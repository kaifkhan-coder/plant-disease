// import express from "express";
// import multer from "multer";
// import fetch from "node-fetch";
// import { OpenRouter } from "@openrouter/sdk";
// const router = express.Router();

// const upload = multer({
//   storage: multer.memoryStorage(),
//   limits: { fileSize: 5 * 1024 * 1024 },
// });
// // const weather = await fetch("https://api.openweathermap.org/data/2.5/weather?q=Mumbai&appid=API_KEY");

// const getUserLocation = async (ip) => {
//   try {
//     const res = await fetch(`https://ipapi.co/${ip}/json/`);
//     const data = await res.json();

//     return {
//       city: data?.city || "Mumbai",
//       lat: data?.latitude,
//       lon: data?.longitude,
//     };
//   } catch (err) {
//     console.error("Location Error:", err);
//     return { city: "Mumbai" };
//   }
// };

// const getWeatherData = async (lat, lon) => {
//   try {
//     const res = await fetch(
//       `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.WEATHER_API_KEY}`
//     );

//     const data = await res.json();

//     return {
//       temp: data?.main?.temp || 25,
//       humidity: data?.main?.humidity || 50,
//       rain: data?.rain?.["1h"] || 0,
//     };
//   } catch (err) {
//     console.error("Weather API Error:", err);
//     return { temp: 25, humidity: 50, rain: 0 };
//   }
// };
// // ✅ Water Recommendation (keep OUTSIDE route so it's reusable)
// const generateWaterRecommendation = (
//   plant,
//   disease,
//   isHealthy,
//   confidence,
//   explanation,
//   weather
// ) => {
//   let base = 1;

//   const p = (plant || "").toLowerCase();
//   const d = (disease || "").toLowerCase();
//   const exp = (explanation || "").toLowerCase();

//   // 🌱 Plant base
//   if (p.includes("tomato")) base = 1.2;
//   else if (p.includes("potato")) base = 1.0;
//   else if (p.includes("rice")) base = 2.2;
//   else if (p.includes("wheat")) base = 1.5;
//   else if (p.includes("rose")) base = 0.7;

//   // 🦠 Disease logic
//   if (d.includes("fungal") || d.includes("rot")) base *= 0.6;
//   else if (d.includes("bacterial")) base *= 0.7;
//   else if (d.includes("viral")) base *= 0.85;

//   // 🍂 Leaf condition
//   if (exp.includes("dry") || exp.includes("wilting")) base *= 1.2;
//   if (exp.includes("overwater") || exp.includes("waterlogged")) base *= 0.5;

//   // 🎯 Confidence safety
//   if (confidence < 0.5) base *= 0.9;

//   // 🌦️ Weather logic (MAIN UPGRADE)
//   if (weather.temp > 30) base *= 1.2;       // hot → more water
//   if (weather.humidity > 80) base *= 0.8;   // humid → less water
//   if (weather.rain > 0) base *= 0.7;        // raining → reduce

//   // 🚫 Clamp
//   base = Math.max(0.1, Math.min(base, 5));

//   return {
//     perDayLiters: Number(base.toFixed(2)),
//     perWeekLiters: Number((base * 7).toFixed(2)),
//     notes: "Water adjusted based on plant condition and real-time weather.",
//   };
// };

// // ✅ Extract JSON even if model wraps it in ```json ... ```
// const extractJson = (text) => {
//   if (!text) return null;

//   // remove code fences
//   const noFences = text.replace(/```json|```/gi, "").trim();

//   // try direct parse
//   try {
//     return JSON.parse(noFences);
//   } catch {}

//   // fallback: find first {...} block
//   const match = noFences.match(/\{[\s\S]*\}/);
//   if (!match) return null;

//   try {
//     return JSON.parse(match[0]);
//   } catch {
//     return null;
//   }
// };

// router.post("/predict", upload.single("image"), async (req, res) => {
//   try {
//     if (!req.file?.buffer) {
//       return res.status(400).json({ error: "Image not received" });
//     }
// const userIP =
//   req.headers["x-forwarded-for"]?.split(",")[0] ||
//   req.socket.remoteAddress;

// // fallback for localhost
// let location = await getUserLocation(userIP);

// if (!location.lat || !location.lon) {
//   location = {
//     city: "Mumbai",
//     lat: 19.0760,
//     lon: 72.8777,
//   };
// }
//     const base64Image = req.file.buffer.toString("base64");

//     const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
//         "Content-Type": "application/json",
//         // Optional but recommended by OpenRouter:
//         "HTTP-Referer": "https://plant-disease-10.onrender.com",
//         "X-Title": "Plant Disease Detection",
//       },
//       body: JSON.stringify({
//         model: "openai/gpt-4o-mini",
//         temperature: 0.2,
//         messages: [
//           {
//             role: "system",
//             content: `
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
//             `.trim(),
//           },
//           {
//             role: "user",
//             content: [
//               { type: "text", text: "Analyze this plant leaf image and return the JSON only." },
//               {
//                 type: "image_url",
//                 image_url: { url: `data:image/jpeg;base64,${base64Image}` },
//               },
//             ],
//           },
//         ],
//       }),
//     });

// const models = [
//   "openai/gpt-4o-mini",
//   "meta-llama/llama-3.2-11b-vision-instruct"
// ];

// let data = null;
// let aiText = null;

// for (const model of models) {
//   const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       model,
//       temperature: 0.2,
//       messages: [
//         {
//           role: "system",
//           content: `
// You are a plant disease detection AI.

// If not plant → return exactly: NOT_A_PLANT

// Otherwise return ONLY valid JSON.
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
//     }),
//   });

//   data = await response.json();
//   aiText = data?.choices?.[0]?.message?.content?.trim();

//   if (aiText) break; // stop if success
// }
// console.log("OPENROUTER FULL RESPONSE:", JSON.stringify(data, null, 2));
//     if (aiText === "NOT_A_PLANT") {
//       return res.json({ notPlant: true });
//     }

//     const aiResult = extractJson(aiText);
// if (!aiText) {
//   console.log("ALL MODELS FAILED:", JSON.stringify(data, null, 2));

//   return res.status(200).json({
//     notPlant: false,
//     error: "AI failed to analyze image",
//     fallback: true
//   });
// }
//     const normalizedDisease = (aiResult.disease || "").toLowerCase();
//     const isHealthy =
//       aiResult.confidence > 0.6 &&
//       (normalizedDisease === "healthy" ||
//         normalizedDisease === "no disease" ||
//         normalizedDisease === "none");
// const weather = await getWeatherData(
//   location.lat || 19.0760,
//   location.lon || 72.8777
// );
// console.log("User Location:", location);
// console.log("Weather Data:", weather);
// aiResult.waterRecommendation = generateWaterRecommendation(
//   aiResult.plant,
//   aiResult.disease,
//   isHealthy,
//   aiResult.confidence,
//   aiResult.explanation,
//   weather
// );

//     // ✅ send only ONCE
//     return res.json(aiResult);
//   } catch (err) {
//     console.error("PREDICT ERROR:", err);
//     return res.status(500).json({ error: "Prediction failed" });
//   }
// });

// export default router;

import express from "express";
import multer from "multer";
import { OpenRouter } from "@openrouter/sdk";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

const openrouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

// ---------- JSON extractor ----------
const extractJson = (text) => {
  if (!text) return null;

  const cleaned = text.replace(/```json|```/gi, "").trim();

  try {
    return JSON.parse(cleaned);
  } catch {}

  const match = cleaned.match(/\{[\s\S]*\}/);
  if (!match) return null;

  try {
    return JSON.parse(match[0]);
  } catch {
    return null;
  }
};

// ---------- clamp water ----------
const clampWater = (water = {}) => {
  let day = Number(water.perDayLiters);

  if (!Number.isFinite(day)) day = 0.5;

  day = Math.max(0.05, Math.min(day, 20));

  return {
    perDayLiters: Number(day.toFixed(2)),
    perWeekLiters: Number((day * 7).toFixed(2)),
    notes:
      water.notes?.trim() ||
      "Adjust watering based on soil moisture and drainage.",
  };
};

router.post("/predict", upload.single("image"), async (req, res) => {
  try {
    if (!req.file?.buffer) {
      return res.status(400).json({ error: "Image not received" });
    }

    const base64Image = req.file.buffer.toString("base64");

    // ✅ FIX: correct OpenRouter call
    const completion = await openrouter.chat.completions.create({
      model: "google/gemma-3-27b-it",
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content: `
You are a plant disease detection AI.

If NOT plant → return exactly:
NOT_A_PLANT

Else return ONLY JSON:
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
            { type: "text", text: "Analyze this plant image." },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
              },
            },
          ],
        },
      ],
    });

    const aiText = completion?.choices?.[0]?.message?.content?.trim();

    if (!aiText) {
      return res.status(500).json({ error: "Empty AI response" });
    }

    if (aiText === "NOT_A_PLANT") {
      return res.json({ notPlant: true });
    }

    const aiResult = extractJson(aiText);

    if (!aiResult) {
      return res.status(500).json({
        error: "Invalid AI JSON",
        raw: aiText,
      });
    }

    // ✅ safety fix for confidence NaN
    aiResult.confidence =
      typeof aiResult.confidence === "number"
        ? aiResult.confidence
        : 0;

    aiResult.waterRecommendation = clampWater(
      aiResult.waterRecommendation
    );

    return res.json(aiResult);
  } catch (err) {
    console.error("PREDICT ERROR:", err);
    return res.status(500).json({ error: "Prediction failed" });
  }
});

export default router;