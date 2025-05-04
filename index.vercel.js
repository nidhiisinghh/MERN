const app = require('./index');
const serverless = require('serverless-http');

const handler = serverless(app);

module.exports.handler = async (event, context) => {
    try {
        const result = await handler(event, context);
        return result;
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' })
        };
    }
};