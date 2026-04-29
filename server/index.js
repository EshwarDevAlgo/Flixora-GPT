const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const gptRoutes = require("./routes/gpt");
const tmdbRoutes = require("./routes/tmdb");

const app = express();
const PORT = process.env.PORT || 5000;

// Security
app.use(helmet());
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST"],
  })
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.ip === "127.0.0.1" || req.ip === "::1", // no limit on localhost
});
app.use(limiter);

// Stricter limit only for GPT route (costs money per call)
const gptLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.ip === "127.0.0.1" || req.ip === "::1", // no limit on localhost
  message: { error: "Too many AI search requests. Please wait a moment." },
});

app.use(express.json({ limit: "1mb" }));

// Routes
app.use("/api/gpt", gptLimiter, gptRoutes);
app.use("/api/tmdb", tmdbRoutes);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/", (_req, res) => {
  res.json({ message: "FlixoraGPT API is running. Use /api/tmdb/* or /api/gpt/*" });
});

app.listen(PORT, () => {
  console.log(`FlixoraGPT server running on port ${PORT}`);
});

module.exports = app;
