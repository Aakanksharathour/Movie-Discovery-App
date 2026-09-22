import 'dotenv/config';

const required = ['TMDB_API_KEY'];

for (const key of required) {
  if (!process.env[key] || !process.env[key].trim()) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

const env = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/movie-discovery',
  tmdbApiKey: process.env.TMDB_API_KEY.trim(),
  tmdbBaseUrl: process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3',
  tmdbImageBaseUrl: 'https://image.tmdb.org/t/p/w500',
};

export default env;
