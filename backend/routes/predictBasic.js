import express from "express";
import multer from "multer";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/predict", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Image required" });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash"
    });

    const imageBase64 = req.file.buffer.toString("base64");

    const result = await model.generateContent([
      {
        inlineData: {
          data: imageBase64,
          mimeType: req.file.mimetype
        }
      },
      `
You are an agricultural expert AI.

Analyze this plant image and respond ONLY in valid JSON:

{
  "plantName": "",
  "scientificName": "",
  "isHealthy": true,
  "diseaseName": "",
  "confidence": 0.0,
  "explanation": "",
  "symptoms": [],
  "treatment": [],
  "prevention": []
}
`
    ]);

    const text = result.response.text();
    const json = JSON.parse(text.match(/\{[\s\S]*\}/)[0]);

    res.json(json);

  } catch (err) {
    console.error("AI Error:", err);
    res.status(500).json({ error: "AI prediction failed" });
  }
});

export default router;
