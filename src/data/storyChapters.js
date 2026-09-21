export const STORY_CHAPTERS = [
  {
    id: 'ch0',
    number: 0,
    title: 'The Hike to Two-Pines',
    subtitle: 'Hiking through Shoshone National Forest to your new home',
    weatherPreset: 'golden_hour',
    initialTime: 17.2,
    objectives: [
      {
        id: 'ch0_obj1',
        text: 'Hike along the canyon trail and cross the Meadow Creek Bridge',
        completed: false,
        action: 'reach_bridge'
      },
      {
        id: 'ch0_obj2',
        text: 'Follow the trail markers up to the base of the lookout tower',
        completed: false,
        action: 'reach_tower_base'
      },
      {
        id: 'ch0_obj3',
        text: 'Climb the wooden tower stairs to the lookout deck',
        completed: false,
        action: 'climb_stairs'
      },
      {
        id: 'ch0_obj4',
        text: 'Enter the cabin, pick up the desk radio, and check in with Willow',
        completed: false,
        action: 'open_radio'
      }
    ],
    dialogue: [
      {
        speaker: 'Ranger Willow',
        portrait: '🌲',
        text: 'Two-Pines incoming, this is Willow over at Thorofare. You should be crossing Meadow Creek now. Follow the switchbacks up the ridge—your tower is waiting for you!',
        responses: [
          { text: 'Copy Willow! Just crossed the creek bridge. Making my way up.', nextIndex: 1 },
          { text: 'The mountain air out here is incredible.', nextIndex: 2 }
        ]
      },
      {
        speaker: 'Ranger Willow',
        portrait: '🌲',
        text: 'Watch your footing on the wooden stairs—they can get slick with pine needles. When you get up top, unlock the hatch and radio me from the desk.',
        responses: [
          { text: 'Almost at the top deck. See you on the radio!', nextIndex: -1 }
        ]
      },
      {
        speaker: 'Ranger Willow',
        portrait: '🌲',
        text: 'Nothing beats Wyoming in late summer. Take it all in, ranger. Head up the staircase and settle into the tower.',
        responses: [
          { text: 'Headed up the stairs now.', nextIndex: -1 }
        ]
      }
    ]
  },
  {
    id: 'ch1',
    number: 1,
    title: 'First Morning at Two-Pines',
    subtitle: 'Morning orientation & horizon check with Ranger Willow',
    weatherPreset: 'golden_hour',
    initialTime: 7.2,
    objectives: [
      {
        id: 'ch1_obj1',
        text: 'Answer the incoming radio transmission on the desk',
        completed: false,
        action: 'open_radio'
      },
      {
        id: 'ch1_obj2',
        text: 'Step onto the Balcony to check the morning valley weather',
        completed: false,
        action: 'camera_balcony'
      },
      {
        id: 'ch1_obj3',
        text: 'Use the Spotting Scope to sight Thorofare Ridge (Azimuth ~315°)',
        completed: false,
        action: 'spot_thorofare'
      }
    ],
    dialogue: [
      {
        speaker: 'Ranger Willow',
        portrait: '🌲',
        text: 'Two-Pines Lookout, this is Willow over at Thorofare. Morning radio check, how was your first night?',
        responses: [
          { text: 'Loud and clear, Willow. First day on the job!', nextIndex: 1 },
          { text: 'Slept like a rock. Just brewing a fresh pot of coffee.', nextIndex: 2 }
        ]
      },
      {
        speaker: 'Ranger Willow',
        portrait: '🌲',
        text: 'Welcome to the Shoshone, rookie. The air is crisp this morning. Take a deep breath and step out onto your balcony—the view will take your breath away.',
        responses: [
          { text: 'Stepping out now. Over and out.', nextIndex: 3 }
        ]
      },
      {
        speaker: 'Ranger Willow',
        portrait: '🌲',
        text: 'Coffee first, watch second—you already have the makings of a seasoned lookout. Once your mug is full, step onto the balcony and check the valley horizon.',
        responses: [
          { text: 'Will do! Stepping out to the balcony now.', nextIndex: 3 }
        ]
      },
      {
        speaker: 'Ranger Willow',
        portrait: '🌲',
        text: 'When you are ready, look through the brass spotting scope toward Thorofare Ridge around bearing 315. Let me know when you see our flag flying.',
        responses: [
          { text: 'Looking through the scope now!', nextIndex: -1 }
        ]
      }
    ]
  },
  {
    id: 'ch2',
    number: 2,
    title: 'Smoke or Steam?',
    subtitle: 'Investigate the thermal plume in the western basin',
    weatherPreset: 'misty_dawn',
    initialTime: 11.5,
    objectives: [
      {
        id: 'ch2_obj1',
        text: 'Look through the Spotting Scope towards West Basin (Azimuth ~275°)',
        completed: false,
        action: 'spot_geyser'
      },
      {
        id: 'ch2_obj2',
        text: 'Radio Willow with your azimuth coordinates',
        completed: false,
        action: 'radio_coordinates'
      },
      {
        id: 'ch2_obj3',
        text: 'Open your Leather Journal and verify the discovery stamp',
        completed: false,
        action: 'open_journal'
      }
    ],
    dialogue: [
      {
        speaker: 'Ranger Willow',
        portrait: '🌲',
        text: 'Two-Pines, we have reports of a rising white column out by the western drainage. Can you swing your scope around bearing 275 and tell me what you see?',
        responses: [
          { text: 'On it. Sighting the western basin now.', nextIndex: 1 },
          { text: 'Is it a campfire or thermal steam?', nextIndex: 2 }
        ]
      },
      {
        speaker: 'Ranger Willow',
        portrait: '🌲',
        text: 'Look for the color of the plume. If it is pure white and rhythmic, it is likely the old Geyser Basin waking up with the morning heat.',
        responses: [
          { text: 'Scope is focused. Confirming coordinates.', nextIndex: -1 }
        ]
      },
      {
        speaker: 'Ranger Willow',
        portrait: '🌲',
        text: 'That is what we need you to verify! Check through your optics and record the exact bearing in your logbook.',
        responses: [
          { text: 'Understood. Checking the scope now.', nextIndex: -1 }
        ]
      }
    ]
  },
  {
    id: 'ch3',
    number: 3,
    title: 'Summer Mist & The Elk Herd',
    subtitle: 'Spot the wildlife crossing near Meadow Creek',
    weatherPreset: 'rainy_afternoon',
    initialTime: 16.0,
    objectives: [
      {
        id: 'ch3_obj1',
        text: 'Pan the scope toward Meadow Creek Valley (Azimuth ~45°)',
        completed: false,
        action: 'spot_elk'
      },
      {
        id: 'ch3_obj2',
        text: 'Capture a Polaroid Snapshot of the scenic valley',
        completed: false,
        action: 'take_polaroid'
      },
      {
        id: 'ch3_obj3',
        text: 'Radio Willow to share the good news about the herd',
        completed: false,
        action: 'radio_elk'
      }
    ],
    dialogue: [
      {
        speaker: 'Ranger Willow',
        portrait: '🌲',
        text: 'The afternoon mist is rolling across Meadow Creek. Keep your eyes peeled toward the river delta near 045 degrees—the elk usually graze there before dusk.',
        responses: [
          { text: 'I love wildlife spotting. Moving to the scope!', nextIndex: 1 },
          { text: 'Got my instant camera ready on the desk.', nextIndex: 2 }
        ]
      },
      {
        speaker: 'Ranger Willow',
        portrait: '🌲',
        text: 'Take your time. There is nothing quite like watching majestic antlers emerge through the silver pine mist.',
        responses: [
          { text: 'Scanning the riverbank now.', nextIndex: -1 }
        ]
      },
      {
        speaker: 'Ranger Willow',
        portrait: '🌲',
        text: 'Snap a good picture for the central ranger bulletin board! We keep a collection of all the season memories.',
        responses: [
          { text: 'Will do! Logging it in the journal.', nextIndex: -1 }
        ]
      }
    ]
  },
  {
    id: 'ch4',
    number: 4,
    title: 'Thunder Over the Valley',
    subtitle: 'Monitor lightning strikes during a cozy summer thunderstorm',
    weatherPreset: 'thunderstorm_dusk',
    initialTime: 20.0,
    objectives: [
      {
        id: 'ch4_obj1',
        text: 'Ensure the desk lamp is switched ON and stove is crackling',
        completed: false,
        action: 'desk_cozy'
      },
      {
        id: 'ch4_obj2',
        text: 'Inspect Granite Peak (Azimuth ~190°) for lightning strikes',
        completed: false,
        action: 'spot_granite'
      },
      {
        id: 'ch4_obj3',
        text: 'Sign off the night watch with Willow over the radio',
        completed: false,
        action: 'radio_signoff'
      }
    ],
    dialogue: [
      {
        speaker: 'Ranger Willow',
        portrait: '🌲',
        text: 'Listen to that rain on the tin roof! The thunder is rolling right over Granite Peak. Make sure your tower lightning rods are grounded and your lantern is lit.',
        responses: [
          { text: 'Stove is warm and tea is brewed. All secure.', nextIndex: 1 },
          { text: 'Watching the flashes across the south ridge.', nextIndex: 2 }
        ]
      },
      {
        speaker: 'Ranger Willow',
        portrait: '🌲',
        text: 'You did outstanding work today, Two-Pines. The forest is peaceful and watched over. Rest well, ranger.',
        responses: [
          { text: 'Goodnight Willow. Two-Pines signing off.', nextIndex: -1 }
        ]
      },
      {
        speaker: 'Ranger Willow',
        portrait: '🌲',
        text: 'No strike fires spotted so far—the heavy rain is keeping the pine needles soaked. Sign your logbook and enjoy the sound of the rain tonight.',
        responses: [
          { text: 'Signing off. Goodnight Willow!', nextIndex: -1 }
        ]
      }
    ]
  }
]
