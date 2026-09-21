import React, { useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { AtmosphericSky } from './AtmosphericSky'
import { CabinModel } from './CabinModel'
import { TerrainEnvironment } from './TerrainEnvironment'
import { TrailEnvironment } from './TrailEnvironment'
import { PlayerController } from './PlayerController'
import { CameraRig } from './CameraRig'
import { useSettingsStore, QUALITY_CONFIGS } from '../../stores/useSettingsStore'
import { useCameraStore, CAMERA_MODES } from '../../stores/useCameraStore'

export function LookoutCanvas() {
  const quality = useSettingsStore((state) => state.quality)
  const qualityConfig = QUALITY_CONFIGS[quality] || QUALITY_CONFIGS.high

  const mode = useCameraStore((state) => state.mode)
  const azimuth = useCameraStore((state) => state.azimuth)
  const pitch = useCameraStore((state) => state.pitch)
  const setLookAngles = useCameraStore((state) => state.setLookAngles)

  const isDragging = useRef(false)
  const lastMousePos = useRef({ x: 0, y: 0 })

  // Handle Drag-to-look for mouse and touch
  const handlePointerDown = (e) => {
    // Enable look dragging in all active view modes
    isDragging.current = true
    lastMousePos.current = { x: e.clientX, y: e.clientY }
  }

  const handlePointerMove = (e) => {
    if (!isDragging.current) return
    const deltaX = e.clientX - lastMousePos.current.x
    const deltaY = e.clientY - lastMousePos.current.y
    lastMousePos.current = { x: e.clientX, y: e.clientY }

    const sensitivity = mode === CAMERA_MODES.SCOPE ? 0.08 : 0.22
    const newAzimuth = azimuth + deltaX * sensitivity
    const newPitch = pitch - deltaY * sensitivity

    setLookAngles(newAzimuth, newPitch)
  }

  const handlePointerUp = () => {
    isDragging.current = false
  }

  return (
    <div
      id="lookout-canvas-container"
      className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing touch-none select-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <Canvas
        shadows={qualityConfig.shadows}
        dpr={qualityConfig.dpr}
        camera={{ position: [-12, -6.6, 48], fov: 62 }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          preserveDrawingBuffer: true // Required for polaroid canvas snapshots
        }}
      >
        <AtmosphericSky />
        <CabinModel />
        <TerrainEnvironment />
        <TrailEnvironment />
        <PlayerController />
        <CameraRig />

        {/* Postprocessing Bloom for warm lantern & sunset radiance */}
        {qualityConfig.bloom && (
          <EffectComposer>
            <Bloom
              intensity={0.4}
              luminanceThreshold={0.7}
              luminanceSmoothing={0.8}
              mipmapBlur
            />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  )
}
