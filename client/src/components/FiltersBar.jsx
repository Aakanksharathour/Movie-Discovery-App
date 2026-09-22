function FiltersBar({
  genres = [],
  genre,
  year,
  minRating,
  sortBy,
  onChange,
}) {
  function updateField(field, value) {
    onChange({ [field]: value });
  }

  return (
    <form
      className="filters-bar"
      onSubmit={(event) => event.preventDefault()}
    >
      <div className="filters-bar__field">
        <label htmlFor="filter-genre">Genre</label>
        <select
          id="filter-genre"
          value={genre}
          onChange={(event) => updateField('genre', event.target.value)}
        >
          <option value="">All genres</option>
          {genres.map((item) => (
            <option key={item.id} value={String(item.id)}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      <div className="filters-bar__field">
        <label htmlFor="filter-year">Year</label>
        <input
          id="filter-year"
          type="number"
          min="1900"
          max="2030"
          placeholder="e.g. 2023"
          value={year}
          onChange={(event) => updateField('year', event.target.value)}
        />
      </div>

      <div className="filters-bar__field">
        <label htmlFor="filter-rating">Min rating</label>
        <select
          id="filter-rating"
          value={minRating}
          onChange={(event) => updateField('minRating', event.target.value)}
        >
          <option value="">Any</option>
          <option value="5">5+</option>
          <option value="6">6+</option>
          <option value="7">7+</option>
          <option value="8">8+</option>
          <option value="9">9+</option>
        </select>
      </div>

      <div className="filters-bar__field">
        <label htmlFor="filter-sort">Sort by</label>
        <select
          id="filter-sort"
          value={sortBy}
          onChange={(event) => updateField('sortBy', event.target.value)}
        >
          <option value="popularity">Popularity</option>
          <option value="rating">Rating</option>
          <option value="release_date">Release date</option>
        </select>
      </div>
    </form>
  );
}

export default FiltersBar;
