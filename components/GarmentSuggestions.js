import { pick } from "../lib/bilingual.js";
import { useLanguage } from "../lib/useLanguage.js";
import { TEXT } from "../lib/uiText.js";

export default function GarmentSuggestions({ suggestions, cursor, onHover, onSelect }) {
  const language = useLanguage();
  return (
    <ul className="suggestions" id="garment-search-suggestions" role="listbox" aria-label={pick(TEXT.catalogue.suggestions, language)}>
      {suggestions.map((garment, index) => (
        <li
          className="suggestion"
          id={`garment-suggestion-${garment.id}`}
          key={garment.id}
          role="option"
          aria-selected={index === cursor}
          onMouseEnter={() => onHover(index)}
          onMouseDown={(event) => { event.preventDefault(); onSelect(garment.nameEn); }}
        >
          <span lang="en">{garment.nameEn}</span>
          <span className="suggestion-khmer" lang="km">{garment.nameKh}</span>
        </li>
      ))}
    </ul>
  );
}
