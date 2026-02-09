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
  "prevention": [],
  "waterRecommendation": {
    "perDayLiters": 0,
    "perWeekLiters": 0,
    "notes": ""
  }
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
      // 🌿 Generate Water Recommendation
const generateWaterRecommendation = (plant, disease, isHealthy) => {
  let perDay = 1; // default

  const plantLower = plant?.toLowerCase() || "";

  if (plantLower.includes("tomato")) perDay = 1.5;
  else if (plantLower.includes("potato")) perDay = 1.2;
  else if (plantLower.includes("rice")) perDay = 2.5;
  else if (plantLower.includes("wheat")) perDay = 1.8;
  else if (plantLower.includes("rose")) perDay = 0.8;

  // If diseased → reduce watering slightly
  if (!isHealthy) perDay *= 0.8;

  return {
    perDayLiters: Number(perDay.toFixed(2)),
    perWeekLiters: Number((perDay * 7).toFixed(2)),
    notes: isHealthy
      ? "Maintain consistent watering schedule and avoid overwatering."
      : "Avoid overwatering during disease. Ensure proper drainage and monitor soil moisture."
  };
};
    } catch {
      return res.status(500).json({ error: "Invalid AI response format" });
    }

    res.json(aiResult);
    const normalizedDisease = aiResult.disease?.toLowerCase() || "";

const isHealthy =
  aiResult.confidence > 0.6 &&
  (normalizedDisease === "healthy" ||
   normalizedDisease === "no disease" ||
   normalizedDisease === "none");

aiResult.waterRecommendation = generateWaterRecommendation(
  aiResult.plant,
  aiResult.disease,
  isHealthy
);

res.json(aiResult);

  } catch (err) {
    console.error("PREDICT ERROR:", err);
    res.status(500).json({ error: "Prediction failed" });
  }
});

export default router;
