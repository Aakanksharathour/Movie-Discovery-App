import env from '../config/env.js';
import {
  transformMovieList,
  transformMovieDetails,
  transformGenres,
} from '../utils/transformMovie.js';
import { buildKey, getCache, setCache } from './cacheService.js';

const TMDB_TIMEOUT_MS = 8000;

// Cache TTLs
const TTL = {
  discover: 5 * 60 * 1000, // 5 minutes
  search: 3 * 60 * 1000, // 3 minutes
  details: 15 * 60 * 1000, // 15 minutes
  genres: 24 * 60 * 60 * 1000, // 24 hours
};

const SORT_MAP = {
  popularity: 'popularity.desc',
  rating: 'vote_average.desc',
  release_date: 'primary_release_date.desc',
};

async function tmdbFetch(path, query = {}) {
  const url = new URL(`${env.tmdbBaseUrl}${path}`);
  url.searchParams.set('api_key', env.tmdbApiKey);

  for (const key of Object.keys(query)) {
    if (query[key] !== undefined && query[key] !== null && query[key] !== '') {
      url.searchParams.set(key, String(query[key]));
    }
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TMDB_TIMEOUT_MS);

  try {
    const response = await fetch(url, { signal: controller.signal });

    if (!response.ok) {
      let message = 'TMDB request failed';
      try {
        const errorBody = await response.json();
        if (errorBody?.status_message) {
          message = errorBody.status_message;
        }
      } catch {
        // ignore
      }

      const tmdbError = new Error(message);
      if (response.status === 404) {
        tmdbError.statusCode = 404;
      } else if (response.status >= 500) {
        tmdbError.statusCode = 502;
      } else {
        tmdbError.statusCode = response.status;
      }
      throw tmdbError;
    }

    return await response.json();
  } catch (error) {
    if (error.name === 'AbortError') {
      const timeoutError = new Error('TMDB request timed out');
      timeoutError.statusCode = 503;
      throw timeoutError;
    }

    if (error.statusCode) {
      throw error;
    }

    console.error('TMDB network error:', error.message);
    const networkError = new Error('Could not reach TMDB');
    networkError.statusCode = 503;
    throw networkError;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function discoverMovies({
  page = 1,
  genre,
  year,
  minRating,
  sortBy = 'popularity',
} = {}) {
  const cacheKey = buildKey([
    'discover',
    page,
    genre || '',
    year || '',
    minRating ?? '',
    sortBy,
  ]);

  const cached = getCache(cacheKey);
  if (cached) {
    return cached;
  }

  const sort_by = SORT_MAP[sortBy] || SORT_MAP.popularity;
  const query = {
    page,
    sort_by,
    include_adult: false,
  };

  if (genre) query.with_genres = genre;
  if (year) query.primary_release_year = year;

  if (minRating !== undefined && minRating !== null && minRating !== '') {
    query['vote_average.gte'] = minRating;
    query['vote_count.gte'] = 50;
  }

  if (sortBy === 'rating') {
    query['vote_count.gte'] = query['vote_count.gte'] || 50;
  }

  const data = await tmdbFetch('/discover/movie', query);
  const result = transformMovieList(data);
  setCache(cacheKey, result, TTL.discover);
  return result;
}

async function searchMovies({ query, page = 1 } = {}) {
  const cacheKey = buildKey(['search', query, page]);
  const cached = getCache(cacheKey);
  if (cached) {
    return cached;
  }

  const data = await tmdbFetch('/search/movie', {
    query,
    page,
    include_adult: false,
  });

  const result = transformMovieList(data);
  setCache(cacheKey, result, TTL.search);
  return result;
}

async function getMovieById(movieId) {
  const cacheKey = buildKey(['details', movieId]);
  const cached = getCache(cacheKey);
  if (cached) {
    return cached;
  }

  const data = await tmdbFetch(`/movie/${movieId}`);
  const movie = transformMovieDetails(data);

  if (!movie) {
    const notFound = new Error('Movie not found');
    notFound.statusCode = 404;
    throw notFound;
  }

  setCache(cacheKey, movie, TTL.details);
  return movie;
}

async function getGenres() {
  const cacheKey = buildKey(['genres']);
  const cached = getCache(cacheKey);
  if (cached) {
    return cached;
  }

  const data = await tmdbFetch('/genre/movie/list');
  const result = transformGenres(data);
  setCache(cacheKey, result, TTL.genres);
  return result;
}

export {
  discoverMovies,
  searchMovies,
  getMovieById,
  getGenres,
  tmdbFetch,
  SORT_MAP,
};
