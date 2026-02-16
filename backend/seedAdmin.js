require('dotenv').config();
const { Admin } = require('./models');
const bcrypt = require('bcryptjs');

const createAdmin = async () => {
    try {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await Admin.findOrCreate({
            where: { email: 'admin@milkapp.com' },
            defaults: {
                name: 'System Admin',
                phone: '0000000000',
                email: 'admin@milkapp.com',
                password: hashedPassword
            }
        });
        console.log('Admin user created/already exists');
        process.exit(0);
    } catch (err) {
        console.error('Error creating admin:', err);
        process.exit(1);
    }
};

createAdmin();
