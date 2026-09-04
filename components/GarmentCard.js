"use client";

import { useState } from "react";

const LABELS = { lower: "Lower Body", upper: "Upper Body", ensemble: "Ensemble" };

const styles = {
  card: {
    backgroundColor: "#1C222C",
    border: "1px solid #2E3644",
    borderRadius: 10,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },
  imgWrap: {
    width: "100%",
    aspectRatio: "16 / 10",
    backgroundColor: "#161B23",
    overflow: "hidden",
    borderBottom: "1px solid #2E3644",
  },
  img: { width: "100%", height: "100%", objectFit: "cover", display: "block" },
  body: { padding: 20, display: "flex", flexDirection: "column", flexGrow: 1 },
  pill: {
    alignSelf: "flex-start",
    fontSize: 11,
    fontFamily: "'Courier New', monospace",
    color: "#2EE6A8",
    backgroundColor: "rgba(46, 230, 168, 0.1)",
    border: "1px solid rgba(46, 230, 168, 0.25)",
    borderRadius: 999,
    padding: "3px 10px",
    letterSpacing: 0.5,
  },
  titleEn: { fontSize: 18, fontWeight: 700, color: "#E8EDF2", margin: "12px 0 2px" },
  titleKh: { fontSize: 15, color: "#2EE6A8", margin: "0 0 12px", fontWeight: 500 },
  material: { fontSize: 12, fontFamily: "'Courier New', monospace", color: "#97A1B3", margin: "0 0 8px", lineHeight: 1.4 },
  desc: { fontSize: 14, color: "#97A1B3", lineHeight: 1.5, margin: 0 },
};

/**
 * Renders an individual garment entry card with aspect-ratio image handling,
 * fallback error recovery, dual-language typography, material specs, and description.
 */
export default function GarmentCard({ garment }) {
  const [imgSrc, setImgSrc] = useState(
    garment.imageUrl || "/images/garments/placeholder.svg"
  );

  return (
    <article style={styles.card}>
      <div style={styles.imgWrap}>
        <img
          src={imgSrc}
          alt={`${garment.nameEn} (${garment.nameKh})`}
          style={styles.img}
          onError={() => setImgSrc("/images/garments/placeholder.svg")}
        />
      </div>
      <div style={styles.body}>
        <span style={styles.pill}>{LABELS[garment.category] || garment.category}</span>
        <h3 style={styles.titleEn}>{garment.nameEn}</h3>
        <p style={styles.titleKh}>{garment.nameKh}</p>
        <p style={styles.material}>
          <span style={{ color: "#E8EDF2" }}>Material:</span> {garment.material}
        </p>
        <p style={styles.desc}>{garment.description}</p>
      </div>
    </article>
  );
}
