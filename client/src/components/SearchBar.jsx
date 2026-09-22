function SearchBar({ value, onChange, placeholder = 'Search movies...' }) {
  return (
    <div className="search-bar">
      <label className="search-bar__label" htmlFor="movie-search">
        Search
      </label>
      <input
        id="movie-search"
        className="search-bar__input"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete="off"
      />
    </div>
  );
}

export default SearchBar;
