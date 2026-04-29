import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Header from "../../components/Header/Header";
import HeroBanner from "../../components/HeroBanner/HeroBanner";
import MovieRow from "../../components/MovieRow/MovieRow";
import GptSearch from "../../components/GptSearch/GptSearch";
import Shimmer from "../../components/Shimmer/Shimmer";
import Footer from "../../components/Footer/Footer";
import useMovieData from "../../hooks/useMovieData";
import { fetchWatchlist } from "../../store/slices/watchlistSlice";

const Browse = () => {
  const dispatch = useDispatch();
  const { uid } = useSelector((state) => state.user);
  const { showGptSearch } = useSelector((state) => state.gpt);
  const {
    nowPlaying, popular, topRated, upcoming, trending,
    popularTV, topRatedTV,
    action, comedy, horror, sciFi, romance, thriller,
    anime, cartoons, documentaries,
    loading,
  } = useSelector((state) => state.movies);

  useMovieData();

  useEffect(() => {
    if (uid) dispatch(fetchWatchlist(uid));
  }, [uid, dispatch]);

  if (loading && nowPlaying.length === 0) return <Shimmer />;

  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      <Header />

      {showGptSearch ? (
        <GptSearch />
      ) : (
        <>
          <HeroBanner />
          <div className="-mt-20 relative z-10">
            {/* ── Core rows ── */}
            <MovieRow title="🔥 Trending This Week" movies={trending} />
            <MovieRow title="🎬 Now Playing" movies={nowPlaying} />
            <MovieRow title="⭐ Popular Movies" movies={popular} />
            <MovieRow title="🏆 Top Rated" movies={topRated} />
            <MovieRow title="🎞️ Upcoming" movies={upcoming} />

            {/* ── Genre rows ── */}
            <MovieRow title="💥 Action" movies={action} />
            <MovieRow title="😂 Comedy" movies={comedy} />
            <MovieRow title="😱 Horror" movies={horror} />
            <MovieRow title="🚀 Sci-Fi" movies={sciFi} />
            <MovieRow title="💕 Romance" movies={romance} />
            <MovieRow title="🔪 Thriller" movies={thriller} />

            {/* ── TV ── */}
            <MovieRow title="📺 Popular TV Shows" movies={popularTV} mediaType="tv" />
            <MovieRow title="🌟 Top Rated TV" movies={topRatedTV} mediaType="tv" />

            {/* ── Special categories ── */}
            <MovieRow title="🎌 Anime" movies={anime} mediaType="tv" />
            <MovieRow title="🎨 Cartoons & Animation" movies={cartoons} />
            <MovieRow title="📽️ Documentaries" movies={documentaries} />
          </div>
        </>
      )}

      <Footer />
    </div>
  );
};

export default Browse;
