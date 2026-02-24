const mongoose = require('mongoose');
const path = require('path');
const User = require(path.join(__dirname, '../backend/models/User'));
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../backend/.env') });

const checkUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const email = 'dineshkumar.ct22@bitsathy.ac.in';
        const user = await User.findOne({ email });

        if (user) {
            console.log('User found:', user);
        } else {
            console.log('User NOT found:', email);
        }

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkUser();
