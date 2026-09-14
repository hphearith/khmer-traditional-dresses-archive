const TABS = [
  { id: "all", label: "All garments" },
  { id: "lower", label: "Lower body" },
  { id: "upper", label: "Upper body" },
  { id: "ensemble", label: "Ensembles" },
];

export default function GarmentFilter({ activeTab, onSelectTab }) {
  return (
    <div className="filters" role="group" aria-label="Garment category">
      {TABS.map((tab) => (
        <button
          className="filter"
          key={tab.id}
          type="button"
          aria-pressed={activeTab === tab.id}
          onClick={() => onSelectTab(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
