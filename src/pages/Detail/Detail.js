import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchMovieDetails, clearSelectedDetail } from "../../store/slices/moviesSlice";
import { addToWatchlist, removeFromWatchlist } from "../../store/slices/watchlistSlice";
import { addToHistory } from "../../store/slices/historySlice";
import { TMDB_IMG_BACKDROP, TMDB_IMG_POSTER } from "../../config/constants";
import Header from "../../components/Header/Header";
import MovieRow from "../../components/MovieRow/MovieRow";
import ReviewSection from "../../components/ReviewSection/ReviewSection";
import Footer from "../../components/Footer/Footer";

const Detail = () => {
  const { type, id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedDetail, loading } = useSelector((state) => state.movies);
  const { uid } = useSelector((state) => state.user);
  const { items: watchlistItems = [] } = useSelector((state) => state.watchlist) || {};

  useEffect(() => {
    dispatch(fetchMovieDetails({ id, type }));
    return () => dispatch(clearSelectedDetail());
  }, [id, type, dispatch]);

  // Track history once the detail is loaded
  useEffect(() => {
    if (selectedDetail && uid) {
      dispatch(addToHistory({ userId: uid, item: selectedDetail, type }));
    }
  }, [selectedDetail, uid, type, dispatch]);

  if (loading || !selectedDetail) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const movie = selectedDetail;
  const title = movie.title || movie.name;
  const releaseDate = movie.release_date || movie.first_air_date;
  const runtime = movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : null;
  const isInWatchlist = watchlistItems.some((i) => i.tmdb_id === movie.id);

  const trailer = movie.videos?.results?.find(
    (v) => v.type === "Trailer" && v.site === "YouTube"
  );

  const handleWatchlist = () => {
    if (!uid) return;
    if (isInWatchlist) {
      dispatch(removeFromWatchlist({ userId: uid, tmdbId: movie.id }));
    } else {
      dispatch(addToWatchlist({ userId: uid, item: { ...movie, media_type: type } }));
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Header />

      {/* Backdrop */}
      <div className="relative w-full h-[60vh] overflow-hidden">
        {movie.backdrop_path && (
          <img
            src={`${TMDB_IMG_BACKDROP}${movie.backdrop_path}`}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative -mt-40 z-10 px-4 md:px-12 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="flex-shrink-0">
            {movie.poster_path ? (
              <img
                src={`${TMDB_IMG_POSTER}${movie.poster_path}`}
                alt={title}
                className="w-48 md:w-64 rounded-xl shadow-2xl"
              />
            ) : (
              <div className="w-48 md:w-64 h-72 md:h-96 bg-gray-800 rounded-xl flex items-center justify-center text-gray-500">
                No Image
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{title}</h1>

            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400 mb-4">
              {releaseDate && <span>{new Date(releaseDate).getFullYear()}</span>}
              {runtime && <span>· {runtime}</span>}
              {movie.vote_average > 0 && (
                <span className="text-yellow-400">★ {movie.vote_average.toFixed(1)}</span>
              )}
              {movie.adult === false && <span className="border border-gray-600 px-1.5 rounded text-xs">PG</span>}
            </div>

            {movie.genres && (
              <div className="flex flex-wrap gap-2 mb-4">
                {movie.genres.map((g) => (
                  <span key={g.id} className="px-3 py-1 bg-gray-800 rounded-full text-xs text-gray-300">
                    {g.name}
                  </span>
                ))}
              </div>
            )}

            {movie.tagline && (
              <p className="text-gray-400 italic text-sm mb-3">"{movie.tagline}"</p>
            )}

            <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-6">
              {movie.overview}
            </p>

            <div className="flex gap-3 mb-8">
              {trailer && (
                <a
                  href={`https://www.youtube.com/watch?v=${trailer.key}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2.5 bg-white text-black rounded-md font-semibold hover:bg-gray-200 transition flex items-center gap-2"
                >
                  ▶ Play Trailer
                </a>
              )}
              <button
                onClick={handleWatchlist}
                className={`px-6 py-2.5 rounded-md font-semibold transition flex items-center gap-2 ${
                  isInWatchlist
                    ? "bg-green-600/20 text-green-400 border border-green-600"
                    : "bg-gray-700 text-white hover:bg-gray-600"
                }`}
              >
                {isInWatchlist ? "✓ In Watchlist" : "+ Add to Watchlist"}
              </button>
              <button
                onClick={() => navigate(-1)}
                className="px-6 py-2.5 bg-gray-800 text-gray-300 rounded-md hover:bg-gray-700 transition"
              >
                ← Back
              </button>
            </div>

            {/* Cast */}
            {movie.credits?.cast && movie.credits.cast.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Cast</h3>
                <p className="text-gray-400 text-sm">
                  {movie.credits.cast.slice(0, 8).map((c) => c.name).join(", ")}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Similar */}
        {movie.similar?.results && movie.similar.results.length > 0 && (
          <div className="mt-12">
            <MovieRow title="More Like This" movies={movie.similar.results} mediaType={type} />
          </div>
        )}

        {/* Reviews */}
        <div className="mt-4 px-0 pb-4">
          <ReviewSection tmdbId={movie.id} mediaType={type} />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Detail;
