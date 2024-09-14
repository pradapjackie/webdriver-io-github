// Importing the required modules
import fs from 'fs';
import axios from 'axios';

// Read JSON data from file
const reportData = JSON.parse(fs.readFileSync('allure-results/report.json', 'utf-8'));

// Extract necessary fields
const {
    reportName,
    statistic: { failed, broken, skipped, passed, total },
    time: { start, stop, duration }
} = reportData;

// Convert time to a human-readable format (optional)
const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds} min`;
};

// Create the Slack message
const slackMessage = {
    text: `*${reportName} Summary*\n
    *Total Tests*: ${total}
    *Passed*: ${passed}
    *Failed*: ${failed}
    *Broken*: ${broken}
    *Skipped*: ${skipped}
    *Duration*: ${formatTime(duration)}`
};

// Send the message to Slack
const sendSlackNotification = async () => {
    const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL; // Get Slack Webhook URL from environment variables
    try {
        await axios.post(slackWebhookUrl, slackMessage);
        console.log('Slack notification sent successfully!');
    } catch (error) {
        console.error('Error sending Slack notification:', error);
    }
};

// Run the function
sendSlackNotification();
