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
  const waterfallMistRef = useRef()
  const birdsGroupRef = useRef()
  const floatingSporesRef = useRef()

  // Generate Instanced Pine Tree matrices for 3 distinct foliage tiers and trunks
  const { tier1Matrices, tier2Matrices, tier3Matrices, trunkMatrices, aspenMatrices } = useMemo(() => {
    const t1 = []
    const t2 = []
    const t3 = []
    const trunks = []
    const aspens = []
    const dummy = new THREE.Object3D()
    
    // Distribute pine trees on valley slopes, ridges, and riverbanks
    for (let i = 0; i < treeCount; i++) {
      const angle = (i / treeCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.4
      const radius = 10 + Math.pow(Math.random(), 1.4) * 150
      const x = Math.cos(angle) * radius
      const z = Math.sin(angle) * radius
      
      // Avoid placing directly on trail corridor
      if (Math.abs(x) < 3.5 && z > 0 && z < 55) continue

      // Terrain height approximation
      let y = -8.6
      if (radius > 20) {
        y += Math.sin(radius * 0.08) * 3 + Math.cos(angle * 4) * 4
      }
      if (radius > 70) {
        y += (radius - 70) * 0.35 // Rising mountain slopes
      }

      const scale = 0.75 + Math.random() * 0.7
      const rotY = Math.random() * Math.PI * 2
      const lean = (Math.random() - 0.5) * 0.08

      // Is it a golden autumn aspen or evergreen pine?
      if (i % 6 === 0 && radius < 60) {
        // Aspen Tree
        dummy.position.set(x, y + 2.5 * scale, z)
        dummy.scale.set(scale * 1.1, scale * 1.2, scale * 1.1)
        dummy.rotation.set(lean, rotY, lean)
        dummy.updateMatrix()
        aspens.push(dummy.matrix.clone())
      } else {
        // Pine Tree Trunk
        dummy.position.set(x, y + 1.2 * scale, z)
        dummy.scale.set(scale, scale, scale)
        dummy.rotation.set(lean, rotY, lean)
        dummy.updateMatrix()
        trunks.push(dummy.matrix.clone())

        // Foliage Tier 1 (Bottom wide skirt)
        dummy.position.set(x, y + (2.4 * scale), z)
        dummy.scale.set(scale * 1.35, scale * 0.9, scale * 1.35)
        dummy.updateMatrix()
        t1.push(dummy.matrix.clone())

        // Foliage Tier 2 (Middle cone)
        dummy.position.set(x, y + (4.0 * scale), z)
        dummy.scale.set(scale * 1.05, scale * 0.85, scale * 1.05)
        dummy.updateMatrix()
        t2.push(dummy.matrix.clone())

        // Foliage Tier 3 (Top crown tip)
        dummy.position.set(x, y + (5.4 * scale), z)
        dummy.scale.set(scale * 0.75, scale * 0.85, scale * 0.75)
        dummy.updateMatrix()
        t3.push(dummy.matrix.clone())
      }
    }

    return {
      tier1Matrices: t1,
      tier2Matrices: t2,
      tier3Matrices: t3,
      trunkMatrices: trunks,
      aspenMatrices: aspens
    }
  }, [treeCount])

  // Setup instanced mesh references
  const meshT1Ref = useRef()
  const meshT2Ref = useRef()
  const meshT3Ref = useRef()
  const meshTrunkRef = useRef()
  const meshAspenRef = useRef()

  React.useEffect(() => {
    if (meshT1Ref.current) {
      tier1Matrices.forEach((mat, i) => meshT1Ref.current.setMatrixAt(i, mat))
      meshT1Ref.current.instanceMatrix.needsUpdate = true
    }
    if (meshT2Ref.current) {
      tier2Matrices.forEach((mat, i) => meshT2Ref.current.setMatrixAt(i, mat))
      meshT2Ref.current.instanceMatrix.needsUpdate = true
    }
    if (meshT3Ref.current) {
      tier3Matrices.forEach((mat, i) => meshT3Ref.current.setMatrixAt(i, mat))
      meshT3Ref.current.instanceMatrix.needsUpdate = true
    }
    if (meshTrunkRef.current) {
      trunkMatrices.forEach((mat, i) => meshTrunkRef.current.setMatrixAt(i, mat))
      meshTrunkRef.current.instanceMatrix.needsUpdate = true
    }
    if (meshAspenRef.current) {
      aspenMatrices.forEach((mat, i) => meshAspenRef.current.setMatrixAt(i, mat))
      meshAspenRef.current.instanceMatrix.needsUpdate = true
    }
  }, [tier1Matrices, tier2Matrices, tier3Matrices, trunkMatrices, aspenMatrices])

  // Animate thermal steam, campfire smoke, waterfall mist, and birds
  useFrame((state, delta) => {
    if (geyserSteamRef.current) {
      const pos = geyserSteamRef.current.geometry.attributes.position.array
      for (let i = 1; i < pos.length; i += 3) {
        pos[i] += delta * 4.2
        pos[i - 1] += Math.sin(state.clock.elapsedTime + i) * 0.08
        if (pos[i] > 26) pos[i] = -2
      }
      geyserSteamRef.current.geometry.attributes.position.needsUpdate = true
    }

    if (campfireSmokeRef.current) {
      const pos = campfireSmokeRef.current.geometry.attributes.position.array
      for (let i = 1; i < pos.length; i += 3) {
        pos[i] += delta * 3.4
        pos[i - 1] += Math.cos(state.clock.elapsedTime + i) * 0.06
        if (pos[i] > 22) pos[i] = -4
      }
      campfireSmokeRef.current.geometry.attributes.position.needsUpdate = true
    }

    if (waterfallMistRef.current) {
      const pos = waterfallMistRef.current.geometry.attributes.position.array
      for (let i = 1; i < pos.length; i += 3) {
        pos[i] += delta * 2.2
        pos[i - 1] += Math.sin(state.clock.elapsedTime * 2 + i) * 0.05
        if (pos[i] > 6) pos[i] = -4
      }
      waterfallMistRef.current.geometry.attributes.position.needsUpdate = true
    }

    if (floatingSporesRef.current) {
      const pos = floatingSporesRef.current.geometry.attributes.position.array
      for (let i = 0; i < pos.length; i += 3) {
        pos[i] += Math.sin(state.clock.elapsedTime * 0.5 + i) * 0.02
        pos[i + 1] += Math.cos(state.clock.elapsedTime * 0.4 + i) * 0.015
      }
      floatingSporesRef.current.geometry.attributes.position.needsUpdate = true
    }

    if (birdsGroupRef.current) {
      birdsGroupRef.current.rotation.y += delta * 0.09
    }
  })

  // Geyser Steam Particle positions
  const geyserPositions = useMemo(() => {
    const pos = []
    for (let i = 0; i < 90; i++) {
      pos.push(
        -55 + (Math.random() - 0.5) * 7,
        -2 + Math.random() * 26,
        -15 + (Math.random() - 0.5) * 7
      )
    }
    return new Float32Array(pos)
  }, [])

  // Campfire Smoke Particle positions
  const smokePositions = useMemo(() => {
    const pos = []
    for (let i = 0; i < 70; i++) {
      pos.push(
        35 + (Math.random() - 0.5) * 5,
        -4 + Math.random() * 22,
        45 + (Math.random() - 0.5) * 5
      )
    }
    return new Float32Array(pos)
  }, [])

  // Waterfall Mist Particle positions
  const waterfallMistPositions = useMemo(() => {
    const pos = []
    for (let i = 0; i < 60; i++) {
      pos.push(
        50 + (Math.random() - 0.5) * 8,
        -4 + Math.random() * 10,
        -85 + (Math.random() - 0.5) * 8
      )
    }
    return new Float32Array(pos)
  }, [])

  // Floating forest motes / light spores
  const sporePositions = useMemo(() => {
    const pos = []
    for (let i = 0; i < 70; i++) {
      pos.push(
        (Math.random() - 0.5) * 50,
        -7 + Math.random() * 12,
        (Math.random() - 0.5) * 50
      )
    }
    return new Float32Array(pos)
  }, [])

  return (
    <group>
      {/* --- Tower Support Stilts & Bracing Framework --- */}
      <group position={[0, -5, 0]}>
        {/* Main 4 Heavy Timber Stilts */}
        {[
          [-1.8, 0, -1.8],
          [1.8, 0, -1.8],
          [-1.8, 0, 1.8],
          [1.8, 0, 1.8]
        ].map((pos, idx) => (
          <mesh key={`stilt-${idx}`} position={pos} castShadow>
            <cylinderGeometry args={[0.18, 0.24, 10, 8]} />
            <meshStandardMaterial color="#382215" roughness={0.9} />
          </mesh>
        ))}
        {/* Heavy Diagonal Cross Trusses */}
        {[-1.8, 1.8].map((z, i) => (
          <group key={`cross-z-${i}`}>
            <mesh position={[0, 0, z]} rotation={[0, 0, 0.44]}>
              <boxGeometry args={[4.5, 0.12, 0.12]} />
              <meshStandardMaterial color="#24140b" />
            </mesh>
            <mesh position={[0, 0, z]} rotation={[0, 0, -0.44]}>
              <boxGeometry args={[4.5, 0.12, 0.12]} />
              <meshStandardMaterial color="#24140b" />
            </mesh>
          </group>
        ))}
        {[-1.8, 1.8].map((x, i) => (
          <group key={`cross-x-${i}`}>
            <mesh position={[x, 0, 0]} rotation={[0.44, 0, 0]}>
              <boxGeometry args={[0.12, 0.12, 4.5]} />
              <meshStandardMaterial color="#24140b" />
            </mesh>
            <mesh position={[x, 0, 0]} rotation={[-0.44, 0, 0]}>
              <boxGeometry args={[0.12, 0.12, 4.5]} />
              <meshStandardMaterial color="#24140b" />
            </mesh>
          </group>
        ))}
      </group>

      {/* --- Central Shoshone Valley Floor & Grassy Slopes --- */}
      <mesh position={[0, -9.0, 0]} receiveShadow>
        <cylinderGeometry args={[220, 220, 2.5, 64]} />
        <meshStandardMaterial color="#263a2b" roughness={0.95} />
      </mesh>

      {/* Valley Terrain Undulations / Foothills */}
      {[
        [-25, -7.5, 20, 18, 4, 22, '#2f4435'],
        [30, -7.2, -15, 24, 5, 28, '#2b3f30'],
        [-40, -6.8, -40, 32, 7, 35, '#283c2d'],
        [45, -7.0, 30, 28, 6, 26, '#334938']
      ].map(([x, y, z, rx, ry, rz, col], idx) => (
        <mesh key={`hill-${idx}`} position={[x, y, z]} receiveShadow>
          <sphereGeometry args={[rx, 16, 12]} scale={[1, ry / rx, rz / rx]} />
          <meshStandardMaterial color={col} roughness={0.95} />
        </mesh>
      ))}

      {/* =========================================================================
          HIGH-DETAIL DRAMATIC MOUNTAIN RANGES WITH LOW-POLY GEOMETRIC FACETS
         ========================================================================= */}

      {/* --- 1. GRANITE PEAK SUMMIT (South-West / South) --- */}
      <group position={[-45, 12, 130]}>
        {/* Main Towering Granite Massif */}
        <mesh rotation={[0, -0.4, 0]} castShadow receiveShadow>
          <coneGeometry args={[75, 78, 7]} />
          <meshStandardMaterial color="#2d2a36" roughness={0.88} />
        </mesh>
        {/* Crystalline Alpine Snowcap & Glacier Summit */}
        <mesh position={[0, 28, 0]} rotation={[0, -0.4, 0]} castShadow>
          <coneGeometry args={[34, 26, 7]} />
          <meshStandardMaterial color="#f1f5f9" roughness={0.3} metalness={0.1} />
        </mesh>
        {/* Flanking Jagged Granite Needles */}
        <mesh position={[-38, -8, -15]} rotation={[0.1, 0.5, 0.2]}>
          <coneGeometry args={[32, 52, 5]} />
          <meshStandardMaterial color="#353140" roughness={0.9} />
        </mesh>
        <mesh position={[42, -12, 10]} rotation={[-0.1, -0.3, -0.15]}>
          <coneGeometry args={[36, 48, 6]} />
          <meshStandardMaterial color="#2a2733" roughness={0.9} />
        </mesh>
        {/* Scree Talus Slope Apron */}
        <mesh position={[0, -32, 0]}>
          <cylinderGeometry args={[88, 98, 12, 16]} />
          <meshStandardMaterial color="#3a3745" roughness={0.95} />
        </mesh>
      </group>

      {/* --- 2. THOROFARE RIDGE & CANYON BLUFFS (North-West) --- */}
      <group position={[-85, 8, -95]}>
        {/* Layered Ridge Crest */}
        <mesh rotation={[0, 0.5, 0]} castShadow receiveShadow>
          <coneGeometry args={[65, 48, 6]} />
          <meshStandardMaterial color="#1e2a24" roughness={0.9} />
        </mesh>
        {/* Secondary Crag with Timberline */}
        <mesh position={[35, -6, 25]} rotation={[0, 0.8, 0]}>
          <coneGeometry args={[45, 36, 5]} />
          <meshStandardMaterial color="#25352c" roughness={0.9} />
        </mesh>
        <mesh position={[-30, -4, -30]} rotation={[0, -0.2, 0]}>
          <coneGeometry args={[50, 42, 6]} />
          <meshStandardMaterial color="#18231e" roughness={0.9} />
        </mesh>
      </group>

      {/* --- 3. TWO-OCEAN PLATEAU & ALPINE WATERFALL (North / North-East) --- */}
      <group position={[35, 14, -135]}>
        {/* Broad Stepped Plateau Massif */}
        <mesh rotation={[0, 0.2, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[55, 85, 55, 8]} />
          <meshStandardMaterial color="#1c2820" roughness={0.92} />
        </mesh>
        {/* Stepped Upper Tier */}
        <mesh position={[0, 32, 0]} rotation={[0, 0.6, 0]}>
          <cylinderGeometry args={[28, 45, 22, 7]} />
          <meshStandardMaterial color="#213027" roughness={0.9} />
        </mesh>
        {/* Snow fields on Plateau Summit */}
        <mesh position={[-5, 44, 0]}>
          <boxGeometry args={[35, 3, 35]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.4} />
        </mesh>
        {/* Alpine Waterfall Ribbon cascading down cliff gorge */}
        <mesh position={[18, -4, 48]} rotation={[0.22, 0, 0]}>
          <planeGeometry args={[4.5, 38]} />
          <meshStandardMaterial color="#7dd3fc" roughness={0.1} metalness={0.8} />
        </mesh>
      </group>

      {/* --- 4. WAPITI CRAGS & EAST VALLEY BLUFFS (East) --- */}
      <group position={[110, 10, -25]}>
        <mesh rotation={[0, 0.7, 0]} castShadow receiveShadow>
          <coneGeometry args={[70, 52, 6]} />
          <meshStandardMaterial color="#243329" roughness={0.9} />
        </mesh>
        <mesh position={[-25, -8, 30]} rotation={[0, -0.4, 0]}>
          <coneGeometry args={[48, 38, 5]} />
          <meshStandardMaterial color="#2d3d32" roughness={0.9} />
        </mesh>
      </group>

      {/* --- 5. ATMOSPHERIC DISTANT 360° HORIZON MOUNTAIN SILHOUETTES --- */}
      {[
        [0, 18, -190, 130, 75, '#151e18'],
        [-170, 22, -60, 120, 80, '#131b15'],
        [160, 16, 70, 125, 70, '#16201a'],
        [60, 26, 180, 140, 85, '#1a1822'],
        [-130, 24, 150, 135, 82, '#181720']
      ].map(([x, y, z, w, h, col], idx) => (
        <mesh key={`far-mtn-${idx}`} position={[x, y, z]}>
          <coneGeometry args={[w, h, 6]} />
          <meshStandardMaterial color={col} roughness={1.0} />
        </mesh>
      ))}

      {/* --- Emerald Lake & Meadow Creek Water Bodies --- */}
      <mesh position={[38, -8.55, 35]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[24, 32]} />
        <meshStandardMaterial color="#194858" roughness={0.08} metalness={0.85} />
      </mesh>
      <mesh position={[18, -8.65, -40]} rotation={[-Math.PI / 2, 0, 0.6]}>
        <planeGeometry args={[16, 85]} />
        <meshStandardMaterial color="#1e5466" roughness={0.12} metalness={0.8} />
      </mesh>

      {/* =========================================================================
          MULTI-TIERED INSTANCED PINE FORESTS & GOLDEN ASPENS
         ========================================================================= */}
      
      {/* 1. Tree Trunks */}
      <instancedMesh
        ref={meshTrunkRef}
        args={[null, null, trunkMatrices.length]}
        castShadow={qualityConfig.shadows}
        receiveShadow
      >
        <cylinderGeometry args={[0.22, 0.32, 2.5, 6]} />
        <meshStandardMaterial color="#2b180d" roughness={0.95} />
      </instancedMesh>

      {/* 2. Pine Foliage Tier 1 (Base Tier - Deep Forest Pine) */}
      <instancedMesh
        ref={meshT1Ref}
        args={[null, null, tier1Matrices.length]}
        castShadow={qualityConfig.shadows}
        receiveShadow
      >
        <coneGeometry args={[1.7, 2.6, 6]} />
        <meshStandardMaterial color="#14281a" roughness={0.88} />
      </instancedMesh>

      {/* 3. Pine Foliage Tier 2 (Middle Tier - Rich Evergreen) */}
      <instancedMesh
        ref={meshT2Ref}
        args={[null, null, tier2Matrices.length]}
        castShadow={qualityConfig.shadows}
        receiveShadow
      >
        <coneGeometry args={[1.35, 2.4, 6]} />
        <meshStandardMaterial color="#1a3523" roughness={0.88} />
      </instancedMesh>

      {/* 4. Pine Foliage Tier 3 (Crown Top - Sunlit Pine Needle Tip) */}
      <instancedMesh
        ref={meshT3Ref}
        args={[null, null, tier3Matrices.length]}
        castShadow={qualityConfig.shadows}
        receiveShadow
      >
        <coneGeometry args={[0.95, 2.2, 5]} />
        <meshStandardMaterial color="#23452f" roughness={0.85} />
      </instancedMesh>

      {/* 5. Golden Autumn Aspens (Scattered Groves) */}
      <instancedMesh
        ref={meshAspenRef}
        args={[null, null, aspenMatrices.length]}
        castShadow={qualityConfig.shadows}
        receiveShadow
      >
        <dodecahedronGeometry args={[2.0, 1]} />
        <meshStandardMaterial color="#d97706" roughness={0.85} />
      </instancedMesh>

      {/* --- Hero Foreground Pine Trees (Extra Detailed Near Tower & Trail) --- */}
      {[
        [-5.5, -8.6, 8.5, 1.3],
        [6.2, -8.6, 6.0, 1.2],
        [-8.5, -8.6, 16.0, 1.4],
        [5.8, -8.6, 22.0, 1.3],
        [-6.8, -8.6, 32.0, 1.5],
        [5.2, -8.6, 42.0, 1.3],
        [-14.0, -8.6, 46.0, 1.6]
      ].map(([tx, ty, tz, ts], idx) => (
        <group key={`hero-tree-${idx}`} position={[tx, ty, tz]} scale={[ts, ts, ts]}>
          {/* Trunk */}
          <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.26, 0.38, 3.2, 8]} />
            <meshStandardMaterial color="#2d170b" roughness={0.9} />
          </mesh>
          {/* Tier 1 */}
          <mesh position={[0, 3.2, 0]} castShadow receiveShadow>
            <coneGeometry args={[2.2, 3.0, 7]} />
            <meshStandardMaterial color="#162e1d" roughness={0.85} />
          </mesh>
          {/* Tier 2 */}
          <mesh position={[0, 4.8, 0]} castShadow receiveShadow>
            <coneGeometry args={[1.7, 2.6, 7]} />
            <meshStandardMaterial color="#1d3d27" roughness={0.85} />
          </mesh>
          {/* Tier 3 */}
          <mesh position={[0, 6.2, 0]} castShadow receiveShadow>
            <coneGeometry args={[1.2, 2.2, 6]} />
            <meshStandardMaterial color="#264e33" roughness={0.85} />
          </mesh>
        </group>
      ))}

      {/* --- Distant Landmark: Thorofare Lookout Tower (~315°) --- */}
      <group position={[-55, 16, -65]}>
        <mesh castShadow>
          <boxGeometry args={[3.2, 3.2, 3.2]} />
          <meshStandardMaterial color="#543622" />
        </mesh>
        <mesh position={[0, 2.4, 0]}>
          <coneGeometry args={[2.6, 1.5, 4]} />
          <meshStandardMaterial color="#1d402b" />
        </mesh>
        <pointLight position={[0, 3.6, 0]} color="#facc15" intensity={1.8} distance={35} />
      </group>

      {/* --- Distant Landmark: West Geyser Basin Thermal Steam (~275°) --- */}
      <group position={[-55, -2, -15]}>
        <mesh position={[0, -0.5, 0]}>
          <cylinderGeometry args={[14, 16, 1.2, 16]} />
          <meshStandardMaterial color="#8a8575" roughness={0.95} />
        </mesh>
        <points ref={geyserSteamRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={90}
              array={geyserPositions}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            size={1.6}
            color="#f1f5f9"
            transparent
            opacity={0.7}
            depthWrite={false}
          />
        </points>
      </group>

      {/* --- Distant Landmark: Meadow Creek Elk Herd (~45°) --- */}
      <group position={[28, -7.5, -35]}>
        {/* Bull Elk */}
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
              count={70}
              array={smokePositions}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            size={1.3}
            color="#94a3b8"
            transparent
            opacity={0.55}
            depthWrite={false}
          />
        </points>
      </group>

      {/* --- Alpine Waterfall Mist Particles --- */}
      <points ref={waterfallMistRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={60}
            array={waterfallMistPositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={1.2}
          color="#bae6fd"
          transparent
          opacity={0.45}
          depthWrite={false}
        />
      </points>

      {/* --- Floating Forest Spores & Sunset Light Motes --- */}
      <points ref={floatingSporesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={70}
            array={sporePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.12}
          color="#fde047"
          transparent
          opacity={0.6}
          depthWrite={false}
        />
      </points>

      {/* --- Circling Birds in the Horizon Sky --- */}
      <group ref={birdsGroupRef} position={[0, 20, 0]}>
        {[
          [35, 2, -20],
          [38, 2.5, -23],
          [32, 1.8, -18],
          [28, 3.0, -25]
        ].map((pos, idx) => (
          <mesh key={`bird-${idx}`} position={pos} rotation={[0, 1.2, 0.3]}>
            <boxGeometry args={[0.9, 0.05, 0.22]} />
            <meshBasicMaterial color="#1a1c1e" />
          </mesh>
        ))}
      </group>
    </group>
  )
}
