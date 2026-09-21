import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useSettingsStore, QUALITY_CONFIGS } from '../../stores/useSettingsStore'

export function TerrainEnvironment() {
  const quality = useSettingsStore((state) => state.quality)
  const qualityConfig = QUALITY_CONFIGS[quality] || QUALITY_CONFIGS.high
  const treeCount = qualityConfig.treeCount

  const geyserSteamRef = useRef()
  const campfireSmokeRef = useRef()
  const birdsGroupRef = useRef()

  // Generate Instanced Pine Tree matrices
  const treeInstances = useMemo(() => {
    const matrices = []
    const dummy = new THREE.Object3D()
    
    // Distribute pine trees on valley slopes and distant ridges
    for (let i = 0; i < treeCount; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = 12 + Math.random() * 140 // Don't block immediate tower view
      const x = Math.cos(angle) * radius
      const z = Math.sin(angle) * radius
      
      // Terrain height approximation
      let y = -2 - Math.sin(radius * 0.05) * 4 - Math.cos(angle * 3) * 6
      if (radius > 80) y += (radius - 80) * 0.25 // Mountain slopes rising

      const scale = 0.8 + Math.random() * 0.9
      dummy.position.set(x, y, z)
      dummy.scale.set(scale, scale * (0.9 + Math.random() * 0.4), scale)
      dummy.rotation.set(0, Math.random() * Math.PI * 2, (Math.random() - 0.5) * 0.1)
      dummy.updateMatrix()
      matrices.push(dummy.matrix.clone())
    }
    return matrices
  }, [treeCount])

  // Setup instanced mesh matrices
  const instancedMeshRef = useRef()
  React.useEffect(() => {
    if (instancedMeshRef.current) {
      treeInstances.forEach((mat, i) => {
        instancedMeshRef.current.setMatrixAt(i, mat)
      })
      instancedMeshRef.current.instanceMatrix.needsUpdate = true
    }
  }, [treeInstances])

  // Animate thermal steam, campfire smoke, and birds circling
  useFrame((state, delta) => {
    if (geyserSteamRef.current) {
      const pos = geyserSteamRef.current.geometry.attributes.position.array
      for (let i = 1; i < pos.length; i += 3) {
        pos[i] += delta * 4.0
        pos[i - 1] += Math.sin(state.clock.elapsedTime + i) * 0.08
        if (pos[i] > 25) {
          pos[i] = -2
        }
      }
      geyserSteamRef.current.geometry.attributes.position.needsUpdate = true
    }

    if (campfireSmokeRef.current) {
      const pos = campfireSmokeRef.current.geometry.attributes.position.array
      for (let i = 1; i < pos.length; i += 3) {
        pos[i] += delta * 3.2
        pos[i - 1] += Math.cos(state.clock.elapsedTime + i) * 0.06
        if (pos[i] > 20) {
          pos[i] = -4
        }
      }
      campfireSmokeRef.current.geometry.attributes.position.needsUpdate = true
    }

    if (birdsGroupRef.current) {
      birdsGroupRef.current.rotation.y += delta * 0.08
    }
  })

  // Geyser Steam Particle positions
  const geyserPositions = useMemo(() => {
    const pos = []
    for (let i = 0; i < 80; i++) {
      pos.push(
        -55 + (Math.random() - 0.5) * 6,
        -2 + Math.random() * 25,
        -15 + (Math.random() - 0.5) * 6
      )
    }
    return new Float32Array(pos)
  }, [])

  // Campfire Smoke Particle positions
  const smokePositions = useMemo(() => {
    const pos = []
    for (let i = 0; i < 60; i++) {
      pos.push(
        35 + (Math.random() - 0.5) * 4,
        -4 + Math.random() * 20,
        45 + (Math.random() - 0.5) * 4
      )
    }
    return new Float32Array(pos)
  }, [])

  return (
    <group>
      {/* --- Tower Support Trestles (High Stilts) --- */}
      <group position={[0, -5, 0]}>
        {/* Main 4 Stilt Legs */}
        {[
          [-1.8, 0, -1.8],
          [1.8, 0, -1.8],
          [-1.8, 0, 1.8],
          [1.8, 0, 1.8]
        ].map((pos, idx) => (
          <mesh key={`stilt-${idx}`} position={pos} castShadow>
            <cylinderGeometry args={[0.15, 0.22, 10, 8]} />
            <meshStandardMaterial color="#301d12" roughness={0.9} />
          </mesh>
        ))}
        {/* Cross Bracing */}
        <mesh position={[0, 0, -1.8]} rotation={[0, 0, 0.4]}>
          <boxGeometry args={[4.2, 0.1, 0.1]} />
          <meshStandardMaterial color="#24140b" />
        </mesh>
        <mesh position={[0, 0, -1.8]} rotation={[0, 0, -0.4]}>
          <boxGeometry args={[4.2, 0.1, 0.1]} />
          <meshStandardMaterial color="#24140b" />
        </mesh>
      </group>

      {/* --- Mountain Terrain Ridges (Stylized Tiered Silhouettes) --- */}
      {/* Central Valley Ground */}
      <mesh position={[0, -9, 0]} receiveShadow>
        <cylinderGeometry args={[180, 180, 2, 48]} />
        <meshStandardMaterial color="#213327" roughness={0.95} />
      </mesh>

      {/* Distant Mountain Ridge Layers */}
      {/* North-West Ridge (Thorofare Ridge) */}
      <mesh position={[-70, 8, -90]} rotation={[0, 0.4, 0]}>
        <coneGeometry args={[55, 38, 5]} />
        <meshStandardMaterial color="#1a2822" roughness={0.9} />
      </mesh>
      {/* North Ridge */}
      <mesh position={[20, 14, -120]}>
        <coneGeometry args={[75, 48, 6]} />
        <meshStandardMaterial color="#18241e" roughness={0.9} />
      </mesh>
      {/* South-West Ridge (Granite Peak Summit) */}
      <mesh position={[-30, 22, 110]} rotation={[0, -0.6, 0]}>
        <coneGeometry args={[65, 62, 5]} />
        <meshStandardMaterial color="#24222b" roughness={0.8} />
      </mesh>
      {/* East Ridge */}
      <mesh position={[95, 12, -20]} rotation={[0, 0.8, 0]}>
        <coneGeometry args={[60, 42, 5]} />
        <meshStandardMaterial color="#1d2e24" roughness={0.9} />
      </mesh>

      {/* --- Emerald Lake & Meadow Creek Water --- */}
      <mesh position={[38, -8.6, 35]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[22, 32]} />
        <meshStandardMaterial color="#1e4e5f" roughness={0.1} metalness={0.8} />
      </mesh>
      <mesh position={[18, -8.7, -40]} rotation={[-Math.PI / 2, 0, 0.6]}>
        <planeGeometry args={[14, 75]} />
        <meshStandardMaterial color="#235c6e" roughness={0.15} metalness={0.7} />
      </mesh>

      {/* --- Instanced Stylized Pine Trees --- */}
      <instancedMesh
        ref={instancedMeshRef}
        args={[null, null, treeCount]}
        castShadow={qualityConfig.shadows}
        receiveShadow
      >
        <coneGeometry args={[1.4, 6.5, 5]} />
        <meshStandardMaterial color="#193324" roughness={0.9} />
      </instancedMesh>

      {/* --- Distant Landmark: Thorofare Lookout Tower (~315°) --- */}
      <group position={[-55, 16, -65]}>
        <mesh castShadow>
          <boxGeometry args={[3, 3, 3]} />
          <meshStandardMaterial color="#543622" />
        </mesh>
        <mesh position={[0, 2.2, 0]}>
          <coneGeometry args={[2.5, 1.4, 4]} />
          <meshStandardMaterial color="#1d402b" />
        </mesh>
        {/* Thorofare Mast Light */}
        <pointLight position={[0, 3.5, 0]} color="#facc15" intensity={1.5} distance={30} />
      </group>

      {/* --- Distant Landmark: West Geyser Basin Thermal Steam (~275°) --- */}
      <group position={[-55, -2, -15]}>
        <mesh position={[0, -0.5, 0]}>
          <cylinderGeometry args={[12, 14, 1, 16]} />
          <meshStandardMaterial color="#8a8575" roughness={0.95} />
        </mesh>
        <points ref={geyserSteamRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={80}
              array={geyserPositions}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            size={1.4}
            color="#e2e8f0"
            transparent
            opacity={0.65}
            depthWrite={false}
          />
        </points>
      </group>

      {/* --- Distant Landmark: Meadow Creek Elk Herd (~45°) --- */}
      <group position={[28, -7.5, -35]}>
        {/* Bull Elk Silhouette */}
        <mesh position={[0, 1.2, 0]} castShadow>
          <boxGeometry args={[1.8, 1.2, 0.8]} />
          <meshStandardMaterial color="#4a2810" roughness={0.9} />
        </mesh>
        {/* Antlers */}
        <mesh position={[0.8, 2.1, 0]} rotation={[0, 0, 0.3]}>
          <boxGeometry args={[0.2, 1.2, 1.4]} />
          <meshStandardMaterial color="#7a5230" />
        </mesh>
        {/* Cow Elk */}
        <mesh position={[-2.5, 1.0, 1.2]} castShadow>
          <boxGeometry args={[1.5, 1.0, 0.6]} />
          <meshStandardMaterial color="#5c3619" roughness={0.9} />
        </mesh>
      </group>

      {/* --- Distant Landmark: Campfire Smoke Plume (~120°) --- */}
      <group position={[35, -4, 45]}>
        <points ref={campfireSmokeRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={60}
              array={smokePositions}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            size={1.2}
            color="#94a3b8"
            transparent
            opacity={0.5}
            depthWrite={false}
          />
        </points>
      </group>

      {/* --- Circling Birds in the Horizon Sky --- */}
      <group ref={birdsGroupRef} position={[0, 18, 0]}>
        {[
          [35, 2, -20],
          [38, 2.5, -23],
          [32, 1.8, -18]
        ].map((pos, idx) => (
          <mesh key={`bird-${idx}`} position={pos} rotation={[0, 1.2, 0.3]}>
            <boxGeometry args={[0.8, 0.05, 0.2]} />
            <meshBasicMaterial color="#1a1c1e" />
          </mesh>
        ))}
      </group>
    </group>
  )
}
