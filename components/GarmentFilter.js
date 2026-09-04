const TABS = [
  { id: "all", label: "All" },
  { id: "lower", label: "Lower Body" },
  { id: "upper", label: "Upper Body" },
  { id: "ensemble", label: "Ensembles" },
];

const styles = {
  container: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
    margin: "24px 0",
  },
  button: {
    padding: "10px 18px",
    borderRadius: 8,
    fontSize: 13,
    fontFamily: "'Courier New', monospace",
    fontWeight: 600,
    cursor: "pointer",
    transition: "background-color 0.15s ease, color 0.15s ease",
  },
  active: {
    backgroundColor: "#2EE6A8",
    color: "#14181F",
    border: "1px solid #2EE6A8",
  },
  inactive: {
    backgroundColor: "#1C222C",
    color: "#97A1B3",
    border: "1px solid #2E3644",
  },
};

/**
 * Renders category filter tabs ('All', 'Lower Body', 'Upper Body', 'Ensembles')
 * and triggers onSelectTab when an active category is chosen.
 */
export default function GarmentFilter({ activeTab, onSelectTab }) {
  return (
    <nav style={styles.container} aria-label="Garment categories">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelectTab(tab.id)}
            style={{
              ...styles.button,
              ...(isActive ? styles.active : styles.inactive),
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
}
