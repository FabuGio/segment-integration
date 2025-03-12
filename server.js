const express = require('express');
const axios = require('axios');
const config = require('./config');

const app = express();
app.use(express.json());

const formatEventData = (rawData) => {
    return {
        eventName: rawData.eventName || 'unknown_event',
        userId: rawData.userId || 'anonymous',
        timestamp: rawData.timestamp || new Date().toISOString(),
        sessionId: rawData.sessionId || null,
        eventData: rawData.eventData || {}
    };
};

const sendToUnityAnalytics = async (eventData) => {
    try {
        const response = await axios.post(config.UNITY_ANALYTICS_URL(), eventData, {
            headers: { 'Content-Type': 'application/json' }
        });

        console.log(`[SUCCESS] Event sent to Unity Analytics:`, response.data);
    } catch (error) {
        console.error(`[ERROR] Failed to send event to Unity:`, error.response?.data || error.message);
        throw new Error('Failed to send event to Unity Analytics');
    }
};

app.post('/webhook', async (req, res) => {
    try {
        
        const eventData = req.body;
        console.log('[INFO] Received event:', eventData);

        const formattedEvent = formatEventData(req.body);
        await sendToUnityAnalytics(formattedEvent);
        
        
        res.status(200).send({ message: 'Event successfully sent to Unity Analytics' });
    } catch (error) {
        console.error('Error enviando evento a Unity:', error.response?.data || error.message);
        res.status(500).send({ error: error.message });
    }
});

// Start server
app.listen(config.PORT, () => {
    console.log(`[SERVER] Listening on port ${config.PORT}`);
});
