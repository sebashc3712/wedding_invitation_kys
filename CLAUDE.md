# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

Static wedding invitation website for Katia & Sebastián (Dec 19, 2026, Cali, Colombia). Each guest gets a unique URL with personalized content. Bilingual (ES/EN). Zero npm dependencies — build uses only Node.js built-ins.

## Commands

```bash
npm run build      # node build.js — generates dist/ from template + guests.json
npm run serve      # npx serve dist — local preview
npm run clean      # rm -rf dist
npm run deploy     # npx gh-pages -d dist
```

Requires Node.js 20+ (`source ~/.nvm/nvm.sh && nvm use 20` — system node is v14).

After ANY change to template, CSS, JS, or guests.json, you must run `npm run build` to regenerate dist/.

## Architecture

**Build pipeline** (`build.js`):
1. Reads `src/template.html` and `guests.json`
2. For each guest: replaces `{{PLACEHOLDER}}` markers (guest data + i18n strings) → writes to `dist/invite/{token}/index.html`
3. Copies `src/css/`, `src/js/`, `src/assets/` into `dist/`
4. Generates `dist/index.html` and `dist/404.html` (landing page, built inline — not from template)

**Key files to edit:**
- `src/template.html` — single HTML template for all guest pages. Uses `{{DISPLAY_NAME}}`, `{{GUEST_NAMES}}`, `{{LANG}}`, `{{TOKEN}}`, `{{GOOGLE_FORM_URL}}`, and `{{i18n.*}}` placeholders
- `src/css/styles.css` — all styles. CSS custom properties for colors in `:root`. Uses `@font-face` for Abigail font (heading) + Google Fonts Lora (body)
- `src/js/main.js` — countdown timer targeting `2026-12-19T17:00:00-05:00`, IntersectionObserver scroll animations
- `build.js` — i18n dictionaries (ES/EN, ~35 strings each), Google Form config, landing page HTML template (inline), build logic
- `guests.json` — guest list array with `token`, `names[]`, `displayName`, `lang`, `plusOne`. Note: `plusOne` is defined but not yet used in the build pipeline


**i18n** is handled entirely in `build.js` as two dictionaries (`i18n.es`, `i18n.en`). To add a new translatable string: add it to both dictionaries, then use `{{i18n.NEW_KEY}}` in template.html.

**Google Form** is embedded via iframe with pre-filled guest name (using `names.join(', ')`). Config constants at top of `build.js`: `GOOGLE_FORM_BASE`, `FORM_FIELD_NAME`.

**Landing page** (`dist/index.html` and `dist/404.html`) is hardcoded to Spanish and generated inline in `build.js` — it does not use `template.html`.

**SVG doodle system**: Background illustrations use an SVG sprite sheet (`<symbol>` definitions) at the top of template.html, referenced via `<use href="#ico-*">` in `.doodles` containers per section. Positioned via numbered CSS classes (`.d1` through `.d82`).

## Color Palette

Terracotta `#CB997E`, Dusty Rose `#DDBEA9`, Peach Cream `#FFE8D6`, Sage Fern `#A5A58D`, Olive Green `#6B705C`, Cream `#FAF3E8`, Coral `#D4856A`

## Verification After Changes

1. `node build.js` — must complete with no errors
2. Check for unreplaced placeholders: `grep -c '{{' dist/invite/a1b2c3d4/index.html` should output `0`
3. Preview both languages: `/invite/a1b2c3d4/` (ES) and `/invite/e5f6a7b8/` (EN)
