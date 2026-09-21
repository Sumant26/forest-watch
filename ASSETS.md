# 🎨 Assets & Synthesis Attributions

**Two-Pines** is built with a zero-asset philosophy: all audio, terrain, cabin models, and particle systems are generated procedurally at runtime with zero external media files.

---

## 🎧 Procedural Audio Synthesis (`src/audio/SoundEngine.js`)

All sound effects, loops, and musical ambiance are generated in real-time via the browser's **Web Audio API**:

* **Rain Soundscape**: Pink noise buffer with randomized high-pass droplet burst triggers.
* **Wind in Pines**: Sweeping resonant Biquad bandpass filter modulated by dual LFOs.
* **Woodstove Fire**: Low-frequency sine drone ($45\text{ Hz}$) combined with stochastic Poisson crackle impulses.
* **Procedural Lo-Fi Chords**: Synthesized electric piano chords using soft triangle and sine waves ($\text{Dmaj7} \rightarrow \text{Bm7} \rightarrow \text{Gmaj7} \rightarrow \text{A7sus4}$).
* **Vintage Walkie-Talkie**: High-pass RF squelch bursts with multi-tone typewriter melodic vocal chirps.
* **Tape Warble Filter**: Analog wow & flutter emulator powered by a slow $0.8\text{ Hz}$ sine LFO driving a low-pass filter.

---

## 🌲 Procedural 3D Geometries & Shaders

* **Lookout Cabin & Furniture**: Custom Three.js procedural box, cylinder, and extrude geometries with warm wood and metal material parameters.
* **Instanced Pine Forest**: Instanced cone and cylinder tree meshes with randomized pitch, yaw, and scale variations.
* **Atmospheric Sky**: Custom Rayleigh scattering shader dome with real-time sun/moon vector updates.
* **Weather Particles**: GPU instanced point clouds for rainfall, mountain mist, and woodstove chimney embers.

---

## 🔤 Typography

* **[Special Elite](https://fonts.google.com/specimen/Special+Elite)** — Typewriter headers and dialogue text (*Apache License 2.0*).
* **[Courier Prime](https://fonts.google.com/specimen/Courier+Prime)** — Field journal entries and terminal coordinates (*SIL Open Font License*).
* **[Outfit](https://fonts.google.com/specimen/Outfit)** — Clean modern UI badges and numerical readouts (*SIL Open Font License*).

---

## 🎴 UI Icons

* **[Lucide React](https://lucide.dev/)** — Lightweight SVG iconography for HUD controls, map pins, and settings toggles (*ISC License*).
