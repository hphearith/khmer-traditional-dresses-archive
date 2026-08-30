// Five entries connected top-to-bottom by a vertical line.
// Entries 02-05 are placeholders to be replaced with real archive entries.
const entries = [
  { id: "entry-01", number: "ENTRY 01", title: "Khmer Traditional Dresses Archive", description: "The process of making Khmer traditional dresses in Cambodia — Archived.", contributor: "Heng Phearith", place: "Phnom Penh" },
  { id: "entry-02", number: "ENTRY 02", title: "Placeholder entry", description: "This entry will be documented later this semester.", contributor: "Heng Phearith", place: "Phnom Penh" },
  { id: "entry-03", number: "ENTRY 03", title: "Placeholder entry", description: "This entry will be documented later this semester.", contributor: "Heng Phearith", place: "Phnom Penh" },
  { id: "entry-04", number: "ENTRY 04", title: "Placeholder entry", description: "This entry will be documented later this semester.", contributor: "Heng Phearith", place: "Phnom Penh" },
  { id: "entry-05", number: "ENTRY 05", title: "Placeholder entry", description: "This entry will be documented later this semester.", contributor: "Heng Phearith", place: "Phnom Penh" },
];

const styles = {
  list: { marginTop: 48 },
  row: { display: "flex", gap: 16 },
  rail: { display: "flex", flexDirection: "column", alignItems: "center", width: 12 },
  dot: { width: 10, height: 10, borderRadius: "50%", backgroundColor: "#2EE6A8", marginTop: 26, flexShrink: 0 },
  line: { width: 1, flexGrow: 1, backgroundColor: "#2E3644" },
  card: { flex: 1, marginBottom: 20, padding: 20, backgroundColor: "#1C222C", border: "1px solid #2E3644", borderRadius: 10 },
  label: { fontFamily: "'Courier New', monospace", fontSize: 11, color: "#97A1B3", letterSpacing: 1, margin: 0 },
  title: { fontSize: 18, fontWeight: 600, margin: "6px 0 8px" },
  meta: { fontSize: 13, color: "#97A1B3", lineHeight: 1.6, margin: 0 },
};

export default function EntryCard() {
  return (
    <section style={styles.list}>
      {entries.map((entry, i) => (
        <div key={entry.id} style={styles.row}>
          <div style={styles.rail}>
            <div style={styles.dot} />
            {i < entries.length - 1 && <div style={styles.line} />}
          </div>
          <article style={styles.card}>
            <p style={styles.label}>{entry.number}</p>
            <h3 style={styles.title}>{entry.title}</h3>
            <p style={styles.meta}>
              {entry.description}
              <br />
              Contributed by {entry.contributor} — {entry.place}
            </p>
          </article>
        </div>
      ))}
    </section>
  );
}