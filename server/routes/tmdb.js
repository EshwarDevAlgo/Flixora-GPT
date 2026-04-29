const express = require("express");
const axios = require("axios");
const { withCache, getCacheStats } = require("../utils/cache");
const router = express.Router();

const TMDB_BASE = "https://api.themoviedb.org/3";
const tmdbGet = (path, params = {}) =>
  axios.get(`${TMDB_BASE}${path}`, {
    params: { api_key: process.env.TMDB_API_KEY, ...params },
  });

// ── Standard movie lists ────────────────────────────────────────────
router.get("/now-playing", (req, res) => {
  withCache("now-playing", async () => {
    const { data } = await tmdbGet("/movie/now_playing", { page: 1 });
    return data.results;
  }, res);
});

router.get("/popular", (req, res) => {
  withCache("popular", async () => {
    const { data } = await tmdbGet("/movie/popular", { page: 1 });
    return data.results;
  }, res);
});

router.get("/top-rated", (req, res) => {
  withCache("top-rated", async () => {
    const { data } = await tmdbGet("/movie/top_rated", { page: 1 });
    return data.results;
  }, res);
});

router.get("/upcoming", (req, res) => {
  withCache("upcoming", async () => {
    const { data } = await tmdbGet("/movie/upcoming", { page: 1 });
    return data.results;
  }, res);
});

router.get("/trending", (req, res) => {
  withCache("trending", async () => {
    const { data } = await tmdbGet("/trending/all/week");
    return data.results;
  }, res);
});

// ── TV lists ────────────────────────────────────────────────────────
router.get("/tv/popular", (req, res) => {
  withCache("tv-popular", async () => {
    const { data } = await tmdbGet("/tv/popular", { page: 1 });
    return data.results;
  }, res);
});

router.get("/tv/top-rated", (req, res) => {
  withCache("tv-top-rated", async () => {
    const { data } = await tmdbGet("/tv/top_rated", { page: 1 });
    return data.results;
  }, res);
});

// ── Genre-based movie lists ─────────────────────────────────────────
// TMDB genre IDs: 28=Action 35=Comedy 27=Horror 878=Sci-Fi
//                 10749=Romance 53=Thriller 14=Fantasy 10751=Family
router.get("/genre/:genreId", (req, res) => {
  const { genreId } = req.params;
  if (!/^\d+$/.test(genreId)) return res.status(400).json({ error: "Invalid genre ID" });
  withCache(`genre_${genreId}`, async () => {
    const { data } = await tmdbGet("/discover/movie", {
      with_genres: genreId,
      sort_by: "popularity.desc",
      "vote_count.gte": 100,
      page: 1,
    });
    return data.results;
  }, res);
});

// ── Special categories ──────────────────────────────────────────────
router.get("/anime", (req, res) => {
  withCache("anime", async () => {
    const { data } = await tmdbGet("/discover/tv", {
      with_genres: 16,
      with_original_language: "ja",
      sort_by: "popularity.desc",
      page: 1,
    });
    return data.results;
  }, res);
});

router.get("/cartoons", (req, res) => {
  withCache("cartoons", async () => {
    const { data } = await tmdbGet("/discover/movie", {
      with_genres: 16,
      "vote_count.gte": 100,
      sort_by: "popularity.desc",
      page: 1,
    });
    return data.results;
  }, res);
});

router.get("/documentaries", (req, res) => {
  withCache("documentaries", async () => {
    const { data } = await tmdbGet("/discover/movie", {
      with_genres: 99,
      sort_by: "popularity.desc",
      page: 1,
    });
    return data.results;
  }, res);
});

// ── Detail pages ────────────────────────────────────────────────────
router.get("/movie/:id", async (req, res) => {
  const { id } = req.params;
  if (!/^\d+$/.test(id)) return res.status(400).json({ error: "Invalid ID" });
  withCache(`movie_${id}`, async () => {
    const { data } = await tmdbGet(`/movie/${id}`, {
      append_to_response: "videos,credits,similar",
    });
    return data;
  }, res);
});

router.get("/tv/:id", async (req, res) => {
  const { id } = req.params;
  if (!/^\d+$/.test(id)) return res.status(400).json({ error: "Invalid ID" });
  withCache(`tv_${id}`, async () => {
    const { data } = await tmdbGet(`/tv/${id}`, {
      append_to_response: "videos,credits,similar",
    });
    return data;
  }, res);
});

// ── Search (not cached — queries are too variable) ──────────────────
router.get("/search", async (req, res) => {
  const { query } = req.query;
  if (!query) return res.status(400).json({ error: "Query required" });
  try {
    const { data } = await tmdbGet("/search/multi", { query, page: 1 });
    res.json(data.results.filter((r) => r.media_type !== "person"));
  } catch (err) {
    console.error("TMDB search error:", err.message);
    res.status(500).json({ error: "Search failed" });
  }
});

// ── Cache diagnostics ───────────────────────────────────────────────
router.get("/cache/stats", (_req, res) => {
  res.json(getCacheStats());
});

module.exports = router;
