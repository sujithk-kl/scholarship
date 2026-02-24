const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = accountSid && authToken ? new twilio(accountSid, authToken) : null;

const sendSMS = async (to, body) => {
    // Format number to E.164 (Twilio requires +[country_code][number])
    let formattedTo = to ? to.toString().trim() : '';

    // If it's a 10-digit number, prepend +91 (India)
    if (formattedTo.length === 10 && !formattedTo.startsWith('+')) {
        formattedTo = `+91${formattedTo}`;
    } else if (formattedTo.length > 10 && !formattedTo.startsWith('+')) {
        formattedTo = `+${formattedTo}`;
    }

    if (!client) {
        console.log('--- SMS SIMULATION ---');
        console.log('TO:', formattedTo);
        console.log('BODY:', body);
        console.log('REASON: Twilio credentials missing in .env');
        console.log('----------------------');
        return;
    }

    try {
        const message = await client.messages.create({
            body: body,
            to: formattedTo,
            from: process.env.TWILIO_PHONE_NUMBER
        });
        console.log(`[SMS SUCCESS] SID: ${message.sid} to ${formattedTo}`);
        return message;
    } catch (error) {
        console.error(`[SMS FAILURE] To: ${formattedTo}, Error:`, error.message);
        // Don't throw error to avoid crashing the main process
    }
};

module.exports = { sendSMS };
