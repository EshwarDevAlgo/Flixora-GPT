import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Header from "../../components/Header/Header";
import MovieCard from "../../components/MovieCard/MovieCard";
import Footer from "../../components/Footer/Footer";
import { fetchWatchlist } from "../../store/slices/watchlistSlice";

const Watchlist = () => {
  const dispatch = useDispatch();
  const { uid } = useSelector((state) => state.user);
  const { items, loading } = useSelector((state) => state.watchlist);

  useEffect(() => {
    if (uid) dispatch(fetchWatchlist(uid));
  }, [uid, dispatch]);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Header />
      <div className="pt-24 px-4 md:px-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">My Watchlist</h2>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg mb-2">Your watchlist is empty</p>
            <p className="text-gray-500 text-sm">
              Browse movies and TV shows to add them to your list
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {items.map((item) => (
              <MovieCard
                key={item.tmdb_id}
                movie={{
                  id: item.tmdb_id,
                  title: item.title,
                  poster_path: item.poster_path,
                  vote_average: item.vote_average,
                  overview: item.overview,
                  media_type: item.media_type,
                }}
                mediaType={item.media_type}
              />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Watchlist;
