import React from "react";
import { useSelector } from "react-redux";
import { TMDB_IMG_BACKDROP } from "../../config/constants";

const HeroBanner = () => {
  const { nowPlaying } = useSelector((state) => state.movies);
  if (!nowPlaying || nowPlaying.length === 0) return null;

  const movie = nowPlaying[0];
  const backdrop = movie.backdrop_path
    ? `${TMDB_IMG_BACKDROP}${movie.backdrop_path}`
    : null;

  return (
    <div className="relative w-full h-[85vh] overflow-hidden">
      {backdrop && (
        <img
          src={backdrop}
          alt={movie.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />

      <div className="relative z-10 flex flex-col justify-end h-full pb-32 px-6 md:px-12 max-w-2xl">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
          {movie.title}
        </h2>
        <p className="text-gray-300 text-sm md:text-base line-clamp-3 mb-6">
          {movie.overview}
        </p>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded-md font-semibold hover:bg-gray-200 transition">
            ▶ Play
          </button>
          <button className="flex items-center gap-2 bg-gray-600/70 text-white px-6 py-2.5 rounded-md font-semibold hover:bg-gray-600 transition">
            ℹ More Info
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
