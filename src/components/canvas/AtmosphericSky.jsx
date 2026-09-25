import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useTimeWeatherStore } from '../../stores/useTimeWeatherStore'
import { useSettingsStore, QUALITY_CONFIGS } from '../../stores/useSettingsStore'

export function AtmosphericSky() {
  const getAtmosphereParams = useTimeWeatherStore((state) => state.getAtmosphereParams)
  const weather = useTimeWeatherStore((state) => state.weather)
  const quality = useSettingsStore((state) => state.quality)
  const qualityConfig = QUALITY_CONFIGS[quality] || QUALITY_CONFIGS.high

  const rainRef = useRef()
  const firefliesRef = useRef()
  const thunderLightRef = useRef()
  const cloudsRef = useRef()
  const birdsVRef = useRef()

  const params = getAtmosphereParams()

  // Rain particle system
  const rainParticleCount = qualityConfig.particles
  const rainPositions = useMemo(() => {
    const pos = []
    for (let i = 0; i < rainParticleCount; i++) {
      pos.push(
        (Math.random() - 0.5) * 50,
        Math.random() * 28,
        (Math.random() - 0.5) * 50
      )
    }
    return new Float32Array(pos)
  }, [rainParticleCount])

  // Firefly particle system
  const fireflyCount = 80
  const fireflyPositions = useMemo(() => {
    const pos = []
    for (let i = 0; i < fireflyCount; i++) {
      pos.push(
        (Math.random() - 0.5) * 24,
        0.5 + Math.random() * 5,
        (Math.random() - 0.5) * 24
      )
    }
    return new Float32Array(pos)
  }, [])

  // Animate weather, clouds, birds & lighting
  useFrame((state, delta) => {
    // Rain falling
    if (rainRef.current && (weather === 'rain' || weather === 'thunderstorm')) {
      const pos = rainRef.current.geometry.attributes.position.array
      for (let i = 1; i < pos.length; i += 3) {
        pos[i] -= delta * 34.0
        if (pos[i] < -2) pos[i] = 26
      }
      rainRef.current.geometry.attributes.position.needsUpdate = true
    }

    // Fireflies floating
    if (firefliesRef.current && params.isNight) {
      const pos = firefliesRef.current.geometry.attributes.position.array
      const time = state.clock.elapsedTime
      for (let i = 0; i < pos.length; i += 3) {
        pos[i] += Math.sin(time * 1.2 + i) * 0.012
        pos[i + 1] += Math.cos(time * 0.9 + i * 0.5) * 0.008
        pos[i + 2] += Math.sin(time * 0.8 + i) * 0.012
      }
      firefliesRef.current.geometry.attributes.position.needsUpdate = true
    }

    // Gentle cloud drifting
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.008
    }

    // Distant birds V-formation flying
    if (birdsVRef.current) {
      birdsVRef.current.position.x += delta * 2.5
      if (birdsVRef.current.position.x > 180) {
        birdsVRef.current.position.x = -180
      }
    }

    // Thunder flashes
    if (thunderLightRef.current) {
      if (weather === 'thunderstorm' && Math.random() < 0.008) {
        thunderLightRef.current.intensity = 5.0
      } else {
        thunderLightRef.current.intensity = THREE.MathUtils.lerp(
          thunderLightRef.current.intensity,
          0,
          delta * 8.0
        )
      }
    }
  })

  // Custom Sky Dome Shader Material with signature Firewatch multi-band gradient
  const skyShader = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        topColor: { value: new THREE.Color(params.skyTop) },
        bottomColor: { value: new THREE.Color(params.skyBottom) },
        fogColor: { value: new THREE.Color(params.fogColor) },
        offset: { value: 12 },
        exponent: { value: 0.55 }
      },
      vertexShader: `
        varying vec3 vWorldPosition;
        void main() {
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 topColor;
        uniform vec3 bottomColor;
        uniform vec3 fogColor;
        uniform float offset;
        uniform float exponent;
        varying vec3 vWorldPosition;
        void main() {
          float h = normalize(vWorldPosition + offset).y;
          float factor = max(pow(max(h, 0.0), exponent), 0.0);
          vec3 sky = mix(bottomColor, topColor, factor);
          if (h < 0.08) {
            sky = mix(fogColor, sky, max(0.0, (h + 0.04) / 0.12));
          }
          gl_FragColor = vec4(sky, 1.0);
        }
      `,
      side: THREE.BackSide,
      depthWrite: false
    })
  }, [params.skyTop, params.skyBottom, params.fogColor])

  // Stylized Cumulus Clouds on Horizon (Firewatch aesthetic)
  const clouds = useMemo(() => {
    const cloudClusters = []
    const cloudCount = 12
    for (let i = 0; i < cloudCount; i++) {
      const angle = (i / cloudCount) * Math.PI * 2
      const radius = 160 + (i % 3) * 15
      const cx = Math.cos(angle) * radius
      const cz = Math.sin(angle) * radius
      const cy = 28 + Math.sin(i * 1.5) * 12

      cloudClusters.push({
        pos: [cx, cy, cz],
        scale: [12 + (i % 4) * 4, 6 + (i % 3) * 2, 8 + (i % 3) * 3],
        rot: [0, angle, 0]
      })
    }
    return cloudClusters
  }, [])

  return (
    <>
      {/* Dynamic Atmospheric Fog */}
      <fog attach="fog" args={[params.fogColor, 12, 190]} />

      {/* Firewatch Ambient Fill Light */}
      <hemisphereLight
        args={[params.skyTop, params.skyBottom, params.ambientIntensity * 1.2]}
      />

      {/* Main Sun / Moon Directional Light */}
      <directionalLight
        position={params.sunPosition}
        color={params.sunColor}
        intensity={params.sunIntensity}
        castShadow={qualityConfig.shadows}
        shadow-mapSize-width={qualityConfig.shadowMapSize || 1024}
        shadow-mapSize-height={qualityConfig.shadowMapSize || 1024}
        shadow-camera-near={0.5}
        shadow-camera-far={260}
        shadow-camera-left={-28}
        shadow-camera-right={28}
        shadow-camera-top={28}
        shadow-camera-bottom={-28}
      />

      {/* Thunder Flash Light */}
      <pointLight
        ref={thunderLightRef}
        position={[0, 40, 0]}
        color="#e0f2fe"
        intensity={0}
        distance={250}
      />

      {/* --- Radiant Sun Disc & Glowing Corona (Day / Sunset) --- */}
      {!params.isNight && (
        <group position={params.sunPosition}>
          {/* Intense Core */}
          <mesh>
            <sphereGeometry args={[9.5, 20, 20]} />
            <meshBasicMaterial color="#fffbeb" />
          </mesh>
          {/* Inner Golden Corona */}
          <mesh>
            <sphereGeometry args={[16.0, 16, 16]} />
            <meshBasicMaterial color="#f59e0b" transparent opacity={0.4} depthWrite={false} />
          </mesh>
          {/* Outer Sunburst Radiance Glow */}
          <mesh>
            <sphereGeometry args={[28.0, 16, 16]} />
            <meshBasicMaterial color="#ea580c" transparent opacity={0.2} depthWrite={false} />
          </mesh>
        </group>
      )}

      {/* --- Giant Glowing Lunar Disc (Night Mode - Image 4) --- */}
      {params.isNight && (
        <group position={[params.sunPosition[0] * -1, 45, params.sunPosition[2] * -1]}>
          {/* Moon Core */}
          <mesh>
            <sphereGeometry args={[14.0, 24, 24]} />
            <meshBasicMaterial color="#fef08a" />
          </mesh>
          {/* Cyan Lunar Halo */}
          <mesh>
            <sphereGeometry args={[26.0, 16, 16]} />
            <meshBasicMaterial color="#38bdf8" transparent opacity={0.25} depthWrite={false} />
          </mesh>
          {/* Moonlight Backlight */}
          <pointLight color="#bae6fd" intensity={1.8} distance={150} />
        </group>
      )}

      {/* --- Stylized Horizon Cumulus Clouds (Firewatch Art Style) --- */}
      <group ref={cloudsRef}>
        {clouds.map((c, idx) => (
          <group key={`cloud-${idx}`} position={c.pos} rotation={c.rot} scale={c.scale}>
            <mesh>
              <dodecahedronGeometry args={[1, 1]} />
              <meshStandardMaterial
                color={params.isNight ? '#0e1d2c' : params.sunElevation < 0.2 ? '#fed7aa' : '#f8fafc'}
                roughness={0.9}
                transparent
                opacity={0.7}
              />
            </mesh>
            <mesh position={[0.7, -0.2, 0.3]} scale={[0.8, 0.7, 0.8]}>
              <dodecahedronGeometry args={[1, 1]} />
              <meshStandardMaterial
                color={params.isNight ? '#0e1d2c' : params.sunElevation < 0.2 ? '#fdba74' : '#f8fafc'}
                roughness={0.9}
                transparent
                opacity={0.65}
              />
            </mesh>
          </group>
        ))}
      </group>

      {/* --- Distant Birds Flying in V-Formation (Images 1 & 3) --- */}
      <group ref={birdsVRef} position={[-40, 26, -90]}>
        {[
          [0, 0, 0],
          [-2.2, -0.8, 2.0],
          [-4.4, -1.6, 4.0],
          [-6.6, -2.4, 6.0],
          [2.2, -0.8, 2.0],
          [4.4, -1.6, 4.0],
          [6.6, -2.4, 6.0]
        ].map(([bx, by, bz], bIdx) => (
          <mesh key={`v-bird-${bIdx}`} position={[bx, by, bz]} rotation={[0, 0.4, 0.1]}>
            <boxGeometry args={[0.9, 0.04, 0.24]} />
            <meshBasicMaterial color="#0f172a" />
          </mesh>
        ))}
      </group>

      {/* Sky Gradient Sphere Dome */}
      <mesh scale={[-1, 1, 1]} material={skyShader}>
        <sphereGeometry args={[240, 32, 24]} />
      </mesh>

      {/* Rain Particle System */}
      {(weather === 'rain' || weather === 'thunderstorm') && (
        <points ref={rainRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={rainParticleCount}
              array={rainPositions}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.14}
            color="#93c5fd"
            transparent
            opacity={0.7}
            depthWrite={false}
          />
        </points>
      )}

      {/* Night Fireflies */}
      {params.isNight && (
        <points ref={firefliesRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={fireflyCount}
              array={fireflyPositions}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.22}
            color="#bef264"
            transparent
            opacity={0.9}
            depthWrite={false}
          />
        </points>
      )}
    </>
  )
}
