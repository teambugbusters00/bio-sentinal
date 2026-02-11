import express from 'express';
import { rateLimit } from 'express-rate-limit';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Groq from "groq-sdk"; // Import Groq SDK

// Import Routes
import aiRoutes from './src/routes/ai.routes.js';
import alertRoutes from './src/routes/alert.routes.js';
import authRoutes from './src/routes/auth.routes.js';
import satelliteRoutes from './src/routes/satellite.routes.js';

dotenv.config();

const app = express();

// --- Middleware ---
app.use(cors({ origin: '*' }));
app.use(express.json());

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  limit: 100,
});
app.use(limiter);

// --- Database Connection ---
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/biosentinel';

mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// --- Initialize Groq Client ---
const client = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

// --- Routes ---

app.get('/', (req, res) => {
    res.send('Welcome to BioSentinel API! Use /health for health check or /api/alerts for alerts.');
});

app.get('/health', (req, res) => {
    res.send('Welcome to the BioSentinal AI API!');
});

app.use('/api/auth', authRoutes);
app.use('/api', aiRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/satellite', satelliteRoutes);

// --- UPDATED SPECIES ENDPOINT (Using Groq) ---
app.post("/api/species", async (req, res) => {
    const { speciesName } = req.body;

    if (!speciesName) {
        return res.status(400).json({ error: "speciesName is required" });
    }

    const prompt = `
    For the species "${speciesName}", return a strict JSON object with these 3 keys:
    1. "favourable_climate": A string describing their ideal environment.
    2. "dos_and_donts": An array of strings regarding human interaction.
    3. "conservation_methods": An array of strings on how to conserve them.
    Return ONLY valid JSON. No Markdown formatting, no backticks.
    `;

    try {
        const completion = await client.chat.completions.create({
            messages: [
                { role: "user", content: prompt }
            ],
            model: "moonshotai/kimi-k2-instruct-0905",
            temperature: 0.5, // Slightly lower temp for more consistent JSON
            max_completion_tokens: 4096,
            top_p: 1,
            stream: false, // We don't need streaming for this short JSON response
            response_format: { type: "json_object" } // Force JSON mode if supported, or rely on prompt
        });

        const rawText = completion.choices[0]?.message?.content;

        if (!rawText) {
            throw new Error("Empty AI response");
        }

        // Clean up any potential markdown backticks just in case
        const cleanJson = rawText.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(cleanJson);

        res.json(parsed);

    } catch (err) {
        console.error("Groq AI Error:", err);
        
        if (err.status === 429) {
            return res.status(429).json({ error: "AI rate limit exceeded" });
        }

        res.status(500).json({ error: "AI processing failed" });
    }
});

// --- 404 Handler ---
app.use((req, res) => {
    console.log(`❌ 404 - ${req.method} ${req.path}`);
    res.status(404).json({ 
        error: 'Endpoint not found',
        path: req.path,
        method: req.method,
        message: `${req.method} ${req.path} is not defined`
    });
});

// --- Start Server ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Biosentinal AI API running on port ${PORT}!`);
});