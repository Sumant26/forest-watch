# 📻 Story & Dialogue Authoring Guide

This guide explains how narrative chapters, dialogue trees, radio transmissions, and character lore are structured in **Two-Pines**.

---

## 🌲 Character Profiles

### Ranger Willow (Callsign: Thorofare Base)
* **Role**: Veteran fire lookout stationed at Thorofare Station (8.4 km NW across the ridge).
* **Personality**: Warm, perceptive, witty, grounded in backcountry wisdom, and reassuring to newcomers.
* **Tone**: Uses colloquial ranger lingo ("Copy that", "10-4", "Ridge looks clear", "Keep your eyes on the treeline").
* **Audio Voice**: Melodic vocal synthesizer blips oscillating in the warm mid-range frequencies (~320Hz–480Hz).

### The Player Ranger (Callsign: Two-Pines)
* **Role**: Newly assigned fire lookout taking watch at Two-Pines Tower for the late summer season.

---

## 📂 Story Data Architecture

All story chapters are defined in [`src/data/storyChapters.js`](file:///c:/Users/ADMIN/Downloads/Work/Projects/Javascript%20projects/forest-fire-watch/src/data/storyChapters.js) and managed by the Zustand store [`src/stores/useStoryStore.js`](file:///c:/Users/ADMIN/Downloads/Work/Projects/Javascript%20projects/forest-fire-watch/src/stores/useStoryStore.js).

### Chapter Schema

```javascript
{
  id: 'ch1',                        // Unique chapter identifier string
  number: 1,                        // Integer sequence number (0 = Prologue)
  title: 'First Morning at Two-Pines',
  subtitle: 'Morning orientation & horizon check with Ranger Willow',
  weatherPreset: 'golden_hour',      // 'clear' | 'mist' | 'rain' | 'storm' | 'golden_hour' | 'twilight' | 'night'
  initialTime: 7.2,                 // Starting time in decimal hours (7.2 = 07:12 AM)
  objectives: [
    {
      id: 'ch1_obj1',
      text: 'Scan the horizon using the Spotting Scope',
      completed: false,
      action: 'open_scope'          // Trigger action string matching store events
    }
  ],
  dialogue: [                       // Array of dialogue nodes
    {
      speaker: 'Ranger Willow',
      portrait: '🌲',
      text: 'Two-Pines, how does that morning coffee taste up there?',
      responses: [
        { 
          text: 'Tastes like pine needles and crisp morning air.', 
          nextIndex: 1              // Index of the next dialogue node in array (-1 = end of convo)
        },
        { 
          text: 'Ready for my first horizon check.', 
          nextIndex: 2 
        }
      ]
    }
  ]
}
```

---

## 🌲 Dialogue Branching Rules

1. **Root Node**: Dialogue starts at index `0`.
2. **Branching**: Each response specifies `nextIndex` pointing to the target node index in `dialogue[]`.
3. **Closing Dialogue**: Set `nextIndex: -1` when a response concludes the radio exchange.
4. **Objective Actions**: Standard objective trigger action keys include:
   - `reach_bridge` — Triggered when player reaches the canyon bridge.
   - `reach_tower_base` — Triggered when player reaches tower base coordinates.
   - `climb_stairs` — Triggered when player climbs to the lookout deck.
   - `open_radio` — Triggered when player opens the radio console.
   - `open_scope` — Triggered when spotting scope overlay is opened.
   - `spot_landmark` — Triggered when spotting scope identifies a designated landmark.
   - `log_journal` — Triggered when player writes a note or saves a weather entry.
   - `complete_focus` — Triggered when a Pomodoro timer session finishes.

---

## ✍️ Writing Best Practices

* **Show, Don't Tell**: Mention atmospheric details like cedar smoke, distant elk calls, and the creak of timber beams in the wind.
* **Keep Lines Concise**: Dialogue is rendered in a typewriter modal with vintage squelch effects; keep passages under 180 characters per node for optimal reading pacing.
* **Branch Variety**: Provide distinct tones in player choices (e.g., contemplative vs. professional vs. lighthearted).
