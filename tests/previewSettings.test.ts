import assert from "node:assert/strict";
import test from "node:test";
import { DEFAULT_PREVIEW, readPreviewOptions, readSavedSamples, saveSample } from "../src/lib/previewSettings.ts";

test("old or damaged preferences fall back safely, and ranges are bounded", () => {
  assert.deepEqual(readPreviewOptions(null), DEFAULT_PREVIEW);
  assert.deepEqual(readPreviewOptions({ tracking: Infinity, lineHeight: -4, textColor: "url(bad)", backgroundColor: "#Ff8800" }), {
    tracking: 0, lineHeight: 1, textColor: null, backgroundColor: "#Ff8800",
  });
  assert.equal(readPreviewOptions({ tracking: 4, lineHeight: 10 }).tracking, 0.3);
  assert.equal(readPreviewOptions({ lineHeight: 10 }).lineHeight, 2.5);
});

test("named samples preserve punctuation, spaces, accents and line breaks through JSON storage", () => {
  const text = "  Café & Bar\n¡Abierto!  €12,50 — 99%  ";
  const saved = saveSample([], "  Signage  ", text, "one");
  assert.deepEqual(readSavedSamples(JSON.parse(JSON.stringify(saved))), [{ id: "one", label: "Signage", text }]);
});

test("updating a named phrase keeps its identity and leaves other phrases intact", () => {
  const initial = saveSample(saveSample([], "Signage", "Original", "one"), "Menus", "Menu", "two");
  const updated = saveSample(initial, "SIGNAGE", "Updated\ntext", "unused");
  assert.deepEqual(updated, [{ id: "one", label: "SIGNAGE", text: "Updated\ntext" }, initial[1]]);
  assert.equal(initial[0].text, "Original");
});

test("empty samples cannot overwrite saved text; limits still allow updating", () => {
  const full = Array.from({ length: 50 }, (_, i) => ({ id: String(i), label: `Phrase ${i}`, text: "Text" }));
  assert.equal(saveSample(full, "New", "text", "new"), full);
  assert.equal(saveSample(full, "Phrase 0", "  \n", "unused"), full);
  assert.equal(saveSample(full, "  ", "text", "unused"), full);
  assert.equal(saveSample(full, "Phrase 0", "Updated", "unused")[0].text, "Updated");
});

test("restoring saved phrases rejects malformed entries and duplicate IDs", () => {
  assert.deepEqual(readSavedSamples([null, { id: 4 }, { id: "a", label: "One", text: "x" },
    { id: "a", label: "Duplicate", text: "y" }, { id: "b", label: "Blank", text: " " }]),
  [{ id: "a", label: "One", text: "x" }]);
});
