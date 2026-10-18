// The Community tab's search box. A plain labelled search field: the matching
// itself lives in lib/entrySearch.js, and the result count is announced by CommunityTab.
export default function CommunitySearch({ query, onQueryChange, inputRef }) {
  return (
    <div className="search-field">
      <label className="search-label" htmlFor="community-search">Search the entries</label>
      <div className="search-control">
        <input
          id="community-search"
          ref={inputRef}
          type="search"
          placeholder="Try a title, a place, or a Khmer word…"
          value={query}
          aria-describedby="community-search-hint"
          onChange={(event) => onQueryChange(event.target.value)}
        />
        {query && (
          <button className="search-clear" type="button" aria-label="Clear search" onClick={() => { onQueryChange(""); inputRef.current?.focus(); }}>
            ✕
          </button>
        )}
      </div>
      <p className="search-hint" id="community-search-hint">Search titles, stories, credits, makers, places, and materials in English or Khmer. Use quotes for an exact phrase.</p>
    </div>
  );
}
