# 🌲 Two-Pines: Cozy Forest Fire Watch

[![Vitest](https://img.shields.io/badge/tests-33%20passed-brightgreen.svg)](https://github.com/)
[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-R3F-orange.svg)](https://threejs.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-v4-38bdf8.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

A comforting, Firewatch-inspired 3D wilderness lookout tower simulator and cozy focus sanctuary built with **React 18, React Three Fiber (Three.js), Web Audio API, and Tailwind CSS**.

Experience an accelerated in-game weather/day-night simulation, third-person trail exploration, horizon spotting optics, warm walkie-talkie story chapters, ambient lo-fi soundscape mixer with vintage tape warble, Pomodoro focus timer, graphics quality scaling, and leather field journal.

---

## 📚 Documentation Index

| Guide | Description |
| :--- | :--- |
| [Technical Specification (`SPEC.md`)](SPEC.md) | Architectural formulas, store schemas, sun trajectory math, and coordinates. |
| [AI Agent Guide (`AGENTS.md`)](AGENTS.md) | Engineering conventions, state rules, and performance guidelines for AI assistants. |
| [Procedural Audio Design (`AUDIO_DESIGN.md`)](AUDIO_DESIGN.md) | Web Audio node graphs, LFO tape flutter, and synth algorithms. |
| [Story & Dialogue Guide (`STORY_GUIDE.md`)](STORY_GUIDE.md) | Character lore, chapter formats, and radio dialogue trees. |
| [60FPS Performance (`PERFORMANCE.md`)](PERFORMANCE.md) | WebGL draw call budgets, instancing patterns, and mobile optimization. |
| [Testing Guide (`TESTING.md`)](TESTING.md) | Vitest test suite structure, unit tests, and pre-commit Husky gates. |
| [Deployment Guide (`DEPLOYMENT.md`)](DEPLOYMENT.md) | Production build steps for Vercel, Netlify, and GitHub Pages. |
| [Changelog (`CHANGELOG.md`)](CHANGELOG.md) | Release notes and version history. |
| [Product Roadmap (`ROADMAP.md`)](ROADMAP.md) | Upcoming features, seasonal biomes, and WebXR milestones. |
| [Contributing Guide (`CONTRIBUTING.md`)](CONTRIBUTING.md) | Guidelines for opening PRs, commit hygiene, and development workflow. |
| [Assets & Attributions (`ASSETS.md`)](ASSETS.md) | Procedural synthesis formulas, typography, and icon licenses. |

---

## 🌟 Key Features

* **🌅 Accelerated In-Game Time & Dynamic Weather**:
  * Non-real-time day cycle (configurable 12-minute full day with 1x, 3x, 5x, 10x speeds and pause).
  * Dynamic atmospheric transitions: Dawn, Crisp Afternoon, Golden Hour Amber Sunset, Twilight Purple, and Starry Night.
  * Weather modes: Clear Sky, Mountain Mist, Pine Rain, and Summer Thunderstorm.
  * Instant atmosphere mood presets with rich Rayleigh sky scattering.

* **🥾 Trail Exploration & Tri-Camera Rig**:
  * Seamless camera switching: **Lookout Cabin (1st Person)**, **Ranger Desk (3rd Person)**, **Desk View**, **Spotting Scope (Horizon)**, and **Balcony Panorama**.
  * Explore the canyon trails, cross Meadow Creek Bridge, and climb the wooden tower stairs.
  * Third-person Ranger character model with walking kinematics, backpack, and ranger hat.

* **🗺️ Topographic Ranger Map & Sighting Scope**:
  * Full-screen vintage topographic contour map with real-time GPS player marker.
  * 360-degree rotating compass azimuth scale and precision optical reticle.
  * Discover distant landmarks: Thorofare Lookout, West Geyser Basin, Meadow Creek Elk Herd, Granite Peak, and Campfire Smoke Plumes.

* **📻 Warm Walkie-Talkie Radio Chapters**:
  * Multi-chapter narrative communicating with veteran lookout Ranger Willow.
  * Letter-by-letter typewriter text with procedural melodic vocal chirps.
  * Tactile walkie-talkie squelch and push-to-talk response branches.

* **📔 Leather Journal & Instant Polaroid Camera**:
  * Verified discovery stamps for spotted landmarks and wildlife.
  * Daily barometer, temperature, and wind recordings.
  * Editable ranger field notes with persistent browser storage.
  * In-game Polaroid snapshot camera with one-click PNG downloads.

* **🎧 Soundscape Mixer with Vintage Tape Warble**:
  * Web Audio API procedural synthesis with independent channel sliders: Rain on tin roof, Wind in pines, Woodstove crackle, Nature chirps/crickets, Lo-Fi chords, and Radio squelch.
  * Vintage Tape Warble low-pass filter with gentle analog flutter.

* **⏳ Mechanical Pomodoro Focus Timer**:
  * Wind-up circular dial timer with Deep Focus (25m), Short Break (5m), and Rest Shift (15m) modes with comforting completion chimes.

* **⚙️ Graphics Quality Switcher & Save Backup**:
  * Low (60fps mobile-optimized), Medium, High, and Ultra presets.
  * Full JSON save backup export and restore across devices.

---

## 🎮 Controls Reference

| Action | Desktop Keyboard & Mouse | Mobile Touchscreen |
| :--- | :--- | :--- |
| **Move Ranger** | <kbd>W</kbd> <kbd>A</kbd> <kbd>S</kbd> <kbd>D</kbd> or Arrow Keys | Left Virtual Joystick |
| **Look / Rotate** | Click & Drag Mouse | Right Touch Drag Area |
| **Sprint** | Hold <kbd>Shift</kbd> | On-Screen Sprint Toggle |
| **Interact / Action** | <kbd>E</kbd> or <kbd>Space</kbd> | Contextual Action Button |
| **Topographic Map** | <kbd>M</kbd> or HUD Map Icon | Top HUD Map Button |
| **Spotting Scope** | <kbd>Z</kbd> or Scope Icon | Quick Switch Dock |
| **Radio Dialogue** | <kbd>R</kbd> or Radio Icon | Quick Switch Dock |
| **Field Journal** | <kbd>J</kbd> or Journal Icon | Quick Switch Dock |
| **Audio Mixer** | <kbd>X</kbd> or Mixer Icon | Bottom-Left Audio Button |

---

## 🚀 Quickstart

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Execute Vitest automated test suite
npm run test:run

# 4. Build production bundle
npm run build
```

---

## 🧪 Testing & CI Gate

All store slices, math algorithms, dialogue progression, and UI components are tested with **Vitest + React Testing Library**. Husky pre-commit hooks and GitHub Actions CI ensure that code cannot be committed or merged if any test fails.

```bash
npm run test:run
npm run lint
```

---

## 📄 License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.
