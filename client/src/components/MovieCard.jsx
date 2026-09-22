import { Link } from 'react-router-dom';

// Simple SVG placeholder when TMDB has no poster
const PLACEHOLDER =
  'data:image/svg+xml,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="450" viewBox="0 0 300 450">
      <rect width="300" height="450" fill="#2a2a2a"/>
      <text x="150" y="225" text-anchor="middle" fill="#888" font-family="sans-serif" font-size="18">No Poster</text>
    </svg>`
  );

function MovieCard({ movie }) {
  const posterSrc = movie.posterUrl || PLACEHOLDER;
  const yearLabel = movie.releaseYear || 'N/A';
  const ratingLabel = movie.rating !== null && movie.rating !== undefined
    ? movie.rating.toFixed(1)
    : 'N/A';

  return (
    <article className="movie-card">
      <Link to={`/movies/${movie.id}`} className="movie-card__link">
        <div className="movie-card__poster-wrap">
          <img
            className="movie-card__poster"
            src={posterSrc}
            alt={`Poster for ${movie.title}`}
            loading="lazy"
          />
        </div>
        <div className="movie-card__body">
          <h2 className="movie-card__title">{movie.title}</h2>
          <div className="movie-card__meta">
            <span>{yearLabel}</span>
            <span className="movie-card__rating" aria-label={`Rating ${ratingLabel}`}>
              ★ {ratingLabel}
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

export default MovieCard;
