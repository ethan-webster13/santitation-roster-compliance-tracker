import express from 'express';
import cors from 'cors';
import { createClient } from 'redis';

const app = express();
app.use(cors()); // Crucial: Allows your React frontend to talk to this server
app.use(express.json());

// Secure connection to Redis
const redisClient = createClient({
    url: 'redis://localhost:6379' // Or your production Redis URL
});

redisClient.on('error', (err) => console.error('Redis Error:', err));
await redisClient.connect();

// The API endpoint your React frontend will call
app.get('/api/roster', async (req, res) => {
    try {
        const data = await redisClient.get('liveRoster');
        const roster = data ? JSON.parse(data) : [];
        
        // Send the data back to React
        res.json({ success: true, roster });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(5000, () => console.log('Backend bridge running on port 5000'));