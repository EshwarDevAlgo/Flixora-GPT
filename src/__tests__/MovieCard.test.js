import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../store/slices/userSlice";
import moviesReducer from "../store/slices/moviesSlice";
import gptReducer from "../store/slices/gptSlice";
import watchlistReducer from "../store/slices/watchlistSlice";
import MovieCard from "../components/MovieCard/MovieCard";

const createTestStore = (preloadedState = {}) =>
  configureStore({
    reducer: {
      user: userReducer,
      movies: moviesReducer,
      gpt: gptReducer,
      watchlist: watchlistReducer,
    },
    preloadedState,
  });

const renderWithProviders = (ui, { store, ...options } = {}) => {
  const testStore = store || createTestStore({
    user: { uid: "123", email: "test@test.com", displayName: "Test", photoURL: null, isAuthenticated: true, loading: false },
    watchlist: { items: [], loading: false, error: null },
  });
  return render(
    <Provider store={testStore}>
      <MemoryRouter>{ui}</MemoryRouter>
    </Provider>,
    options
  );
};

describe("MovieCard", () => {
  const mockMovie = {
    id: 550,
    title: "Fight Club",
    poster_path: "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
    vote_average: 8.4,
    overview: "A ticking-Loss insomnia memoir.",
  };

  it("renders movie title on hover area", () => {
    renderWithProviders(<MovieCard movie={mockMovie} />);
    expect(screen.getByAltText("Fight Club")).toBeInTheDocument();
  });

  it("shows no image placeholder when poster_path is null", () => {
    const movieNoImage = { ...mockMovie, poster_path: null };
    renderWithProviders(<MovieCard movie={movieNoImage} />);
    expect(screen.getByText("No Image")).toBeInTheDocument();
  });

  it("renders add to watchlist button", () => {
    renderWithProviders(<MovieCard movie={mockMovie} />);
    expect(screen.getByTitle("Add to watchlist")).toBeInTheDocument();
  });
});
