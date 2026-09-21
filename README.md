# 🌲 Two-Pines: Cozy Forest Fire Watch

A comforting, Firewatch-inspired 3D lookout tower experience built with **React 18, Three.js (React Three Fiber), Web Audio API, and Tailwind CSS**.

Experience an accelerated in-game weather/time simulation, horizon spotting optics, warm walkie-talkie story chapters, ambient soundscape mixer with vintage tape warble, Pomodoro focus timer, graphics quality scaling, and leather field journal.

---

## 🌟 Key Features

* **🌅 Accelerated In-Game Time & Dynamic Weather**:
  * Non-real-time day cycle (configurable 12-minute full day with 1x, 3x, 5x, 10x speeds and pause).
  * Dynamic atmospheric transitions: Dawn, Crisp Afternoon, Golden Hour Amber Sunset, Twilight Purple, and Starry Night.
  * Weather modes: Clear Sky, Mountain Mist, Pine Rain, and Summer Thunderstorm.
  * Instant atmosphere mood presets.

* **🔭 Tri-Camera Rig & Horizon Spotting**:
  * Seamless switching: **Lookout Cabin (1st Person)**, **Ranger Desk (3rd Person)**, **Desk View**, **Spotting Scope (Horizon)**, and **Balcony Panorama**.
  * 360-degree rotating compass azimuth scale and precision optical reticle.
  * Spot distant landmarks: Thorofare Lookout, West Geyser Basin, Meadow Creek Elk Herd, Granite Peak, and Campfire Smoke Plumes.

* **📻 Warm Walkie-Talkie Radio Chapters**:
  * 4 pre-scripted story chapters communicating with Ranger Willow.
  * Letter-by-letter typewriter text with procedural melodic vocal chirps.
  * Tactile walkie-talkie squelch and push-to-talk response branches.

* **📔 Leather Journal & Instant Polaroid Camera**:
  * Verified discovery stamps for spotted landmarks and wildlife.
  * Daily barometer, temperature, and wind recordings.
  * Editable ranger field notes.
  * In-game Polaroid snapshot camera with one-click image downloads.

* **🎧 Soundscape Mixer with Vintage Tape Warble**:
  * Web Audio API procedural synthesis with independent channel sliders: Rain on tin roof, Wind in pines, Woodstove crackle, Nature chirps/crickets, Lo-Fi chords, and Radio squelch.
  * Vintage Tape Warble low-pass filter with gentle analog flutter.

* **⏳ Mechanical Pomodoro Focus Timer**:
  * Wind-up circular dial timer with Deep Focus (25m), Short Break (5m), and Rest Shift (15m) modes.

* **⚙️ Graphics Quality Switcher & Save Profile Import/Export**:
  * Low (60fps mobile-optimized), Medium, High, and Ultra presets.
  * Full JSON save backup export and restore across devices.

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

All store slices, math algorithms, dialogue progression, and UI components are tested with **Vitest + React Testing Library**.
Husky pre-commit hooks and GitHub Actions CI ensure that code cannot be committed or merged if any test fails.

```bash
npm run test:run
```
# forest-watch
