import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchMovieDetails } from '../api/moviesApi';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import WishlistButton from '../components/WishlistButton';

const PLACEHOLDER =
  'data:image/svg+xml,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="450" viewBox="0 0 300 450">
      <rect width="300" height="450" fill="#2a2a2a"/>
      <text x="150" y="225" text-anchor="middle" fill="#888" font-family="sans-serif" font-size="18">No Poster</text>
    </svg>`
  );

function MovieDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadDetails() {
      setLoading(true);
      setError('');
      setMovie(null);

      try {
        const data = await fetchMovieDetails(id, {
          signal: controller.signal,
        });
        setMovie(data);
      } catch (err) {
        if (err.code === 'ERR_CANCELED' || err.name === 'CanceledError') {
          return;
        }

        const message =
          err.response?.data?.message ||
          err.message ||
          'Failed to load movie details.';
        setError(message);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadDetails();

    return () => {
      controller.abort();
    };
  }, [id, retryKey]);

  function handleBack() {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  }

  if (loading) {
    return (
      <section className="page">
        <LoadingSpinner message="Loading movie details..." />
      </section>
    );
  }

  if (error) {
    return (
      <section className="page">
        <button type="button" className="btn btn--ghost back-btn" onClick={handleBack}>
          ← Back
        </button>
        <ErrorMessage
          message={error}
          onRetry={() => setRetryKey((key) => key + 1)}
        />
      </section>
    );
  }

  if (!movie) {
    return null;
  }

  const posterSrc = movie.posterUrl || PLACEHOLDER;
  const yearLabel = movie.releaseYear || 'N/A';
  const ratingLabel =
    movie.rating !== null && movie.rating !== undefined
      ? movie.rating.toFixed(1)
      : 'N/A';
  const runtimeLabel = movie.runtime ? `${movie.runtime} min` : null;

  return (
    <section className="page">
      <button type="button" className="btn btn--ghost back-btn" onClick={handleBack}>
        ← Back
      </button>

      <article className="details">
        <div className="details__poster-wrap">
          <img
            className="details__poster"
            src={posterSrc}
            alt={`Poster for ${movie.title}`}
          />
        </div>

        <div className="details__content">
          <h1 className="details__title">{movie.title}</h1>

          {movie.tagline ? (
            <p className="details__tagline">{movie.tagline}</p>
          ) : null}

          <ul className="details__meta">
            <li>{yearLabel}</li>
            <li>★ {ratingLabel}</li>
            {runtimeLabel ? <li>{runtimeLabel}</li> : null}
            {movie.status ? <li>{movie.status}</li> : null}
          </ul>

          {movie.genres && movie.genres.length > 0 ? (
            <div className="details__genres">
              {movie.genres.map((genre) => (
                <span key={genre.id} className="details__genre-chip">
                  {genre.name}
                </span>
              ))}
            </div>
          ) : null}

          <WishlistButton movie={movie} />

          <div className="details__overview">
            <h2>Overview</h2>
            <p>
              {movie.overview
                ? movie.overview
                : 'No overview available for this movie.'}
            </p>
          </div>
        </div>
      </article>
    </section>
  );
}

export default MovieDetailsPage;
