// api/roster.js
import { createClient } from 'redis';

// Re-use the client across serverless invocations if possible
let client;

export default async function handler(req, res) {
    // Add CORS headers so your local React dev server can talk to it
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        if (!client) {
            client = createClient({ url: process.env.REDIS_URL });
            client.on('error', (err) => console.error('Redis Client Error', err));
            await client.connect();
        }

        const data = await client.get('liveRoster');
        const roster = data ? JSON.parse(data) : [];

        return res.status(200).json({ success: true, roster });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}