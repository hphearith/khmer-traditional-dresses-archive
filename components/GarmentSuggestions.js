export default function GarmentSuggestions({ suggestions, cursor, onHover, onSelect }) {
  return (
    <ul className="suggestions" id="garment-search-suggestions" role="listbox" aria-label="Search suggestions">
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
          <span>{garment.nameEn}</span>
          <span className="suggestion-khmer" lang="km">{garment.nameKh}</span>
        </li>
      ))}
    </ul>
  );
}
