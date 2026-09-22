import { getGenres } from '../services/tmdbService.js';

async function getAllGenres(req, res, next) {
  try {
    const data = await getGenres();
    return res.json(data);
  } catch (error) {
    return next(error);
  }
}

export { getAllGenres };
