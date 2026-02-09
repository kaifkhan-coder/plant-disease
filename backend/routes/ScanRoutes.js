import express from "express";
import Scan from "../models/Scan.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

/**
 * SAVE NEW SCAN
 */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const scan = new Scan({
      user: req.user.id, // ✅ schema uses `user`

      imageUrl: req.body.imageUrl,

      diagnosis: {
        plantName: req.body.plantName,
        isHealthy: req.body.isHealthy,
        diseaseName: req.body.diseaseName,
        confidenceScore: req.body.confidenceScore,
      },
    });

    await scan.save();

    res.status(201).json({
      message: "Scan saved successfully",
      scan,
    });
  } catch (err) {
    console.error("Scan save error:", err);
    res.status(500).json({ message: "Failed to save scan" });
  }
});

/**
 * GET USER SCAN HISTORY
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const scans = await Scan.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.json(scans); // ✅ always array
  } catch (err) {
    console.error("Fetch history error:", err);
    res.status(500).json({ message: "Failed to fetch history" });
  }
});

/**
 * CLEAR HISTORY
 */
router.delete("/", authMiddleware, async (req, res) => {
  try {
    await Scan.deleteMany({ user: req.user.id });
    res.json({ message: "History cleared" });
  } catch (err) {
    res.status(500).json({ message: "Failed to clear history" });
  }
});

export default router;
