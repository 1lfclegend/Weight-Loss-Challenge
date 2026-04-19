# Beatmatcher / DJ App

Simple Vite + React app for Beatmatcher / DJ workflow prototyping.

## Prerequisites

- Node.js 18+
- npm 9+

## Run locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open the URL shown in the terminal (typically `http://localhost:5173`).

## Available scripts

- `npm run dev` — start the Vite development server.
- `npm run build` — produce an optimized production build in `dist/`.
- `npm run preview` — serve the production build locally.
- `npm run check` — run the repository verification script (currently build verification).
- `npm run test` — run lightweight automated smoke tests.

## Production build

```bash
npm run build
npm run preview

# optional one-command verification
npm run check
```

## Continuous integration

GitHub Actions runs `npm run check` on every push and pull request.

## Troubleshooting

- If dependencies fail to resolve, delete `node_modules/` and re-run `npm install`.
- If the dev server port is busy, Vite will suggest another available local port.
