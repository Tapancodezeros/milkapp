const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const customerRoutes = require('./customer');
const vendorRoutes = require('./vendor');
const subscriptionRoutes = require('./subscription');
const transactionRoutes = require('./transaction');
const commonRoutes = require('./common');

router.use('/', authRoutes);
router.use('/customer', customerRoutes);
router.use('/vendor', vendorRoutes);
router.use('/', subscriptionRoutes);
router.use('/', transactionRoutes);
router.use('/vendors', commonRoutes);

module.exports = router;
