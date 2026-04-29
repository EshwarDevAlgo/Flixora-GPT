import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { supabase } from "../../config/supabase";

export const fetchReviews = createAsyncThunk("reviews/fetch", async (tmdbId) => {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("tmdb_id", tmdbId)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data || [];
});

export const submitReview = createAsyncThunk(
  "reviews/submit",
  async ({ userId, userName, tmdbId, mediaType, rating, reviewText }) => {
    if (!supabase) throw new Error("Supabase not configured");
    const { data, error } = await supabase
      .from("reviews")
      .upsert(
        [{ user_id: userId, user_name: userName, tmdb_id: tmdbId, media_type: mediaType, rating, review_text: reviewText }],
        { onConflict: "user_id,tmdb_id" }
      )
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  }
);

export const deleteReview = createAsyncThunk("reviews/delete", async ({ userId, tmdbId }) => {
  if (!supabase) throw new Error("Supabase not configured");
  const { error } = await supabase
    .from("reviews")
    .delete()
    .eq("user_id", userId)
    .eq("tmdb_id", tmdbId);
  if (error) throw new Error(error.message);
  return { userId, tmdbId };
});

const reviewsSlice = createSlice({
  name: "reviews",
  initialState: {
    items: [],
    loading: false,
    submitting: false,
    error: null,
  },
  reducers: {
    clearReviews: (state) => {
      state.items = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviews.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      })
      .addCase(submitReview.pending, (state) => { state.submitting = true; })
      .addCase(submitReview.fulfilled, (state, action) => {
        const idx = state.items.findIndex(
          (r) => r.user_id === action.payload.user_id && r.tmdb_id === action.payload.tmdb_id
        );
        if (idx !== -1) {
          state.items[idx] = action.payload;
        } else {
          state.items.unshift(action.payload);
        }
        state.submitting = false;
      })
      .addCase(submitReview.rejected, (state, action) => {
        state.error = action.error.message;
        state.submitting = false;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (r) => !(r.user_id === action.payload.userId && r.tmdb_id === action.payload.tmdbId)
        );
      });
  },
});

export const { clearReviews } = reviewsSlice.actions;
export default reviewsSlice.reducer;
