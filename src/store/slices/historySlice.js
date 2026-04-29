import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../../config/supabase";

export const fetchHistory = createAsyncThunk("history/fetch", async (userId) => {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("watch_history")
    .select("*")
    .eq("user_id", userId)
    .order("viewed_at", { ascending: false })
    .limit(60);
  if (error) throw new Error(error.message);
  return data || [];
});

export const addToHistory = createAsyncThunk("history/add", async ({ userId, item, type }) => {
  if (!supabase || !userId) return null;
  const { error } = await supabase
    .from("watch_history")
    .upsert(
      [{
        user_id: userId,
        tmdb_id: item.id,
        title: item.title || item.name,
        poster_path: item.poster_path,
        media_type: type || item.media_type || "movie",
        viewed_at: new Date().toISOString(),
      }],
      { onConflict: "user_id,tmdb_id" }
    );
  if (error) console.warn("History upsert:", error.message);
  return {
    tmdb_id: item.id,
    title: item.title || item.name,
    poster_path: item.poster_path,
    media_type: type || "movie",
    viewed_at: new Date().toISOString(),
  };
});

export const clearHistoryItem = createAsyncThunk("history/clearItem", async ({ userId, tmdbId }) => {
  if (!supabase) return tmdbId;
  await supabase.from("watch_history").delete().eq("user_id", userId).eq("tmdb_id", tmdbId);
  return tmdbId;
});

const historySlice = createSlice({
  name: "history",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearAllHistory: (state) => { state.items = []; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHistory.pending, (state) => { state.loading = true; })
      .addCase(fetchHistory.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchHistory.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      .addCase(addToHistory.fulfilled, (state, action) => {
        if (!action.payload) return;
        const idx = state.items.findIndex((i) => i.tmdb_id === action.payload.tmdb_id);
        if (idx !== -1) {
          state.items[idx].viewed_at = action.payload.viewed_at;
        } else {
          state.items.unshift(action.payload);
        }
      })
      .addCase(clearHistoryItem.fulfilled, (state, action) => {
        state.items = state.items.filter((i) => i.tmdb_id !== action.payload);
      });
  },
});

export const { clearAllHistory } = historySlice.actions;
export default historySlice.reducer;
