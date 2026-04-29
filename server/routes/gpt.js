const express = require("express");
const { OpenAI } = require("openai");
const axios = require("axios");
const router = express.Router();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post("/search", async (req, res) => {
  const { query } = req.body;

  if (!query || typeof query !== "string" || query.trim().length === 0) {
    return res.status(400).json({ error: "Query is required" });
  }

  if (query.length > 500) {
    return res.status(400).json({ error: "Query too long (max 500 chars)" });
  }

  try {
    const gptResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a movie and TV show recommendation engine. Given a user's natural language description of what they want to watch, return ONLY a JSON array of up to 8 movie/TV show titles that best match their request. Each item should have "title" and "type" (either "movie" or "tv"). Example: [{"title":"Inception","type":"movie"},{"title":"Breaking Bad","type":"tv"}]. Return ONLY the JSON array, no other text.`,
        },
        {
          role: "user",
          content: query,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const content = gptResponse.choices[0].message.content.trim();
    let suggestions;
    try {
      suggestions = JSON.parse(content);
    } catch {
      return res.status(500).json({ error: "Failed to parse AI response" });
    }

    // Fetch TMDB data for each suggestion
    const tmdbResults = await Promise.allSettled(
      suggestions.map(async (item) => {
        const searchType = item.type === "tv" ? "tv" : "movie";
        const tmdbRes = await axios.get(
          `https://api.themoviedb.org/3/search/${searchType}`,
          {
            params: {
              api_key: process.env.TMDB_API_KEY,
              query: item.title,
              page: 1,
            },
          }
        );
        if (tmdbRes.data.results && tmdbRes.data.results.length > 0) {
          const result = tmdbRes.data.results[0];
          return {
            id: result.id,
            title: result.title || result.name,
            overview: result.overview,
            poster_path: result.poster_path,
            backdrop_path: result.backdrop_path,
            vote_average: result.vote_average,
            release_date: result.release_date || result.first_air_date,
            media_type: searchType,
          };
        }
        return null;
      })
    );

    const results = tmdbResults
      .filter((r) => r.status === "fulfilled" && r.value !== null)
      .map((r) => r.value);

    res.json({ results, query });
  } catch (error) {
    console.error("GPT search error:", error.message);
    res.status(500).json({ error: "AI search failed. Please try again." });
  }
});

module.exports = router;
