import { pick } from "../lib/bilingual.js";
import { garmentNames } from "../lib/garmentNames.js";
import { useLanguage } from "../lib/useLanguage.js";
import { TEXT } from "../lib/uiText.js";

export default function GarmentSuggestions({ suggestions, cursor, onHover, onSelect }) {
  const language = useLanguage();
  return (
    <ul className="suggestions" id="garment-search-suggestions" role="listbox" aria-label={pick(TEXT.catalogue.suggestions, language)}>
      {suggestions.map((garment, index) => {
        const [lead, other] = garmentNames(garment, language);
        return (
          <li
            className="suggestion"
            id={`garment-suggestion-${garment.id}`}
            key={garment.id}
            role="option"
            aria-selected={index === cursor}
            onMouseEnter={() => onHover(index)}
            onMouseDown={(event) => { event.preventDefault(); onSelect(garment); }}
          >
            <span lang={lead.lang}>{lead.text}</span>
            <span className="suggestion-other" lang={other.lang}>{other.text}</span>
          </li>
        );
      })}
    </ul>
  );
}
