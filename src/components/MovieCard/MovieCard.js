import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { TMDB_IMG_POSTER } from "../../config/constants";
import { addToWatchlist, removeFromWatchlist } from "../../store/slices/watchlistSlice";

const MovieCard = ({ movie, mediaType = "movie" }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { uid } = useSelector((state) => state.user);
  const { items: watchlistItems = [] } = useSelector((state) => state.watchlist) || {};

  const isInWatchlist = watchlistItems.some(
    (i) => i.tmdb_id === movie.id
  );

  const type = movie.media_type || mediaType;

  const handleClick = () => {
    navigate(`/detail/${type}/${movie.id}`);
  };

  const handleWatchlist = (e) => {
    e.stopPropagation();
    if (!uid) return;
    if (isInWatchlist) {
      dispatch(removeFromWatchlist({ userId: uid, tmdbId: movie.id }));
    } else {
      dispatch(addToWatchlist({ userId: uid, item: { ...movie, media_type: type } }));
    }
  };

  return (
    <div
      onClick={handleClick}
      className="group relative flex-shrink-0 w-36 md:w-44 cursor-pointer transition-transform duration-300 hover:scale-105 hover:z-10"
    >
      <div className="relative rounded-lg overflow-hidden shadow-lg">
        {movie.poster_path ? (
          <img
            src={`${TMDB_IMG_POSTER}${movie.poster_path}`}
            alt={movie.title || movie.name}
            className="w-full h-52 md:h-64 object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-52 md:h-64 bg-gray-800 flex items-center justify-center text-gray-500 text-xs">
            No Image
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300" />

        <button
          onClick={handleWatchlist}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 rounded-full w-8 h-8 flex items-center justify-center text-sm hover:bg-black/80"
          title={isInWatchlist ? "Remove from watchlist" : "Add to watchlist"}
        >
          {isInWatchlist ? "✓" : "+"}
        </button>

        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <p className="text-xs font-semibold truncate">{movie.title || movie.name}</p>
          {movie.vote_average > 0 && (
            <p className="text-xs text-yellow-400">★ {movie.vote_average.toFixed(1)}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
