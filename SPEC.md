# 📐 Technical Specification: Two-Pines Forest Fire Watch

## 1. System Architecture

The application is structured into decoupled, modular subsystems:

```mermaid
graph TD
    App[App.jsx Main Container]
    
    subgraph State Management [Zustand Stores]
        TimeStore[useTimeWeatherStore]
        PlayerStore[usePlayerStore]
        CameraStore[useCameraStore]
        AudioStore[useAudioStore]
        StoryStore[useStoryStore]
        JournalStore[useJournalStore]
        FocusStore[useFocusStore]
        SettingsStore[useSettingsStore]
    end

    subgraph 3D WebGL Layer [React Three Fiber]
        Canvas[LookoutCanvas]
        Sky[AtmosphericSky]
        Terrain[TerrainEnvironment & TrailEnvironment]
        Cabin[CabinModel & TowerStairsAndDeck]
        Player[PlayerController & RangerCharacter]
        Rig[CameraRig]
    end

    subgraph Procedural Audio [Web Audio API]
        SoundEngine[SoundEngine.js Multi-Channel Synthesizer]
    end

    subgraph Glassmorphic UI [React & Tailwind CSS]
        HUD[HUDHeader & MobileTouchControls]
        Scope[SpottingScopeOverlay]
        Radio[RadioDialogueModal]
        Journal[LeatherJournalModal]
        Mixer[AudioMixerDrawer]
        Timer[FocusTimerModal]
        Map[RangerMapOverlay]
        Settings[SettingsModal]
    end

    App --> StateManagement
    StateManagement --> 3D WebGL Layer
    StateManagement --> Procedural Audio
    StateManagement --> Glassmorphic UI
```

---

## 2. In-Game Time & Atmospheric Formulas

### 2.1 Time Advancement
* **Time Cycle**: Time $t$ is represented as decimal hours $t \in [0, 24)$.
* **Differential Step**:
  $$\Delta t = \frac{\Delta s \times \text{speedMultiplier}}{30}$$
  *(At $1\times$ speed, $12\text{ real minutes} = 24\text{ in-game hours}$)*.

### 2.2 Solar Coordinates & Celestial Orbit
* **Sun Elevation Factor**:
  $$\theta_{\text{sun}} = \sin\left(\frac{t - 6}{12} \times \pi\right)$$
* **Cartesian Sun Position** ($r = 120$):
  $$x = 120 \cos\left(\frac{t - 6}{24} \times 2\pi\right), \quad y = \max\left(-10, 120 \sin(\theta_{\text{sun}})\right), \quad z = 40 \sin\left(\frac{t - 6}{24} \times 2\pi\right)$$

### 2.3 Barometer & Temperature Simulation
* **Daylight Factor** $D(t) = \max\left(0, \sin\left(\frac{t - 6}{12}\pi\right)\right)$
* **Temperature**:
  $$T(t) = 45^\circ\text{F} + 28^\circ\text{F} \times D(t) + \text{weatherOffset}$$
* **Barometric Pressure**:
  $$P(t) = 29.85\text{ inHg} + \text{pressureDelta}(\text{weatherMode})$$

---

## 3. Spotting Horizon Coordinates

| Landmark ID | Landmark Name | Azimuth Bearing | Elevation Pitch | Distance | Sighting Stamp |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `spot_thorofare` | **Thorofare Lookout Station** | 315° NW | 0° | 8.4 km | `APPROVED LOOKOUT POST` |
| `spot_geyser` | **West Geyser Basin** | 275° W | -5° | 5.2 km | `VERIFIED THERMAL STEAM` |
| `spot_elk` | **Meadow Creek Elk Herd** | 45° NE | -8° | 3.8 km | `WILDLIFE SIGHTING LOGGED` |
| `spot_granite` | **Granite Peak Summit** | 190° S | +12° | 12.1 km | `SUMMIT RIDGE SECURE` |
| `spot_campfire` | **Emerald Lake Campsite** | 120° SE | -6° | 4.5 km | `SAFE BACKCOUNTRY FIRE` |

* **Optical Reticle Lock-On Threshold**: Azimuth tolerance $\Delta\theta \le \pm 6^\circ$ and Pitch tolerance $\Delta\phi \le \pm 4^\circ$.

---

## 4. Graphics Quality Scaling

| Tier | DPR | Shadows | Shadow Map Size | Tree Instances | Particle Count | Bloom Effect |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Low** | `1.0` | Off | N/A | 200 | 150 | Off |
| **Medium** | `1.2` | Soft | 512 | 500 | 400 | Off |
| **High** | `1.5` | Full | 1024 | 900 | 800 | On |
| **Ultra** | `2.0` | Full | 2048 | 1400 | 1400 | On |

---

## 5. Locomotion & Collision Math

* **Walk Speed**: $v_{\text{walk}} = 3.2\text{ m/s}$
* **Sprint Speed**: $v_{\text{sprint}} = 6.0\text{ m/s}$
* **Stair Ascent Kinematics**:
  $$y(s) = y_{\text{base}} + \left(\frac{s - s_{\text{start}}}{s_{\text{end}} - s_{\text{start}}}\right) \times h_{\text{deck}}$$
  Where $h_{\text{deck}} = 12.0\text{m}$ lookout tower elevation above ridge terrain.
