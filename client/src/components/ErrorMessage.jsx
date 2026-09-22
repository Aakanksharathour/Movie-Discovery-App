function ErrorMessage({ message, onRetry }) {
  return (
    <div className="state-box state-box--error" role="alert">
      <p>{message || 'Something went wrong.'}</p>
      {onRetry ? (
        <button type="button" className="btn" onClick={onRetry}>
          Try again
        </button>
      ) : null}
    </div>
  );
}

export default ErrorMessage;
