# 🌲 Contributing to Two-Pines

Thank you for your interest in contributing to **Two-Pines: Cozy Forest Fire Watch**! We welcome bug fixes, documentation improvements, new story chapters, audio presets, and 3D visual enhancements.

---

## 🛠️ Development Workflow

### 1. Setup
```bash
# Clone repository
git clone https://github.com/your-username/forest-fire-watch.git
cd forest-fire-watch

# Install dependencies
npm install

# Start local development server with HMR
npm run dev
```

### 2. Branch Naming Conventions
Create a feature branch from `main`:
* `feature/audio-snow-storm`
* `fix/compass-azimuth-wrap`
* `docs/update-story-guide`

### 3. Commit Message Standards
We adhere to [Conventional Commits](https://www.conventionalcommits.org/):
* `feat: add chapter 5 radio transmission`
* `fix: prevent camera clipping near cabin roof`
* `docs: enrich procedural audio guide`
* `perf: reduce instanced pine draw calls on low tier`

---

## 🧪 Quality Gates & CI

Before submitting a Pull Request, verify that all automated checks pass locally:

```bash
# 1. Run unit test suite
npm run test:run

# 2. Run fast Oxlint linter
npm run lint

# 3. Verify production build succeeds
npm run build
```

* **Husky Pre-Commit Hook**: Husky automatically executes `npm run test:run && npm run lint` before any commit. Commits will fail if tests or linting errors are present.
* **GitHub Actions CI**: Every Pull Request runs the automated CI workflow (`.github/workflows/ci.yml`).

---

## 📋 Pull Request Checklist

When submitting a PR, please ensure:
- [ ] New state actions or math functions have accompanying tests in `src/test/`.
- [ ] UI modifications are tested on mobile (360px) and desktop viewports.
- [ ] No large binary audio/image files have been added (adhere to the zero-asset procedural design).
- [ ] Code conforms to project conventions and passes `npm run lint`.
