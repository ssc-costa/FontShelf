# FontShelf

A desktop font manager for your own fonts, based on **ZFontManager by TheHolyOneZ**.
Type your own text once, browse it across your library, and keep the right fonts together for each project.

## First version — 0.1.0

- A permanent multiline sample-text workbench. Line breaks, punctuation, accents and spaces are preserved.
- Save up to 50 named phrases; select, update or delete them. Text and preview options are restored on restart.
- Shared letter spacing, line height, text colour and background colour, with a reset to theme defaults.
- Edit the same sample text inside the side-by-side comparison window.
- Installed fonts and watched folders, family/style grouping, search, favourites, tags, project collections and glyph inspection from ZFontManager.
- Independent FontShelf settings, font library and fontconfig fragment, so upstream and this fork can coexist.

The compact metadata list shows font names and file details. Use the preview grid, cover cards, detail inspector, waterfall or comparison for live sample text.

## Windows download

Open [Actions](https://github.com/ssc-costa/FontShelf/actions), select a successful **Build FontShelf for Windows** run, and download its **FontShelf-0.1.0-Windows-x64** artifact (GitHub sign-in required).
Extract it and run the setup EXE or MSI. Alternatively, extract the nested portable ZIP and run FontShelf.exe. Portable mode stores data beside the app; Windows WebView2 Runtime is required.

Build artifacts appear only after the Windows workflow passes. No signed release is claimed by this repository. Windows installation and font activation should be checked on a real Windows machine before relying on them for production work.

## Develop

Requires Node.js 24+, pnpm 10.33.0, stable Rust and the [Tauri prerequisites](https://tauri.app/start/prerequisites/) for your OS.

```sh
pnpm install --frozen-lockfile
pnpm tauri dev
```

```sh
pnpm test
pnpm i18n:check
pnpm build
pnpm exec playwright install chromium
pnpm test:ui
pnpm tauri build
```

The interface test harness uses mocked desktop IPC and two bundled open fonts; it verifies preview text, saved phrases, settings restoration, styling, comparison editing and a small desktop viewport. It does not replace testing native activation on Windows.

Windows installers are built and uploaded automatically on pushes to main. The upstream cross-platform implementation is retained, but this fork initially targets Windows. macOS and Linux packaging are not yet verified for FontShelf.

## Credits and licence

Derived from [ZFontManager](https://github.com/TheHolyOneZ/ZFontManager), copyright © 2026 TheHolyOneZ. Modified by ssc-costa and contributors. **GPL-3.0-only**; see [LICENSE](LICENSE) and [NOTICE.md](NOTICE.md). The original documentation is preserved in [README.upstream.md](README.upstream.md).
