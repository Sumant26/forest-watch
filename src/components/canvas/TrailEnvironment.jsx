import React from 'react'
import { TowerStairsAndDeck } from './TowerStairsAndDeck'

export function TrailEnvironment() {
  // Trail curve points from trailhead to tower base
  const trailSegments = [
    // Segment 1: Trailhead canyon path
    { pos: [-12, -8.65, 48], rot: [0, 0.4, 0], scale: [2.5, 0.05, 12] },
    { pos: [-8, -8.65, 38], rot: [0, 0.2, 0], scale: [2.5, 0.05, 10] },
    // Segment 2: Approaching Meadow Creek bridge
    { pos: [-4, -8.65, 30], rot: [0, -0.1, 0], scale: [2.4, 0.05, 8] },
    // Segment 3: Past bridge to switchback base
    { pos: [-1, -8.65, 18], rot: [0, 0.3, 0], scale: [2.2, 0.05, 12] },
    // Segment 4: Tower base clearing
    { pos: [0, -8.65, 6], rot: [0, 0, 0], scale: [5.0, 0.05, 8] }
  ]

  return (
    <group position={[0, 0, 0]}>
      {/* 4-Flight Tower Stairs */}
      <TowerStairsAndDeck />

      {/* --- Winding Dirt Trail Segments --- */}
      {trailSegments.map((seg, idx) => (
        <mesh
          key={`trail-${idx}`}
          position={seg.pos}
          rotation={seg.rot}
          scale={seg.scale}
          receiveShadow
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#6e5033" roughness={0.98} />
        </mesh>
      ))}

      {/* --- Wooden Footbridge over Meadow Creek (Z = 24 to 26) --- */}
      <group position={[-2, -8.5, 25]} rotation={[0, -0.2, 0]}>
        {/* Bridge Planks Deck */}
        <mesh position={[0, 0.08, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.2, 0.12, 5.5]} />
          <meshStandardMaterial color="#4a2e1e" roughness={0.85} />
        </mesh>
        {/* Bridge Log Stringers */}
        <mesh position={[-1.0, -0.05, 0]} castShadow>
          <cylinderGeometry args={[0.15, 0.15, 5.6, 8]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial color="#2d1a0e" roughness={0.9} />
        </mesh>
        <mesh position={[1.0, -0.05, 0]} castShadow>
          <cylinderGeometry args={[0.15, 0.15, 5.6, 8]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial color="#2d1a0e" roughness={0.9} />
        </mesh>
        {/* Bridge Railings */}
        {[-1.05, 1.05].map((x, i) => (
          <group key={`bridge-rail-${i}`}>
            <mesh position={[x, 0.5, 0]} castShadow>
              <boxGeometry args={[0.08, 0.08, 5.5]} />
              <meshStandardMaterial color="#3b2416" />
            </mesh>
            {[-2.2, -0.7, 0.7, 2.2].map((z, j) => (
              <mesh key={`post-${j}`} position={[x, 0.25, z]} castShadow>
                <boxGeometry args={[0.08, 0.5, 0.08]} />
                <meshStandardMaterial color="#3b2416" />
              </mesh>
            ))}
          </group>
        ))}
      </group>

      {/* --- Trail Directional Signs --- */}
      {/* Sign 1: Trailhead Start Sign */}
      <group position={[-10.5, -8.6, 46]} rotation={[0, 0.6, 0]}>
        <mesh position={[0, 0.6, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 1.2, 8]} />
          <meshStandardMaterial color="#2d1a0e" />
        </mesh>
        {/* Signboard */}
        <mesh position={[0, 1.0, 0]} castShadow>
          <boxGeometry args={[0.8, 0.35, 0.05]} />
          <meshStandardMaterial color="#543622" />
        </mesh>
        {/* Sign Text Bar */}
        <mesh position={[0, 1.0, 0.03]}>
          <planeGeometry args={[0.7, 0.25]} />
          <meshBasicMaterial color="#d4a359" />
        </mesh>
      </group>

      {/* Sign 2: Creek Bridge Marker */}
      <group position={[-3.6, -8.6, 27]} rotation={[0, -0.3, 0]}>
        <mesh position={[0, 0.5, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 1.0, 8]} />
          <meshStandardMaterial color="#2d1a0e" />
        </mesh>
        <mesh position={[0, 0.85, 0]} castShadow>
          <boxGeometry args={[0.7, 0.25, 0.04]} />
          <meshStandardMaterial color="#543622" />
        </mesh>
      </group>

      {/* Sign 3: Tower Base Sign */}
      <group position={[-1.8, -8.6, 4]} rotation={[0, 0.8, 0]}>
        <mesh position={[0, 0.6, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 1.2, 8]} />
          <meshStandardMaterial color="#2d1a0e" />
        </mesh>
        <mesh position={[0, 1.0, 0]} castShadow>
          <boxGeometry args={[0.85, 0.35, 0.05]} />
          <meshStandardMaterial color="#543622" />
        </mesh>
      </group>

      {/* --- Wildflowers along the Trail (Fireweed & Lupine) --- */}
      {[
        [-10, -8.55, 44, '#d946ef'],
        [-11.5, -8.55, 41, '#818cf8'],
        [-6.5, -8.55, 36, '#facc15'],
        [-3.2, -8.55, 32, '#d946ef'],
        [-5.5, -8.55, 22, '#818cf8'],
        [1.5, -8.55, 14, '#facc15'],
        [-2.0, -8.55, 9, '#d946ef'],
        [2.5, -8.55, 5, '#818cf8']
      ].map(([x, y, z, color], idx) => (
        <group key={`flower-patch-${idx}`} position={[x, y, z]}>
          {[
            [-0.2, 0.15, -0.1],
            [0.2, 0.18, 0.15],
            [0, 0.22, 0]
          ].map(([fx, fy, fz], fIdx) => (
            <mesh key={`stem-${fIdx}`} position={[fx, fy, fz]}>
              <cylinderGeometry args={[0.04, 0.01, 0.25, 5]} />
              <meshBasicMaterial color={color} />
            </mesh>
          ))}
        </group>
      ))}

      {/* --- Trail Stone Cairns (Stacked River Stones) --- */}
      {[
        [-9.5, -8.6, 45],
        [-0.5, -8.6, 20]
      ].map((pos, cIdx) => (
        <group key={`cairn-${cIdx}`} position={pos}>
          <mesh position={[0, 0.1, 0]} castShadow>
            <dodecahedronGeometry args={[0.22, 0]} />
            <meshStandardMaterial color="#64748b" roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.28, 0]} castShadow>
            <dodecahedronGeometry args={[0.16, 0]} />
            <meshStandardMaterial color="#64748b" roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.42, 0]} castShadow>
            <dodecahedronGeometry args={[0.11, 0]} />
            <meshStandardMaterial color="#78716c" roughness={0.9} />
          </mesh>
        </group>
      ))}

      {/* --- Trailside Rocks & Boulders --- */}
      {[
        [-14, -8.4, 45, 1.8],
        [-9, -8.4, 32, 1.4],
        [2, -8.4, 22, 1.9],
        [-3.5, -8.4, 10, 1.6],
        [3.5, -8.4, 2, 2.2]
      ].map(([x, y, z, s], idx) => (
        <mesh key={`rock-${idx}`} position={[x, y, z]} scale={[s, s * 0.7, s]} castShadow receiveShadow>
          <dodecahedronGeometry args={[0.8, 0]} />
          <meshStandardMaterial color="#475569" roughness={0.9} />
        </mesh>
      ))}

      {/* --- Fallen Mossy Pine Logs --- */}
      <mesh position={[-7, -8.5, 28]} rotation={[0.2, 0.8, 0.1]} castShadow receiveShadow>
        <cylinderGeometry args={[0.22, 0.28, 4.2, 8]} rotation={[0, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#2d1c12" roughness={0.95} />
      </mesh>
    </group>
  )
}
