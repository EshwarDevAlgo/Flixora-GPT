import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    uid: null,
    email: null,
    displayName: null,
    photoURL: null,
    isAuthenticated: false,
    loading: true,
  },
  reducers: {
    setUser: (state, action) => {
      const { uid, email, displayName, photoURL } = action.payload;
      state.uid = uid;
      state.email = email;
      state.displayName = displayName;
      state.photoURL = photoURL;
      state.isAuthenticated = true;
      state.loading = false;
    },
    clearUser: (state) => {
      state.uid = null;
      state.email = null;
      state.displayName = null;
      state.photoURL = null;
      state.isAuthenticated = false;
      state.loading = false;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setUser, clearUser, setLoading } = userSlice.actions;
export default userSlice.reducer;
