import { Archivo, Marcellus, Noto_Serif_Khmer } from "next/font/google";

// The salon's web fonts, downloaded at build time and served from this site.
// Each sets a CSS variable on the element that carries fontVariables (.shop),
// and app/home.css names the faces from those variables.
// - Archivo, stretched wide: only the sign's English.
// - Marcellus: every other English heading and name.
// - Noto Serif Khmer, Khmer letters only: the sign's Khmer and the Khmer in
//   headings, at 700 and 800, so it looks the same on every phone, including
//   phones that do not have it installed.
export const wide = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--font-wide", display: "swap" });
export const salon = Marcellus({ subsets: ["latin"], weight: "400", variable: "--font-salon", display: "swap" });
export const serifKhmer = Noto_Serif_Khmer({ subsets: ["khmer"], weight: ["700", "800"], variable: "--font-serif-khmer", display: "swap" });

export const fontVariables = `${wide.variable} ${salon.variable} ${serifKhmer.variable}`;
