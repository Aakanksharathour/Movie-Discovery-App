import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchDiscoverMovies, fetchGenres } from '../api/moviesApi';
import MovieGrid from '../components/MovieGrid';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import FiltersBar from '../components/FiltersBar';
import Pagination from '../components/Pagination';

function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read filters from the URL so refresh / back button keep context
  const page = Number(searchParams.get('page')) || 1;
  const genre = searchParams.get('genre') || '';
  const year = searchParams.get('year') || '';
  const minRating = searchParams.get('minRating') || '';
  const sortBy = searchParams.get('sortBy') || 'popularity';

  const [genres, setGenres] = useState([]);
  const [movies, setMovies] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retryKey, setRetryKey] = useState(0);

  // Load genre list once for the filter dropdown
  useEffect(() => {
    let cancelled = false;

    async function loadGenres() {
      try {
        const data = await fetchGenres();
        if (!cancelled) {
          setGenres(data.genres || []);
        }
      } catch {
        // Genres failing should not block the whole page
        if (!cancelled) {
          setGenres([]);
        }
      }
    }

    loadGenres();
    return () => {
      cancelled = true;
    };
  }, []);

  // Reload movies whenever URL filters/page change
  useEffect(() => {
    const controller = new AbortController();

    async function loadMovies() {
      setLoading(true);
      setError('');

      try {
        const params = {
          page,
          sortBy,
        };

        if (genre) params.genre = genre;
        if (year) params.year = year;
        if (minRating) params.minRating = minRating;

        const data = await fetchDiscoverMovies(params, {
          signal: controller.signal,
        });

        setMovies(data.results || []);
        setTotalPages(data.totalPages || 0);
      } catch (err) {
        // Ignore cancelled requests (user changed filters quickly)
        if (err.code === 'ERR_CANCELED' || err.name === 'CanceledError') {
          return;
        }

        const message =
          err.response?.data?.message ||
          err.message ||
          'Failed to load movies.';
        setError(message);
        setMovies([]);
        setTotalPages(0);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadMovies();

    return () => {
      controller.abort();
    };
  }, [page, genre, year, minRating, sortBy, retryKey]);

  function updateFilters(partial) {
    const next = new URLSearchParams(searchParams);

    for (const key of Object.keys(partial)) {
      const value = partial[key];
      if (value === '' || value === null || value === undefined) {
        next.delete(key);
      } else {
        next.set(key, String(value));
      }
    }

    // Changing filters should go back to page 1
    if (!Object.prototype.hasOwnProperty.call(partial, 'page')) {
      next.delete('page');
    }

    setSearchParams(next);
  }

  function handlePageChange(nextPage) {
    updateFilters({ page: nextPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <section className="page">
      <div className="page__header">
        <h1 className="page__title">Discover</h1>
        <p className="page__subtitle">
          Browse movies by genre, year, rating, and sort order.
        </p>
      </div>

      <FiltersBar
        genres={genres}
        genre={genre}
        year={year}
        minRating={minRating}
        sortBy={sortBy}
        onChange={updateFilters}
      />

      {loading ? <LoadingSpinner /> : null}

      {!loading && error ? (
        <ErrorMessage
          message={error}
          onRetry={() => setRetryKey((key) => key + 1)}
        />
      ) : null}

      {!loading && !error && movies.length === 0 ? (
        <EmptyState message="No movies match these filters." />
      ) : null}

      {!loading && !error && movies.length > 0 ? (
        <>
          <MovieGrid movies={movies} />
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      ) : null}
    </section>
  );
}

export default HomePage;
