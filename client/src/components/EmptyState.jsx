function EmptyState({ message = 'No movies found.' }) {
  return (
    <div className="state-box">
      <p>{message}</p>
    </div>
  );
}

export default EmptyState;
