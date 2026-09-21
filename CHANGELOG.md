# Changelog

All notable changes to the **Two-Pines: Cozy Forest Fire Watch** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Planned
- Backcountry snow & autumn seasonal biomes.
- WebXR / VR immersive lookout exploration mode.
- Additional interactive wildlife behavior (golden eagle nesting, bear tracks).

---

## [1.2.0] - 2026-09-21

### Added
- **Trail Exploration & Prologue Hike**:
  - Chapter 0 prologue hike through Shoshone National Forest across Meadow Creek Bridge.
  - Interactive wooden tower staircase ascent with step sound synthesis.
  - Third-person Ranger character model with walk/run kinematics, backpack, and ranger hat.
- **Topographic Ranger Map Overlay**:
  - Full-screen vintage topographic contour map with real-time player GPS locator pin.
  - Sighting landmark indicators and compass orientation ring.
- **Mobile Touch Controller & Virtual Joystick**:
  - Dual-stick mobile touch locomotion and camera panning controls.
  - Dynamic responsive UI overlays optimized for small screens (360px+).
- **Audio & Focus Additions**:
  - Mechanical wind-up Pomodoro focus timer (25m / 5m / 15m) with bell chime.
  - Vintage tape warble flutter filter for lo-fi procedural audio.

### Changed
- Refactored camera rig to support seamless switching between Cabin First-Person, Ranger Third-Person, Desk View, Spotting Scope, and Balcony Panorama.
- Enhanced day/night lighting color gradients with rich Rayleigh atmospheric dome scattering.

---

## [1.1.0] - 2026-09-15

### Added
- **Horizon Spotting Scope**:
  - Precision 360° azimuth optical reticle with elevation pitch tracking.
  - Five discoverable Shoshone landmarks: Thorofare Lookout, West Geyser Basin, Meadow Creek Elk, Granite Peak, and Emerald Lake Campsite.
  - Verified discovery stamp system in the field journal.
- **Leather Field Journal & Instant Camera**:
  - Interactive parchment journal with barometric weather logs and editable ranger notes.
  - Canvas snapshot Polaroid camera with instant PNG downloads.
- **Story Chapter Progression**:
  - Radio dialogue system with letter-by-letter typewriter animation and melodic speech blips.
  - Story chapters 1 through 4 with Ranger Willow.

---

## [1.0.0] - 2026-09-01

### Added
- **Initial Two-Pines Release**:
  - 3D lookout cabin environment built with React Three Fiber and Three.js.
  - Accelerated 12-minute day/night cycle with configurable speed multiplier (1x, 3x, 5x, 10x, pause).
  - Procedural Web Audio API sound synthesizer with multi-channel sliders (Rain, Wind, Woodstove, Nature, Lo-Fi Chords, Radio).
  - Graphics tier quality scaler (Low, Medium, High, Ultra).
  - LocalStorage save profile management with JSON export/import.
  - Vitest + React Testing Library test suite and Husky pre-commit hooks.
