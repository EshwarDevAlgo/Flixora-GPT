import moviesReducer, { clearSearchResults, clearSelectedDetail } from "../store/slices/moviesSlice";

describe("moviesSlice", () => {
  const initialState = {
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
  };

  it("should return the initial state", () => {
    expect(moviesReducer(undefined, { type: "unknown" })).toEqual(initialState);
  });

  it("should handle clearSearchResults", () => {
    const state = { ...initialState, searchResults: [{ id: 1 }] };
    const result = moviesReducer(state, clearSearchResults());
    expect(result.searchResults).toEqual([]);
  });

  it("should handle clearSelectedDetail", () => {
    const state = { ...initialState, selectedDetail: { id: 1, title: "Test" } };
    const result = moviesReducer(state, clearSelectedDetail());
    expect(result.selectedDetail).toBeNull();
  });

  it("should set loading on fetchNowPlaying pending", () => {
    const result = moviesReducer(initialState, {
      type: "movies/fetchNowPlaying/pending",
    });
    expect(result.loading).toBe(true);
  });

  it("should set nowPlaying on fetchNowPlaying fulfilled", () => {
    const movies = [{ id: 1, title: "Movie 1" }, { id: 2, title: "Movie 2" }];
    const result = moviesReducer(initialState, {
      type: "movies/fetchNowPlaying/fulfilled",
      payload: movies,
    });
    expect(result.nowPlaying).toEqual(movies);
    expect(result.loading).toBe(false);
  });

  it("should set error on fetchNowPlaying rejected", () => {
    const result = moviesReducer(initialState, {
      type: "movies/fetchNowPlaying/rejected",
      error: { message: "Network error" },
    });
    expect(result.error).toBe("Network error");
    expect(result.loading).toBe(false);
  });
});
