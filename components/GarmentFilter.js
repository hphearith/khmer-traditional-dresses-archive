import { combined } from "../lib/bilingual.js";
import { TEXT } from "../lib/uiText.js";
import Bilingual from "./Bilingual.js";

const TABS = [
  { id: "all", label: TEXT.catalogue.all },
  { id: "lower", label: TEXT.catalogue.lower },
  { id: "upper", label: TEXT.catalogue.upper },
  { id: "ensemble", label: TEXT.catalogue.ensemble },
];

export default function GarmentFilter({ activeTab, onSelectTab }) {
  return (
    <div className="filters" role="group" aria-label={combined(TEXT.catalogue.filterLabel)}>
      {TABS.map((tab) => (
        <button
          className="filter"
          key={tab.id}
          type="button"
          aria-pressed={activeTab === tab.id}
          onClick={() => onSelectTab(tab.id)}
        >
          <Bilingual text={tab.label} inline />
        </button>
      ))}
    </div>
  );
}
