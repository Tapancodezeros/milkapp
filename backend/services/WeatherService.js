const { WeatherAdvisory, Customer, Subscription, Vendor } = require('../models');
const AppError = require('../utils/appError');

class WeatherService {
    async getAdvisory(vendorId = null) {
        let advisory = null;
        if (vendorId) {
            advisory = await WeatherAdvisory.findOne({
                where: { vendorId },
                order: [['updatedAt', 'DESC']]
            });
        }

        if (!advisory) {
            advisory = await WeatherAdvisory.findOne({
                where: { vendorId: null },
                order: [['updatedAt', 'DESC']]
            });
        }

        if (!advisory) {
            return {
                isRainyMode: false,
                severity: 'moderate',
                advisoryTitle: 'Clear Weather',
                advisoryMessage: 'Regular delivery schedules active. Deliveries are proceeding as normal.',
                estimatedDelayMinutes: 0,
                updatedAt: new Date()
            };
        }

        return advisory;
    }

    async toggleRainMode({ isRainyMode, severity, advisoryTitle, advisoryMessage, estimatedDelayMinutes, vendorId = null }) {
        let advisory = null;
        if (vendorId) {
            advisory = await WeatherAdvisory.findOne({ where: { vendorId } });
        } else {
            advisory = await WeatherAdvisory.findOne({ where: { vendorId: null } });
        }

        if (advisory) {
            advisory.isRainyMode = isRainyMode !== undefined ? isRainyMode : !advisory.isRainyMode;
            if (severity) advisory.severity = severity;
            if (advisoryTitle) advisory.advisoryTitle = advisoryTitle;
            if (advisoryMessage) advisory.advisoryMessage = advisoryMessage;
            if (estimatedDelayMinutes !== undefined) advisory.estimatedDelayMinutes = estimatedDelayMinutes;
            await advisory.save();
        } else {
            advisory = await WeatherAdvisory.create({
                isRainyMode: isRainyMode !== undefined ? isRainyMode : true,
                severity: severity || 'moderate',
                advisoryTitle: advisoryTitle || 'Rainy Weather Advisory',
                advisoryMessage: advisoryMessage || 'Heavy rain in area. Morning milk deliveries dispatched in rainproof packaging with +30m delay.',
                estimatedDelayMinutes: estimatedDelayMinutes !== undefined ? estimatedDelayMinutes : 30,
                vendorId: vendorId || null
            });
        }

        return advisory;
    }

    async updateCustomerPreferences(customerId, { rainproofPackaging, rainDropoffInstructions }) {
        const customer = await Customer.findByPk(customerId);
        if (!customer) {
            throw new AppError('Customer not found', 404);
        }

        if (rainproofPackaging !== undefined) {
            customer.rainproofPackaging = Boolean(rainproofPackaging);
        }
        if (rainDropoffInstructions !== undefined) {
            customer.rainDropoffInstructions = rainDropoffInstructions;
        }

        await customer.save();
        return {
            rainproofPackaging: customer.rainproofPackaging,
            rainDropoffInstructions: customer.rainDropoffInstructions
        };
    }

    async skipTodayRain(customerId, subscriptionId) {
        const sub = await Subscription.findOne({
            where: { id: subscriptionId, customerId }
        });
        if (!sub) {
            throw new AppError('Subscription not found', 404);
        }

        const today = new Date().toISOString().split('T')[0];
        let pausedList = [];
        try {
            pausedList = JSON.parse(sub.rainPausedDates || '[]');
        } catch (e) {
            pausedList = [];
        }

        if (!pausedList.includes(today)) {
            pausedList.push(today);
            sub.rainPausedDates = JSON.stringify(pausedList);
            await sub.save();
        }

        return {
            subscriptionId: sub.id,
            rainPausedDates: pausedList,
            todaySkipped: true
        };
    }

    async getVendorRainSummary(vendorId) {
        const advisory = await this.getAdvisory(vendorId);

        const subscriptions = await Subscription.findAll({
            where: { vendorId, status: 'active' },
            include: [{
                model: Customer,
                attributes: ['id', 'name', 'phone', 'rainproofPackaging', 'rainDropoffInstructions']
            }]
        });

        const rainproofCount = subscriptions.filter(s => s.Customer && s.Customer.rainproofPackaging).length;
        const today = new Date().toISOString().split('T')[0];
        const todaySkippedCount = subscriptions.filter(s => {
            try {
                const dates = JSON.parse(s.rainPausedDates || '[]');
                return dates.includes(today);
            } catch (e) {
                return false;
            }
        }).length;

        return {
            advisory,
            totalActiveSubscriptions: subscriptions.length,
            rainproofCount,
            todaySkippedCount,
            customersNeedingRainproof: subscriptions
                .filter(s => s.Customer && (s.Customer.rainproofPackaging || s.Customer.rainDropoffInstructions))
                .map(s => ({
                    subscriptionId: s.id,
                    customerName: s.Customer.name,
                    phone: s.Customer.phone,
                    rainproofPackaging: s.Customer.rainproofPackaging,
                    rainDropoffInstructions: s.Customer.rainDropoffInstructions,
                    quantity: s.quantity
                }))
        };
    }
}

module.exports = new WeatherService();
