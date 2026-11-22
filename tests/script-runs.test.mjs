import assert from "node:assert/strict";
import test from "node:test";
import { scriptRuns } from "../lib/scriptRuns.js";

test("a Khmer gloss in an English material becomes its own Khmer run", () => {
  assert.deepEqual(scriptRuns("Chong Kiet Tie-Dyed Silk (សូត្រចងគាត)"), [
    { text: "Chong Kiet Tie-Dyed Silk (", lang: "en" },
    { text: "សូត្រចងគាត", lang: "km" },
    { text: ")", lang: "en" },
  ]);
});

test("text in one script is one run", () => {
  assert.deepEqual(scriptRuns("Lightweight Silk Crepe or Fine Cotton"), [
    { text: "Lightweight Silk Crepe or Fine Cotton", lang: "en" },
  ]);
  assert.deepEqual(scriptRuns("ស្បៃជីបប៉ាក់ឌិនខ្សែសយ"), [{ text: "ស្បៃជីបប៉ាក់ឌិនខ្សែសយ", lang: "km" }]);
});

test("joining the runs gives back the text exactly, Khmer included", () => {
  for (const text of ["Pleated Silk with Gold Thread & Sequins (ស្បៃជីបប៉ាក់ឌិនខ្សែសយ)", "សំពត់ ហូល and Av Pak", "", "  "]) {
    assert.equal(scriptRuns(text).map((run) => run.text).join(""), text);
  }
});

test("empty text has no runs", () => {
  assert.deepEqual(scriptRuns(""), []);
});
