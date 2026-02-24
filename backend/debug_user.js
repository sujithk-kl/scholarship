const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const checkUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const email = 'dineshkumar.ct22@bitsathy.ac.in';
        const user = await User.findOne({ email });

        if (user) {
            console.log('User found:', user);
            console.log('User found:', user);
            // Reset password and role
            user.password = '123456';
            user.role = 'Student';
            await user.save();
            console.log('Password reset to 123456 and Role set to Student');
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
