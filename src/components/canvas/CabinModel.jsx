import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useCameraStore } from '../../stores/useCameraStore'
import { useTimeWeatherStore } from '../../stores/useTimeWeatherStore'

export function CabinModel() {
  const deskLampOn = useCameraStore((state) => state.deskLampOn)
  const weather = useTimeWeatherStore((state) => state.weather)

  const stoveEmberRef = useRef()
  const lanternLightRef = useRef()
  const steamParticlesRef = useRef()

  // Animate stove embers, kettle steam & lantern flicker
  useFrame((state, delta) => {
    if (stoveEmberRef.current) {
      const flicker = 0.85 + Math.sin(state.clock.elapsedTime * 6.5) * 0.15
      stoveEmberRef.current.intensity = flicker * 1.8
    }

    if (lanternLightRef.current) {
      const lanternFlicker = 1.0 + Math.sin(state.clock.elapsedTime * 3.2) * 0.08
      lanternLightRef.current.intensity = lanternFlicker * 1.6
    }

    if (steamParticlesRef.current) {
      const positions = steamParticlesRef.current.geometry.attributes.position.array
      for (let i = 1; i < positions.length; i += 3) {
        positions[i] += delta * 0.25
        if (positions[i] > 1.8) {
          positions[i] = 1.2
        }
      }
      steamParticlesRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  // Steam particle geometry
  const steamPositions = React.useMemo(() => {
    const pos = []
    for (let i = 0; i < 30; i++) {
      pos.push(
        -1.4 + (Math.random() - 0.5) * 0.08,
        1.25 + Math.random() * 0.4,
        -1.35 + (Math.random() - 0.5) * 0.08
      )
    }
    return new Float32Array(pos)
  }, [])

  return (
    <group position={[0, 0, 0]}>
      {/* --- Cabin Floor (Warm Wood Planks) --- */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <boxGeometry args={[4.6, 0.2, 4.6]} />
        <meshStandardMaterial color="#4a2e1e" roughness={0.7} metalness={0.05} />
      </mesh>

      {/* Decorative Floor Planks Lines */}
      {[-1.8, -1.2, -0.6, 0, 0.6, 1.2, 1.8].map((x, idx) => (
        <mesh key={`plank-${idx}`} position={[x, 0.102, 0]}>
          <boxGeometry args={[0.02, 0.005, 4.5]} />
          <meshStandardMaterial color="#2d1a0e" roughness={0.9} />
        </mesh>
      ))}

      {/* --- Outer Balcony (Wraparound Wooden Deck) --- */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <boxGeometry args={[7.4, 0.15, 7.4]} />
        <meshStandardMaterial color="#3b2416" roughness={0.8} />
      </mesh>

      {/* Balcony Railings */}
      {/* North */}
      <mesh position={[0, 0.6, -3.6]} castShadow>
        <boxGeometry args={[7.2, 0.08, 0.1]} />
        <meshStandardMaterial color="#2d1a0e" />
      </mesh>
      {/* South */}
      <mesh position={[0, 0.6, 3.6]} castShadow>
        <boxGeometry args={[7.2, 0.08, 0.1]} />
        <meshStandardMaterial color="#2d1a0e" />
      </mesh>
      {/* East */}
      <mesh position={[3.6, 0.6, 0]} castShadow>
        <boxGeometry args={[0.1, 0.08, 7.2]} />
        <meshStandardMaterial color="#2d1a0e" />
      </mesh>
      {/* West */}
      <mesh position={[-3.6, 0.6, 0]} castShadow>
        <boxGeometry args={[0.1, 0.08, 7.2]} />
        <meshStandardMaterial color="#2d1a0e" />
      </mesh>

      {/* Balcony Posts */}
      {[-3.5, -1.75, 0, 1.75, 3.5].map((x, i) => (
        <group key={`post-n-${i}`}>
          <mesh position={[x, 0.3, -3.6]} castShadow>
            <boxGeometry args={[0.08, 0.6, 0.08]} />
            <meshStandardMaterial color="#2d1a0e" />
          </mesh>
          <mesh position={[x, 0.3, 3.6]} castShadow>
            <boxGeometry args={[0.08, 0.6, 0.08]} />
            <meshStandardMaterial color="#2d1a0e" />
          </mesh>
        </group>
      ))}

      {/* --- Cabin Wooden Corner Pillars --- */}
      {[
        [-2.2, 1.4, -2.2],
        [2.2, 1.4, -2.2],
        [-2.2, 1.4, 2.2],
        [2.2, 1.4, 2.2]
      ].map((pos, idx) => (
        <mesh key={`pillar-${idx}`} position={pos} castShadow>
          <boxGeometry args={[0.18, 2.8, 0.18]} />
          <meshStandardMaterial color="#351f12" roughness={0.7} />
        </mesh>
      ))}

      {/* --- Cabin Half-Walls (Lower Waist Height) --- */}
      {/* North Wall Base */}
      <mesh position={[0, 0.45, -2.2]} castShadow receiveShadow>
        <boxGeometry args={[4.4, 0.9, 0.12]} />
        <meshStandardMaterial color="#543622" roughness={0.8} />
      </mesh>
      {/* South Wall Base */}
      <mesh position={[0, 0.45, 2.2]} castShadow receiveShadow>
        <boxGeometry args={[4.4, 0.9, 0.12]} />
        <meshStandardMaterial color="#543622" roughness={0.8} />
      </mesh>
      {/* West Wall Base */}
      <mesh position={[-2.2, 0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.12, 0.9, 4.4]} />
        <meshStandardMaterial color="#543622" roughness={0.8} />
      </mesh>
      {/* East Wall Base */}
      <mesh position={[2.2, 0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.12, 0.9, 4.4]} />
        <meshStandardMaterial color="#543622" roughness={0.8} />
      </mesh>

      {/* --- Large Panoramic Windows (Tinted Glass) --- */}
      {[
        [0, 1.8, -2.2, 4.2, 1.6, 0.04],
        [0, 1.8, 2.2, 4.2, 1.6, 0.04],
        [-2.2, 1.8, 0, 0.04, 1.6, 4.2],
        [2.2, 1.8, 0, 0.04, 1.6, 4.2]
      ].map(([x, y, z, w, h, d], i) => (
        <mesh key={`glass-${i}`} position={[x, y, z]}>
          <boxGeometry args={[w, h, d]} />
          <meshPhysicalMaterial
            color="#a8d4e6"
            transparent
            opacity={weather === 'rain' ? 0.32 : 0.18}
            roughness={weather === 'rain' ? 0.2 : 0.05}
            transmission={0.88}
            thickness={0.15}
          />
        </mesh>
      ))}

      {/* Window Muntin Frames (Horizontal and Vertical Crossbars) */}
      <mesh position={[0, 1.8, -2.2]}>
        <boxGeometry args={[4.3, 0.04, 0.06]} />
        <meshStandardMaterial color="#2a180d" />
      </mesh>
      <mesh position={[0, 1.8, 2.2]}>
        <boxGeometry args={[4.3, 0.04, 0.06]} />
        <meshStandardMaterial color="#2a180d" />
      </mesh>
      <mesh position={[-2.2, 1.8, 0]}>
        <boxGeometry args={[0.06, 0.04, 4.3]} />
        <meshStandardMaterial color="#2a180d" />
      </mesh>
      <mesh position={[2.2, 1.8, 0]}>
        <boxGeometry args={[0.06, 0.04, 4.3]} />
        <meshStandardMaterial color="#2a180d" />
      </mesh>

      {/* --- Timber Ceiling Rafters & Roof --- */}
      <mesh position={[0, 2.75, 0]} castShadow receiveShadow>
        <boxGeometry args={[5.4, 0.18, 5.4]} />
        <meshStandardMaterial color="#41291b" roughness={0.9} />
      </mesh>
      {/* Diagonal Roof Beams */}
      <mesh position={[0, 2.65, 0]} rotation={[0, Math.PI / 4, 0]}>
        <boxGeometry args={[5.8, 0.08, 0.12]} />
        <meshStandardMaterial color="#2e1a0f" />
      </mesh>
      <mesh position={[0, 2.65, 0]} rotation={[0, -Math.PI / 4, 0]}>
        <boxGeometry args={[5.8, 0.08, 0.12]} />
        <meshStandardMaterial color="#2e1a0f" />
      </mesh>
      {/* Green Metal Roof Pyramid Cap */}
      <mesh position={[0, 3.0, 0]} castShadow>
        <coneGeometry args={[4.0, 0.7, 4]} rotation={[0, Math.PI / 4, 0]} />
        <meshStandardMaterial color="#1e382b" roughness={0.5} metalness={0.2} />
      </mesh>

      {/* --- Central Hanging Brass Lantern --- */}
      <group position={[0, 2.3, 0]}>
        {/* Chain */}
        <mesh position={[0, 0.25, 0]}>
          <cylinderGeometry args={[0.01, 0.01, 0.5, 8]} />
          <meshStandardMaterial color="#111" />
        </mesh>
        {/* Lantern Casing */}
        <mesh position={[0, -0.05, 0]} castShadow>
          <cylinderGeometry args={[0.12, 0.15, 0.25, 8]} />
          <meshStandardMaterial color="#8a5a2b" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Glowing Lantern Glass Core */}
        <mesh position={[0, -0.05, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.18, 8]} />
          <meshBasicMaterial color="#ffc107" />
        </mesh>
        <pointLight
          ref={lanternLightRef}
          position={[0, -0.1, 0]}
          color="#ffb74d"
          intensity={1.6}
          distance={7.0}
        />
      </group>

      {/* --- Central Osborne Fire Finder Table --- */}
      <group position={[0, 0.9, 0]}>
        {/* Pedestal Stand */}
        <mesh position={[0, -0.45, 0]} castShadow>
          <cylinderGeometry args={[0.12, 0.2, 0.9, 16]} />
          <meshStandardMaterial color="#1a1c1e" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Brass Circular Map Table */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.55, 0.55, 0.06, 32]} />
          <meshStandardMaterial color="#d4a359" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Top Topographical Disc & Sighting Vane */}
        <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.5, 32]} />
          <meshStandardMaterial color="#e8d8b0" roughness={0.9} />
        </mesh>
        {/* Compass Rose Ring Markings */}
        <mesh position={[0, 0.045, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.42, 0.48, 32]} />
          <meshBasicMaterial color="#8b5a2b" />
        </mesh>
        {/* Brass Sighting Ring Arm */}
        <mesh position={[0, 0.07, 0]} rotation={[0, 0.8, 0]} castShadow>
          <boxGeometry args={[1.05, 0.02, 0.04]} />
          <meshStandardMaterial color="#b38234" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* --- Ranger Work Desk (North-East Corner) --- */}
      <group position={[0.4, 0, -1.35]}>
        {/* Table Top */}
        <mesh position={[0, 0.82, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.7, 0.06, 0.85]} />
          <meshStandardMaterial color="#693d25" roughness={0.6} />
        </mesh>
        {/* Table Legs */}
        {[
          [-0.75, 0.4, -0.35],
          [0.75, 0.4, -0.35],
          [-0.75, 0.4, 0.35],
          [0.75, 0.4, 0.35]
        ].map((pos, idx) => (
          <mesh key={`desk-leg-${idx}`} position={pos} castShadow>
            <boxGeometry args={[0.07, 0.8, 0.07]} />
            <meshStandardMaterial color="#402414" />
          </mesh>
        ))}

        {/* Vintage Desk Lamp (Gooseneck Brass) */}
        <group position={[0.55, 0.85, -0.2]}>
          <mesh position={[0, 0.02, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.09, 0.03, 16]} />
            <meshStandardMaterial color="#b3863b" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.18, 0]} castShadow>
            <cylinderGeometry args={[0.015, 0.015, 0.3, 8]} />
            <meshStandardMaterial color="#b3863b" metalness={0.8} />
          </mesh>
          <mesh position={[-0.05, 0.3, 0]} rotation={[0, 0, 0.5]} castShadow>
            <coneGeometry args={[0.08, 0.12, 16]} />
            <meshStandardMaterial color="#1f4037" roughness={0.4} />
          </mesh>
          {/* Desk Lamp Light */}
          {deskLampOn && (
            <pointLight
              position={[-0.05, 0.26, 0]}
              color="#ffba66"
              intensity={2.8}
              distance={4.5}
              castShadow
            />
          )}
        </group>

        {/* Vintage Radio Transceiver */}
        <group position={[-0.45, 0.85, -0.15]}>
          <mesh position={[0, 0.1, 0]} castShadow>
            <boxGeometry args={[0.38, 0.2, 0.22]} />
            <meshStandardMaterial color="#303b36" roughness={0.5} />
          </mesh>
          {/* Frequency Dial */}
          <mesh position={[0.08, 0.1, 0.12]} rotation={[Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.04, 16]} />
            <meshStandardMaterial color="#d4cbb8" />
          </mesh>
          {/* Microphone cable & handset */}
          <mesh position={[-0.1, 0.08, 0.12]}>
            <boxGeometry args={[0.06, 0.12, 0.04]} />
            <meshStandardMaterial color="#181818" />
          </mesh>
          {/* Glowing Green Status LED */}
          <mesh position={[0.14, 0.16, 0.11]}>
            <sphereGeometry args={[0.012, 8, 8]} />
            <meshBasicMaterial color="#34d399" />
          </mesh>
        </group>

        {/* Open Leather Journal & Pencil */}
        <group position={[0.05, 0.86, 0.05]} rotation={[0, -0.1, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.34, 0.02, 0.24]} />
            <meshStandardMaterial color="#613318" roughness={0.9} />
          </mesh>
          {/* Paper Pages */}
          <mesh position={[0, 0.015, 0]}>
            <boxGeometry args={[0.32, 0.01, 0.22]} />
            <meshStandardMaterial color="#f7f0df" roughness={0.95} />
          </mesh>
        </group>

        {/* Steaming Ceramic Mug */}
        <group position={[-0.15, 0.85, 0.2]}>
          <mesh position={[0, 0.05, 0]} castShadow>
            <cylinderGeometry args={[0.045, 0.04, 0.1, 16]} />
            <meshStandardMaterial color="#dfd8c8" roughness={0.3} />
          </mesh>
          {/* Hot Cocoa / Coffee Surface */}
          <mesh position={[0, 0.09, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.038, 16]} />
            <meshStandardMaterial color="#3d2314" roughness={0.1} />
          </mesh>
        </group>

        {/* Books & Field Guides Stack */}
        <group position={[0.55, 0.85, 0.2]}>
          <mesh position={[0, 0.02, 0]} castShadow>
            <boxGeometry args={[0.22, 0.04, 0.16]} />
            <meshStandardMaterial color="#2d4a3e" />
          </mesh>
          <mesh position={[0, 0.05, 0]} rotation={[0, 0.1, 0]} castShadow>
            <boxGeometry args={[0.2, 0.03, 0.15]} />
            <meshStandardMaterial color="#8b3a2b" />
          </mesh>
        </group>
      </group>

      {/* --- Cork Bulletin Board on South Wall with Pinned Notes --- */}
      <group position={[0.8, 1.4, 2.15]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.2, 0.7, 0.04]} />
          <meshStandardMaterial color="#b38a5b" roughness={0.95} />
        </mesh>
        {/* Frame */}
        <mesh position={[0, 0, -0.01]}>
          <boxGeometry args={[1.26, 0.76, 0.02]} />
          <meshStandardMaterial color="#3d2314" />
        </mesh>
        {/* Pinned Map / Notes */}
        <mesh position={[-0.3, 0.05, 0.025]}>
          <planeGeometry args={[0.35, 0.45]} />
          <meshStandardMaterial color="#f0e6d2" />
        </mesh>
        <mesh position={[0.25, -0.05, 0.025]} rotation={[0, 0, -0.1]}>
          <planeGeometry args={[0.3, 0.3]} />
          <meshStandardMaterial color="#fff8e7" />
        </mesh>
      </group>

      {/* --- Cast-Iron Woodstove (North-West Corner) --- */}
      <group position={[-1.4, 0, -1.35]}>
        {/* Stove Body */}
        <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.3, 0.32, 0.9, 16]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.7} roughness={0.4} />
        </mesh>
        {/* Glowing Ember Window */}
        <mesh position={[0, 0.45, 0.3]}>
          <planeGeometry args={[0.18, 0.18]} />
          <meshBasicMaterial color="#ff5722" />
        </mesh>
        <pointLight
          ref={stoveEmberRef}
          position={[0, 0.45, 0.35]}
          color="#ff7a29"
          intensity={1.8}
          distance={3.5}
        />
        {/* Stovepipe Chimney going through roof */}
        <mesh position={[0, 1.7, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 1.8, 16]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Enamel Boiling Kettle on Stove Top */}
        <group position={[0, 0.95, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.1, 0.12, 0.14, 16]} />
            <meshStandardMaterial color="#8a2020" roughness={0.4} metalness={0.2} />
          </mesh>
        </group>
      </group>

      {/* Gentle Steam Particles from Kettle */}
      <points ref={steamParticlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={30}
            array={steamPositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.06}
          color="#ffffff"
          transparent
          opacity={0.4}
          depthWrite={false}
        />
      </points>

      {/* --- Brass Binoculars / Spotting Scope on Tripod (Facing North-West) --- */}
      <group position={[0, 0, -1.85]} rotation={[0, -0.3, 0]}>
        {/* Tripod Legs */}
        {[-0.2, 0, 0.2].map((x, idx) => (
          <mesh
            key={`tripod-${idx}`}
            position={[x * 0.7, 0.7, x * 0.4]}
            rotation={[0.15, 0, -x * 0.6]}
            castShadow
          >
            <cylinderGeometry args={[0.015, 0.015, 1.4, 8]} />
            <meshStandardMaterial color="#2d2d2d" metalness={0.7} />
          </mesh>
        ))}
        {/* Scope Optical Tube */}
        <mesh position={[0, 1.42, 0]} rotation={[-0.05, 0, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.08, 0.6, 16]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial color="#c29b38" metalness={0.85} roughness={0.2} />
        </mesh>
      </group>

      {/* --- Firewood Basket next to Stove --- */}
      <group position={[-1.7, 0, -0.6]}>
        <mesh position={[0, 0.15, 0]} castShadow>
          <cylinderGeometry args={[0.22, 0.18, 0.3, 12]} />
          <meshStandardMaterial color="#4a2e1e" roughness={0.9} />
        </mesh>
        {/* Birch Firewood Logs */}
        {[-0.08, 0, 0.08].map((x, i) => (
          <mesh key={`log-${i}`} position={[x, 0.28, 0]} rotation={[0.2, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.04, 0.04, 0.3, 8]} />
            <meshStandardMaterial color="#c2a784" roughness={0.8} />
          </mesh>
        ))}
      </group>

      {/* --- Emergency Fire Axe Mounted on Wall Case --- */}
      <group position={[-2.15, 1.4, 1.2]} rotation={[0, Math.PI / 2, 0]}>
        <mesh castShadow>
          <boxGeometry args={[0.9, 0.4, 0.08]} />
          <meshStandardMaterial color="#8a2020" roughness={0.6} />
        </mesh>
        {/* Glass Front */}
        <mesh position={[0, 0, 0.045]}>
          <planeGeometry args={[0.8, 0.3]} />
          <meshPhysicalMaterial color="#ffffff" transparent opacity={0.3} roughness={0.1} />
        </mesh>
        {/* Axe Handle */}
        <mesh position={[0, 0, 0.02]} rotation={[0, 0, 0.1]}>
          <cylinderGeometry args={[0.015, 0.02, 0.7, 8]} />
          <meshStandardMaterial color="#d4a359" />
        </mesh>
        {/* Axe Red Steel Head */}
        <mesh position={[0.25, 0.05, 0.02]} rotation={[0, 0, -0.2]}>
          <boxGeometry args={[0.16, 0.1, 0.03]} />
          <meshStandardMaterial color="#b91c1c" metalness={0.7} roughness={0.3} />
        </mesh>
      </group>

      {/* --- Cozy Southwestern Aztec Pattern Floor Rug --- */}
      <group position={[0.2, 0.105, -0.3]} rotation={[-Math.PI / 2, 0, 0]}>
        <mesh receiveShadow>
          <planeGeometry args={[2.4, 1.8]} />
          <meshStandardMaterial color="#993d24" roughness={0.95} />
        </mesh>
        {/* Diamond Geometric Borders */}
        <mesh position={[0, 0, 0.002]}>
          <ringGeometry args={[0.4, 0.6, 4]} />
          <meshBasicMaterial color="#d4a359" />
        </mesh>
      </group>

      {/* --- Supply Shelf with Canned Food & Field Radio Battery --- */}
      <group position={[2.14, 1.3, -1.0]}>
        {/* Wooden Shelf */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.1, 0.04, 1.4]} />
          <meshStandardMaterial color="#4a2e1e" />
        </mesh>
        {/* Canned Peaches & Beans */}
        {[-0.45, -0.3, -0.15, 0.15, 0.35].map((z, idx) => (
          <mesh key={`can-${idx}`} position={[0, 0.08, z]} castShadow>
            <cylinderGeometry args={[0.04, 0.04, 0.1, 12]} />
            <meshStandardMaterial color={idx % 2 === 0 ? '#f59e0b' : '#3b82f6'} metalness={0.6} roughness={0.3} />
          </mesh>
        ))}
      </group>

      {/* --- Roof Communication Mast Antenna & Beacon --- */}
      <group position={[1.8, 3.2, -1.8]}>
        {/* Steel Mast */}
        <mesh castShadow>
          <cylinderGeometry args={[0.03, 0.05, 3.2, 8]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
        </mesh>
        {/* Crossbars */}
        <mesh position={[0, 0.8, 0]}>
          <boxGeometry args={[0.6, 0.02, 0.02]} />
          <meshStandardMaterial color="#64748b" />
        </mesh>
        <mesh position={[0, 1.3, 0]}>
          <boxGeometry args={[0.4, 0.02, 0.02]} />
          <meshStandardMaterial color="#64748b" />
        </mesh>
        {/* Blinking Red Aviation Beacon on Mast Tip */}
        <mesh position={[0, 1.6, 0]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshBasicMaterial color="#ef4444" />
        </mesh>
        <pointLight position={[0, 1.6, 0]} color="#ef4444" intensity={1.5} distance={8} />
      </group>

      {/* --- Ranger Swivel Chair --- */}
      <group position={[0.4, 0, -0.75]}>
        {/* Chair Base */}
        <mesh position={[0, 0.45, 0]} castShadow>
          <boxGeometry args={[0.45, 0.08, 0.45]} />
          <meshStandardMaterial color="#382013" />
        </mesh>
        <mesh position={[0, 0.7, -0.2]} castShadow>
          <boxGeometry args={[0.45, 0.5, 0.06]} />
          <meshStandardMaterial color="#382013" />
        </mesh>
      </group>
    </group>
  )
}
