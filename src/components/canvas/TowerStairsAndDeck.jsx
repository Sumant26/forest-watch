import React from 'react'

export function TowerStairsAndDeck() {
  // Connected 4-flight staircase wrapping around the tower stilts from y = -8.8 to y = 0
  const landings = [
    // Landing 1 (South-West)
    { pos: [-2.2, -6.6, 2.2], size: [1.8, 0.14, 1.8] },
    // Landing 2 (South-East)
    { pos: [2.2, -4.4, 2.2], size: [1.8, 0.14, 1.8] },
    // Landing 3 (North-East)
    { pos: [2.2, -2.2, -2.2], size: [1.8, 0.14, 1.8] },
    // Top Balcony Landing (North-West)
    { pos: [-2.2, 0.0, -2.2], size: [1.8, 0.14, 1.8] }
  ]

  // Flight 1: Trail ground entrance [-1.2, -8.8, 3.8] up to Landing 1 [-2.2, -6.6, 2.2]
  const stepsFlight1 = []
  for (let i = 0; i <= 10; i++) {
    const t = i / 10
    stepsFlight1.push({
      pos: [-1.2 + (-2.2 - -1.2) * t, -8.8 + (-6.6 - -8.8) * t, 3.8 + (2.2 - 3.8) * t],
      rot: [0, 0.5, 0]
    })
  }

  // Flight 2: Landing 1 [-2.2, -6.6, 2.2] along South edge to Landing 2 [2.2, -4.4, 2.2]
  const stepsFlight2 = []
  for (let i = 0; i <= 10; i++) {
    const t = i / 10
    stepsFlight2.push({
      pos: [-2.2 + (2.2 - -2.2) * t, -6.6 + (-4.4 - -6.6) * t, 2.2],
      rot: [0, 0, 0]
    })
  }

  // Flight 3: Landing 2 [2.2, -4.4, 2.2] along East edge to Landing 3 [2.2, -2.2, -2.2]
  const stepsFlight3 = []
  for (let i = 0; i <= 10; i++) {
    const t = i / 10
    stepsFlight3.push({
      pos: [2.2, -4.4 + (-2.2 - -4.4) * t, 2.2 + (-2.2 - 2.2) * t],
      rot: [0, Math.PI / 2, 0]
    })
  }

  // Flight 4: Landing 3 [2.2, -2.2, -2.2] along North edge to Top Landing [-2.2, 0.0, -2.2]
  const stepsFlight4 = []
  for (let i = 0; i <= 10; i++) {
    const t = i / 10
    stepsFlight4.push({
      pos: [2.2 + (-2.2 - 2.2) * t, -2.2 + (0.0 - -2.2) * t, -2.2],
      rot: [0, 0, 0]
    })
  }

  // Vertical Access Ladder rungs (South face of tower)
  const ladderRungs = []
  for (let y = -8.4; y <= -0.2; y += 0.4) {
    ladderRungs.push(y)
  }

  return (
    <group position={[0, 0, 0]}>
      {/* --- Tower Mountain Granite Crags & Boulder Foundation (Images 3 & 5) --- */}
      {[
        [-2.4, -8.7, -2.4, 2.2],
        [2.4, -8.7, -2.4, 2.4],
        [-2.4, -8.7, 2.4, 2.1],
        [2.4, -8.7, 2.4, 2.5],
        [0.0, -8.8, 0.0, 3.2],
        [-3.2, -8.6, 0.0, 1.8],
        [3.2, -8.6, 0.0, 1.9]
      ].map(([rx, ry, rz, rs], bIdx) => (
        <mesh key={`tower-base-rock-${bIdx}`} position={[rx, ry, rz]} scale={[rs, rs * 0.6, rs]} castShadow receiveShadow>
          <dodecahedronGeometry args={[0.9, 0]} />
          <meshStandardMaterial color="#57534e" roughness={0.92} />
        </mesh>
      ))}

      {/* --- Tower Stone Foundation Piers at Ground Level --- */}
      {[
        [-1.8, -8.7, -1.8],
        [1.8, -8.7, -1.8],
        [-1.8, -8.7, 1.8],
        [1.8, -8.7, 1.8]
      ].map((pos, idx) => (
        <mesh key={`pier-${idx}`} position={pos} castShadow receiveShadow>
          <boxGeometry args={[0.85, 0.8, 0.85]} />
          <meshStandardMaterial color="#44403c" roughness={0.95} />
        </mesh>
      ))}

      {/* --- Vertical Wooden & Steel Access Ladder (South-East Tower Leg) --- */}
      <group position={[1.8, 0, 1.85]}>
        {/* Left Ladder Stringer Rail */}
        <mesh position={[-0.22, -4.4, 0]} castShadow>
          <boxGeometry args={[0.04, 8.8, 0.08]} />
          <meshStandardMaterial color="#2d1a0e" roughness={0.7} />
        </mesh>
        {/* Right Ladder Stringer Rail */}
        <mesh position={[0.22, -4.4, 0]} castShadow>
          <boxGeometry args={[0.04, 8.8, 0.08]} />
          <meshStandardMaterial color="#2d1a0e" roughness={0.7} />
        </mesh>
        {/* Ladder Rungs */}
        {ladderRungs.map((y, idx) => (
          <mesh key={`ladder-rung-${idx}`} position={[0, y, 0]} castShadow>
            <cylinderGeometry args={[0.018, 0.018, 0.44, 8]} rotation={[0, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#8a5a2b" metalness={0.5} roughness={0.4} />
          </mesh>
        ))}
        {/* Ladder Safety Cage Arches */}
        {[-7, -5, -3, -1].map((y, idx) => (
          <mesh key={`cage-${idx}`} position={[0, y, 0.25]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.28, 0.02, 6, 12, Math.PI]} />
            <meshStandardMaterial color="#1f2937" metalness={0.7} />
          </mesh>
        ))}
      </group>

      {/* --- Staircase Landings --- */}
      {landings.map((l, idx) => (
        <group key={`landing-${idx}`} position={l.pos}>
          {/* Landing Platform */}
          <mesh castShadow receiveShadow>
            <boxGeometry args={l.size} />
            <meshStandardMaterial color="#3b2416" roughness={0.8} />
          </mesh>
          {/* Landing Outer Railings */}
          <mesh position={[0, 0.5, 0.85]} castShadow>
            <boxGeometry args={[1.7, 0.08, 0.06]} />
            <meshStandardMaterial color="#24140b" />
          </mesh>
          <mesh position={[0, 0.5, -0.85]} castShadow>
            <boxGeometry args={[1.7, 0.08, 0.06]} />
            <meshStandardMaterial color="#24140b" />
          </mesh>
          <mesh position={[-0.85, 0.5, 0]} castShadow>
            <boxGeometry args={[0.06, 0.08, 1.7]} />
            <meshStandardMaterial color="#24140b" />
          </mesh>
          <mesh position={[0.85, 0.5, 0]} castShadow>
            <boxGeometry args={[0.06, 0.08, 1.7]} />
            <meshStandardMaterial color="#24140b" />
          </mesh>
          {/* Corner Rail Posts */}
          {[
            [-0.85, 0.25, -0.85],
            [0.85, 0.25, -0.85],
            [-0.85, 0.25, 0.85],
            [0.85, 0.25, 0.85]
          ].map((postPos, pIdx) => (
            <mesh key={`lp-${pIdx}`} position={postPos} castShadow>
              <boxGeometry args={[0.07, 0.5, 0.07]} />
              <meshStandardMaterial color="#24140b" />
            </mesh>
          ))}
        </group>
      ))}

      {/* --- Stair Flight Treads --- */}
      {/* Flight 1: Ground to Landing 1 */}
      {stepsFlight1.map((step, idx) => (
        <mesh key={`f1-${idx}`} position={step.pos} rotation={step.rot} castShadow receiveShadow>
          <boxGeometry args={[0.9, 0.08, 0.36]} />
          <meshStandardMaterial color="#4a2e1e" roughness={0.8} />
        </mesh>
      ))}

      {/* Flight 2: Landing 1 to Landing 2 */}
      {stepsFlight2.map((step, idx) => (
        <mesh key={`f2-${idx}`} position={step.pos} rotation={step.rot} castShadow receiveShadow>
          <boxGeometry args={[0.38, 0.08, 0.9]} />
          <meshStandardMaterial color="#4a2e1e" roughness={0.8} />
        </mesh>
      ))}

      {/* Flight 3: Landing 2 to Landing 3 */}
      {stepsFlight3.map((step, idx) => (
        <mesh key={`f3-${idx}`} position={step.pos} rotation={step.rot} castShadow receiveShadow>
          <boxGeometry args={[0.9, 0.08, 0.38]} />
          <meshStandardMaterial color="#4a2e1e" roughness={0.8} />
        </mesh>
      ))}

      {/* Flight 4: Landing 3 to Top Deck */}
      {stepsFlight4.map((step, idx) => (
        <mesh key={`f4-${idx}`} position={step.pos} rotation={step.rot} castShadow receiveShadow>
          <boxGeometry args={[0.38, 0.08, 0.9]} />
          <meshStandardMaterial color="#4a2e1e" roughness={0.8} />
        </mesh>
      ))}

      {/* Continuous Slanted Handrails for Flight 2 */}
      <mesh position={[0, -5.5, 2.7]} rotation={[0, 0, 0.44]} castShadow>
        <boxGeometry args={[4.8, 0.06, 0.06]} />
        <meshStandardMaterial color="#24140b" />
      </mesh>

      {/* Continuous Slanted Handrails for Flight 3 */}
      <mesh position={[2.7, -3.3, 0]} rotation={[0.44, 0, 0]} castShadow>
        <boxGeometry args={[0.06, 0.06, 4.8]} />
        <meshStandardMaterial color="#24140b" />
      </mesh>

      {/* Continuous Slanted Handrails for Flight 4 */}
      <mesh position={[0, -1.1, -2.7]} rotation={[0, 0, -0.44]} castShadow>
        <boxGeometry args={[4.8, 0.06, 0.06]} />
        <meshStandardMaterial color="#24140b" />
      </mesh>
    </group>
  )
}
