import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function RangerCharacter({ isMoving, isSprinting }) {
  const rangerGroup = useRef()
  const leftLeg = useRef()
  const rightLeg = useRef()
  const leftArm = useRef()
  const rightArm = useRef()
  const head = useRef()
  const radioLed = useRef()

  useFrame((state, delta) => {
    // LED blink on ranger chest radio
    if (radioLed.current) {
      radioLed.current.material.opacity = Math.sin(state.clock.elapsedTime * 4) > 0 ? 1 : 0.2
    }

    if (isMoving) {
      const speed = isSprinting ? 14 : 8
      const walkCycle = state.clock.elapsedTime * speed

      // Legs swing
      if (leftLeg.current && rightLeg.current) {
        leftLeg.current.rotation.x = Math.sin(walkCycle) * 0.65
        rightLeg.current.rotation.x = -Math.sin(walkCycle) * 0.65
      }
      // Arms swing
      if (leftArm.current && rightArm.current) {
        leftArm.current.rotation.x = -Math.sin(walkCycle) * 0.55
        rightArm.current.rotation.x = Math.sin(walkCycle) * 0.55
      }
      // Subtle torso bounce & head sway
      if (rangerGroup.current) {
        rangerGroup.current.position.y = Math.abs(Math.sin(walkCycle * 2)) * 0.05
      }
      if (head.current) {
        head.current.rotation.z = Math.sin(walkCycle) * 0.04
      }
    } else {
      // Idle breathing
      const idle = Math.sin(state.clock.elapsedTime * 2) * 0.015
      if (leftLeg.current && rightLeg.current) {
        leftLeg.current.rotation.x = THREE.MathUtils.lerp(leftLeg.current.rotation.x, 0, delta * 8)
        rightLeg.current.rotation.x = THREE.MathUtils.lerp(rightLeg.current.rotation.x, 0, delta * 8)
      }
      if (leftArm.current && rightArm.current) {
        leftArm.current.rotation.x = THREE.MathUtils.lerp(leftArm.current.rotation.x, 0, delta * 8)
        rightArm.current.rotation.x = THREE.MathUtils.lerp(rightArm.current.rotation.x, 0, delta * 8)
      }
      if (rangerGroup.current) {
        rangerGroup.current.position.y = idle
      }
      if (head.current) {
        head.current.rotation.z = 0
      }
    }
  })

  return (
    <group ref={rangerGroup} position={[0, 0, 0]}>
      {/* --- Torso (Khaki/Ochre US Forest Service Field Shirt) --- */}
      <mesh position={[0, 0.92, 0]} castShadow>
        <boxGeometry args={[0.44, 0.56, 0.28]} />
        <meshStandardMaterial color="#c28c46" roughness={0.8} />
      </mesh>

      {/* Shirt Collar & V-Neck */}
      <mesh position={[0, 1.2, 0.08]} rotation={[0.2, 0, 0]} castShadow>
        <boxGeometry args={[0.26, 0.08, 0.16]} />
        <meshStandardMaterial color="#a07234" />
      </mesh>

      {/* Forest Service Pine Tree Embroidered Patch on Left Chest */}
      <mesh position={[-0.12, 1.1, 0.145]}>
        <boxGeometry args={[0.07, 0.08, 0.01]} />
        <meshStandardMaterial color="#1e382b" />
      </mesh>
      <mesh position={[-0.12, 1.1, 0.152]}>
        <coneGeometry args={[0.025, 0.05, 3]} />
        <meshBasicMaterial color="#facc15" />
      </mesh>

      {/* Ranger Name Tag on Right Chest ("HENRY") */}
      <mesh position={[0.12, 1.1, 0.145]}>
        <boxGeometry args={[0.09, 0.03, 0.01]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      <mesh position={[0.12, 1.1, 0.152]}>
        <boxGeometry args={[0.07, 0.015, 0.005]} />
        <meshBasicMaterial color="#f8fafc" />
      </mesh>

      {/* Dual Chest Pockets with Brass Snaps */}
      <mesh position={[-0.12, 0.96, 0.145]}>
        <boxGeometry args={[0.12, 0.14, 0.02]} />
        <meshStandardMaterial color="#a07234" />
      </mesh>
      <mesh position={[0.12, 0.96, 0.145]}>
        <boxGeometry args={[0.12, 0.14, 0.02]} />
        <meshStandardMaterial color="#a07234" />
      </mesh>

      {/* Heavy-Duty Leather Belt with Brass Buckle */}
      <mesh position={[0, 0.64, 0]} castShadow>
        <boxGeometry args={[0.45, 0.08, 0.29]} />
        <meshStandardMaterial color="#3b2314" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.64, 0.15]}>
        <boxGeometry args={[0.08, 0.07, 0.02]} />
        <meshStandardMaterial color="#d4a359" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Compass Leather Pouch on Right Hip */}
      <mesh position={[0.22, 0.62, 0.04]} castShadow>
        <boxGeometry args={[0.07, 0.09, 0.08]} />
        <meshStandardMaterial color="#2d170b" />
      </mesh>

      {/* Handheld Walkie-Talkie on Left Chest Strap */}
      <group position={[-0.16, 1.02, 0.17]}>
        <mesh castShadow>
          <boxGeometry args={[0.07, 0.16, 0.05]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.5} />
        </mesh>
        {/* Antenna */}
        <mesh position={[0.02, 0.14, 0]}>
          <cylinderGeometry args={[0.008, 0.008, 0.15, 6]} />
          <meshStandardMaterial color="#111111" />
        </mesh>
        {/* Blinking Status LED */}
        <mesh ref={radioLed} position={[0.02, 0.05, 0.03]}>
          <sphereGeometry args={[0.01, 8, 8]} />
          <meshBasicMaterial color="#22c55e" transparent />
        </mesh>
      </group>

      {/* --- Heavy Expedition Backpack --- */}
      <group position={[0, 0.95, -0.2]}>
        {/* Main Canvas Forest Pack */}
        <mesh castShadow>
          <boxGeometry args={[0.38, 0.5, 0.24]} />
          <meshStandardMaterial color="#2d4233" roughness={0.9} />
        </mesh>
        {/* Front Accessory Pocket with Zipper Line */}
        <mesh position={[0, -0.08, -0.13]} castShadow>
          <boxGeometry args={[0.28, 0.22, 0.06]} />
          <meshStandardMaterial color="#243629" />
        </mesh>
        {/* Rolled Crimson Sleeping Bag / Bedroll on Top */}
        <mesh position={[0, 0.32, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.1, 0.1, 0.44, 12]} />
          <meshStandardMaterial color="#8a3020" roughness={0.8} />
        </mesh>
        {/* Bedroll Leather Tie-Down Straps */}
        {[-0.14, 0.14].map((x, i) => (
          <mesh key={`strap-${i}`} position={[x, 0.32, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.105, 0.105, 0.03, 12]} />
            <meshStandardMaterial color="#24140b" />
          </mesh>
        ))}
        {/* Steel Enamel Canteen Flask on Left Side */}
        <mesh position={[-0.22, 0, 0]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 0.18, 8]} />
          <meshStandardMaterial color="#3b5266" roughness={0.4} metalness={0.6} />
        </mesh>
        {/* Coiled Golden Climbing Rope with Carabiners on Right Side */}
        <mesh position={[0.22, 0, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
          <torusGeometry args={[0.08, 0.035, 8, 16]} />
          <meshStandardMaterial color="#d4a359" roughness={0.9} />
        </mesh>
        <mesh position={[0.22, 0.08, 0]}>
          <torusGeometry args={[0.025, 0.008, 6, 8]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>

      {/* --- Head & Iconic Ranger Felt Hat --- */}
      <group ref={head} position={[0, 1.34, 0]}>
        {/* Head */}
        <mesh castShadow>
          <sphereGeometry args={[0.14, 16, 16]} />
          <meshStandardMaterial color="#dfb48c" roughness={0.6} />
        </mesh>

        {/* Brown Full Beard */}
        <mesh position={[0, -0.04, 0.09]}>
          <boxGeometry args={[0.15, 0.1, 0.1]} />
          <meshStandardMaterial color="#4a2e18" roughness={0.9} />
        </mesh>

        {/* Iconic Wide-Brim Ranger Felt Hat */}
        <group position={[0, 0.12, 0]}>
          {/* Wide Brim */}
          <mesh castShadow>
            <cylinderGeometry args={[0.3, 0.32, 0.03, 16]} />
            <meshStandardMaterial color="#4a3728" roughness={0.9} />
          </mesh>
          {/* Hat Crown (Four Dents Peak) */}
          <mesh position={[0, 0.08, 0]} castShadow>
            <cylinderGeometry args={[0.15, 0.17, 0.14, 16]} />
            <meshStandardMaterial color="#4a3728" roughness={0.9} />
          </mesh>
          {/* Dark Leather Hatband */}
          <mesh position={[0, 0.02, 0]}>
            <cylinderGeometry args={[0.175, 0.175, 0.025, 16]} />
            <meshStandardMaterial color="#24140b" />
          </mesh>
          {/* USFS Hat Pin */}
          <mesh position={[0, 0.05, 0.165]}>
            <boxGeometry args={[0.02, 0.02, 0.01]} />
            <meshStandardMaterial color="#facc15" metalness={0.9} />
          </mesh>
        </group>
      </group>

      {/* --- Left Arm with Rolled Sleeves, USFS Patch & Field Watch --- */}
      <group ref={leftArmRef} position={[-0.28, 1.15, 0]}>
        {/* Shoulder / Upper Arm */}
        <mesh position={[0, -0.16, 0]} castShadow>
          <boxGeometry args={[0.13, 0.32, 0.14]} />
          <meshStandardMaterial color="#c28c46" />
        </mesh>
        {/* Shoulder Patch */}
        <mesh position={[-0.07, -0.12, 0]}>
          <boxGeometry args={[0.01, 0.08, 0.06]} />
          <meshStandardMaterial color="#1e382b" />
        </mesh>
        {/* Forearm (Skin) */}
        <mesh position={[0, -0.38, 0]} castShadow>
          <boxGeometry args={[0.11, 0.22, 0.12]} />
          <meshStandardMaterial color="#dfb48c" />
        </mesh>
        {/* Field Watch on Left Wrist */}
        <mesh position={[0, -0.44, 0]}>
          <boxGeometry args={[0.12, 0.04, 0.13]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
      </group>

      {/* --- Right Arm with Rolled Sleeves --- */}
      <group ref={rightArmRef} position={[0.28, 1.15, 0]}>
        <mesh position={[0, -0.16, 0]} castShadow>
          <boxGeometry args={[0.13, 0.32, 0.14]} />
          <meshStandardMaterial color="#c28c46" />
        </mesh>
        <mesh position={[0, -0.38, 0]} castShadow>
          <boxGeometry args={[0.11, 0.22, 0.12]} />
          <meshStandardMaterial color="#dfb48c" />
        </mesh>
      </group>

      {/* --- Left Leg with Cargo Pants & Hiking Boot --- */}
      <group ref={leftLegRef} position={[-0.13, 0.6, 0]}>
        {/* Trousers */}
        <mesh position={[0, -0.3, 0]} castShadow>
          <boxGeometry args={[0.16, 0.58, 0.18]} />
          <meshStandardMaterial color="#382d24" roughness={0.9} />
        </mesh>
        {/* Cargo Side Pocket */}
        <mesh position={[-0.08, -0.25, 0]}>
          <boxGeometry args={[0.03, 0.14, 0.12]} />
          <meshStandardMaterial color="#30251c" />
        </mesh>
        {/* Rugged Vibram Sole Hiking Boot */}
        <group position={[0, -0.6, 0.02]}>
          <mesh castShadow>
            <boxGeometry args={[0.17, 0.12, 0.26]} />
            <meshStandardMaterial color="#1f140e" roughness={0.8} />
          </mesh>
          {/* Black Rubber Sole */}
          <mesh position={[0, -0.06, 0]}>
            <boxGeometry args={[0.18, 0.03, 0.27]} />
            <meshStandardMaterial color="#0f0f0f" roughness={0.95} />
          </mesh>
          {/* Bright Firewatch Red Boot Laces */}
          <mesh position={[0, 0.05, 0.04]}>
            <boxGeometry args={[0.06, 0.03, 0.12]} />
            <meshBasicMaterial color="#dc2626" />
          </mesh>
        </group>
      </group>

      {/* --- Right Leg with Cargo Pants & Hiking Boot --- */}
      <group ref={rightLegRef} position={[0.13, 0.6, 0]}>
        <mesh position={[0, -0.3, 0]} castShadow>
          <boxGeometry args={[0.16, 0.58, 0.18]} />
          <meshStandardMaterial color="#382d24" roughness={0.9} />
        </mesh>
        <mesh position={[0.08, -0.25, 0]}>
          <boxGeometry args={[0.03, 0.14, 0.12]} />
          <meshStandardMaterial color="#30251c" />
        </mesh>
        <group position={[0, -0.6, 0.02]}>
          <mesh castShadow>
            <boxGeometry args={[0.17, 0.12, 0.26]} />
            <meshStandardMaterial color="#1f140e" roughness={0.8} />
          </mesh>
          <mesh position={[0, -0.06, 0]}>
            <boxGeometry args={[0.18, 0.03, 0.27]} />
            <meshStandardMaterial color="#0f0f0f" roughness={0.95} />
          </mesh>
          <mesh position={[0, 0.05, 0.04]}>
            <boxGeometry args={[0.06, 0.03, 0.12]} />
            <meshBasicMaterial color="#dc2626" />
          </mesh>
        </group>
      </group>
    </group>
  )
}
