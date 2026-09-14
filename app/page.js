import collection from "../collection.config.js";
import GarmentsArchive from "../components/GarmentsArchive.js";
import ProcessMap from "../components/ProcessMap.js";

export default function Home() {
  return (
    <>
      <a className="skip" href="#collection">Skip to collection</a>
      <p className="archive-note">Illustrative textile studies are shown while archive photographs are pending.</p>
      <header className="container masthead">
        <a className="brand" href="#top">
          <span className="mark" aria-hidden="true">✳</span>
          <span className="label">Khmer Living Archive</span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#collection">Collection</a>
          <a href="#about">About the archive</a>
        </nav>
      </header>
      <main id="top">
        <section className="container hero" aria-labelledby="archive-name">
          <div className="hero-copy">
            <p className="label">A personal collection · Dress &amp; craft</p>
            <h1 id="archive-name">{collection.name}</h1>
            <p className="lead">{collection.description}</p>
            <a className="button" href="#collection">Browse the collection <span aria-hidden="true">↗</span></a>
            <p className="hero-note">An archive of garments, materials, and the knowledge behind them.</p>
          </div>
          <figure>
            <div className="hero-art">
              <div className="cloth" aria-hidden="true" />
              <div className="cloth second" aria-hidden="true" />
              <span className="art-label"><span className="label">Colour &amp; cloth</span><br />Illustrative textile study</span>
            </div>
            <figcaption>A visual study for the archive, not a documentary photograph.</figcaption>
          </figure>
        </section>

        <GarmentsArchive />

        <section className="source" id="about" aria-labelledby="source-heading">
          <div className="container source-inner">
            <div>
              <p className="label">02 / Behind the archive</p>
              <h2 id="source-heading">Knowledge from<br />a tailor’s practice.</h2>
            </div>
            <div>
              <p className="source-copy">{collection.source}</p>
              <p className="byline">Source recorded by {collection.curator}</p>
            </div>
          </div>
        </section>

        <ProcessMap />
      </main>
      <footer className="container">
        <p>{collection.name}</p>
        <p>Built in ICT 340 — Vibe Coding, American University of Phnom Penh, Fall 2026. This archive is under construction all semester. Come back in December.</p>
      </footer>
    </>
  );
}
