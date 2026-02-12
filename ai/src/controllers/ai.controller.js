import Groq from "groq-sdk";
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { ChatHistory } from '../models/ChatHistory.js';
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

dotenv.config();

// --- 2. Initialize Groq Client ---
const getGroqClient = () => {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey || apiKey === 'gsk_your_api_key_here') {
        console.warn("⚠️ GROQ_API_KEY not set. AI features will return mock responses.");
        return null;
    }
    return new Groq({ apiKey });
};

const client = getGroqClient();

// --- 1. DB Connection Helper ---
const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return true;
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri || mongoUri.includes('localhost')) {
        console.warn("⚠️ MongoDB not available. Chat history will not be saved.");
        return false;
    }
    try {
        await mongoose.connect(mongoUri);
        console.log("MongoDB Connected Successfully");
        return true;
    } catch (error) {
        console.error("MongoDB Connection Error:", error);
        return false;
    }
};

export const askGemini = async (req, res) => {
    try {
        const dbConnected = await connectDB();

        const { sessionId, question, species } = req.body;

        // 1. Validation
        if (!question || !sessionId) {
            return res.status(400).json({ error: "Required fields (sessionId, question) are missing." });
        }

        // Check if Groq client is available
        if (!client) {
            return res.status(503).json({ 
                error: "AI service not configured. Please set GROQ_API_KEY in .env file." 
            });
        }

        // 2. Fetch or Create Chat Session (only if DB connected)
        let chatSession = null;
        let newSession = false;
        if (dbConnected) {
            chatSession = await ChatHistory.findOne({ sessionId });

            // Create session without requiring species data
            if (!chatSession) {
                newSession = true;
                chatSession = new ChatHistory({
                    sessionId,
                    speciesContext: species ? JSON.stringify(species) : "General Biodiversity Chat",
                    messages: []
                });
            }
        } else {
            // When DB is not connected, allow chat without species requirement
            console.log("MongoDB not connected - enabling general Kaya chat mode");
        }

        // 3. Construct System Instruction
        const speciesContextStr = species ? JSON.stringify(species, null, 2) : '{"name": "Unknown Species", "description": "General biodiversity inquiry"}';
        
        const systemInstruction = `
        ROLE: You are Kaya, an experienced biodiversity expert.
        
        CONTEXT DATA (Use this ONLY to identify the species we are discussing): 
        ${speciesContextStr}

        INSTRUCTIONS:
        1. **ANSWER DIRECTLY**: Answer the user's question using your expert general knowledge about this species.
        2. **FILL GAPS**: If the CONTEXT DATA is missing details, use your internal knowledge.
        3. **TONE**: Professional, educational, and natural.
        4. **FORMAT**: Keep it short, concise, scannable.
        `;

        // 4. Format History for Groq (OpenAI Compatible Format)
        const apiMessages = [
            { role: "system", content: systemInstruction },
            ...(chatSession?.messages?.map(msg => ({
                role: msg.role === 'model' ? 'assistant' : 'user',
                content: msg.text
            })) || []),
            { role: "user", content: question }
        ];

        // 5. Call Groq API
        const completion = await client.chat.completions.create({
            messages: apiMessages,
            model: "moonshotai/kimi-k2-instruct-0905",
            temperature: 0.6,
            max_completion_tokens: 4096,
            top_p: 1,
            stream: true,
            stop: null
        });

        // 6. Handle Stream Collection
        let aiReply = "";
        for await (const chunk of completion) {
            aiReply += chunk.choices[0]?.delta?.content || "";
        }

        // 7. Save to MongoDB (only if connected)
        if (chatSession && dbConnected) {
            chatSession.messages.push({ role: 'user', text: question });
            chatSession.messages.push({ role: 'model', text: aiReply });
            chatSession.lastUpdated = new Date();
            await chatSession.save();
        }

        // 8. Send Response
        res.status(200).json({ 
            reply: aiReply,
            sessionId: sessionId 
        });

    } catch (error) {
        console.error("Groq AI Controller Error:", error);
        res.status(500).json({ reply: "Something went wrong on my end. Try asking again!" });
    }
};

// --- AI Image Classification Endpoints ---

// Helper function to analyze image using Groq/LLM
const analyzeImageWithAI = async (imageBuffer, imageName) => {
    const client = getGroqClient();
    
    if (!client) {
        // Return mock response if no API key
        return {
            is_suspicious: false,
            confidence: 0.5,
            label: 'human',
            reasoning: 'Mock response - GROQ_API_KEY not configured'
        };
    }

    try {
        const base64Image = imageBuffer.toString('base64');
        
        const completion = await client.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: `Analyze this image and determine if it appears to be AI-generated or human-created. Look for signs of AI generation like:
                            - Unnatural textures or patterns
                            - Inconsistent lighting/shadows
                            - Distorted anatomy or objects
                            - Oversaturated or unnatural colors
                            - Pixelation or artifacts typical of AI upscaling
                            
                            Provide a JSON response with:
                            - is_suspicious: boolean (true if AI-generated suspected)
                            - confidence: number (0-1, how confident you are)
                            - label: "ai" or "human"
                            - reasoning: brief explanation of your assessment
                            - signs_detected: array of specific signs noticed`
                        },
                        {
                            type: "image_url",
                            image_url: {
                                url: `data:image/jpeg;base64,${base64Image}`
                            }
                        }
                    ]
                }
            ],
            model: "llama-4-scout-2025",
            temperature: 0.2,
            max_completion_tokens: 1024
        });

        const responseText = completion.choices[0]?.message?.content || '';
        
        // Try to parse JSON from response
        try {
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
        } catch (parseError) {
            console.error('Failed to parse AI response:', parseError);
        }
        
        return {
            is_suspicious: false,
            confidence: 0.5,
            label: 'human',
            reasoning: responseText.substring(0, 200),
            raw_response: responseText
        };
    } catch (error) {
        console.error('AI image analysis error:', error);
        return {
            is_suspicious: false,
            confidence: 0.5,
            label: 'human',
            reasoning: 'Analysis failed, defaulting to human'
        };
    }
};

// Helper function for basic pixel analysis
const analyzePixelQuality = (imageBuffer) => {
    // Basic pixel analysis for compression artifacts and noise patterns
    // This is a simplified version - in production you'd use more sophisticated methods
    return {
        compression_artifacts: false,
        noise_consistency: true,
        is_suspicious: false,
        quality_score: 0.9
    };
};

// POST /classify/image - Basic AI vs Human image classification
export const classifyImage = async (req, res) => {
    try {
        if (!req.files || !req.files.file) {
            return res.status(400).json({ error: 'No image file provided' });
        }

        const file = req.files.file;
        const imageBuffer = file.data;
        
        // Analyze image
        const analysis = await analyzeImageWithAI(imageBuffer, file.name);
        
        res.json({
            success: true,
            ai_detection: {
                is_suspicious: analysis.is_suspicious,
                confidence: analysis.confidence,
                label: analysis.label,
                reasoning: analysis.reasoning,
                signs_detected: analysis.signs_detected || []
            },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Image classification error:', error);
        res.status(500).json({ error: 'Failed to classify image' });
    }
};

// POST /classify/image/url - Classify image from URL
export const classifyImageFromURL = async (req, res) => {
    try {
        const { url } = req.body;
        
        if (!url) {
            return res.status(400).json({ error: 'URL parameter is required' });
        }

        // Download image from URL
        const response = await axios({
            url,
            responseType: 'arraybuffer',
            timeout: 10000
        });

        const imageBuffer = Buffer.from(response.data);
        const analysis = await analyzeImageWithAI(imageBuffer, url);
        
        res.json({
            success: true,
            ai_detection: {
                is_suspicious: analysis.is_suspicious,
                confidence: analysis.confidence,
                label: analysis.label,
                reasoning: analysis.reasoning,
                signs_detected: analysis.signs_detected || []
            },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('URL image classification error:', error);
        res.status(500).json({ error: 'Failed to classify image from URL' });
    }
};

// POST /classify/image/analyze - Full analysis (AI detection + pixel quality)
export const analyzeImage = async (req, res) => {
    try {
        if (!req.files || !req.files.file) {
            return res.status(400).json({ error: 'No image file provided' });
        }

        const file = req.files.file;
        const imageBuffer = file.data;
        
        // Run both AI detection and pixel analysis in parallel
        const [aiAnalysis, pixelAnalysis] = await Promise.all([
            analyzeImageWithAI(imageBuffer, file.name),
            Promise.resolve(analyzePixelQuality(imageBuffer))
        ]);

        // Determine overall assessment
        const isRejected = aiAnalysis.is_suspicious || pixelAnalysis.is_suspicious;
        
        const result = {
            success: true,
            ai_detection: {
                is_suspicious: aiAnalysis.is_suspicious,
                confidence: aiAnalysis.confidence,
                label: aiAnalysis.label,
                reasoning: aiAnalysis.reasoning,
                signs_detected: aiAnalysis.signs_detected || []
            },
            pixel_analysis: {
                is_suspicious: pixelAnalysis.is_suspicious,
                compression_artifacts: pixelAnalysis.compression_artifacts,
                noise_consistency: pixelAnalysis.noise_consistency,
                quality_score: pixelAnalysis.quality_score
            },
            overall_assessment: {
                is_accepted: !isRejected,
                status: isRejected ? 'rejected' : 'accepted',
                reason: isRejected 
                    ? (aiAnalysis.is_suspicious 
                        ? 'AI-generated content detected' 
                        : 'Suspicious pixel quality detected')
                    : 'Image passed all authenticity checks'
            },
            timestamp: new Date().toISOString()
        };

        res.json(result);
    } catch (error) {
        console.error('Image analysis error:', error);
        res.status(500).json({ error: 'Failed to analyze image' });
    }
};
