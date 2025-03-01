require('dotenv').config();
const express = require('express');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json());

app.post('/webhook', async (req, res) => {
    console.log("🔹 Received request from Segment:", JSON.stringify(req.body, null, 2)); // Log the request

    try {
        const eventData = req.body;

        const projectId = 'af5317f1-13f1-48af-b859-682ec2830ddb';
        const environmentName = 'production';
        const unityUrl = `https://collect.analytics.unity3d.com/api/analytics/collect/v1/projects/${projectId}/environments/${environmentName}`;

        const eventName = 'EventTest';//eventData.event || "unknown_event";
        const userID = eventData.userId || "unknown_user";
        const timestamp = eventData.timestamp || new Date().toISOString();

        const unityPayload = {
            "eventList": [
                {
                    "eventName": eventName,
                    "userID": userID,
                    "eventUUID": uuidv4(), // Generate unique event ID to prevent duplicates
                    "eventTimestamp": timestamp,
                    "eventVersion": 1
                }
            ]
        };

        const response = await axios.post(unityUrl, eventData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log("✅ Event successfully sent to Unity Analytics:", response.status);

        res.status(204).send(); // 204 means success with no content

    } catch (error) {
        console.error("❌ Error sending event to Unity:", error.response?.data || error.message);
        res.status(500).send('Error sending event');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
