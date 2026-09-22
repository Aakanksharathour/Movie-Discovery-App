import {
  discoverMovies,
  searchMovies,
  getMovieById,
} from '../services/tmdbService.js';
import {
  parseDiscoverQuery,
  parseSearchQuery,
  parseMovieId,
} from '../utils/validateQuery.js';

async function getDiscoverMovies(req, res, next) {
  try {
    const parsed = parseDiscoverQuery(req.query);
    if (!parsed.ok) {
      return res.status(400).json({ message: parsed.message });
    }

    const data = await discoverMovies(parsed.value);
    return res.json(data);
  } catch (error) {
    return next(error);
  }
}

async function getSearchMovies(req, res, next) {
  try {
    const parsed = parseSearchQuery(req.query);
    if (!parsed.ok) {
      return res.status(400).json({ message: parsed.message });
    }

    const data = await searchMovies(parsed.value);
    return res.json(data);
  } catch (error) {
    return next(error);
  }
}

async function getMovieDetails(req, res, next) {
  try {
    const parsed = parseMovieId(req.params.id);
    if (!parsed.ok) {
      return res.status(400).json({ message: parsed.message });
    }

    const movie = await getMovieById(parsed.value);
    return res.json(movie);
  } catch (error) {
    return next(error);
  }
}

export { getDiscoverMovies, getSearchMovies, getMovieDetails };
