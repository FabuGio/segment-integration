require('dotenv').config();
const express = require('express');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json());

const PROJECT_ID = 'af5317f1-13f1-48af-b859-682ec2830ddb';
const ENVIRONMENT_NAME = 'production';

const UNITY_API_URL = `https://collect.analytics.unity3d.com/api/analytics/collect/v1/projects/${PROJECT_ID}/environments/${ENVIRONMENT_NAME}`;
const RANDOM_USER_ID = 'https://collect.analytics.unity3d.com/api/analytics/collect/v1/uuid';

app.post('/webhook', async (req, res) => {
    console.log("🔹 Received request from Segment:", JSON.stringify(req.body, null, 2));

    try {
        const eventData = req.body;

        const eventPayload = {
            "eventList": [
                {
                    "eventName": "EventTest", 
                    "eventTimestamp": new Date().toISOString(),
                    "eventUUID": uuidv4(),  
                    "userID": "test-user-123",
                    "sessionID": uuidv4(),  
                    "eventParams": {
                        "clientVersion": "1.0.0",
                        "platform": "PC_CLIENT",
                        "sdkMethod": "CustomScript",
                        "userCountry": "US"
                    }
                }
            ]
        };

        const response = await axios.post(UNITY_API_URL, eventPayload, {
            headers: {
                "Content-Type": "application/json",
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
