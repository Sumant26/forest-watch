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
  const isRadioOpen = useStoryStore((state) => state.isRadioOpen)

  // Local state for keyboard inputs
  const keys = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
    sprint: false
  })

  const playerPos = useRef(new THREE.Vector3(...position))
  const smoothVelocity = useRef(new THREE.Vector3(0, 0, 0))
  const smoothAzimuth = useRef(azimuth)
  const smoothPitch = useRef(pitch)
  
  const isAutoClimbing = useRef(false)
  const autoClimbProgress = useRef(0)
  const autoClimbDirection = useRef(1) // 1 = ascending, -1 = descending

  const footstepTimer = useRef(0)
  const headBobTimer = useRef(0)
  const radioSwayTimer = useRef(0)
  const isPointerLocked = useRef(false)
  const firstPersonRadioRef = useRef()

  // Sync external teleportation
  useEffect(() => {
    playerPos.current.set(...position)
    smoothVelocity.current.set(0, 0, 0)
  }, [position])

  // Stair waypoints for smooth ascent from ground (y=-8.2) to deck (y=0)
  const stairWaypoints = [
    new THREE.Vector3(-1.2, -8.2, 3.8), // Start at base of stairs
    new THREE.Vector3(-2.2, -6.6, 2.2), // Landing 1
    new THREE.Vector3(2.2, -4.4, 2.2),  // Landing 2
    new THREE.Vector3(2.2, -2.2, -2.2), // Landing 3
    new THREE.Vector3(-2.2, 0.0, -2.2), // Top Landing
    new THREE.Vector3(-1.0, 0.0, -1.0)  // Cabin Deck Entrance
  ]

  // Setup Keyboard, Stair Trigger, and Pointer Lock listeners
  useEffect(() => {
    const handleStairTrigger = () => {
      if (playerPos.current.y <= -4.0) {
        // Ascend stairs from base
        isAutoClimbing.current = true
        autoClimbProgress.current = 0
        autoClimbDirection.current = 1
        soundEngine.playFootstep('wood')
      } else {
        // Descend stairs from deck
        isAutoClimbing.current = true
        autoClimbProgress.current = 1
        autoClimbDirection.current = -1
        soundEngine.playFootstep('wood')
      }
    }

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
          if (playerPos.current.y <= -5.0 && (playerPos.current.z <= 7.0 || Math.hypot(playerPos.current.x - (-1.2), playerPos.current.z - 3.8) < 4.5)) {
            // Ascend stairs
            isAutoClimbing.current = true
            autoClimbProgress.current = 0
            autoClimbDirection.current = 1
            soundEngine.playFootstep('wood')
          } else if (playerPos.current.y >= -1.5 && (playerPos.current.z >= 1.0 || Math.hypot(playerPos.current.x - (-2.2), playerPos.current.z - (-2.2)) < 3.5)) {
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

    // Pointer Lock look handler with smooth sensitivity
    const handleMouseMove = (e) => {
      if (document.pointerLockElement === gl.domElement) {
        const sensitivity = 0.12
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
    window.addEventListener('trigger-stair-climb', handleStairTrigger)
    document.addEventListener('pointerlockchange', handlePointerLockChange)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('trigger-stair-climb', handleStairTrigger)
      document.removeEventListener('pointerlockchange', handlePointerLockChange)
    }
  }, [gl.domElement, cameraMode, setCameraMode, setLookAngles, openRadio])

  // Movement & physics loop with smooth momentum damping
  useFrame((state, delta) => {
    // Smooth angle interpolation (eliminates mouse micro-jitter)
    smoothAzimuth.current = THREE.MathUtils.lerp(
      smoothAzimuth.current,
      azimuth,
      1 - Math.exp(-22 * delta)
    )
    smoothPitch.current = THREE.MathUtils.lerp(
      smoothPitch.current,
      pitch,
      1 - Math.exp(-22 * delta)
    )

    // Handle Auto-Climbing Stairs smoothly
    if (isAutoClimbing.current) {
      const climbSpeed = 0.6 * delta
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
        footstepTimer.current += delta * 4.0
        if (footstepTimer.current > 1.0) {
          footstepTimer.current = 0
          soundEngine.playFootstep('wood')
          setCurrentSurface('wood')
        }
      }

      setPosition([playerPos.current.x, playerPos.current.y, playerPos.current.z])
      setMovementState(true, false)

      // Direct Camera Positioning during climbing
      const azRad = THREE.MathUtils.degToRad(smoothAzimuth.current)
      if (cameraMode === CAMERA_MODES.FIRST_PERSON) {
        const eyeY = playerPos.current.y + 1.6
        camera.position.set(playerPos.current.x, eyeY, playerPos.current.z)
        const lookTarget = new THREE.Vector3(
          playerPos.current.x + Math.sin(azRad) * 10,
          eyeY,
          playerPos.current.z - Math.cos(azRad) * 10
        )
        camera.lookAt(lookTarget)
        camera.fov = 62
        camera.updateProjectionMatrix()
      } else if (cameraMode === CAMERA_MODES.THIRD_PERSON) {
        const followDist = 3.2
        const camX = playerPos.current.x - Math.sin(azRad) * followDist
        const camZ = playerPos.current.z + Math.cos(azRad) * followDist
        const camY = playerPos.current.y + 1.8
        camera.position.set(camX, camY, camZ)
        camera.lookAt(playerPos.current.x, playerPos.current.y + 1.1, playerPos.current.z)
        camera.fov = 55
        camera.updateProjectionMatrix()
      }
      return
    }

    // Only update movement in First Person or Third Person mode
    if (cameraMode !== CAMERA_MODES.FIRST_PERSON && cameraMode !== CAMERA_MODES.THIRD_PERSON) {
      return
    }

    const isMoving = keys.current.forward || keys.current.backward || keys.current.left || keys.current.right
    const isSprinting = keys.current.sprint && isMoving
    setMovementState(isMoving, isSprinting)

    const targetSpeed = isMoving ? (isSprinting ? 8.2 : 4.6) : 0

    // Movement direction vector relative to camera azimuth
    const azRad = THREE.MathUtils.degToRad(smoothAzimuth.current)
    const forwardVec = new THREE.Vector3(Math.sin(azRad), 0, -Math.cos(azRad)).normalize()
    const rightVec = new THREE.Vector3(Math.cos(azRad), 0, Math.sin(azRad)).normalize()

    const moveDir = new THREE.Vector3(0, 0, 0)
    if (keys.current.forward) moveDir.add(forwardVec)
    if (keys.current.backward) moveDir.sub(forwardVec)
    if (keys.current.right) moveDir.add(rightVec)
    if (keys.current.left) moveDir.sub(rightVec)

    if (moveDir.lengthSq() > 0) {
      moveDir.normalize()
    }

    // Smooth momentum acceleration & friction damping
    const targetVel = moveDir.multiplyScalar(targetSpeed)
    smoothVelocity.current.lerp(targetVel, 1 - Math.exp(-12 * delta))

    if (smoothVelocity.current.lengthSq() > 0.001) {
      playerPos.current.addScaledVector(smoothVelocity.current, delta)

      // Footstep sounds
      const currentSpeedRatio = smoothVelocity.current.length() / 4.6
      footstepTimer.current += delta * (isSprinting ? 2.8 : 1.8) * Math.max(0.4, currentSpeedRatio)
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
      playerPos.current.x = Math.max(-25, Math.min(25, playerPos.current.x))
      playerPos.current.z = Math.max(3.8, Math.min(65, playerPos.current.z))
    } else {
      // Tower Lookout Cabin & Wraparound Balcony (y = 0.0)
      playerPos.current.y = 0.0
      playerPos.current.x = Math.max(-3.4, Math.min(3.4, playerPos.current.x))
      playerPos.current.z = Math.max(-3.4, Math.min(3.4, playerPos.current.z))
    }

    setPosition([playerPos.current.x, playerPos.current.y, playerPos.current.z])

    // --- Direct Camera Positioning in FPS & 3P Modes ---
    if (cameraMode === CAMERA_MODES.FIRST_PERSON) {
      if (isMoving) {
        headBobTimer.current += delta * (isSprinting ? 13 : 8.5)
      } else {
        headBobTimer.current += delta * 1.5 // gentle idle breath
      }
      const bobY = isMoving ? Math.sin(headBobTimer.current) * 0.035 : Math.sin(headBobTimer.current) * 0.008
      const bobX = isMoving ? Math.cos(headBobTimer.current * 0.5) * 0.015 : 0

      const eyeY = playerPos.current.y + 1.6 + bobY
      const camPos = new THREE.Vector3(playerPos.current.x + bobX, eyeY, playerPos.current.z)

      const pitchRad = THREE.MathUtils.degToRad(smoothPitch.current)
      const lookTarget = new THREE.Vector3(
        camPos.x + Math.sin(azRad) * Math.cos(pitchRad) * 50,
        camPos.y + Math.sin(pitchRad) * 50,
        camPos.z - Math.cos(azRad) * Math.cos(pitchRad) * 50
      )

      camera.position.copy(camPos)
      camera.lookAt(lookTarget)
      camera.fov = 62
      camera.updateProjectionMatrix()

      // --- First Person Handheld Walkie-Talkie Position & Sway (Firewatch Image 2) ---
      if (firstPersonRadioRef.current) {
        radioSwayTimer.current += delta * (isMoving ? 9 : 2)
        const radioSwayY = Math.sin(radioSwayTimer.current) * (isMoving ? 0.025 : 0.006)
        const radioSwayX = Math.cos(radioSwayTimer.current * 0.5) * (isMoving ? 0.018 : 0.004)
        
        // Base radio offset in front of camera
        const raiseHeight = isRadioOpen ? 0.25 : 0.0
        const rightOffset = 0.28 + radioSwayX
        const downOffset = -0.26 + radioSwayY + raiseHeight
        const forwardOffset = 0.55

        // Transform local camera space to world coordinates
        const radioPos = camPos.clone()
        const rightVecCam = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion)
        const upVecCam = new THREE.Vector3(0, 1, 0).applyQuaternion(camera.quaternion)
        const fwdVecCam = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion)

        radioPos.addScaledVector(rightVecCam, rightOffset)
        radioPos.addScaledVector(upVecCam, downOffset)
        radioPos.addScaledVector(fwdVecCam, forwardOffset)

        firstPersonRadioRef.current.position.copy(radioPos)
        firstPersonRadioRef.current.quaternion.copy(camera.quaternion)
        firstPersonRadioRef.current.rotateY(-0.15)
        firstPersonRadioRef.current.rotateX(0.12)
      }
    } else if (cameraMode === CAMERA_MODES.THIRD_PERSON) {
      const pitchRad = THREE.MathUtils.degToRad(smoothPitch.current)
      const dist = 3.4
      const horizontalDist = dist * Math.cos(pitchRad)
      const verticalOffset = 1.4 + dist * Math.sin(pitchRad)

      const camX = playerPos.current.x - Math.sin(azRad) * horizontalDist
      const camZ = playerPos.current.z + Math.cos(azRad) * horizontalDist
      const camY = playerPos.current.y + Math.max(0.6, verticalOffset)

      const camTarget = new THREE.Vector3(
        playerPos.current.x,
        playerPos.current.y + 1.25,
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

      {/* --- First-Person Handheld Walkie-Talkie (Signature Firewatch Immersion - Image 2) --- */}
      {cameraMode === CAMERA_MODES.FIRST_PERSON && (
        <group ref={firstPersonRadioRef}>
          {/* Handheld Walkie-Talkie Transceiver Body */}
          <group scale={[0.85, 0.85, 0.85]}>
            {/* Ranger Hand / Forearm (Stylized Firewatch Skin) */}
            <mesh position={[0.06, -0.14, 0.04]} rotation={[0.4, 0.2, -0.3]} castShadow>
              <cylinderGeometry args={[0.045, 0.06, 0.24, 12]} />
              <meshStandardMaterial color="#dfb48c" roughness={0.6} />
            </mesh>
            {/* Ranger Thumb Gripping Front */}
            <mesh position={[-0.04, -0.02, 0.035]} rotation={[0.2, 0.3, 0.5]}>
              <boxGeometry args={[0.03, 0.06, 0.03]} />
              <meshStandardMaterial color="#dfb48c" roughness={0.6} />
            </mesh>

            {/* Radio Main Housing (Dark USFS Green-Black Composite) */}
            <mesh position={[0, 0, 0]} castShadow>
              <boxGeometry args={[0.075, 0.16, 0.045]} />
              <meshStandardMaterial color="#212a24" roughness={0.6} />
            </mesh>
            {/* Radio Speaker Grill Slits */}
            {[-0.03, -0.015, 0, 0.015].map((gy, gIdx) => (
              <mesh key={`grill-${gIdx}`} position={[0, gy, 0.023]}>
                <boxGeometry args={[0.05, 0.005, 0.002]} />
                <meshStandardMaterial color="#0f1711" />
              </mesh>
            ))}
            {/* USFS Pine Shield Logo on Radio */}
            <mesh position={[0, 0.045, 0.023]}>
              <coneGeometry args={[0.012, 0.02, 3]} />
              <meshBasicMaterial color="#facc15" />
            </mesh>
            {/* Volume / Squelch Knob */}
            <mesh position={[-0.022, 0.09, 0]} castShadow>
              <cylinderGeometry args={[0.01, 0.01, 0.02, 8]} />
              <meshStandardMaterial color="#111111" metalness={0.7} />
            </mesh>
            {/* Antenna */}
            <mesh position={[0.022, 0.14, 0]} castShadow>
              <cylinderGeometry args={[0.004, 0.006, 0.14, 8]} />
              <meshStandardMaterial color="#181818" roughness={0.4} />
            </mesh>
            {/* Glowing Status LED (Active Radio Radiance) */}
            <mesh position={[-0.022, 0.065, 0.023]}>
              <sphereGeometry args={[0.005, 8, 8]} />
              <meshBasicMaterial color={isRadioOpen ? '#22c55e' : '#eab308'} />
            </mesh>
          </group>
        </group>
      )}
    </>
  )
}
