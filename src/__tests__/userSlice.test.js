import userReducer, { setUser, clearUser, setLoading } from "../store/slices/userSlice";

describe("userSlice", () => {
  const initialState = {
    uid: null,
    email: null,
    displayName: null,
    photoURL: null,
    isAuthenticated: false,
    loading: true,
  };

  it("should return the initial state", () => {
    expect(userReducer(undefined, { type: "unknown" })).toEqual(initialState);
  });

  it("should handle setUser", () => {
    const user = {
      uid: "123",
      email: "test@example.com",
      displayName: "Test User",
      photoURL: "https://example.com/photo.jpg",
    };
    const state = userReducer(initialState, setUser(user));
    expect(state.uid).toBe("123");
    expect(state.email).toBe("test@example.com");
    expect(state.displayName).toBe("Test User");
    expect(state.isAuthenticated).toBe(true);
    expect(state.loading).toBe(false);
  });

  it("should handle clearUser", () => {
    const loggedInState = {
      uid: "123",
      email: "test@example.com",
      displayName: "Test",
      photoURL: null,
      isAuthenticated: true,
      loading: false,
    };
    const state = userReducer(loggedInState, clearUser());
    expect(state.uid).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.loading).toBe(false);
  });

  it("should handle setLoading", () => {
    const state = userReducer(initialState, setLoading(false));
    expect(state.loading).toBe(false);
  });
});
