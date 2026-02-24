const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const connectDB = require('../config/db');

dotenv.config();

connectDB();

const importData = async () => {
    try {
        await User.deleteMany();

        const users = [
            {
                name: 'Admin User',
                email: 'admin@nsp.gov.in',
                password: 'password', // Will be hashed by pre-save hook
                role: 'Admin',
                mobile: '9999999999'
            },
            {
                name: 'Institute Verifier',
                email: 'verifier@nsp.gov.in',
                password: 'password',
                role: 'Verifier',
                mobile: '8888888888'
            },
            {
                name: 'Student User',
                email: 'student@example.com',
                password: 'password',
                role: 'Student',
                mobile: '7777777777'
            },
            {
                name: 'Dinesh Saravanan',
                email: 'dineshsaravanan600@gmail.com',
                password: 'password',
                role: 'Student',
                mobile: '9876543210'
            }
        ];

        for (const user of users) {
            await User.create(user);
        }

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await User.deleteMany();
        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
