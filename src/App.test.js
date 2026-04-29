import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./store/slices/userSlice";
import moviesReducer from "./store/slices/moviesSlice";
import gptReducer from "./store/slices/gptSlice";
import watchlistReducer from "./store/slices/watchlistSlice";
import App from "./App";

jest.mock("firebase/app", () => ({
  initializeApp: jest.fn(),
}));

jest.mock("./config/firebase", () => ({
  auth: {},
  googleProvider: {},
}));

jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(),
  GoogleAuthProvider: jest.fn(),
  onAuthStateChanged: jest.fn(() => jest.fn()),
  signInWithPopup: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  updateProfile: jest.fn(),
  signOut: jest.fn(),
}));

jest.mock("./config/supabase", () => ({
  supabase: { from: jest.fn() },
}));

jest.mock("./hooks/useAuthListener", () => jest.fn());

const createTestStore = () =>
  configureStore({
    reducer: {
      user: userReducer,
      movies: moviesReducer,
      gpt: gptReducer,
      watchlist: watchlistReducer,
    },
  });

test("renders without crashing", () => {
  const store = createTestStore();
  const { container } = render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  expect(container).toBeTruthy();
});
