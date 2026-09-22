import { Router } from 'express';
import {
  getDiscoverMovies,
  getSearchMovies,
  getMovieDetails,
} from '../controllers/moviesController.js';

const router = Router();

// Static paths first — otherwise "discover" / "search" would match :id
router.get('/discover', getDiscoverMovies);
router.get('/search', getSearchMovies);
router.get('/:id', getMovieDetails);

export default router;
