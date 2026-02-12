import express from 'express';
import { askGemini, classifyImage, classifyImageFromURL, analyzeImage } from '../controllers/ai.controller.js';

const router = express.Router();

// File upload helper using multer from app.locals
const getUploadMiddleware = (req) => req.app.locals?.upload;

// Chat endpoint
router.post('/chat', askGemini);

// Image classification endpoints with file upload
router.post('/classify/image', async (req, res) => {
    const upload = getUploadMiddleware(req);
    if (!upload) {
        return res.status(500).json({ error: 'Upload middleware not configured' });
    }
    upload.single('file')(req, res, (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        classifyImage(req, res);
    });
});

router.post('/classify/image/url', classifyImageFromURL);

router.post('/classify/image/analyze', async (req, res) => {
    const upload = getUploadMiddleware(req);
    if (!upload) {
        return res.status(500).json({ error: 'Upload middleware not configured' });
    }
    upload.single('file')(req, res, (err) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        analyzeImage(req, res);
    });
});

export default router;
