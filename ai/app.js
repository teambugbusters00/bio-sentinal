import express from 'express';
import { rateLimit } from 'express-rate-limit'
import cors from 'cors';
import dotenv from 'dotenv';
import aiRoutes from './src/routes/ai.routes.js';

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

app.get('/health', (req, res) => {
    res.send('Welcome to the BioSentinal AI API!');
}
);

app.use('/api', aiRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Biosentinal AI API running on port ${PORT}!`);
});