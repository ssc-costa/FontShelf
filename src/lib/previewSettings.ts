export interface PreviewOptions {
  tracking: number;
  lineHeight: number;
  textColor: string | null;
  backgroundColor: string | null;
}

export interface SavedSample {
  id: string;
  label: string;
  text: string;
}

export const DEFAULT_PREVIEW: PreviewOptions = {
  tracking: 0,
  lineHeight: 1.35,
  textColor: null,
  backgroundColor: null,
};

function bounded(value: unknown, fallback: number, min: number, max: number): number {
  return typeof value === "number" && Number.isFinite(value)
    ? Math.min(max, Math.max(min, value))
    : fallback;
}

function color(value: unknown): string | null {
  return typeof value === "string" && /^#[a-f\d]{6}$/i.test(value) ? value : null;
}

export function readPreviewOptions(value: unknown): PreviewOptions {
  const obj = value && typeof value === "object" ? value as Partial<PreviewOptions> : {};
  return {
    tracking: bounded(obj.tracking, 0, -0.08, 0.3),
    lineHeight: bounded(obj.lineHeight, 1.35, 1, 2.5),
    textColor: color(obj.textColor),
    backgroundColor: color(obj.backgroundColor),
  };
}

export function readSavedSamples(value: unknown): SavedSample[] {
  if (!Array.isArray(value)) return [];
  const ids = new Set<string>();
  return value.filter((item): item is SavedSample => {
    if (!item || typeof item !== "object" || typeof item.id !== "string" || !item.id ||
      typeof item.label !== "string" || !item.label.trim() || item.label.length > 80 ||
      typeof item.text !== "string" || !item.text.trim() || ids.has(item.id)) return false;
    ids.add(item.id);
    return true;
  }).slice(0, 50).map(({ id, label, text }) => ({ id, label, text }));
}

/** A repeated name updates its existing phrase without changing its position. */
export function saveSample(samples: SavedSample[], label: string, text: string, id: string): SavedSample[] {
  const name = label.trim().slice(0, 80);
  if (!name || !text.trim()) return samples;
  const match = samples.find((s) => s.label.toLocaleLowerCase() === name.toLocaleLowerCase());
  if (match) return samples.map((s) => s.id === match.id ? { ...s, label: name, text } : s);
  if (samples.length >= 50) return samples;
  return [...samples, { id, label: name, text }];
}
