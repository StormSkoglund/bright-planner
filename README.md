# BrightPlanner

Small Vite + React + TypeScript app for recipe planning and quick static publishing.

This README covers local development, building, and deploying to GitHub Pages using the repository's workflow.

## Quick summary
- Dev: fast HMR with Vite
- Build: output to `dist/`
- Deploy: workflow builds and publishes `dist/` to the `gh-pages` branch

## Requirements
- Node.js 20.x (CI and Vite require Node 20+) — install via nvm or your OS package manager
- npm (bundled with Node)

## Getting started (local development)
1. Install dependencies:

```bash
npm ci
```

2. Start dev server:

```bash
npm run dev
```

3. Open http://localhost:5173 (or the URL printed by Vite).

## Build for production

```bash
npm run build
```

The build output is written to `dist/`.

## Deploy (GitHub Actions)
- This repository includes a workflow that builds the site, uploads an artifact, then publishes the site by pushing to `gh-pages`.
- Triggering the workflow:
  - Push to one of the watched branches (configured: `main`/`master` in the workflow). Or trigger a manual run if `workflow_dispatch` is enabled.
  - The build creates an artifact named `github-pages` and the deploy job publishes that artifact to the `gh-pages` branch.

## Force a rebuild
- Re-run the workflow from the Actions UI, or push an empty commit:

```bash
git commit --allow-empty -m "chore: force rebuild"
git push
```

## Enabling GitHub Pages (Settings)
- For the current workflow you should set Pages to use the `gh-pages` branch and folder `/` (root). Steps:
  1. Go to your repository → Settings → Pages
  2. Select `gh-pages` as the branch and `/` as the folder, then Save

## Troubleshooting
- `configure-pages` 404 / "Get Pages site failed": make sure Pages is enabled in Settings first. If your organization blocks programmatic enablement you must have an admin enable Pages.
- Vite / Node warnings in Actions: the workflow uses Node 20.x; ensure your local Node matches if you see different behavior locally.
- Artifact upload/download errors: CI uses `actions/upload-pages-artifact@v3` / `actions/download-artifact@v3` and then pushes to `gh-pages`. If deploy fails, open the Actions run, copy the failing step log, and paste here.

## Contributing
- Create a branch, implement changes, open a pull request. Maintain code style and keep changes small and focused.

## License
- Add your preferred license file (e.g., `LICENSE`) if you intend to publish this repository.

## More help
- If a deploy fails, paste the exact Actions log for the failing step and I’ll help diagnose it.

Enjoy!
