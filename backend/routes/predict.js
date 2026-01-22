import express from "express";
import multer from "multer";
import fetch from "node-fetch";

const router = express.Router();
const upload = multer({ limits: { fileSize: 5 * 1024 * 1024 } });

router.post("/predict", upload.single("image"), async (req, res) => {
  try {
    // 1️⃣ Validate image
    if (!req.file) {
      return res.status(400).json({ error: "Image not received" });
    }

    // 2️⃣ Convert image → base64
    const base64Image = req.file.buffer.toString("base64");

    // 3️⃣ OpenRouter API call
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `
You are a plant disease detection AI.
If the image is NOT a plant leaf, respond exactly:
NOT_A_PLANT

Otherwise respond ONLY valid JSON:
{
  "plant": "",
  "disease": "",
  "confidence": 0.0,
  "explanation": "",
  "treatment": [],
  "prevention": []
}
`
          },
          {
            role: "user",
            content: [
              { type: "text", text: "Analyze this plant leaf image" },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`
                }
              }
            ]
          }
        ]
      })
    });

    const data = await response.json();
    const aiText = data.choices?.[0]?.message?.content;

    console.log("AI RAW RESPONSE:", aiText);

    // 4️⃣ NOT A PLANT
    if (aiText === "NOT_A_PLANT") {
      return res.json({ notPlant: true });
    }

    // 5️⃣ Parse JSON safely
    let aiResult;
    try {
      aiResult = JSON.parse(aiText);
    } catch {
      return res.status(500).json({ error: "Invalid AI response format" });
    }

    res.json(aiResult);

  } catch (err) {
    console.error("PREDICT ERROR:", err);
    res.status(500).json({ error: "Prediction failed" });
  }
});

export default router;
