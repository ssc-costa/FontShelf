// Test-only desktop bridge. Never imported by the production entry point.
import { mockIPC, mockWindows, mockConvertFileSrc } from "@tauri-apps/api/mocks";
const paths = [
  "/node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2",
  "/node_modules/@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2",
];
const fonts = ["Inter", "JetBrains Mono"].map((family, i) => ({
  id: family, family, style: "Regular", path: paths[i], previewPath: null, faceIndex: 0,
  postscriptName: family, foundry: "Test fixture", license: "SIL OFL", licenseUrl: null,
  format: "woff2", isVariable: true, axes: [], weight: 400, italic: false,
  monospaced: i === 1, classification: i === 1 ? "mono" : "sans", scripts: ["latin"],
  features: [], glyphCount: 700, fileSize: 48000, source: "user", installable: false,
  deactivatable: false, active: true,
}));
const defaults = { onboarded: true, motionPref: "reduced", localePref: "en", sampleText: "Your next great idea\nstarts with the right font.", sizeIndex: 4 };
mockWindows("main");
mockConvertFileSrc("windows");
mockIPC(async (cmd, args) => {
  if (cmd === "get_prefs") return JSON.parse(localStorage.getItem("ui-test-prefs") ?? JSON.stringify(defaults));
  if (cmd === "set_prefs") { localStorage.setItem("ui-test-prefs", JSON.stringify(args?.prefs)); return; }
  if (cmd === "scan_fonts") return fonts;
  if (["get_tags", "get_notes", "get_covers"].includes(cmd)) return {};
  if (cmd === "get_collections") return { "Signage": [], "Menus": [] };
  if (["get_favorites", "list_trash", "get_features"].includes(cmd)) return [];
  if (cmd === "get_preview_font") return fetch(String(args?.path)).then((r) => r.arrayBuffer());
  if (cmd === "get_settings") return {extraDirs: [], watchEnabled: true, autoActivateImports: false, libraryDir: null, libraryDirEnabled: false, affinityEnabled: false, affinityDeactivateOnQuit: true, onlineFontsEnabled: false};
  if (cmd === "set_ui_scale") return 1;
  if (cmd === "adobe_available") return false;
  return null;
}, {shouldMockEvents: true});
await import("../../src/main");
