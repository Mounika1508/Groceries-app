const axios = require('axios');
const sendSMS = async(mobile, message) => {
    try {
        const SID = process.env.TWILIO_SID;
        const TOKEN = process.env.TWILIO_AUTH_TOKEN;

        const url = `https://api.twilio.com/2010-04-01/Accounts/${SID}/Messages.json`;
        const data = new URLSearchParams({
            Body: message,
            From: process.env.TWILIO_PHONE_NUMBER,
            To: "91" + mobile,
        });
        const response = await axios.post(url, data, {
            auth: {
                username: SID,
                password: TOKEN,
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        console.log('SMS sent successfully:', response.data.sid);
        return response.data;   
    } catch (error) {
        console.error('Error sending SMS:', error);
        res.status(500).json({ error: 'Failed to send SMS' });
    }   
};

module.exports = { sendSMS };