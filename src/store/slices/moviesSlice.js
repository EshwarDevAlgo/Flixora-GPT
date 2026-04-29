import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE } from "../../config/constants";

export const fetchNowPlaying = createAsyncThunk("movies/fetchNowPlaying", async () => {
  const { data } = await axios.get(`${API_BASE}/tmdb/now-playing`);
  return data;
});

export const fetchPopular = createAsyncThunk("movies/fetchPopular", async () => {
  const { data } = await axios.get(`${API_BASE}/tmdb/popular`);
  return data;
});

export const fetchTopRated = createAsyncThunk("movies/fetchTopRated", async () => {
  const { data } = await axios.get(`${API_BASE}/tmdb/top-rated`);
  return data;
});

export const fetchUpcoming = createAsyncThunk("movies/fetchUpcoming", async () => {
  const { data } = await axios.get(`${API_BASE}/tmdb/upcoming`);
  return data;
});

export const fetchTrending = createAsyncThunk("movies/fetchTrending", async () => {
  const { data } = await axios.get(`${API_BASE}/tmdb/trending`);
  return data;
});

export const fetchPopularTV = createAsyncThunk("movies/fetchPopularTV", async () => {
  const { data } = await axios.get(`${API_BASE}/tmdb/tv/popular`);
  return data;
});

export const fetchTopRatedTV = createAsyncThunk("movies/fetchTopRatedTV", async () => {
  const { data } = await axios.get(`${API_BASE}/tmdb/tv/top-rated`);
  return data;
});

export const fetchMovieDetails = createAsyncThunk("movies/fetchMovieDetails", async ({ id, type }) => {
  const { data } = await axios.get(`${API_BASE}/tmdb/${type}/${id}`);
  return { data, type };
});

export const searchTMDB = createAsyncThunk("movies/searchTMDB", async (query) => {
  const { data } = await axios.get(`${API_BASE}/tmdb/search`, { params: { query } });
  return data;
});

// ── New category thunks ─────────────────────────────────────────────
export const fetchAction    = createAsyncThunk("movies/fetchAction",    () => axios.get(`${API_BASE}/tmdb/genre/28`).then(r => r.data));
export const fetchComedy    = createAsyncThunk("movies/fetchComedy",    () => axios.get(`${API_BASE}/tmdb/genre/35`).then(r => r.data));
export const fetchHorror    = createAsyncThunk("movies/fetchHorror",    () => axios.get(`${API_BASE}/tmdb/genre/27`).then(r => r.data));
export const fetchSciFi     = createAsyncThunk("movies/fetchSciFi",     () => axios.get(`${API_BASE}/tmdb/genre/878`).then(r => r.data));
export const fetchRomance   = createAsyncThunk("movies/fetchRomance",   () => axios.get(`${API_BASE}/tmdb/genre/10749`).then(r => r.data));
export const fetchThriller  = createAsyncThunk("movies/fetchThriller",  () => axios.get(`${API_BASE}/tmdb/genre/53`).then(r => r.data));
export const fetchAnime     = createAsyncThunk("movies/fetchAnime",     () => axios.get(`${API_BASE}/tmdb/anime`).then(r => r.data));
export const fetchCartoons  = createAsyncThunk("movies/fetchCartoons",  () => axios.get(`${API_BASE}/tmdb/cartoons`).then(r => r.data));
export const fetchDocs      = createAsyncThunk("movies/fetchDocs",      () => axios.get(`${API_BASE}/tmdb/documentaries`).then(r => r.data));

const moviesSlice = createSlice({
  name: "movies",
  initialState: {
    nowPlaying: [],
    popular: [],
    topRated: [],
    upcoming: [],
    trending: [],
    popularTV: [],
    topRatedTV: [],
    action: [],
    comedy: [],
    horror: [],
    sciFi: [],
    romance: [],
    thriller: [],
    anime: [],
    cartoons: [],
    documentaries: [],
    searchResults: [],
    selectedDetail: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearSearchResults: (state) => { state.searchResults = []; },
    clearSelectedDetail: (state) => { state.selectedDetail = null; },
  },
  extraReducers: (builder) => {
    const addFetchCase = (thunk, key) => {
      builder
        .addCase(thunk.pending, (state) => { state.loading = true; })
        .addCase(thunk.fulfilled, (state, action) => {
          state[key] = action.payload;
          state.loading = false;
        })
        .addCase(thunk.rejected, (state, action) => {
          state.error = action.error.message;
          state.loading = false;
        });
    };
    addFetchCase(fetchNowPlaying, "nowPlaying");
    addFetchCase(fetchPopular, "popular");
    addFetchCase(fetchTopRated, "topRated");
    addFetchCase(fetchUpcoming, "upcoming");
    addFetchCase(fetchTrending, "trending");
    addFetchCase(fetchPopularTV, "popularTV");
    addFetchCase(fetchTopRatedTV, "topRatedTV");
    addFetchCase(searchTMDB, "searchResults");
    addFetchCase(fetchAction, "action");
    addFetchCase(fetchComedy, "comedy");
    addFetchCase(fetchHorror, "horror");
    addFetchCase(fetchSciFi, "sciFi");
    addFetchCase(fetchRomance, "romance");
    addFetchCase(fetchThriller, "thriller");
    addFetchCase(fetchAnime, "anime");
    addFetchCase(fetchCartoons, "cartoons");
    addFetchCase(fetchDocs, "documentaries");

    builder
      .addCase(fetchMovieDetails.pending, (state) => { state.loading = true; })
      .addCase(fetchMovieDetails.fulfilled, (state, action) => {
        state.selectedDetail = action.payload.data;
        state.loading = false;
      })
      .addCase(fetchMovieDetails.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      });
  },
});

export const { clearSearchResults, clearSelectedDetail } = moviesSlice.actions;
export default moviesSlice.reducer;
