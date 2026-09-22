import express from 'express';
import cors from 'cors';
import moviesRouter from './routes/movies.js';
import genresRouter from './routes/genres.js';
import wishlistRouter from './routes/wishlist.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Movie Discovery API is running',
  });
});

app.use('/api/movies', moviesRouter);
app.use('/api/genres', genresRouter);
app.use('/api/wishlist', wishlistRouter);

app.use(errorHandler);

export default app;
