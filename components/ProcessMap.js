const PROCESS_STEPS = [
  [
    "Materials & preparation",
    "This space will record the selected fabric and tools, together with the tailor’s explanation of the starting preparations.",
  ],
  [
    "Measurements & planning",
    "This space will preserve notes on how the garment is planned, including any measurements or pattern references used in this particular making process.",
  ],
  [
    "Shaping the garment",
    "This space will document how the material takes shape. The actual technique and sequence will come from the tailor’s account.",
  ],
  [
    "Assembly & detailing",
    "This space will pair close-up documentation with notes on how the piece is brought together and which details are added, where applicable.",
  ],
  [
    "Finishing & final piece",
    "This space will show the finished garment alongside the tailor’s notes on final adjustments and a reference to its archive entry.",
  ],
];

export default function ProcessMap() {
  return (
    <section className="container process" id="making-process" aria-labelledby="process-heading">
      <div className="process-intro">
        <p className="label">03 / The making process</p>
        <h2 id="process-heading">Follow the making, step by step.</h2>
        <p>A place to archive the work behind a garment, from the first preparations to the finished piece.</p>
        <p>Five proposed stages are shown below. Their names and order await the tailor’s documentation; photographs and process notes have not yet been recorded.</p>
      </div>
      <ol className="process-map" aria-label="Five proposed stages of making a garment">
        {PROCESS_STEPS.map(([title, description], index) => (
          <li className="process-step" key={title}>
            <div className="process-media">
              <span className="label">Step {index + 1}</span>
              <span className="step-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <span className="label">Photo or video pending</span>
            </div>
            <div className="process-copy">
              <p className="label subtle">Proposed stage · Not yet documented</p>
              <h3>{title}</h3>
              <p>{description}</p>
            </div>
            {index < PROCESS_STEPS.length - 1 && (
              <svg className="process-connector" viewBox="0 0 100 80" preserveAspectRatio="none" aria-hidden="true" focusable="false">
                <path d="M0 0 V40 H100 V80" />
              </svg>
            )}
          </li>
        ))}
      </ol>
      <a className="text-link" href="#collection">Return to the catalogue ↑</a>
    </section>
  );
}
