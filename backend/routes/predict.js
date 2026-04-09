import express from "express";
import multer from "multer";
import { OpenRouter } from "@openrouter/sdk";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

// ✅ Water Recommendation
const generateWaterRecommendation = (plant, disease, isHealthy, confidence, explanation) => {
  let base = 1;

  const p = (plant || "").toLowerCase();
  const d = (disease || "").toLowerCase();
  const exp = (explanation || "").toLowerCase();

  if (p.includes("tomato")) base = 1.2;
  else if (p.includes("potato")) base = 1.0;
  else if (p.includes("rice")) base = 2.2;
  else if (p.includes("wheat")) base = 1.5;
  else if (p.includes("rose")) base = 0.7;

  if (d.includes("fungal") || d.includes("rot")) base *= 0.6;
  else if (d.includes("bacterial")) base *= 0.7;
  else if (d.includes("viral")) base *= 0.85;

  if (exp.includes("dry") || exp.includes("wilting")) base *= 1.2;
  if (exp.includes("overwater") || exp.includes("waterlogged")) base *= 0.5;

  if (confidence < 0.5) base *= 0.9;

  base = Math.max(0.1, Math.min(base, 5));

  return {
    perDayLiters: Number(base.toFixed(2)),
    perWeekLiters: Number((base * 7).toFixed(2)),
    notes: "Water adjusted based on plant condition.",
  };
};

// ✅ Extract JSON
const extractJson = (text) => {
  if (!text) return null;
  const noFences = text.replace(/```json|```/gi, "").trim();
  try { return JSON.parse(noFences); } catch {}
  const match = noFences.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try { return JSON.parse(match[0]); } catch { return null; }
};

const SYSTEM_PROMPT = `
You are a plant disease detection AI.

If the image is NOT a plant leaf, respond exactly:
NOT_A_PLANT

Otherwise respond ONLY valid JSON (no markdown, no backticks):
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
}`.trim();

const MODELS = [
  "openai/gpt-4o-mini",
  "meta-llama/llama-3.2-11b-vision-instruct",
];

router.post("/predict", upload.single("image"), async (req, res) => {
  try {
    if (!req.file?.buffer) {
      return res.status(400).json({ error: "Image not received" });
    }

    const base64Image =
      `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;

    let aiText = null;
    let lastResponse = null;

    // ✅ Try models one by one (ONLY ONE METHOD - fetch)
    for (const model of MODELS) {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:2000",
          "X-Title": "Plant Disease Detection"
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: "system",
              content: SYSTEM_PROMPT
            },
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "Identify plant and disease from this leaf image. Return ONLY JSON."
                },
                {
                  type: "image_url",
                  image_url: {
                    url: base64Image
                  }
                }
              ]
            }
          ],
          temperature: 0.2
        })
      });

      lastResponse = await response.json();
      aiText = lastResponse?.choices?.[0]?.message?.content?.trim();

      console.log(`Model: ${model} →`, aiText?.slice(0, 100));

      if (aiText) break;
    }

    if (!aiText) {
      console.log("ALL MODELS FAILED:", JSON.stringify(lastResponse, null, 2));
      return res.status(500).json({ error: "Empty AI response" });
    }

    if (aiText === "NOT_A_PLANT") {
      return res.json({ notPlant: true });
    }

    const aiResult = extractJson(aiText);

    if (!aiResult) {
      return res.status(500).json({
        error: "Invalid JSON from AI",
        raw: aiText.slice(0, 300)
      });
    }

    const normalizedDisease = (aiResult.disease || "").toLowerCase();

    const isHealthy =
      aiResult.confidence > 0.6 &&
      ["healthy", "no disease", "none"].includes(normalizedDisease);

    aiResult.waterRecommendation = generateWaterRecommendation(
      aiResult.plant,
      aiResult.disease,
      isHealthy,
      aiResult.confidence,
      aiResult.explanation
    );

    return res.json(aiResult);

  } catch (err) {
    console.error("PREDICT ERROR:", err);
    return res.status(500).json({ error: "Prediction failed" });
  }
});
export default router;

// import express from "express";
//   import multer from "multer";
//   // import { OpenRouter } from "@openrouter/sdk";
//   import { OpenAI } from "openai";

//   const router = express.Router();

//   const upload = multer({
//     storage: multer.memoryStorage(),
//     limits: { fileSize: 5 * 1024 * 1024 },
//   });

//   const getClient = new OpenAI({
//     apiKey: process.env.OPENROUTER_API_KEY,
//     baseURL: "https://openrouter.ai/api/v1",
//   });

// // ✅ Extract JSON even if model wraps it in ```json ... ```
// const extractJson = (text) => {
//   if (!text) return null;

//   const noFences = text.replace(/```json|```/gi, "").trim();

//   try {
//     return JSON.parse(noFences);
//   } catch {}

//   const match = noFences.match(/\{[\s\S]*\}/);
//   if (!match) return null;

//   try {
//     return JSON.parse(match[0]);
//   } catch {
//     return null;
//   }
// };

// // ✅ Optional safety clamp (NOT predefined by plant, just prevents nonsense)
// const clampWater = (water) => {
//   if (!water) return water;

//   let day = Number(water.perDayLiters);
//   if (!Number.isFinite(day)) day = 0.5;

//   // Clamp to a reasonable range (general)
//   day = Math.max(0.05, Math.min(day, 20));

//   return {
//     perDayLiters: Number(day.toFixed(2)),
//     perWeekLiters: Number((day * 7).toFixed(2)),
//     notes: (water.notes || "").trim() || "Adjust watering based on soil moisture and drainage.",
//   };
// };

// router.post("/predict", upload.single("image"), async (req, res) => {
//   try {
//     if (!req.file?.buffer) {
//       return res.status(400).json({ error: "Image not received" });
//     }

//     const base64Image = req.file.buffer.toString("base64");
//     const openrouter = getClient();
//     const completion = await openrouter.chat.completions.create({
//       model: "qwen/qwen2.5-vl-72b-instruct",
//       temperature: 0.2,
//       messages: [
//         {
//           role: "system",
//           content: `
// You are a plant disease detection AI.

// If the image is NOT a plant leaf, respond exactly:
// NOT_A_PLANT

// Otherwise respond ONLY valid JSON (no markdown, no backticks):
// {
//   "plant": "",
//   "disease": "",
//   "confidence": 0.0,
//   "explanation": "",
//   "treatment": [],
//   "prevention": [],
//   "waterRecommendation": {
//     "perDayLiters": 0,
//     "perWeekLiters": 0,
//     "notes": ""
//   }
// }

// Rules for waterRecommendation:
// - Do NOT use fixed/predefined values by plant name.
// - Estimate watering based on visible plant type + leaf condition (dry/wilted vs wet/rot) + disease type/severity.
// - perWeekLiters must equal perDayLiters * 7.
// - If unsure: be conservative and say it depends on soil moisture, pot size, and weather.
//           `.trim(),
//         },
//         {
//           role: "user",
//           content: [
//             { type: "text", text: "Analyze this plant leaf image and return JSON only." },
//             {
//               type: "image_url",
//               image_url: { url: `data:image/jpeg;base64,${base64Image}` },
//             },
//           ],
//         },
//       ],
//     });

//     const aiText = completion?.choices?.[0]?.message?.content?.trim();
//     console.log("AI RAW RESPONSE:", aiText);

//     if (!aiText) return res.status(500).json({ error: "Empty AI response" });

//     if (aiText === "NOT_A_PLANT") return res.json({ notPlant: true });

//     const aiResult = extractJson(aiText);
//     if (!aiResult) {
//       return res.status(500).json({
//         error: "Invalid AI response format",
//         raw: aiText.slice(0, 500),
//       });
//     }

//     // ✅ Keep AI watering, only clamp sanity (optional)
//     aiResult.waterRecommendation = clampWater(aiResult.waterRecommendation);

//     return res.json(aiResult);
//   } catch (err) {
//     console.error("PREDICT ERROR:", err);
//     return res.status(500).json({ error: "Prediction failed" });
//   }
// });

// export default router;