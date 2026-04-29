import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE } from "../../config/constants";

export const fetchGptResults = createAsyncThunk("gpt/fetchGptResults", async (query) => {
  const { data } = await axios.post(`${API_BASE}/gpt/search`, { query });
  return data;
});

const gptSlice = createSlice({
  name: "gpt",
  initialState: {
    showGptSearch: false,
    results: [],
    searchQuery: "",
    loading: false,
    error: null,
  },
  reducers: {
    toggleGptSearch: (state) => {
      state.showGptSearch = !state.showGptSearch;
    },
    clearGptResults: (state) => {
      state.results = [];
      state.searchQuery = "";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGptResults.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGptResults.fulfilled, (state, action) => {
        state.results = action.payload.results;
        state.searchQuery = action.payload.query;
        state.loading = false;
      })
      .addCase(fetchGptResults.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      });
  },
});

export const { toggleGptSearch, clearGptResults } = gptSlice.actions;
export default gptSlice.reducer;
