import React, { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { usePlayerStore } from '../../stores/usePlayerStore'
import { useCameraStore, CAMERA_MODES } from '../../stores/useCameraStore'
import { useStoryStore } from '../../stores/useStoryStore'
import { soundEngine } from '../../audio/SoundEngine'
import { RangerCharacter } from './RangerCharacter'

export function PlayerController() {
  const { camera, gl } = useThree()
  
  const position = usePlayerStore((state) => state.position)
  const setPosition = usePlayerStore((state) => state.setPosition)
  const setMovementState = usePlayerStore((state) => state.setMovementState)
  const setCurrentSurface = usePlayerStore((state) => state.setCurrentSurface)

  const cameraMode = useCameraStore((state) => state.mode)
  const setCameraMode = useCameraStore((state) => state.setMode)
  const azimuth = useCameraStore((state) => state.azimuth)
  const pitch = useCameraStore((state) => state.pitch)
  const setLookAngles = useCameraStore((state) => state.setLookAngles)

  const completeObjective = useStoryStore((state) => state.completeObjective)
  const openRadio = useStoryStore((state) => state.openRadio)

  // Local state for keyboard inputs
  const keys = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
    sprint: false
  })

  const playerPos = useRef(new THREE.Vector3(...position))
  const isAutoClimbing = useRef(false)
  const autoClimbProgress = useRef(0)
  const autoClimbDirection = useRef(1) // 1 = ascending, -1 = descending

  const footstepTimer = useRef(0)
  const headBobTimer = useRef(0)
  const isPointerLocked = useRef(false)
  const isDragging = useRef(false)
  const lastMousePos = useRef({ x: 0, y: 0 })

  // Sync external teleportation
  useEffect(() => {
    playerPos.current.set(...position)
  }, [position])

  // Stair waypoints for smooth ascent from ground (y=-8.2) to deck (y=0)
  const stairWaypoints = [
    new THREE.Vector3(-1.2, -8.2, 3.8), // Start at base of stairs
    new THREE.Vector3(-2.2, -6.6, 2.2), // Landing 1
    new THREE.Vector3(2.2, -4.4, 2.2),  // Landing 2
    new THREE.Vector3(2.2, -2.2, -2.2), // Landing 3
    new THREE.Vector3(-2.2, 0.0, -2.2), // Top Landing
    new THREE.Vector3(0.0, 0.0, -1.0)   // Cabin Deck
  ]

  // Setup Keyboard and Pointer Lock listeners
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') return

      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          keys.current.forward = true
          break
        case 'KeyS':
        case 'ArrowDown':
          keys.current.backward = true
          break
        case 'KeyA':
        case 'ArrowLeft':
          keys.current.left = true
          break
        case 'KeyD':
        case 'ArrowRight':
          keys.current.right = true
          break
        case 'ShiftLeft':
        case 'ShiftRight':
          keys.current.sprint = true
          break
        case 'KeyV':
        case 'KeyF':
          // Toggle First Person <-> Third Person
          if (cameraMode === CAMERA_MODES.FIRST_PERSON) {
            setCameraMode(CAMERA_MODES.THIRD_PERSON)
          } else if (cameraMode === CAMERA_MODES.THIRD_PERSON) {
            setCameraMode(CAMERA_MODES.FIRST_PERSON)
          }
          break
        case 'KeyC':
          // Toggle Cinematic view
          if (cameraMode === CAMERA_MODES.CINEMATIC) {
            setCameraMode(CAMERA_MODES.FIRST_PERSON)
          } else {
            setCameraMode(CAMERA_MODES.CINEMATIC)
          }
          break
        case 'KeyE':
          // Contextual Action: Climb Stairs or Open Radio
          if (playerPos.current.z > 2.0 && playerPos.current.z < 6.0 && playerPos.current.y <= -6.0) {
            // Ascend stairs
            isAutoClimbing.current = true
            autoClimbProgress.current = 0
            autoClimbDirection.current = 1
            soundEngine.playFootstep('wood')
          } else if (playerPos.current.y >= -1.0 && playerPos.current.z >= 1.5 && Math.abs(playerPos.current.x) <= 2.8) {
            // Descend stairs
            isAutoClimbing.current = true
            autoClimbProgress.current = 1
            autoClimbDirection.current = -1
            soundEngine.playFootstep('wood')
          } else if (playerPos.current.y > -2) {
            openRadio()
          }
          break
        default:
          break
      }
    }

    const handleKeyUp = (e) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          keys.current.forward = false
          break
        case 'KeyS':
        case 'ArrowDown':
          keys.current.backward = false
          break
        case 'KeyA':
        case 'ArrowLeft':
          keys.current.left = false
          break
        case 'KeyD':
        case 'ArrowRight':
          keys.current.right = false
          break
        case 'ShiftLeft':
        case 'ShiftRight':
          keys.current.sprint = false
          break
        default:
          break
      }
    }

    // Pointer Lock look handler
    const handleMouseMove = (e) => {
      if (document.pointerLockElement === gl.domElement) {
        const sensitivity = 0.15
        const newAz = (useCameraStore.getState().azimuth + e.movementX * sensitivity) % 360
        const newPitch = Math.max(-65, Math.min(65, useCameraStore.getState().pitch - e.movementY * sensitivity))
        setLookAngles(newAz, newPitch)
      }
    }

    const handlePointerLockChange = () => {
      isPointerLocked.current = document.pointerLockElement === gl.domElement
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('pointerlockchange', handlePointerLockChange)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('pointerlockchange', handlePointerLockChange)
    }
  }, [gl.domElement, cameraMode, setCameraMode, setLookAngles, openRadio])

  // Movement & physics loop
  useFrame((state, delta) => {
    // Handle Auto-Climbing Stairs smoothly
    if (isAutoClimbing.current) {
      const climbSpeed = 0.45 * delta
      autoClimbProgress.current += autoClimbDirection.current * climbSpeed

      if (autoClimbProgress.current >= 1.0) {
        autoClimbProgress.current = 1.0
        isAutoClimbing.current = false
        playerPos.current.set(0.0, 0.0, -1.0)
        completeObjective('climb_stairs')
      } else if (autoClimbProgress.current <= 0.0) {
        autoClimbProgress.current = 0.0
        isAutoClimbing.current = false
        playerPos.current.set(-1.2, -8.2, 4.5)
      } else {
        // Multi-segment waypoint interpolation
        const totalSegments = stairWaypoints.length - 1
        const segmentProgress = autoClimbProgress.current * totalSegments
        const index = Math.min(totalSegments - 1, Math.floor(segmentProgress))
        const frac = segmentProgress - index

        const p1 = stairWaypoints[index]
        const p2 = stairWaypoints[index + 1]
        playerPos.current.lerpVectors(p1, p2, frac)

        // Footstep sounds while climbing
        footstepTimer.current += delta * 3.5
        if (footstepTimer.current > 1.0) {
          footstepTimer.current = 0
          soundEngine.playFootstep('wood')
          setCurrentSurface('wood')
        }
      }

      setPosition([playerPos.current.x, playerPos.current.y, playerPos.current.z])
      setMovementState(true, false)
      return
    }

    // Only update movement in First Person or Third Person mode
    if (cameraMode !== CAMERA_MODES.FIRST_PERSON && cameraMode !== CAMERA_MODES.THIRD_PERSON) {
      return
    }

    const isMoving = keys.current.forward || keys.current.backward || keys.current.left || keys.current.right
    const isSprinting = keys.current.sprint && isMoving
    setMovementState(isMoving, isSprinting)

    const moveSpeed = (isSprinting ? 8.5 : 4.5) * delta

    // Movement direction vector relative to camera azimuth
    const azRad = THREE.MathUtils.degToRad(azimuth)
    const forwardVec = new THREE.Vector3(Math.sin(azRad), 0, -Math.cos(azRad)).normalize()
    const rightVec = new THREE.Vector3(Math.cos(azRad), 0, Math.sin(azRad)).normalize()

    const moveDir = new THREE.Vector3(0, 0, 0)
    if (keys.current.forward) moveDir.add(forwardVec)
    if (keys.current.backward) moveDir.sub(forwardVec)
    if (keys.current.right) moveDir.add(rightVec)
    if (keys.current.left) moveDir.sub(rightVec)

    if (moveDir.lengthSq() > 0) {
      moveDir.normalize().multiplyScalar(moveSpeed)
      playerPos.current.add(moveDir)

      // Footstep sounds
      footstepTimer.current += delta * (isSprinting ? 2.8 : 1.8)
      if (footstepTimer.current > 1.0) {
        footstepTimer.current = 0
        const surface = playerPos.current.y > -2 ? 'wood' : 'dirt'
        soundEngine.playFootstep(surface)
        setCurrentSurface(surface)
      }
    }

    // --- Dynamic Elevation & Collision Boundaries ---
    if (playerPos.current.y < -3.0) {
      // Trail Ground Level (y = -8.2)
      playerPos.current.y = -8.2
      // Trail corridor clamping
      playerPos.current.x = Math.max(-25, Math.min(25, playerPos.current.x))
      playerPos.current.z = Math.max(3.8, Math.min(65, playerPos.current.z))
    } else {
      // Tower Lookout Cabin & Wraparound Balcony (y = 0.0)
      playerPos.current.y = 0.0
      // Clamped within outer balcony railing
      playerPos.current.x = Math.max(-3.4, Math.min(3.4, playerPos.current.x))
      playerPos.current.z = Math.max(-3.4, Math.min(3.4, playerPos.current.z))
    }

    setPosition([playerPos.current.x, playerPos.current.y, playerPos.current.z])

    // --- Direct Camera Positioning in FPS & 3P Modes ---
    if (cameraMode === CAMERA_MODES.FIRST_PERSON) {
      if (isMoving) {
        headBobTimer.current += delta * (isSprinting ? 14 : 9)
      }
      const bobY = isMoving ? Math.sin(headBobTimer.current) * 0.035 : 0

      const eyeY = playerPos.current.y + 1.6 + bobY
      const camPos = new THREE.Vector3(playerPos.current.x, eyeY, playerPos.current.z)

      const pitchRad = THREE.MathUtils.degToRad(pitch)
      const lookTarget = new THREE.Vector3(
        camPos.x + Math.sin(azRad) * Math.cos(pitchRad) * 50,
        camPos.y + Math.sin(pitchRad) * 50,
        camPos.z - Math.cos(azRad) * Math.cos(pitchRad) * 50
      )

      camera.position.copy(camPos)
      camera.lookAt(lookTarget)
      camera.fov = 62
      camera.updateProjectionMatrix()
    } else if (cameraMode === CAMERA_MODES.THIRD_PERSON) {
      const followDist = 3.2
      const followHeight = 1.9
      const camX = playerPos.current.x - Math.sin(azRad) * followDist
      const camZ = playerPos.current.z + Math.cos(azRad) * followDist
      const camY = playerPos.current.y + followHeight

      const camTarget = new THREE.Vector3(
        playerPos.current.x,
        playerPos.current.y + 1.2,
        playerPos.current.z
      )

      camera.position.set(camX, camY, camZ)
      camera.lookAt(camTarget)
      camera.fov = 55
      camera.updateProjectionMatrix()
    }

    // --- Spatial Story Objectives ---
    if (playerPos.current.z <= 26) {
      completeObjective('reach_bridge')
    }
    if (playerPos.current.z <= 5) {
      completeObjective('reach_tower_base')
    }
    if (playerPos.current.y >= -1.0) {
      completeObjective('climb_stairs')
    }
  })

  const isMoving = usePlayerStore((state) => state.isMoving)
  const isSprinting = usePlayerStore((state) => state.isSprinting)

  return (
    <>
      {/* 3D Stylized Ranger Character in Third-Person Mode */}
      {cameraMode === CAMERA_MODES.THIRD_PERSON && (
        <group
          position={position}
          rotation={[0, THREE.MathUtils.degToRad(azimuth + 180), 0]}
        >
          <RangerCharacter isMoving={isMoving} isSprinting={isSprinting} />
        </group>
      )}
    </>
  )
}
