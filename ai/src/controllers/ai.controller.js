import Groq from "groq-sdk";
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { ChatHistory } from '../models/ChatHistory.js'; 

dotenv.config();

// --- 1. DB Connection Helper ---
// (Kept from previous steps to ensure stability)
const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB Connected Successfully");
    } catch (error) {
        console.error("MongoDB Connection Error:", error);
        throw new Error("Database connection failed");
    }
};

// --- 2. Initialize Groq Client ---
const client = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

export const askGemini = async (req, res) => {
    try {
        await connectDB();

        const { sessionId, question, species } = req.body;

        // 1. Validation
        if (!question || !sessionId) {
            return res.status(400).json({ error: "Required fields (sessionId, question) are missing." });
        }

        // 2. Fetch or Create Chat Session
        let chatSession = await ChatHistory.findOne({ sessionId });

        if (!chatSession) {
            if (!species) {
                return res.status(400).json({ error: "Species data is required to start a new chat session." });
            }
            chatSession = new ChatHistory({
                sessionId,
                speciesContext: species || "Generic Biodiversity",
                messages: []
            });
        }

        // 3. Construct System Instruction
        const speciesContextStr = JSON.stringify(chatSession.speciesContext, null, 2);
        
        const systemInstruction = `
        ROLE: You are Kaya, an experienced biodiversity expert.
        
        CONTEXT DATA (Use this ONLY to identify the species we are discussing): 
        ${speciesContextStr}

        INSTRUCTIONS:
        1. **ANSWER DIRECTLY**: Answer the user's question using your expert general knowledge about this species.
        2. **FILL GAPS**: If the CONTEXT DATA is missing details, use your internal knowledge.
        3. **TONE**: Professional, educational, and natural.
        4. **FORMAT**: Keep it short, concise, scannable.
        5. **DIAGRAMS**: If a biological concept is difficult to explain textually, trigger a diagram by inserting 

[Image of X]
. Use sparingly.
        `;

        // 4. Format History for Groq (OpenAI Compatible Format)
        // Note: Groq uses 'assistant' instead of 'model', and 'system' for instructions
        const apiMessages = [
            { role: "system", content: systemInstruction },
            ...chatSession.messages.map(msg => ({
                role: msg.role === 'model' ? 'assistant' : 'user', // Map DB 'model' to Groq 'assistant'
                content: msg.text
            })),
            { role: "user", content: question }
        ];

        // 5. Call Groq API
        const completion = await client.chat.completions.create({
            messages: apiMessages,
            model: "moonshotai/kimi-k2-instruct-0905",
            temperature: 0.6,
            max_completion_tokens: 4096,
            top_p: 1,
            stream: true, // Streaming enabled
            stop: null
        });

        // 6. Handle Stream Collection
        // Since your frontend expects a single JSON response, we collect the stream here.
        let aiReply = "";
        for await (const chunk of completion) {
            aiReply += chunk.choices[0]?.delta?.content || "";
        }

        // 7. Save to MongoDB
        chatSession.messages.push({ role: 'user', text: question });
        chatSession.messages.push({ role: 'model', text: aiReply });
        chatSession.lastUpdated = new Date();
        
        await chatSession.save();

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