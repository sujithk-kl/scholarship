const cron = require('node-cron');
const axios = require('axios');

const initKeepAlive = () => {
    // Schedule a task to run every 14 minutes to keep the backend awake
    cron.schedule('*/14 * * * *', async () => {
        try {
            // Using the base backend url as it returns 'API is running...'
            const url = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`;
            console.log(`[Keep Alive] Pinging backend at ${url} ...`);

            const response = await axios.get(url);
            console.log(`[Keep Alive] Success: ${response.status} - ${response.data}`);
        } catch (error) {
            console.error(`[Keep Alive] Error:`, error.message);
        }
    });

    console.log('Keep-alive cron job initialized (runs every 14 mins)');
};

module.exports = { initKeepAlive };
