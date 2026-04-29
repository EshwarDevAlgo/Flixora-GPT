import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../../config/supabase";

export const fetchWatchlist = createAsyncThunk("watchlist/fetch", async (userId) => {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("watchlist")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data;
});

export const addToWatchlist = createAsyncThunk("watchlist/add", async ({ userId, item }) => {
  const row = {
    user_id: userId,
    tmdb_id: item.id,
    title: item.title || item.name,
    poster_path: item.poster_path,
    media_type: item.media_type || "movie",
    vote_average: item.vote_average,
    overview: item.overview,
  };
  if (!supabase) throw new Error("Supabase not configured");
  const { data, error } = await supabase.from("watchlist").insert([row]).select().single();
  if (error) throw new Error(error.message);
  return data;
});

export const removeFromWatchlist = createAsyncThunk("watchlist/remove", async ({ userId, tmdbId }) => {
  if (!supabase) throw new Error("Supabase not configured");
  const { error } = await supabase
    .from("watchlist")
    .delete()
    .eq("user_id", userId)
    .eq("tmdb_id", tmdbId);
  if (error) throw new Error(error.message);
  return tmdbId;
});

const watchlistSlice = createSlice({
  name: "watchlist",
  initialState: {
    items: [],
    loading: false,
    error: null,
    _removedItem: null, // stored for optimistic revert
  },
  reducers: {
    clearWatchlist: (state) => { state.items = []; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWatchlist.pending, (state) => { state.loading = true; })
      .addCase(fetchWatchlist.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchWatchlist.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })

      // ── OPTIMISTIC ADD ──────────────────────────────────────────────
      .addCase(addToWatchlist.pending, (state, action) => {
        const { item } = action.meta.arg;
        // Immediately insert into UI — mark as optimistic
        state.items.unshift({
          tmdb_id: item.id,
          title: item.title || item.name,
          poster_path: item.poster_path,
          media_type: item.media_type || "movie",
          vote_average: item.vote_average,
          overview: item.overview,
          _optimistic: true,
        });
      })
      .addCase(addToWatchlist.fulfilled, (state, action) => {
        // Replace the optimistic placeholder with confirmed DB row,
        // or add the item if no optimistic placeholder exists.
        const idx = state.items.findIndex(
          (i) => i.tmdb_id === action.payload.tmdb_id && i._optimistic
        );
        if (idx !== -1) {
          state.items[idx] = action.payload;
        } else {
          state.items.unshift(action.payload);
        }
      })
      .addCase(addToWatchlist.rejected, (state, action) => {
        // Revert — remove the optimistic item
        const { item } = action.meta.arg;
        state.items = state.items.filter(
          (i) => !(i.tmdb_id === item.id && i._optimistic)
        );
        state.error = action.error.message;
      })

      // ── OPTIMISTIC REMOVE ───────────────────────────────────────────
      .addCase(removeFromWatchlist.pending, (state, action) => {
        const { tmdbId } = action.meta.arg;
        // Store removed item in case we need to revert
        state._removedItem = state.items.find((i) => i.tmdb_id === tmdbId) || null;
        // Immediately remove from UI
        state.items = state.items.filter((i) => i.tmdb_id !== tmdbId);
      })
      .addCase(removeFromWatchlist.fulfilled, (state, action) => {
        if (!state._removedItem) {
          state.items = state.items.filter((i) => i.tmdb_id !== action.payload);
        }
        state._removedItem = null;
      })
      .addCase(removeFromWatchlist.rejected, (state) => {
        // Revert — put the item back
        if (state._removedItem) {
          state.items.unshift(state._removedItem);
          state._removedItem = null;
        }
      });
  },
});

export const { clearWatchlist } = watchlistSlice.actions;
export default watchlistSlice.reducer;

