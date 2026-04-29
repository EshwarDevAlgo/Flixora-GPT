import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGptResults, clearGptResults } from "../../store/slices/gptSlice";
import MovieCard from "../MovieCard/MovieCard";

const GptSearch = () => {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const { results, loading, error, searchQuery } = useSelector((state) => state.gpt);
  const inputRef = useRef(null);

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    dispatch(fetchGptResults(trimmed));
  };

  const handleClear = () => {
    setQuery("");
    dispatch(clearGptResults());
    inputRef.current?.focus();
  };

  const suggestions = [
    "A mind-bending sci-fi thriller like Inception",
    "Feel-good comedy for a rainy Sunday",
    "Dark crime drama with plot twists",
    "Animated movies for family movie night",
    "Documentaries about space exploration",
  ];

  return (
    <div className="pt-28 px-4 md:px-8 min-h-screen">
      <div className="max-w-3xl mx-auto mb-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              AI-Powered
            </span>{" "}
            Search
          </h2>
          <p className="text-gray-400 text-sm md:text-base">
            Describe what you're in the mood for and let AI find the perfect match
          </p>
        </div>

        <form onSubmit={handleSearch} className="relative">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. A gripping thriller with unexpected twists..."
            className="w-full px-5 py-4 bg-gray-900/80 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-sm md:text-base pr-32"
            maxLength={500}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
            {query && (
              <button
                type="button"
                onClick={handleClear}
                className="px-3 py-2 text-gray-400 hover:text-white text-sm"
              >
                Clear
              </button>
            )}
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="px-5 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold text-sm hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </form>

        {!results.length && !loading && !error && (
          <div className="mt-6 flex flex-wrap gap-2 justify-center">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => {
                  setQuery(s);
                  dispatch(fetchGptResults(s));
                }}
                className="px-3 py-1.5 bg-gray-800/60 border border-gray-700 rounded-full text-xs text-gray-300 hover:bg-gray-700 hover:text-white transition"
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {loading && (
        <div className="flex flex-col items-center gap-3 py-16">
          <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">AI is finding the best matches...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-8">
          <p className="text-red-400 text-sm">Something went wrong. Please try again.</p>
        </div>
      )}

      {results.length > 0 && (
        <div className="max-w-6xl mx-auto">
          <h3 className="text-lg font-semibold text-gray-300 mb-4">
            Results for: <span className="text-white">"{searchQuery}"</span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {results.map((movie) => (
              <MovieCard key={movie.id} movie={movie} mediaType={movie.media_type} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GptSearch;
