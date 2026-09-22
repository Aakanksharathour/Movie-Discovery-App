function LoadingSpinner({ message = 'Loading movies...' }) {
  return (
    <div className="state-box" role="status" aria-live="polite">
      <div className="spinner" aria-hidden="true" />
      <p>{message}</p>
    </div>
  );
}

export default LoadingSpinner;
