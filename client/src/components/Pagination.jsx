function Pagination({ page, totalPages, onPageChange }) {
  if (!totalPages || totalPages <= 1) {
    return null;
  }

  const canGoPrev = page > 1;
  const canGoNext = page < totalPages;

  return (
    <nav className="pagination" aria-label="Pagination">
      <button
        type="button"
        className="btn btn--ghost"
        disabled={!canGoPrev}
        onClick={() => onPageChange(page - 1)}
      >
        Previous
      </button>

      <p className="pagination__info">
        Page {page} of {totalPages}
      </p>

      <button
        type="button"
        className="btn btn--ghost"
        disabled={!canGoNext}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </button>
    </nav>
  );
}

export default Pagination;
