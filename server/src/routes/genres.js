import { Router } from 'express';
import { getAllGenres } from '../controllers/genresController.js';

const router = Router();

// GET /api/genres
router.get('/', getAllGenres);

export default router;
