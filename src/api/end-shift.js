// api/end-shift.js
import { createClient } from 'redis';

let client;

export default async function handler(req, res) {
    // Enable CORS for local development
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Ensure this is a POST request
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method Not Allowed' });
    }

    try {
        if (!client) {
            client = createClient({ url: process.env.REDIS_URL });
            client.on('error', (err) => console.error('Redis Client Error', err));
            await client.connect();
        }

        const currentData = req.body;
        
        // 1. Generate a unique key based on the current date (e.g., "snapshot:2026-06-12")
        const today = new Date().toISOString().split('T')[0];
        const snapshotKey = `snapshot:${today}`;

        // 2. Save the metrics payload to Redis as a stringified JSON object
        await client.set(snapshotKey, JSON.stringify({
            date: today,
            timestamp: Date.now(),
            metrics: currentData
        }));

        // 3. Define the clean baseline state to send back to the frontend
        const cleanResetState = {
            activeWorkers: "0/22",
            openZones: 10,
            complianceStatus: "Pending",
            completedLogs: "0/5"
        };

        return res.status(200).json({ 
            success: true, 
            message: `Shift data archived under key: ${snapshotKey}`,
            resetState: cleanResetState 
        });

    } catch (error) {
        console.error("Failed to archive shift data:", error);
        return res.status(500).json({ success: false, error: "Internal Server Error" });
    }
}