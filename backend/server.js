import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import predictRoute from "./routes/predict.js";
import authRoutes from "./routes/auth.js";
import scanRoutes from "./routes/ScanRoutes.js";
import { connect } from "mongoose";
import connectDB from "./db.js";

const app = express();
const PORT = process.env.PORT || 2000;

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(passport.initialize());

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "https://aims-18.onrender.com/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ googleId: profile.id });

    if (!user) {
      user = await User.create({
        username: profile.emails[0].value.split("@")[0].toLowerCase(),
        googleId: profile.id,
        full_name: profile.displayName,
        email: profile.emails[0].value,
        isVerified: true,
        role: "user",
        password: Math.random().toString(36).slice(-8) // Random password
      });
    }
      else if (!user.googleId) {
        user.googleId = profile.id;
        await user.save();
    }
    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
}));

// GitHub Strategy
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: "https://aims-18.onrender.com/auth/github/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails && profile.emails[0]
      ? profile.emails[0].value
      : `${profile.username}@github.com`;

    let user = await User.findOne({ githubId: profile.id });
    if (!user) {
      user = await User.create({
        full_name: profile.displayName || profile.username,
        username: profile.username,
        githubId: profile.id,
        email: profile.emails?.[0]?.value || `${profile.username}@github.com`,
        isVerified: true,
        role: "user",
        password: Math.random().toString(36).slice(-8) // Random password
      });
    }
    else if (!user.githubId) {
      user.githubId = profile.id;
      await user.save();
    }
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

app.get("/auth/google",
  passport.authenticate("google", {
    scope: [
      "openid",
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile"
    ]
  })
);

app.get("/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login.html" }),
  (req, res) => {
  res.redirect(`${import.meta.env.VITE_API_URL}/user`)
  }
);

app.get("/auth/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

app.get("/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/login.html" }),
  (req, res) => {
  res.redirect(`${import.meta.env.VITE_API_URL}/user`)
  }
);
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
