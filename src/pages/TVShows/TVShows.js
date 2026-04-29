import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Header from "../../components/Header/Header";
import MovieRow from "../../components/MovieRow/MovieRow";
import Footer from "../../components/Footer/Footer";
import { fetchPopularTV, fetchTopRatedTV } from "../../store/slices/moviesSlice";

const TVShows = () => {
  const dispatch = useDispatch();
  const { popularTV, topRatedTV } = useSelector((state) => state.movies);

  useEffect(() => {
    if (!popularTV.length) dispatch(fetchPopularTV());
    if (!topRatedTV.length) dispatch(fetchTopRatedTV());
  }, [dispatch, popularTV.length, topRatedTV.length]);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Header />
      <div className="pt-24">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 px-4 md:px-8">TV Shows</h2>
        <MovieRow title="📺 Popular TV Shows" movies={popularTV} mediaType="tv" />
        <MovieRow title="🌟 Top Rated TV Shows" movies={topRatedTV} mediaType="tv" />
      </div>
      <Footer />
    </div>
  );
};

export default TVShows;
