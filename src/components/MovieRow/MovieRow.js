import React, { useRef } from "react";
import MovieCard from "../MovieCard/MovieCard";

const MovieRow = ({ title, movies, mediaType = "movie" }) => {
  const rowRef = useRef(null);

  const scroll = (direction) => {
    if (rowRef.current) {
      const scrollAmount = direction === "left" ? -600 : 600;
      rowRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  if (!movies || movies.length === 0) return null;

  return (
    <div className="px-4 md:px-8 mb-8">
      <h3 className="text-lg md:text-xl font-semibold mb-3 text-white">{title}</h3>
      <div className="group relative">
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-0 bottom-0 z-20 w-10 bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-black/70 rounded-r-lg"
        >
          ‹
        </button>
        <div
          ref={rowRef}
          className="flex gap-3 overflow-x-scroll scrollbar-hide scroll-smooth py-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} mediaType={mediaType} />
          ))}
        </div>
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-0 bottom-0 z-20 w-10 bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-black/70 rounded-l-lg"
        >
          ›
        </button>
      </div>
    </div>
  );
};

export default MovieRow;
