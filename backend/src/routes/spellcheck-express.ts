import { Router } from "express";
import { generateWithGemini } from "../lib/gemini";

const router = Router();

router.post("/", async (req: any, res: any) => {
  try {
    const { text } = (req.body as { text?: string }) || {};
    if (!text) return res.status(400).json({ error: "Text is required" });

    const prompt = `You are a spelling checker. Analyze this text and find spelling errors. Return ONLY a JSON array of errors in this exact format:\n[\n  {\n    "word": "misspelled word",\n    "offset": character position where error starts,\n    "length": length of the word,\n    "message": "brief explanation",\n    "suggestions": ["correction1", "correction2", "correction3"]\n  }\n]\n\nIf there are no errors, return an empty array [].\n\nText to check: "${text}"`;

    const responseText = await generateWithGemini(prompt);

    // extract json array from response text
    const jsonMatch = /\[[\s\S]*\]/.exec(responseText);
    const suggestions = jsonMatch ? JSON.parse(jsonMatch[0]) : [];

    return res.json({ suggestions });
  } catch (error) {
    console.error("Spellcheck error:", error);
    return res.status(500).json({ suggestions: [] });
  }
});

export default router;
