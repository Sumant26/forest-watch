# ⚡ 60FPS WebGL & React Performance Guide

**Two-Pines** is designed to maintain a consistent 60 FPS across a spectrum of devices—from entry-level smartphones to high-end desktop workstations.

---

## 🎯 Core Rendering Principles

### 1. Zero State Mutations in `useFrame`
* **Rule**: Never call Zustand setters, trigger `setState`, or allocate new JavaScript objects (`new Vector3()`, `new Color()`) inside the React Three Fiber `useFrame` loop.
* **Practice**: Use module-scoped or component-ref temporary vectors/matrices (`tempVec`, `tempMatrix`) and mutate existing properties in-place.

```javascript
// ✅ CORRECT: Zero-allocation frame update
const tempVec = new THREE.Vector3()

useFrame((state, delta) => {
  if (!meshRef.current) return
  meshRef.current.position.y += Math.sin(state.clock.elapsedTime) * 0.002
})

// ❌ INCORRECT: Triggers GC pressure & React re-renders
useFrame(() => {
  setPlayerState({ pos: [1, 2, 3] }) // Forces React tree re-render
  const v = new THREE.Vector3(1, 2, 3) // Creates GC garbage every frame
})
```

### 2. Geometry Instancing & Draw Call Batching
* Terrain pine trees, rocks, trail markers, and bridge planks use `<instancedMesh>` to collapse hundreds of 3D objects into single draw calls.
* Shared materials reuse standard shader programs across instances.

### 3. Graphics Quality Scaling Tiers

| Tier | DPR | Shadow Resolution | Tree Instances | Particle Count | Bloom & Post-processing |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Low** | `1.0` | Disabled (`0`) | 200 | 150 | Disabled |
| **Medium** | `1.2` | `512` | 500 | 400 | Disabled |
| **High** | `1.5` | `1024` | 900 | 800 | Selective Bloom |
| **Ultra** | `2.0` | `2048` | 1400 | 1400 | Full Bloom + Tonemapping |

---

## 📱 Mobile Optimizations

* **Pointer Events**: Canvas uses passive event listeners and CSS `touch-action: none` to eliminate mobile scroll stutter.
* **Pixel Ratio Clamping**: `dpr` is clamped to $\min(\text{window.devicePixelRatio}, 2.0)$ to prevent 3x/4x retina screens from rendering unnecessary pixel fragments.
* **Geometry Simplification**: Cabin furniture, stove, and railings use low-poly geometric primitives with vertex color accents instead of heavy texture maps.

---

## 🧪 Profiling & Diagnostic Tools

* Run `r3f-perf` or Chrome DevTools Performance panel to profile frame budgets (target: $\le 16.6\text{ms}$ per frame).
* Use `gl.info.render.calls` to monitor total draw calls (target: $\le 45$ active draw calls).
