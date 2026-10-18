import { combined } from "../lib/bilingual.js";
import { TEXT } from "../lib/uiText.js";
import Bilingual from "./Bilingual.js";

// The Community tab's search box. A plain labelled search field: the matching
// itself lives in lib/entrySearch.js, and the result count is announced by CommunityTab.
export default function CommunitySearch({ query, onQueryChange, inputRef }) {
  return (
    <div className="search-field">
      <label className="search-label" htmlFor="community-search"><Bilingual text={TEXT.community.searchLabel} inline /></label>
      <div className="search-control">
        <input
          id="community-search"
          ref={inputRef}
          type="search"
          placeholder={combined(TEXT.community.placeholder)}
          value={query}
          aria-describedby="community-search-hint"
          onChange={(event) => onQueryChange(event.target.value)}
        />
        {query && (
          <button className="search-clear" type="button" aria-label={combined(TEXT.catalogue.clearSearch)} onClick={() => { onQueryChange(""); inputRef.current?.focus(); }}>
            ✕
          </button>
        )}
      </div>
      <p className="search-hint" id="community-search-hint"><Bilingual text={TEXT.community.searchHint} /></p>
    </div>
  );
}
