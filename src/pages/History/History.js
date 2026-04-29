import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { fetchHistory, clearHistoryItem, clearAllHistory } from "../../store/slices/historySlice";
import { TMDB_IMG_POSTER } from "../../config/constants";

const History = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { uid } = useSelector((state) => state.user);
  const { items, loading } = useSelector((state) => state.history);

  useEffect(() => {
    if (uid) dispatch(fetchHistory(uid));
  }, [uid, dispatch]);

  const handleRemove = (e, tmdbId) => {
    e.stopPropagation();
    dispatch(clearHistoryItem({ userId: uid, tmdbId }));
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Header />
      <div className="pt-24 px-4 md:px-12 pb-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold">Watch History</h2>
          {items.length > 0 && (
            <button
              onClick={() => dispatch(clearAllHistory())}
              className="text-xs text-red-400 hover:text-red-300 border border-red-500/30 px-3 py-1.5 rounded-md transition"
            >
              Clear All
            </button>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array(12).fill(0).map((_, i) => (
              <div key={i} className="h-52 bg-gray-800/50 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-3">🎬</p>
            <p className="text-gray-400 text-lg mb-1">No watch history yet</p>
            <p className="text-gray-500 text-sm">Movies and shows you view will appear here</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {items.map((item) => (
              <div
                key={item.tmdb_id}
                onClick={() => navigate(`/detail/${item.media_type}/${item.tmdb_id}`)}
                className="group relative cursor-pointer rounded-lg overflow-hidden transition-transform hover:scale-105"
              >
                {item.poster_path ? (
                  <img
                    src={`${TMDB_IMG_POSTER}${item.poster_path}`}
                    alt={item.title}
                    className="w-full h-52 object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-52 bg-gray-800 flex items-center justify-center text-gray-500 text-xs">
                    No Image
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition" />
                <button
                  onClick={(e) => handleRemove(e, item.tmdb_id)}
                  className="absolute top-2 right-2 w-6 h-6 bg-black/70 rounded-full text-xs text-gray-300 hover:text-white opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
                  title="Remove from history"
                >
                  ×
                </button>
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/90 to-transparent">
                  <p className="text-xs font-semibold truncate">{item.title}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(item.viewed_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default History;
