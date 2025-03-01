const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

app.post('/webhook', async (req, res) => {
    try {
        const eventData = req.body;

        const projectId = 'af5317f1-13f1-48af-b859-682ec2830ddb';
        const environmentName = 'production';
        const unityUrl = `https://collect.analytics.unity3d.com/api/analytics/collect/v1/projects/${projectId}/environments/${environmentName}`;

        const response = await axios.post(unityUrl, eventData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        res.status(200).send('Evento enviado a Unity Analytics');
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
        res.status(500).send('Error al enviar evento');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en puerto ${PORT}`);
});
