import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Note: If 'gemini-3-flash-preview' is not available, switch to 'gemini-1.5-flash'
const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

export const askGemini = async (req, res) => {
    try {
        const { history = [], question, species } = req.body;

        if (!question || !species) {
            return res.status(400).json({ error: "Required fields (question, species) are missing." });
        }

        const speciesContext = typeof species === 'object' 
            ? JSON.stringify(species, null, 2) 
            : species;

        const systemInstruction = `
  ROLE: You are Kara, an experienced biodiversity expert.
  
  CONTEXT DATA (Use this ONLY to identify the species we are discussing): 
  ${speciesContext}

  INSTRUCTIONS:
  1. **ANSWER DIRECTLY**: Answer the user's question using your expert general knowledge about this species. Do NOT mention "metadata," "JSON fields," "missing values," or "database keys" (like GBIF IDs).
  2. **FILL GAPS**: If the provided CONTEXT DATA is just a name or ID, use your own internal knowledge to provide the biological facts (habitat, threats, diet, etc.).
  3. **TONE**: Professional, educational, and natural. Act like a professor, not a database reader.
  4. **FORMAT**: Keep it short, concise, scannable, and use Markdown only for **bold** and lists key terms.
`;

        const chat = model.startChat({
            history: [
                { role: "user", parts: [{ text: systemInstruction }] },
                { role: "model", parts: [{ text: "I have loaded the species data. How can I help you today?" }] },
                ...history 
            ],
        });

        const result = await chat.sendMessage(question);
        const response = await result.response;
        const aiReply = response.text();

        res.status(200).json({ reply: aiReply });

    } catch (error) {
        console.error("Gemini AI Controller Error:", error);

        // 4. Handle Rate Limiting (429) specifically
        if (error.message && error.message.includes("429")) {
            return res.status(429).json({ 
                reply: "I'm a bit overwhelmed with requests right now. Please try again in a minute!" 
            });
        }

        res.status(500).json({ reply: "Something went wrong on my end. Try asking again!" });
    }
};