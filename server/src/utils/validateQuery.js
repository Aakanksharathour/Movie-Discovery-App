import { SORT_MAP } from '../services/tmdbService.js';

/**
 * Read and validate common movie query params.
 * Returns either { ok: true, value } or { ok: false, message }.
 */
function parseDiscoverQuery(query) {
  const page = Number(query.page) || 1;
  if (!Number.isInteger(page) || page < 1) {
    return { ok: false, message: 'page must be a whole number of 1 or greater' };
  }

  let genre;
  if (query.genre !== undefined && query.genre !== '') {
    genre = Number(query.genre);
    if (!Number.isInteger(genre) || genre < 1) {
      return { ok: false, message: 'genre must be a valid genre id number' };
    }
  }

  let year;
  if (query.year !== undefined && query.year !== '') {
    year = Number(query.year);
    const currentYear = new Date().getFullYear() + 1;
    if (!Number.isInteger(year) || year < 1900 || year > currentYear) {
      return { ok: false, message: `year must be between 1900 and ${currentYear}` };
    }
  }

  let minRating;
  if (query.minRating !== undefined && query.minRating !== '') {
    minRating = Number(query.minRating);
    if (Number.isNaN(minRating) || minRating < 0 || minRating > 10) {
      return { ok: false, message: 'minRating must be a number between 0 and 10' };
    }
  }

  const sortBy = query.sortBy || 'popularity';
  if (!SORT_MAP[sortBy]) {
    return {
      ok: false,
      message: 'sortBy must be one of: popularity, rating, release_date',
    };
  }

  return {
    ok: true,
    value: { page, genre, year, minRating, sortBy },
  };
}

function parseSearchQuery(query) {
  const q = typeof query.q === 'string' ? query.q.trim() : '';
  if (!q) {
    return { ok: false, message: 'q (search text) is required' };
  }

  const page = Number(query.page) || 1;
  if (!Number.isInteger(page) || page < 1) {
    return { ok: false, message: 'page must be a whole number of 1 or greater' };
  }

  return { ok: true, value: { query: q, page } };
}

function parseMovieId(idParam) {
  const movieId = Number(idParam);
  if (!Number.isInteger(movieId) || movieId < 1) {
    return { ok: false, message: 'movie id must be a positive whole number' };
  }
  return { ok: true, value: movieId };
}

export { parseDiscoverQuery, parseSearchQuery, parseMovieId };
