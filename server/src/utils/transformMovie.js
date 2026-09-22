import env from '../config/env.js';

/**
 * Convert one TMDB movie (list item) into our clean card format.
 */
function transformMovie(tmdbMovie) {
  if (!tmdbMovie) {
    return null;
  }

  const releaseDate = tmdbMovie.release_date || '';
  const releaseYear = releaseDate ? releaseDate.slice(0, 4) : null;

  let posterUrl = null;
  if (tmdbMovie.poster_path) {
    posterUrl = `${env.tmdbImageBaseUrl}${tmdbMovie.poster_path}`;
  }

  // Details endpoint uses genres: [{id, name}], list endpoints use genre_ids: [number]
  let genreIds = [];
  if (Array.isArray(tmdbMovie.genre_ids)) {
    genreIds = tmdbMovie.genre_ids;
  } else if (Array.isArray(tmdbMovie.genres)) {
    for (let i = 0; i < tmdbMovie.genres.length; i++) {
      if (tmdbMovie.genres[i]?.id) {
        genreIds.push(tmdbMovie.genres[i].id);
      }
    }
  }

  return {
    id: tmdbMovie.id,
    title: tmdbMovie.title || tmdbMovie.name || 'Untitled',
    overview: tmdbMovie.overview || '',
    posterUrl,
    releaseYear,
    rating: typeof tmdbMovie.vote_average === 'number'
      ? Number(tmdbMovie.vote_average.toFixed(1))
      : null,
    genreIds,
  };
}

/**
 * Extra fields for the movie details page.
 */
function transformMovieDetails(tmdbMovie) {
  const base = transformMovie(tmdbMovie);
  if (!base) {
    return null;
  }

  const genres = [];
  if (Array.isArray(tmdbMovie.genres)) {
    for (let i = 0; i < tmdbMovie.genres.length; i++) {
      const genre = tmdbMovie.genres[i];
      if (genre?.id && genre?.name) {
        genres.push({ id: genre.id, name: genre.name });
      }
    }
  }

  let backdropUrl = null;
  if (tmdbMovie.backdrop_path) {
    backdropUrl = `https://image.tmdb.org/t/p/w1280${tmdbMovie.backdrop_path}`;
  }

  return {
    ...base,
    genres,
    runtime: typeof tmdbMovie.runtime === 'number' ? tmdbMovie.runtime : null,
    tagline: tmdbMovie.tagline || '',
    backdropUrl,
    status: tmdbMovie.status || null,
  };
}

/**
 * Convert a TMDB list response (discover/search) into our list format.
 */
function transformMovieList(tmdbResponse) {
  const results = [];
  const rawResults = Array.isArray(tmdbResponse?.results) ? tmdbResponse.results : [];

  for (let i = 0; i < rawResults.length; i++) {
    const movie = transformMovie(rawResults[i]);
    if (movie) {
      results.push(movie);
    }
  }

  return {
    page: tmdbResponse?.page || 1,
    totalPages: tmdbResponse?.total_pages || 0,
    totalResults: tmdbResponse?.total_results || 0,
    results,
  };
}

/**
 * Convert TMDB genre list into [{ id, name }].
 */
function transformGenres(tmdbResponse) {
  const genres = [];
  const raw = Array.isArray(tmdbResponse?.genres) ? tmdbResponse.genres : [];

  for (let i = 0; i < raw.length; i++) {
    if (raw[i]?.id && raw[i]?.name) {
      genres.push({ id: raw[i].id, name: raw[i].name });
    }
  }

  return { genres };
}

export {
  transformMovie,
  transformMovieDetails,
  transformMovieList,
  transformGenres,
};
