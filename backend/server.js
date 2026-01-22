import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import predictRoute from "./routes/predict.js";


const app = express();
const PORT = process.env.PORT || 2000;

app.use(cors());
app.use(express.json({ limit: "10mb" }));

// console.log("GEMINI_API_KEY:", process.env.GEMINI_API_KEY ? "Loaded" : "Not Loaded");
console.log("GEMINI API KEY:", process.env.GEMINI_API_KEY);

app.use("/api", predictRoute);

app.get("/", (req, res) => {
  res.send("🌱 Plant Disease Detection API Running");
});

app.listen(PORT, () => {
  console.log(`🔥 Server running on http://localhost:${PORT}`);
});
