import watchlistReducer, { clearWatchlist } from "../store/slices/watchlistSlice";

describe("watchlistSlice", () => {
  const initialState = {
    items: [],
    loading: false,
    error: null,
  };

  it("should return the initial state", () => {
    expect(watchlistReducer(undefined, { type: "unknown" })).toEqual(initialState);
  });

  it("should clear watchlist", () => {
    const state = { ...initialState, items: [{ tmdb_id: 1 }, { tmdb_id: 2 }] };
    const result = watchlistReducer(state, clearWatchlist());
    expect(result.items).toEqual([]);
  });

  it("should set loading on fetchWatchlist pending", () => {
    const result = watchlistReducer(initialState, {
      type: "watchlist/fetch/pending",
    });
    expect(result.loading).toBe(true);
  });

  it("should set items on fetchWatchlist fulfilled", () => {
    const items = [{ tmdb_id: 1, title: "Movie" }];
    const result = watchlistReducer(initialState, {
      type: "watchlist/fetch/fulfilled",
      payload: items,
    });
    expect(result.items).toEqual(items);
    expect(result.loading).toBe(false);
  });

  it("should add item on addToWatchlist fulfilled", () => {
    const item = { tmdb_id: 1, title: "Movie" };
    const result = watchlistReducer(initialState, {
      type: "watchlist/add/fulfilled",
      payload: item,
    });
    expect(result.items).toContainEqual(item);
  });

  it("should remove item on removeFromWatchlist fulfilled", () => {
    const state = {
      ...initialState,
      items: [{ tmdb_id: 1, title: "Movie" }, { tmdb_id: 2, title: "Movie 2" }],
    };
    const result = watchlistReducer(state, {
      type: "watchlist/remove/fulfilled",
      payload: 1,
    });
    expect(result.items).toHaveLength(1);
    expect(result.items[0].tmdb_id).toBe(2);
  });
});
