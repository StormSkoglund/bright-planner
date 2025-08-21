# Deploying BrightPlanner

Denne fil viser to nemme måder at hoste sit statiske site efter at du har bygget med `npm run build` (Vite output i `dist/`).

1) GitHub Pages (Actions)
- Opret et repo på GitHub.
- Push denne mappe til GitHub (`git remote add origin <url>`; `git push -u origin main`).
- GitHub Actions workflow `.github/workflows/deploy-pages.yml` bygger og udgiver `dist/` til Pages.

2) Netlify
- Opret en ny site på Netlify og vælg "Deploy from Git" eller drag & drop `dist/`.
- Hvis du bruger Git-deploy, Netlify kører `npm run build` og bruger `dist/` som publish-mappe.

Bemærk: Der er en sikkerhedskopi `public/recipes.broken.json` hvis JSON tidligere blev korrumperet.
