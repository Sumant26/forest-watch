# 🧪 Testing Guide

This project maintains automated testing standards using **Vitest** and **React Testing Library**. All state mutations, math algorithms, dialogue systems, and UI components are tested to prevent regressions.

---

## 🏃 Running Tests

```bash
# Run full test suite once (CI mode)
npm run test:run

# Run tests in interactive watch mode
npm run test

# Run linter
npm run lint
```

---

## 📂 Test Organization

Tests are located in [`src/test/`](file:///c:/Users/ADMIN/Downloads/Work/Projects/Javascript%20projects/forest-fire-watch/src/test/):

| Test File | Target Module | Coverage Scope |
| :--- | :--- | :--- |
| `useTimeWeatherStore.test.js` | `src/stores/useTimeWeatherStore.js` | Time increment, speed multiplier, weather presets, sun elevation math. |
| `usePlayerStore.test.js` | `src/stores/usePlayerStore.js` | Player position, rotation, camera modes, staircase climbing state. |
| `useCameraStore.test.js` | `src/stores/useCameraStore.js` | Active camera viewpoints, transitions, scope zoom, reticle centering. |
| `useAudioStore.test.js` | `src/stores/useAudioStore.js` | Master gain, individual channel volumes, mute toggling, tape warble state. |
| `useStoryStore.test.js` | `src/stores/useStoryStore.js` | Chapter advancement, objective completions, dialogue tree traversal. |
| `useJournalStore.test.js` | `src/stores/useJournalStore.js` | Sighting discovery verification, weather logging, custom ranger notes. |
| `useFocusStore.test.js` | `src/stores/useFocusStore.js` | Pomodoro timer countdown, mode transitions (Focus/Break/Rest), tick logic. |
| `useSettingsStore.test.js` | `src/stores/useSettingsStore.js` | Graphics tiers, shadow map resolution, save backup export & import. |
| `HUDHeader.test.jsx` | `src/components/ui/HUDHeader.jsx` | Time/weather indicator rendering, action button click handlers, drawer triggers. |

---

## ✍️ Writing New Unit Tests

When adding a new feature or store slice, create a corresponding test file in `src/test/`:

```javascript
import { describe, it, expect, beforeEach } from 'vitest'
import { useYourStore } from '../stores/useYourStore'

describe('useYourStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useYourStore.setState(useYourStore.getInitialState?.() || {})
  })

  it('correctly updates state on action', () => {
    const { performAction } = useYourStore.getState()
    performAction('payload')
    expect(useYourStore.getState().value).toBe('expected_result')
  })
})
```

---

## 🛡️ Pre-Commit Hook Integration

Husky is configured to execute `npm run test:run && npm run lint` before every commit. Commits will be blocked automatically if any test fails or if the linter encounters syntax errors.
