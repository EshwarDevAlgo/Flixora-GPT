import gptReducer, { toggleGptSearch, clearGptResults } from "../store/slices/gptSlice";

describe("gptSlice", () => {
  const initialState = {
    showGptSearch: false,
    results: [],
    searchQuery: "",
    loading: false,
    error: null,
  };

  it("should return the initial state", () => {
    expect(gptReducer(undefined, { type: "unknown" })).toEqual(initialState);
  });

  it("should toggle GPT search", () => {
    const state = gptReducer(initialState, toggleGptSearch());
    expect(state.showGptSearch).toBe(true);
    const state2 = gptReducer(state, toggleGptSearch());
    expect(state2.showGptSearch).toBe(false);
  });

  it("should clear GPT results", () => {
    const state = {
      ...initialState,
      results: [{ id: 1 }],
      searchQuery: "test",
      error: "some error",
    };
    const result = gptReducer(state, clearGptResults());
    expect(result.results).toEqual([]);
    expect(result.searchQuery).toBe("");
    expect(result.error).toBeNull();
  });

  it("should set loading on fetchGptResults pending", () => {
    const result = gptReducer(initialState, {
      type: "gpt/fetchGptResults/pending",
    });
    expect(result.loading).toBe(true);
    expect(result.error).toBeNull();
  });

  it("should set results on fetchGptResults fulfilled", () => {
    const payload = {
      results: [{ id: 1, title: "Inception" }],
      query: "mind bending sci-fi",
    };
    const result = gptReducer(initialState, {
      type: "gpt/fetchGptResults/fulfilled",
      payload,
    });
    expect(result.results).toEqual(payload.results);
    expect(result.searchQuery).toBe(payload.query);
    expect(result.loading).toBe(false);
  });

  it("should set error on fetchGptResults rejected", () => {
    const result = gptReducer(initialState, {
      type: "gpt/fetchGptResults/rejected",
      error: { message: "API Error" },
    });
    expect(result.error).toBe("API Error");
    expect(result.loading).toBe(false);
  });
});
