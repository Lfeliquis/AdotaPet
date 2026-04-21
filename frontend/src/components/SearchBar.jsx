function SearchBar({ search, setSearch, sizeFilter, setSizeFilter }) {
  return (
    <div className="searchbar">
      <input
        type="text"
        placeholder="Buscar por nome ou descrição..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="searchbar-input"
      />

      <select
        value={sizeFilter}
        onChange={(e) => setSizeFilter(e.target.value)}
        className="searchbar-select"
      >
        <option value="">Todos os portes</option>
        <option value="Pequeno">Pequeno</option>
        <option value="Médio">Médio</option>
        <option value="Grande">Grande</option>
      </select>
    </div>
  );
}

export default SearchBar;
