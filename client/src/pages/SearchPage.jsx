import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchSearchMovies } from '../api/moviesApi';
import useDebounce from '../hooks/useDebounce';
import SearchBar from '../components/SearchBar';
import MovieGrid from '../components/MovieGrid';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import Pagination from '../components/Pagination';

function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const queryFromUrl = searchParams.get('q') || '';
  const page = Number(searchParams.get('page')) || 1;

  // Local input updates immediately; API uses the debounced value
  const [inputValue, setInputValue] = useState(queryFromUrl);
  const debouncedQuery = useDebounce(inputValue, 400);

  const [movies, setMovies] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [retryKey, setRetryKey] = useState(0);

  // When debounced text changes, update the URL (and reset page)
  useEffect(() => {
    const trimmed = debouncedQuery.trim();

    setSearchParams(
      (prev) => {
        const currentQ = prev.get('q') || '';
        if (trimmed === currentQ) {
          return prev;
        }

        const next = new URLSearchParams();
        if (trimmed) {
          next.set('q', trimmed);
        }
        return next;
      },
      { replace: true }
    );
  }, [debouncedQuery, setSearchParams]);

  // Fetch when URL query/page change (or retry)
  useEffect(() => {
    const q = (searchParams.get('q') || '').trim();
    const currentPage = Number(searchParams.get('page')) || 1;

    if (!q) {
      setMovies([]);
      setTotalPages(0);
      setError('');
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    async function loadSearchResults() {
      setLoading(true);
      setError('');

      try {
        const data = await fetchSearchMovies(
          { q, page: currentPage },
          { signal: controller.signal }
        );
        setMovies(data.results || []);
        setTotalPages(data.totalPages || 0);
      } catch (err) {
        if (err.code === 'ERR_CANCELED' || err.name === 'CanceledError') {
          return;
        }

        const message =
          err.response?.data?.message ||
          err.message ||
          'Failed to search movies.';
        setError(message);
        setMovies([]);
        setTotalPages(0);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadSearchResults();

    return () => {
      controller.abort();
    };
  }, [searchParams, retryKey]);

  function handlePageChange(nextPage) {
    const next = new URLSearchParams(searchParams);
    if (nextPage <= 1) {
      next.delete('page');
    } else {
      next.set('page', String(nextPage));
    }
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const activeQuery = queryFromUrl.trim();

  return (
    <section className="page">
      <div className="page__header">
        <h1 className="page__title">Search</h1>
        <p className="page__subtitle">
          Type a title. Results update after you pause typing.
        </p>
      </div>

      <SearchBar value={inputValue} onChange={setInputValue} />

      {!activeQuery && !loading ? (
        <EmptyState message="Start typing to search for movies." />
      ) : null}

      {activeQuery && loading ? <LoadingSpinner message="Searching..." /> : null}

      {activeQuery && !loading && error ? (
        <ErrorMessage message={error} onRetry={() => setRetryKey((k) => k + 1)} />
      ) : null}

      {activeQuery && !loading && !error && movies.length === 0 ? (
        <EmptyState message={`No results for “${activeQuery}”.`} />
      ) : null}

      {activeQuery && !loading && !error && movies.length > 0 ? (
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

export default SearchPage;
