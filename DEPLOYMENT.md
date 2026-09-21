# 🚀 Deployment Guide

This guide covers building, optimizing, and deploying **Two-Pines: Cozy Forest Fire Watch** to modern cloud hosting platforms and static web providers.

---

## 📦 Production Build

Create an optimized, minified production build:

```bash
# 1. Ensure all tests and linting pass
npm run test:run
npm run lint

# 2. Build production bundle into /dist
npm run build

# 3. Preview production build locally
npm run preview
```

---

## 🌐 Cloud Deployment Options

### 1. Vercel
1. Install Vercel CLI: `npm i -g vercel` (or connect via GitHub repository in the Vercel dashboard).
2. Configuration defaults:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Deploy: `vercel --prod`

### 2. Netlify
Create `netlify.toml` in project root (optional, or configure via web dashboard):
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 3. GitHub Pages
1. In `vite.config.js`, set the base path if serving from a sub-path:
   ```javascript
   export default defineConfig({
     base: '/forest-fire-watch/',
     // ...
   })
   ```
2. Configure `.github/workflows/deploy.yml` with the standard GitHub Actions Pages workflow to publish the `dist/` directory on pushes to `main`.

---

## 🛡️ Pre-Deployment Verification Checklist

- [ ] All 33+ unit and component tests pass (`npm run test:run`).
- [ ] Linter reports 0 errors (`npm run lint`).
- [ ] Web Audio initializes correctly on mobile and desktop user gesture.
- [ ] Canvas scales smoothly across 360px mobile viewports and 4K desktop screens.
- [ ] Save state exports and imports successfully without corrupted JSON payloads.
