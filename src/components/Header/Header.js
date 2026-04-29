import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { signOut } from "firebase/auth";
import { auth } from "../../config/firebase";
import { toggleGptSearch, clearGptResults } from "../../store/slices/gptSlice";
import { useNavigate, Link } from "react-router-dom";

const Header = () => {
  const { displayName, photoURL } = useSelector((state) => state.user);
  const { showGptSearch } = useSelector((state) => state.gpt);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut(auth);
    navigate("/");
  };

  const handleGptToggle = () => {
    dispatch(toggleGptSearch());
    if (!showGptSearch) {
      navigate("/browse");
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-8 py-3 bg-gradient-to-b from-black/90 to-transparent">
      <div className="flex items-center gap-6">
        <Link to="/browse" onClick={() => dispatch(clearGptResults())}>
          <h1 className="text-2xl md:text-3xl font-bold text-red-600 tracking-tight">
            Flixora<span className="text-white">GPT</span>
          </h1>
        </Link>
        <nav className="hidden md:flex gap-4 text-sm text-gray-300">
          <Link to="/browse" className="hover:text-white transition">Home</Link>
          <Link to="/tv" className="hover:text-white transition">TV Shows</Link>
          <Link to="/watchlist" className="hover:text-white transition">My List</Link>
          <Link to="/history" className="hover:text-white transition">History</Link>
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleGptToggle}
          className={`px-4 py-1.5 rounded-md text-sm font-semibold transition ${
            showGptSearch
              ? "bg-white text-black hover:bg-gray-200"
              : "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
          }`}
        >
          {showGptSearch ? "✕ Close" : "🤖 AI Search"}
        </button>

        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <img
              src={photoURL || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + displayName}
              alt="avatar"
              className="w-8 h-8 rounded-full"
            />
            <span className="hidden md:block text-sm text-gray-300">{displayName}</span>
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-gray-900 border border-gray-700 rounded-lg shadow-xl py-2">
              <Link
                to="/watchlist"
                className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800"
                onClick={() => setMenuOpen(false)}
              >
                My Watchlist
              </Link>
              <Link
                to="/history"
                className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800"
                onClick={() => setMenuOpen(false)}
              >
                Watch History
              </Link>
              <button
                onClick={handleSignOut}
                className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-800"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
