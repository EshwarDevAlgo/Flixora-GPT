const NodeCache = require("node-cache");

// TTL: 10 minutes for TMDB data (they don't change often)
const cache = new NodeCache({ stdTTL: 600, checkperiod: 120 });

/**
 * Serve a route with caching.
 * Sets X-Cache: HIT | MISS header so you can verify it's working in DevTools.
 */
const withCache = async (key, fetchFn, res) => {
  try {
    const cached = cache.get(key);
    if (cached !== undefined) {
      res.setHeader("X-Cache", "HIT");
      return res.json(cached);
    }
    const data = await fetchFn();
    cache.set(key, data);
    res.setHeader("X-Cache", "MISS");
    res.json(data);
  } catch (err) {
    console.error(`Cache fetch error [${key}]:`, err.message);
    res.status(500).json({ error: "Failed to fetch data" });
  }
};

const getCacheStats = () => ({
  keys: cache.keys().length,
  stats: cache.getStats(),
});

const invalidate = (key) => cache.del(key);

module.exports = { withCache, getCacheStats, invalidate };
