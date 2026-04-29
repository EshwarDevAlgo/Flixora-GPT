import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import moviesReducer from "./slices/moviesSlice";
import gptReducer from "./slices/gptSlice";
import watchlistReducer from "./slices/watchlistSlice";
import reviewsReducer from "./slices/reviewsSlice";
import historyReducer from "./slices/historySlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    movies: moviesReducer,
    gpt: gptReducer,
    watchlist: watchlistReducer,
    reviews: reviewsReducer,
    history: historyReducer,
  },
});

export default store;
