const mongoose = require('mongoose');
const path = require('path');
const User = require(path.join(__dirname, '../backend/models/User'));
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../backend/.env') });

const resetVerifier = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const email = 'verifier@nsp.gov.in';
        const password = 'Verifier@123';

        let user = await User.findOne({ email });

        if (user) {
            console.log('Verifier found. Updating password...');
            user.password = password;
            await user.save();
            console.log('Password updated.');
        } else {
            console.log('Verifier NOT found. Creating new user...');
            user = await User.create({
                name: 'Official Verifier',
                email: email,
                password: password,
                role: 'Verifier',
                mobile: '9999999999'
            });
            console.log('Verifier created.');
        }

        console.log('Credentials:');
        console.log('Email:', email);
        console.log('Password:', password);

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

resetVerifier();
