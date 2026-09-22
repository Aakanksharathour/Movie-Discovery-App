import { useEffect, useState } from 'react';
import { fetchWishlist, removeWishlistItem } from '../api/wishlistApi';
import MovieCard from '../components/MovieCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';

function WishlistPage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadWishlist() {
      setLoading(true);
      setError('');

      try {
        const data = await fetchWishlist({ signal: controller.signal });
        const results = data.results || [];
        const normalized = [];

        for (let i = 0; i < results.length; i++) {
          const item = results[i];
          normalized.push({
            id: item.movieId,
            title: item.title,
            posterUrl: item.posterUrl,
            releaseYear: item.releaseYear,
            rating: item.rating,
          });
        }

        setMovies(normalized);
      } catch (err) {
        if (err.code === 'ERR_CANCELED' || err.name === 'CanceledError') {
          return;
        }

        setError(
          err.response?.data?.message ||
            err.message ||
            'Failed to load wishlist.'
        );
        setMovies([]);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadWishlist();

    return () => {
      controller.abort();
    };
  }, [retryKey]);

  async function handleRemove(movieId) {
    try {
      await removeWishlistItem(movieId);
      setMovies((current) => {
        const next = [];
        for (let i = 0; i < current.length; i++) {
          if (current[i].id !== movieId) {
            next.push(current[i]);
          }
        }
        return next;
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          'Failed to remove movie.'
      );
    }
  }

  return (
    <section className="page">
      <div className="page__header">
        <h1 className="page__title">Wishlist</h1>
        <p className="page__subtitle">
          Movies you saved. They stay here after you close the app.
        </p>
      </div>

      {loading ? <LoadingSpinner message="Loading wishlist..." /> : null}

      {!loading && error ? (
        <ErrorMessage
          message={error}
          onRetry={() => setRetryKey((key) => key + 1)}
        />
      ) : null}

      {!loading && !error && movies.length === 0 ? (
        <EmptyState message="Your wishlist is empty. Add movies from a details page." />
      ) : null}

      {!loading && !error && movies.length > 0 ? (
        <div className="movie-grid">
          {movies.map((movie) => (
            <div key={movie.id} className="wishlist-card">
              <MovieCard movie={movie} />
              <button
                type="button"
                className="btn btn--ghost btn--small wishlist-card__remove"
                onClick={() => handleRemove(movie.id)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}

export default WishlistPage;
