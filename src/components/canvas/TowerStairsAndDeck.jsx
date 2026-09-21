import React from 'react'

export function TowerStairsAndDeck() {
  // Generate 4-flight staircase wrapping around the tower stilts from y = -8.8 to y = 0
  const landings = [
    { pos: [-2.2, -6.6, 2.2], size: [1.6, 0.12, 1.6] },
    { pos: [2.2, -4.4, 2.2], size: [1.6, 0.12, 1.6] },
    { pos: [2.2, -2.2, -2.2], size: [1.6, 0.12, 1.6] },
    { pos: [-2.2, 0, -2.2], size: [1.6, 0.12, 1.6] }
  ]

  // Steps generator
  const stepsFlight1 = []
  for (let i = 0; i < 10; i++) {
    const progress = i / 10
    stepsFlight1.push({
      pos: [-2.2 + progress * 2.2, -8.8 + progress * 2.2, 2.2],
      rot: [0, 0, 0.4]
    })
  }

  const stepsFlight2 = []
  for (let i = 0; i < 10; i++) {
    const progress = i / 10
    stepsFlight2.push({
      pos: [2.2, -6.6 + progress * 2.2, 2.2 - progress * 4.4],
      rot: [-0.4, 0, 0]
    })
  }

  const stepsFlight3 = []
  for (let i = 0; i < 10; i++) {
    const progress = i / 10
    stepsFlight3.push({
      pos: [2.2 - progress * 4.4, -4.4 + progress * 2.2, -2.2],
      rot: [0, 0, -0.4]
    })
  }

  const stepsFlight4 = []
  for (let i = 0; i < 10; i++) {
    const progress = i / 10
    stepsFlight4.push({
      pos: [-2.2, -2.2 + progress * 2.2, -2.2 + progress * 2.2],
      rot: [0.4, 0, 0]
    })
  }

  return (
    <group position={[0, 0, 0]}>
      {/* --- Tower Stone Foundation Piers at Ground Level --- */}
      {[
        [-1.8, -8.8, -1.8],
        [1.8, -8.8, -1.8],
        [-1.8, -8.8, 1.8],
        [1.8, -8.8, 1.8]
      ].map((pos, idx) => (
        <mesh key={`pier-${idx}`} position={pos} castShadow receiveShadow>
          <boxGeometry args={[0.7, 0.6, 0.7]} />
          <meshStandardMaterial color="#6b7280" roughness={0.95} />
        </mesh>
      ))}

      {/* --- Staircase Landings --- */}
      {landings.map((l, idx) => (
        <group key={`landing-${idx}`} position={l.pos}>
          {/* Landing Platform */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={l.size} />
            <meshStandardMaterial color="#3b2416" roughness={0.8} />
          </mesh>
          {/* Landing Safety Railing */}
          <mesh position={[0, 0.45, 0.7]} castShadow>
            <boxGeometry args={[1.5, 0.06, 0.06]} />
            <meshStandardMaterial color="#2d1a0e" />
          </mesh>
          <mesh position={[0, 0.45, -0.7]} castShadow>
            <boxGeometry args={[1.5, 0.06, 0.06]} />
            <meshStandardMaterial color="#2d1a0e" />
          </mesh>
        </group>
      ))}

      {/* --- Stair Flight Treads & Stringers --- */}
      {/* Flight 1: Ground to Landing 1 */}
      {stepsFlight1.map((step, idx) => (
        <mesh key={`f1-${idx}`} position={step.pos} castShadow receiveShadow>
          <boxGeometry args={[0.4, 0.06, 0.8]} />
          <meshStandardMaterial color="#4a2e1e" roughness={0.8} />
        </mesh>
      ))}

      {/* Flight 2: Landing 1 to Landing 2 */}
      {stepsFlight2.map((step, idx) => (
        <mesh key={`f2-${idx}`} position={step.pos} castShadow receiveShadow>
          <boxGeometry args={[0.8, 0.06, 0.4]} />
          <meshStandardMaterial color="#4a2e1e" roughness={0.8} />
        </mesh>
      ))}

      {/* Flight 3: Landing 2 to Landing 3 */}
      {stepsFlight3.map((step, idx) => (
        <mesh key={`f3-${idx}`} position={step.pos} castShadow receiveShadow>
          <boxGeometry args={[0.4, 0.06, 0.8]} />
          <meshStandardMaterial color="#4a2e1e" roughness={0.8} />
        </mesh>
      ))}

      {/* Flight 4: Landing 3 to Top Balcony */}
      {stepsFlight4.map((step, idx) => (
        <mesh key={`f4-${idx}`} position={step.pos} castShadow receiveShadow>
          <boxGeometry args={[0.8, 0.06, 0.4]} />
          <meshStandardMaterial color="#4a2e1e" roughness={0.8} />
        </mesh>
      ))}
    </group>
  )
}
