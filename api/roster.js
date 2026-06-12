// api/roster.js
import { createClient } from 'redis';

let client;

export default async function handler(req, res) {
    // Enable CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        // Fallback to local machine if REDIS_URL environment variable isn't loaded properly
        // api/roster.js
const redisUrl = process.env.KV_URL || process.env.REDIS_URL || 'redis://localhost:6379';

        if (!client) {
            console.log('Initializing Redis client with URL:', redisUrl);
            client = createClient({ url: redisUrl });
            client.on('error', (err) => console.error('Redis Client Connection Error:', err));
        }

        if (!client.isOpen) {
            await client.connect();
        }

        const data = await client.get('liveRoster');
        const roster = data ? JSON.parse(data) : [];

        return res.status(200).json({ success: true, roster });
    } catch (error) {
        console.error("API ROUTE CRASHED:", error);
        return res.status(500).json({ success: false, error: error.message });
    }
}