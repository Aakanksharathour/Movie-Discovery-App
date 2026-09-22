import axiosClient from './axiosClient';

/**
 * Browse / discover movies from our backend.
 * params: page, genre, year, minRating, sortBy
 * options.signal: AbortController signal to cancel stale requests
 */
async function fetchDiscoverMovies(params = {}, options = {}) {
  const response = await axiosClient.get('/movies/discover', {
    params,
    signal: options.signal,
  });
  return response.data;
}

/**
 * Search movies by text.
 */
async function fetchSearchMovies({ q, page = 1 }, options = {}) {
  const response = await axiosClient.get('/movies/search', {
    params: { q, page },
    signal: options.signal,
  });
  return response.data;
}

/**
 * Get one movie's details.
 */
async function fetchMovieDetails(movieId, options = {}) {
  const response = await axiosClient.get(`/movies/${movieId}`, {
    signal: options.signal,
  });
  return response.data;
}

/**
 * Get all genres.
 */
async function fetchGenres(options = {}) {
  const response = await axiosClient.get('/genres', {
    signal: options.signal,
  });
  return response.data;
}

export {
  fetchDiscoverMovies,
  fetchSearchMovies,
  fetchMovieDetails,
  fetchGenres,
};
