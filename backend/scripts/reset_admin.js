const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');

dotenv.config({ path: path.join(__dirname, '../.env') });

const checkAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const email = 'admin@nsp.gov.in';
        let user = await User.findOne({ email });

        if (user) {
            console.log('Admin user found:', user.email);
            console.log('Current Role:', user.role);

            // Reset password
            user.password = 'Admin@123';
            if (user.role !== 'Admin') {
                console.log('Fixing role to Admin');
                user.role = 'Admin';
            }
            await user.save();
            console.log('Password reset to: Admin@123');
        } else {
            console.log('Admin user not found. Creating...');
            user = await User.create({
                email,
                password: 'Admin@123',
                role: 'Admin',
                details: {} // flexible schema
            });
            console.log('Admin user created with password: Admin@123');
        }

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkAdmin();
