import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import predictRoute from "./routes/predict.js";
import authRoutes from "./routes/auth.js";
import scanRoutes from "./routes/ScanRoutes.js";
import connectDB from "./db.js";

const app = express();
const PORT = process.env.PORT || 2000;

app.use(cors());
app.use(express.json({ limit: "10mb" }));
// ✅ passport.initialize() hata diya — OAuth use nahi kar raha ab

connectDB();    
app.use("/api", predictRoute);
app.use("/api/auth", authRoutes);
app.use("/api/scans", scanRoutes);

app.get("/", (req, res) => {
  res.send("🌱 Plant Disease Detection API Running");
});

app.listen(PORT, () => {
  console.log(`🔥 Server running on http://localhost:${PORT}`);
});