import React, { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useCameraStore, CAMERA_MODES, CAMERA_PRESETS } from '../../stores/useCameraStore'

export function CameraRig() {
  const { camera } = useThree()
  const mode = useCameraStore((state) => state.mode)
  const zoom = useCameraStore((state) => state.zoom)
  const azimuth = useCameraStore((state) => state.azimuth)
  const pitch = useCameraStore((state) => state.pitch)

  const currentPos = useRef(new THREE.Vector3(0, 1.6, 0.4))
  const currentTarget = useRef(new THREE.Vector3(0, 1.45, -3.5))

  useFrame((state, delta) => {
    // Only manage camera position in fixed cinematic / scope / desk / balcony modes
    // First-Person (FPS) and Third-Person are handled solely by PlayerController
    if (mode === CAMERA_MODES.FIRST_PERSON || mode === CAMERA_MODES.THIRD_PERSON) {
      return
    }

    const preset = CAMERA_PRESETS[mode] || CAMERA_PRESETS[CAMERA_MODES.DESK]
    let desiredPos = new THREE.Vector3(...preset.position)
    let desiredTarget = new THREE.Vector3(...preset.target)

    if (mode === CAMERA_MODES.CINEMATIC) {
      // Gentle cinematic orbit / drone drift around the lookout station
      const time = state.clock.elapsedTime * 0.08
      const radius = 20.0
      const camX = Math.sin(time) * radius - 4
      const camZ = Math.cos(time) * radius + 6
      const camY = 2.5 + Math.sin(time * 0.5) * 2.0
      desiredPos.set(camX, camY, camZ)
      desiredTarget.set(0, 1.2, 0)
    } else if (mode === CAMERA_MODES.SCOPE) {
      const azRad = THREE.MathUtils.degToRad(azimuth)
      const pitchRad = THREE.MathUtils.degToRad(pitch)
      const lookDist = 100
      const lookX = desiredPos.x + Math.sin(azRad) * Math.cos(pitchRad) * lookDist
      const lookY = desiredPos.y + Math.sin(pitchRad) * lookDist
      const lookZ = desiredPos.z - Math.cos(azRad) * Math.cos(pitchRad) * lookDist
      desiredTarget.set(lookX, lookY, lookZ)
    }

    // Smooth lerp
    const lerpSpeed = delta * (mode === CAMERA_MODES.CINEMATIC ? 2.5 : 5.0)
    currentPos.current.lerp(desiredPos, lerpSpeed)
    currentTarget.current.lerp(desiredTarget, lerpSpeed)

    camera.position.copy(currentPos.current)
    camera.lookAt(currentTarget.current)

    // Smooth FOV zoom
    const targetFov = mode === CAMERA_MODES.SCOPE ? 24 / zoom : preset.fov
    camera.fov = THREE.MathUtils.lerp(camera.fov, targetFov, delta * 5.0)
    camera.updateProjectionMatrix()
  })

  return null
}
