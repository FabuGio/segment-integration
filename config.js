require('dotenv').config();

module.exports = {
    UNITY_PROJECT_ID: process.env.UNITY_PROJECT_ID,
    UNITY_ENVIRONMENT: process.env.UNITY_ENVIRONMENT,
    PORT: process.env.PORT,
    
    UNITY_ANALYTICS_URL: function () {
        return `https://collect.analytics.unity3d.com/api/analytics/collect/v1/projects/${this.UNITY_PROJECT_ID}/environments/${this.UNITY_ENVIRONMENT}`;
    }
};
