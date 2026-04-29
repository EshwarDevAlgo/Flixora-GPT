import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  fetchNowPlaying, fetchPopular, fetchTopRated, fetchUpcoming,
  fetchTrending, fetchPopularTV, fetchTopRatedTV,
  fetchAction, fetchComedy, fetchHorror, fetchSciFi,
  fetchAnime, fetchCartoons, fetchDocs, fetchRomance, fetchThriller,
} from "../store/slices/moviesSlice";

const useMovieData = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Priority 1 — main page content loads immediately
    dispatch(fetchNowPlaying());
    dispatch(fetchPopular());
    dispatch(fetchTopRated());
    dispatch(fetchUpcoming());
    dispatch(fetchTrending());
    dispatch(fetchPopularTV());
    dispatch(fetchTopRatedTV());

    // Priority 2 — genre rows load slightly after so main content renders first
    const timer = setTimeout(() => {
      dispatch(fetchAction());
      dispatch(fetchComedy());
      dispatch(fetchHorror());
      dispatch(fetchSciFi());
      dispatch(fetchAnime());
      dispatch(fetchCartoons());
      dispatch(fetchDocs());
      dispatch(fetchRomance());
      dispatch(fetchThriller());
    }, 800);

    return () => clearTimeout(timer);
  }, [dispatch]);
};

export default useMovieData;
