const axios = require('axios');
const sendSMS = async(phone, message) => {
    try {
        const SID = process.env.TWILIO_SID;
        const TOKEN = process.env.TWILIO_TOKEN;

        const url = `https://api.twilio.com/2010-04-01/Accounts/${SID}/Messages.json`;
        const data = new URLSearchParams({
            Body: message,
            From: process.env.TWILIO_PHONE,
            To: `+91${phone}`,
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
        throw error;
    }   
};

module.exports = { sendSMS };