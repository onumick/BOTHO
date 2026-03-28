# Botho University GPA Calculator

Browser-based GPA and CGPA calculator tailored for Botho University programme structures.

This app runs entirely in the browser, stores progress in local storage, and exports a downloadable GPA report card image.

## Features

- Programme search with fuzzy matching (Fuse.js).
- Year-by-year module entry based on programme structure.
- Grade entry in two modes:
  - Letter grades (`A+` to `F`)
  - Percentage input (auto-mapped to letter grades)
- Real-time running GPA while entering results.
- CGPA and classification summary:
  - Distinction (`>= 3.5`)
  - Merit (`>= 2.75`)
  - Pass (`< 2.75`)
- Module exclusion toggle for retakes or omitted modules.
- Client-side export to PNG report card.
- Privacy-first design: no backend, no server-side data storage.

## Tech Stack

- Next.js 14 (static export mode)
- React 18
- TypeScript
- Tailwind CSS
- Fuse.js (search)
- html2canvas (report export rendering)

## Project Structure

```text
src/
  components/
    CourseManager.tsx    # Grade/percentage input and running GPA
    ExportModule.tsx     # PNG export logic (html2canvas)
    GPAEngine.ts         # Grade points and GPA/CGPA calculations
    Layout.tsx           # App shell and SEO meta
    ResultCard.tsx       # Final result card and export UI
    SearchEngine.tsx     # Programme fuzzy search
  data/
    programmes.json      # Programme/module source data used by the app
  hooks/
    useLocalStorage.ts   # Persist state in browser localStorage
  lib/
    normalizeProgrammes.ts # Converts raw data to UI shape
    types.ts               # Shared TypeScript types
  pages/
    _app.tsx
    index.tsx            # Main page and step flow
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run in development

```bash
npm run dev
```

Open `http://localhost:3000`.

### 3. Build static output

```bash
npm run build
```

### 4. Preview production build locally

```bash
npm run start
```

This command builds and serves `out/` on port `3000`.

## Available Scripts

- `npm run dev` - Start Next.js dev server.
- `npm run build` - Create static export in `out/`.
- `npm run build:ghpages` - Build with `GITHUB_PAGES=true` for GitHub Pages base path.
- `npm run start` - Build and serve static export with `serve`.
- `npm run lint` - Run ESLint.
- `npm run deploy` - Build for GitHub Pages and publish `out/` via `gh-pages`.

## Deployment

This repository is configured for GitHub Pages.

- `next.config.js` uses static export (`output: 'export'`).
- When `GITHUB_PAGES=true`, `basePath` is set to `/BOTHO`.
- CI workflow at `.github/workflows/deploy.yml` runs on pushes to `main` and publishes `./out`.

If your repository name changes, update the GitHub Pages base path in `next.config.js` and related deployment settings.

## Data and Calculation Notes

- Programme/module definitions are sourced from `src/data/programmes.json`.
- GPA is weighted by module credits using points from `src/components/GPAEngine.ts`.
- CGPA is computed across all graded, non-excluded modules.
- All user-entered data is saved locally in browser local storage keys prefixed with `bu_`.

## Privacy

- No authentication.
- No API calls for grade processing.
- No student records sent to a backend.
- All calculations happen on-device.

## Known Caveat

`src/components/ResultCard.tsx` references `/qr-code.png` in the exported report section. Ensure `public/qr-code.png` exists if you want the QR image to render in the report.

## Contributing

1. Create a feature branch.
2. Make your changes.
3. Run:

```bash
npm run lint
npm run build
```

4. Open a pull request.

## License

This project is licensed under the Apache License 2.0.

It is open for use, modification, and distribution, but attribution and preservation of license notices are required.

See [LICENSE](LICENSE) for full terms.
