import React, { useRef, useState } from 'react'
import { usePlayerStore } from '../../stores/usePlayerStore'
import { useCameraStore, CAMERA_MODES } from '../../stores/useCameraStore'

export function VirtualJoystick() {
  const cameraMode = useCameraStore((state) => state.mode)
  const position = usePlayerStore((state) => state.position)
  const setPosition = usePlayerStore((state) => state.setPosition)
  const setMovementState = usePlayerStore((state) => state.setMovementState)
  const azimuth = useCameraStore((state) => state.azimuth)

  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 })
  const isDragging = useRef(false)
  const startTouch = useRef({ x: 0, y: 0 })
  const moveInterval = useRef(null)

  if (cameraMode !== CAMERA_MODES.FIRST_PERSON && cameraMode !== CAMERA_MODES.THIRD_PERSON) {
    return null
  }

  const handleTouchStart = (e) => {
    isDragging.current = true
    const touch = e.touches[0]
    startTouch.current = { x: touch.clientX, y: touch.clientY }

    if (moveInterval.current) clearInterval(moveInterval.current)
    moveInterval.current = setInterval(() => {
      setMovementState(true)
    }, 50)
  }

  const handleTouchMove = (e) => {
    if (!isDragging.current) return
    const touch = e.touches[0]
    const deltaX = touch.clientX - startTouch.current.x
    const deltaY = touch.clientY - startTouch.current.y

    const distance = Math.min(40, Math.sqrt(deltaX * deltaX + deltaY * deltaY))
    const angle = Math.atan2(deltaY, deltaX)

    const knX = Math.cos(angle) * distance
    const knY = Math.sin(angle) * distance
    setKnobPos({ x: knX, y: knY })

    // Movement calculation
    const normX = knX / 40
    const normY = knY / 40

    const azRad = (azimuth * Math.PI) / 180
    const fwdX = Math.sin(azRad)
    const fwdZ = -Math.cos(azRad)
    const rightX = Math.cos(azRad)
    const rightZ = Math.sin(azRad)

    const dx = (-normY * fwdX + normX * rightX) * 0.18
    const dz = (-normY * fwdZ + normX * rightZ) * 0.18

    const currentPos = usePlayerStore.getState().position
    setPosition([currentPos[0] + dx, currentPos[1], currentPos[2] + dz])
  }

  const handleTouchEnd = () => {
    isDragging.current = false
    setKnobPos({ x: 0, y: 0 })
    setMovementState(false)
    if (moveInterval.current) {
      clearInterval(moveInterval.current)
      moveInterval.current = null
    }
  }

  return (
    <div
      id="virtual-mobile-joystick"
      className="sm:hidden fixed bottom-8 left-8 z-30 pointer-events-auto select-none"
    >
      <div
        className="w-28 h-28 rounded-full fw-panel border border-amber-500/40 shadow-2xl relative flex items-center justify-center touch-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
      >
        {/* Joystick Base Ring */}
        <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center pointer-events-none">
          {/* Thumb Knob */}
          <div
            className="w-10 h-10 rounded-full bg-amber-500 shadow-xl border border-amber-300 pointer-events-none transform transition-transform"
            style={{
              transform: `translate(${knobPos.x}px, ${knobPos.y}px)`
            }}
          />
        </div>
      </div>
    </div>
  )
}
