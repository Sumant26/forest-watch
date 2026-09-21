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

  const params = getAtmosphereParams()

  // Rain particle system
  const rainParticleCount = qualityConfig.particles
  const rainPositions = useMemo(() => {
    const pos = []
    for (let i = 0; i < rainParticleCount; i++) {
      pos.push(
        (Math.random() - 0.5) * 45,
        Math.random() * 25,
        (Math.random() - 0.5) * 45
      )
    }
    return new Float32Array(pos)
  }, [rainParticleCount])

  // Firefly particle system
  const fireflyCount = 70
  const fireflyPositions = useMemo(() => {
    const pos = []
    for (let i = 0; i < fireflyCount; i++) {
      pos.push(
        (Math.random() - 0.5) * 16,
        0.5 + Math.random() * 4,
        (Math.random() - 0.5) * 16
      )
    }
    return new Float32Array(pos)
  }, [])

  // Animate weather particles & thunder
  useFrame((state, delta) => {
    // Rain falling
    if (rainRef.current && (weather === 'rain' || weather === 'thunderstorm')) {
      const pos = rainRef.current.geometry.attributes.position.array
      for (let i = 1; i < pos.length; i += 3) {
        pos[i] -= delta * 32.0
        if (pos[i] < -2) {
          pos[i] = 25
        }
      }
      rainRef.current.geometry.attributes.position.needsUpdate = true
    }

    // Fireflies floating
    if (firefliesRef.current && params.isNight) {
      const pos = firefliesRef.current.geometry.attributes.position.array
      const time = state.clock.elapsedTime
      for (let i = 0; i < pos.length; i += 3) {
        pos[i] += Math.sin(time + i) * 0.008
        pos[i + 1] += Math.cos(time + i * 0.5) * 0.006
        pos[i + 2] += Math.sin(time * 0.8 + i) * 0.008
      }
      firefliesRef.current.geometry.attributes.position.needsUpdate = true
    }

    // Thunder flashes
    if (thunderLightRef.current) {
      if (weather === 'thunderstorm' && Math.random() < 0.008) {
        thunderLightRef.current.intensity = 4.5
      } else {
        thunderLightRef.current.intensity = THREE.MathUtils.lerp(
          thunderLightRef.current.intensity,
          0,
          delta * 8.0
        )
      }
    }
  })

  // Custom Sky Dome Shader Material with 3-stop vertical Firewatch gradient
  const skyShader = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        topColor: { value: new THREE.Color(params.skyTop) },
        bottomColor: { value: new THREE.Color(params.skyBottom) },
        fogColor: { value: new THREE.Color(params.fogColor) },
        offset: { value: 10 },
        exponent: { value: 0.65 }
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
          if (h < 0.05) {
            sky = mix(fogColor, sky, max(0.0, (h + 0.05) / 0.1));
          }
          gl_FragColor = vec4(sky, 1.0);
        }
      `,
      side: THREE.BackSide,
      depthWrite: false
    })
  }, [params.skyTop, params.skyBottom, params.fogColor])

  return (
    <>
      {/* Fog */}
      <fog attach="fog" args={[params.fogColor, 15, 180]} />

      {/* Soft Firewatch Hemisphere Fill Light */}
      <hemisphereLight
        args={[params.skyTop, params.skyBottom, params.ambientIntensity * 1.1]}
      />

      {/* Sun / Moon Directional Light */}
      <directionalLight
        position={params.sunPosition}
        color={params.sunColor}
        intensity={params.sunIntensity}
        castShadow={qualityConfig.shadows}
        shadow-mapSize-width={qualityConfig.shadowMapSize || 1024}
        shadow-mapSize-height={qualityConfig.shadowMapSize || 1024}
        shadow-camera-near={0.5}
        shadow-camera-far={250}
        shadow-camera-left={-25}
        shadow-camera-right={25}
        shadow-camera-top={25}
        shadow-camera-bottom={-25}
      />

      {/* Glowing Sun Disk on Horizon */}
      {!params.isNight && (
        <group position={params.sunPosition}>
          {/* Core Sun Disc */}
          <mesh>
            <sphereGeometry args={[7.0, 16, 16]} />
            <meshBasicMaterial color="#fffbeb" />
          </mesh>
          {/* Outer Sun Glow Corona */}
          <mesh>
            <sphereGeometry args={[14.0, 16, 16]} />
            <meshBasicMaterial color="#f97316" transparent opacity={0.35} depthWrite={false} />
          </mesh>
        </group>
      )}

      {/* Sky Gradient Sphere Dome */}
      <mesh scale={[-1, 1, 1]} material={skyShader}>
        <sphereGeometry args={[220, 32, 24]} />
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
            size={0.12}
            color="#93c5fd"
            transparent
            opacity={0.65}
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
            size={0.18}
            color="#a3e635"
            transparent
            opacity={0.85}
            depthWrite={false}
          />
        </points>
      )}
    </>
  )
}
