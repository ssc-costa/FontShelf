import { BookmarkPlus, RotateCcw, Trash2 } from "lucide-react";
import { useState } from "react";
import { DEFAULT_PREVIEW } from "../lib/previewSettings";
import { useT } from "../lib/i18n";
import { useFontStore } from "../state/fontStore";

export function SampleWorkbench({ compact = false }: { compact?: boolean }) {
  const t = useT();
  const text = useFontStore((s) => s.sampleText);
  const setText = useFontStore((s) => s.setSampleText);
  const samples = useFontStore((s) => s.savedSamples);
  const saveSample = useFontStore((s) => s.saveSample);
  const deleteSample = useFontStore((s) => s.deleteSample);
  const options = useFontStore((s) => s.previewOptions);
  const setOptions = useFontStore((s) => s.setPreviewOptions);
  const uppercase = useFontStore((s) => s.previewUppercase);
  const setUppercase = useFontStore((s) => s.setPreviewUppercase);
  const [selected, setSelected] = useState("");
  const [label, setLabel] = useState("");
  const selectedSample = samples.find((s) => s.id === selected);
  const duplicateName = samples.some((s) => s.label.toLocaleLowerCase() === label.trim().toLocaleLowerCase());
  const canSave = Boolean(label.trim() && text.trim() && (samples.length < 50 || duplicateName));

  return (
    <section className={`sample-workbench ${compact ? "sample-compact" : ""}`} aria-label={t("sample.workbench")}>
      <div className="sample-heading">
        <label className="sample-title" htmlFor={compact ? "compare-sample" : "library-sample"}>{t("sample.title")}</label>
        <span>{t("sample.hint")}</span>
        <button className={`case-toggle ${uppercase ? "case-toggle-on" : ""}`} aria-label={t("top.uppercase")}
          aria-pressed={uppercase} onClick={() => setUppercase(!uppercase)}>AA</button>
      </div>
      <textarea id={compact ? "compare-sample" : "library-sample"} rows={2} value={text}
        onChange={(e) => setText(e.target.value)} spellCheck={false} placeholder={t("top.samplePlaceholder")} />
      <div className="sample-tools">
        <select aria-label={t("sample.saved")} value={selectedSample?.id ?? ""} onChange={(e) => {
          const sample = samples.find((s) => s.id === e.target.value);
          setSelected(sample?.id ?? "");
          setLabel(sample?.label ?? "");
          if (sample) setText(sample.text);
        }}>
          <option value="">{t("sample.saved")}</option>
          {samples.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
        <input className="sample-name" aria-label={t("sample.name")} placeholder={t("sample.name")}
          value={label} maxLength={80} onChange={(e) => setLabel(e.target.value)} />
        <button className="sample-action" disabled={!canSave} onClick={() => {
          const id = saveSample(label);
          if (id) setSelected(id);
        }}><BookmarkPlus size={14} />{t(duplicateName ? "sample.update" : "sample.save")}</button>
        <button className="sample-icon" aria-label={t("sample.delete")} title={t("sample.delete")} disabled={!selectedSample}
          onClick={() => { if (selectedSample) deleteSample(selectedSample.id); setSelected(""); setLabel(""); }}><Trash2 size={14} /></button>
        <label className="sample-slider">{t("sample.spacing")}
          <input type="range" aria-label={t("sample.spacing")} min={-0.08} max={0.3} step={0.01}
            value={options.tracking} onChange={(e) => setOptions({ tracking: Number(e.target.value) })} />
          <output>{options.tracking.toFixed(2)}</output>
        </label>
        <label className="sample-slider">{t("sample.lineHeight")}
          <input type="range" aria-label={t("sample.lineHeight")} min={1} max={2.5} step={0.05}
            value={options.lineHeight} onChange={(e) => setOptions({ lineHeight: Number(e.target.value) })} />
          <output>{options.lineHeight.toFixed(2)}</output>
        </label>
        <label className="sample-color" title={t("sample.ink")}>{t("sample.ink")}
          <input type="color" aria-label={t("sample.ink")} value={options.textColor ?? "#e9edf5"}
            onChange={(e) => setOptions({ textColor: e.target.value })} />
        </label>
        <label className="sample-color" title={t("sample.paper")}>{t("sample.paper")}
          <input type="color" aria-label={t("sample.paper")} value={options.backgroundColor ?? "#171b26"}
            onChange={(e) => setOptions({ backgroundColor: e.target.value })} />
        </label>
        <button className="sample-icon" aria-label={t("sample.reset")} title={t("sample.reset")}
          onClick={() => setOptions(DEFAULT_PREVIEW)}><RotateCcw size={14} /></button>
      </div>
    </section>
  );
}
