import express from "express";
import multer from "multer";
import fetch from "node-fetch";
import { OpenRouter } from "@openrouter/sdk";
const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

// ✅ Water Recommendation (keep OUTSIDE route so it's reusable)
const generateWaterRecommendation = (plant, disease, isHealthy) => {
  let perDay = 1; // default liters/day
  const p = (plant || "").toLowerCase();

  if (p.includes("tomato")) perDay = 1.5;
  else if (p.includes("potato")) perDay = 1.2;
  else if (p.includes("rice")) perDay = 2.5;
  else if (p.includes("wheat")) perDay = 1.8;
  else if (p.includes("rose")) perDay = 0.8;

  // diseased => slightly reduce watering (general safe rule)
  if (!isHealthy) perDay *= 0.8;

  return {
    perDayLiters: Number(perDay.toFixed(2)),
    perWeekLiters: Number((perDay * 7).toFixed(2)),
    notes: isHealthy
      ? "Maintain consistent watering and avoid overwatering."
      : "Avoid overwatering during disease. Ensure drainage and monitor soil moisture.",
  };
};

// ✅ Extract JSON even if model wraps it in ```json ... ```
const extractJson = (text) => {
  if (!text) return null;

  // remove code fences
  const noFences = text.replace(/```json|```/gi, "").trim();

  // try direct parse
  try {
    return JSON.parse(noFences);
  } catch {}

  // fallback: find first {...} block
  const match = noFences.match(/\{[\s\S]*\}/);
  if (!match) return null;

  try {
    return JSON.parse(match[0]);
  } catch {
    return null;
  }
};

router.post("/predict", upload.single("image"), async (req, res) => {
  try {
    if (!req.file?.buffer) {
      return res.status(400).json({ error: "Image not received" });
    }

    const base64Image = req.file.buffer.toString("base64");

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        // Optional but recommended by OpenRouter:
        // "HTTP-Referer": "http://localhost:3000",
        // "X-Title": "Plant Disease Detection",
      },
      body: JSON.stringify({
        model: "google/gemma-3-27b-it",
        temperature: 0.2,
        messages: [
          {
            role: "system",
            content: `
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
}
            `.trim(),
          },
          {
            role: "user",
            content: [
              { type: "text", text: "Analyze this plant leaf image and return the JSON only." },
              {
                type: "image_url",
                image_url: { url: `data:image/jpeg;base64,${base64Image}` },
              },
            ],
          },
        ],
      }),
    });

    const data = await response.json();
    const aiText = data?.choices?.[0]?.message?.content?.trim();

    console.log("AI RAW RESPONSE:", aiText);

    if (!aiText) {
      return res.status(500).json({ error: "Empty AI response" });
    }

    if (aiText === "NOT_A_PLANT") {
      return res.json({ notPlant: true });
    }

    const aiResult = extractJson(aiText);
    if (!aiResult) {
      return res.status(500).json({
        error: "Invalid AI response format",
        raw: aiText.slice(0, 500),
      });
    }

    const normalizedDisease = (aiResult.disease || "").toLowerCase();
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

    // ✅ send only ONCE
    return res.json(aiResult);
  } catch (err) {
    console.error("PREDICT ERROR:", err);
    return res.status(500).json({ error: "Prediction failed" });
  }
});

export default router;

// import express from "express";
// import multer from "multer";
// import { OpenRouter } from "@openrouter/sdk";

// const router = express.Router();

// const upload = multer({
//   storage: multer.memoryStorage(),
//   limits: { fileSize: 5 * 1024 * 1024 },
// });

// const openrouter = new OpenRouter({
//   apiKey: process.env.OPENROUTER_API_KEY,
// });

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

//     const completion = await openrouter.chat.send({
//       model: "google/gemma-3-27b-it",
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