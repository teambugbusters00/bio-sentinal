import express from 'express';
import { rateLimit } from 'express-rate-limit'
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import mongoose from 'mongoose';
import aiRoutes from './src/routes/ai.routes.js';
import alertRoutes from './src/routes/alert.routes.js';
import authRoutes from './src/routes/auth.routes.js';
import satelliteRoutes from './src/routes/satellite.routes.js';

dotenv.config();

const app = express();

app.use(cors(
  {
    origin: '*'
  }
));
app.use(express.json());

const limiter = rateLimit({
	windowMs: 10 * 60 * 1000,
	limit: 100,
})

app.use(limiter)

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/biosentinel';

mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

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
Return ONLY valid JSON. No Markdown formatting.
`;

  try {
    const aiRes = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }]
      },
      { timeout: 15000 }
    );

    const rawText =
      aiRes.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawText) {
      throw new Error("Empty AI response");
    }

    const cleanJson = rawText.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleanJson);

    res.json(parsed);
  } catch (err) {
    if (err.response?.status === 429) {
      return res.status(429).json({ error: "AI rate limit exceeded" });
    }

    console.error("Gemini error:", err.message);
    res.status(500).json({ error: "AI processing failed" });
  }
});

// 404 Handler - Log missing endpoints
app.use((req, res) => {
    console.log(`❌ 404 - ${req.method} ${req.path}`);
    res.status(404).json({ 
        error: 'Endpoint not found',
        path: req.path,
        method: req.method,
        message: `${req.method} ${req.path} is not defined`
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Biosentinal AI API running on port ${PORT}!`);
});
