import { Html, OrbitControls } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

import type { EquipmentStatus, PlantEquipment, RiskLevel } from '@/data/plant/types'
import { PLANT_ZONES } from '@/data/plant/zones'
import type { ZoneState } from '@/store/usePlantStore'
import { usePlantStore } from '@/store/usePlantStore'

type ViewState = '3d' | 'top'
type HeatMode = 'heat' | 'bubble'

type ZoneArea = {
  id: string
  label: string
  center: [number, number, number]
  size: [number, number]
}

type EquipmentShape = 'tank' | 'tower' | 'reactor' | 'pump' | 'building' | 'loading' | 'pipelineNode' | 'exchanger' | 'valve' | 'cooling'

const ZONE_AREAS: ZoneArea[] = [
  { id: 'ZONE A', label: 'ZONE A STORAGE', center: [-9, 0, -5], size: [5.5, 5] },
  { id: 'ZONE B', label: 'ZONE B PROCESSING', center: [-2.5, 0, -4], size: [5, 5.5] },
  { id: 'ZONE C', label: 'ZONE C HOT WORK', center: [3.5, 0, -2.5], size: [4.5, 5] },
  { id: 'ZONE D', label: 'ZONE D CONTROL', center: [9, 0, -4.5], size: [4.5, 4.5] },
  { id: 'ZONE E', label: 'ZONE E LOADING', center: [6.5, 0, 5], size: [5.5, 4.5] },
]

const PIPELINES: Array<{ id: string; from: [number, number, number]; to: [number, number, number] }> = [
  { id: 'p-a-b', from: [-7.2, 1.15, -4.8], to: [-4.4, 1.15, -4.4] },
  { id: 'p-b-c', from: [-0.8, 1.5, -3.8], to: [2.1, 1.5, -2.7] },
  { id: 'p-c-d', from: [5.2, 1.1, -2.6], to: [7.4, 1.1, -3.9] },
  { id: 'p-b-e', from: [-1.4, 0.8, -1.8], to: [4.4, 0.8, 3.2] },
  { id: 'p-d-e', from: [8.4, 0.9, -2.2], to: [7.1, 0.9, 3.0] },
]

function zoneRiskHex(score: number): string {
  if (score >= 81) return '#ef4444'
  if (score >= 61) return '#f97316'
  if (score >= 41) return '#facc15'
  if (score >= 21) return '#22c55e'
  return '#3b82f6'
}

function zoneRiskLabel(score: number): string {
  if (score >= 81) return 'Critical'
  if (score >= 61) return 'High'
  if (score >= 41) return 'Medium'
  if (score >= 21) return 'Low'
  return 'Safe'
}

function equipmentHex(status: EquipmentStatus): string {
  switch (status) {
    case 'Critical':
      return '#ef4444'
    case 'Warning':
      return '#f97316'
    case 'Maintenance':
      return '#3b82f6'
    case 'Offline':
      return '#64748b'
    default:
      return '#10b981'
  }
}

function sensorRiskLevel(value: number, min: number, max: number): RiskLevel {
  const span = Math.max(1, max - min)
  const normalized = ((value - min) / span) * 100
  if (normalized >= 81) return 'critical'
  if (normalized >= 61) return 'high'
  if (normalized >= 41) return 'medium'
  if (normalized >= 21) return 'low'
  return 'safe'
}

function sensorHex(level: RiskLevel): string {
  switch (level) {
    case 'critical':
      return '#ef4444'
    case 'high':
      return '#f97316'
    case 'medium':
      return '#facc15'
    case 'low':
      return '#22c55e'
    default:
      return '#3b82f6'
  }
}

function severityTextClass(level: RiskLevel): string {
  switch (level) {
    case 'critical':
      return 'text-critical'
    case 'high':
      return 'text-orange-500'
    case 'medium':
      return 'text-yellow-400'
    case 'low':
      return 'text-success'
    default:
      return 'text-primary'
  }
}

function equipmentShape(type: string): EquipmentShape {
  if (type.includes('Storage')) return 'tank'
  if (type.includes('Cooling')) return 'cooling'
  if (type.includes('Distillation')) return 'tower'
  if (type.includes('Reactor')) return 'reactor'
  if (type.includes('Heat Exchanger')) return 'exchanger'
  if (type.includes('Pump')) return 'pump'
  if (type.includes('Warehouse')) return 'building'
  if (type.includes('Loading')) return 'loading'
  if (type.includes('Control')) return 'building'
  if (type.includes('Valve')) return 'valve'
  if (type.includes('Pipeline')) return 'pipelineNode'
  return 'building'
}

function lineSegmentTransform(from: [number, number, number], to: [number, number, number]) {
  const fx = from[0]
  const fy = from[1]
  const fz = from[2]
  const tx = to[0]
  const ty = to[1]
  const tz = to[2]
  const dx = tx - fx
  const dy = ty - fy
  const dz = tz - fz
  const len = Math.sqrt(dx * dx + dy * dy + dz * dz)
  const mid: [number, number, number] = [fx + dx / 2, fy + dy / 2, fz + dz / 2]
  const yaw = Math.atan2(dx, dz)
  const pitch = -Math.atan2(dy, Math.sqrt(dx * dx + dz * dz))
  return { len, mid, yaw, pitch }
}

function CameraRig({
  view,
  selectedZone,
  trigger,
}: {
  view: ViewState
  selectedZone: ZoneState | null
  trigger: number
}) {
  const { camera } = useThree()
  const controlsRef = useRef<any>(null)
  const desiredPos = useRef(new THREE.Vector3(0, 13, 18))
  const desiredTarget = useRef(new THREE.Vector3(0, 0, 0))

  useEffect(() => {
    if (selectedZone) {
      if (view === 'top') {
        desiredPos.current.set(selectedZone.position.x, 22, selectedZone.position.z + 0.01)
      } else {
        desiredPos.current.set(selectedZone.position.x + 5.5, 11.5, selectedZone.position.z + 8.5)
      }
      desiredTarget.current.set(selectedZone.position.x, 0.2, selectedZone.position.z)
      return
    }

    if (view === 'top') {
      desiredPos.current.set(0, 28, 0.01)
      desiredTarget.current.set(0, 0, 0)
    } else {
      desiredPos.current.set(0, 13, 18)
      desiredTarget.current.set(0, 0.8, 0)
    }
  }, [view, selectedZone])

  useEffect(() => {
    if (!controlsRef.current) return
    controlsRef.current.target.copy(desiredTarget.current)
    controlsRef.current.update()
  }, [trigger])

  useFrame(() => {
    camera.position.lerp(desiredPos.current, 0.06)
    if (controlsRef.current) {
      controlsRef.current.target.lerp(desiredTarget.current, 0.06)
      controlsRef.current.update()
    } else {
      camera.lookAt(desiredTarget.current)
    }
  })

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enablePan
      enableZoom
      enableRotate={view === '3d'}
      minDistance={6}
      maxDistance={40}
      maxPolarAngle={Math.PI / 2.05}
      minPolarAngle={view === 'top' ? 0.01 : 0.2}
    />
  )
}

function GroundAndAtmosphere() {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[56, 56]} />
        <meshStandardMaterial color="#040b14" />
      </mesh>

      <gridHelper args={[56, 52, '#193146', '#102437']} position={[0, 0.005, 0]} />

      <mesh position={[0, 7.8, -8]}>
        <boxGeometry args={[44, 16, 0.1]} />
        <meshStandardMaterial color="#0b1a2d" transparent opacity={0.16} emissive="#12243b" emissiveIntensity={0.2} />
      </mesh>
    </>
  )
}

function ZoneHeatSurface({ zone, selected, mode }: { zone: ZoneState; selected: boolean; mode: HeatMode }) {
  const baseColor = useMemo(() => new THREE.Color(zoneRiskHex(zone.riskScore)), [zone.riskScore])
  const ringRef = useRef<THREE.Mesh>(null)
  const planeRef = useRef<THREE.Mesh>(null)
  const radius = Math.max(zone.size.width, zone.size.depth) * 0.54
  const intensity = zone.riskScore / 100

  useFrame(({ clock }) => {
    const t = clock.elapsedTime

    if (ringRef.current) {
      const ringMat = ringRef.current.material as THREE.MeshStandardMaterial
      const pulse = zone.riskScore >= 81 ? 0.35 + Math.sin(t * 2.8) * 0.2 : 0.14 + intensity * 0.15
      ringMat.opacity = pulse
      ringMat.emissiveIntensity = zone.riskScore >= 81 ? 0.9 + Math.sin(t * 3.2) * 0.25 : 0.4 + intensity * 0.35
      const grow = zone.riskScore >= 81 ? 1.04 + Math.sin(t * 2.3) * 0.08 : 1
      ringRef.current.scale.set(grow, 1, grow)
    }

    if (planeRef.current) {
      const planeMat = planeRef.current.material as THREE.MeshStandardMaterial
      planeMat.opacity = mode === 'bubble' ? 0.14 : 0.1 + intensity * 0.28
      planeMat.emissiveIntensity = selected ? 0.35 : 0.18 + intensity * 0.35
      if (mode === 'bubble') {
        planeRef.current.position.y = 0.07 + intensity * 0.18 + Math.sin(t * 1.3 + zone.position.x) * 0.03
      }
    }
  })

  return (
    <group position={[zone.position.x, 0, zone.position.z]}>
      <mesh ref={planeRef} position={[0, 0.04, 0]}>
        <boxGeometry args={[zone.size.width, 0.06, zone.size.depth]} />
        <meshStandardMaterial
          color={baseColor}
          emissive={baseColor}
          emissiveIntensity={0.24}
          transparent
          opacity={0.2}
          metalness={0.2}
          roughness={0.6}
        />
      </mesh>

      <mesh ref={ringRef} position={[0, 0.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius * 0.84, radius, 48]} />
        <meshStandardMaterial color={baseColor} emissive={baseColor} emissiveIntensity={0.65} transparent opacity={0.2} side={THREE.DoubleSide} />
      </mesh>

      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(zone.size.width, 0.1, zone.size.depth)]} />
        <lineBasicMaterial color={zoneRiskHex(zone.riskScore)} transparent opacity={selected ? 0.9 : 0.46} />
      </lineSegments>

      <mesh
        position={[0, 0.08, 0]}
        onClick={() => {
          // handled by parent pointer events on overlay mesh below
        }}
      >
        <boxGeometry args={[zone.size.width + 0.2, 0.08, zone.size.depth + 0.2]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      <Html center position={[0, 1.35, 0]} style={{ pointerEvents: 'none' }}>
        <div
          style={{
            border: `1px solid ${zoneRiskHex(zone.riskScore)}aa`,
            background: '#071120d9',
            color: '#dbe8ff',
            borderRadius: 6,
            padding: '4px 8px',
            minWidth: 122,
            textAlign: 'center',
            boxShadow: `0 0 16px ${zoneRiskHex(zone.riskScore)}44`,
          }}
        >
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', color: zoneRiskHex(zone.riskScore) }}>{zone.label.replace(' — ', ' ')}</div>
          <div style={{ marginTop: 2, fontSize: 9, letterSpacing: '0.08em' }}>{zoneRiskLabel(zone.riskScore).toUpperCase()} · {zone.riskScore}</div>
        </div>
      </Html>
    </group>
  )
}

function TankAssembly({ color, scale = 1 }: { color: string; scale?: number }) {
  return (
    <group scale={scale}>
      <mesh position={[0, 0.9, 0]} castShadow>
        <cylinderGeometry args={[0.85, 0.9, 1.7, 20]} />
        <meshStandardMaterial color="#61718b" metalness={0.68} roughness={0.34} emissive={color} emissiveIntensity={0.08} />
      </mesh>
      <mesh position={[0, 1.84, 0]} castShadow>
        <coneGeometry args={[0.75, 0.46, 20]} />
        <meshStandardMaterial color="#546881" metalness={0.66} roughness={0.4} emissive={color} emissiveIntensity={0.05} />
      </mesh>
      <mesh position={[0.95, 0.55, 0.6]} castShadow>
        <boxGeometry args={[0.42, 0.3, 0.42]} />
        <meshStandardMaterial color="#485a70" metalness={0.5} roughness={0.46} />
      </mesh>
    </group>
  )
}

function TowerAssembly({ color, scale = 1 }: { color: string; scale?: number }) {
  return (
    <group scale={scale}>
      <mesh position={[0, 1.85, 0]} castShadow>
        <cylinderGeometry args={[0.36, 0.52, 3.7, 20]} />
        <meshStandardMaterial color="#5f6f86" metalness={0.72} roughness={0.28} emissive={color} emissiveIntensity={0.1} />
      </mesh>
      <mesh position={[0, 3.95, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.32, 0.65, 16]} />
        <meshStandardMaterial color="#8b9db8" metalness={0.75} roughness={0.2} emissive="#9fb4d4" emissiveIntensity={0.28} />
      </mesh>
      <mesh position={[0.62, 1.3, 0]} castShadow>
        <boxGeometry args={[0.2, 0.14, 1.0]} />
        <meshStandardMaterial color="#4f6079" metalness={0.55} roughness={0.42} />
      </mesh>
    </group>
  )
}

function ReactorAssembly({ color, scale = 1 }: { color: string; scale?: number }) {
  return (
    <group scale={scale}>
      <mesh position={[0, 1.2, 0]} castShadow>
        <cylinderGeometry args={[0.78, 0.78, 1.9, 20]} />
        <meshStandardMaterial color="#64748b" metalness={0.75} roughness={0.25} emissive={color} emissiveIntensity={0.26} />
      </mesh>
      <mesh position={[0, 2.3, 0]} castShadow>
        <sphereGeometry args={[0.62, 18, 16]} />
        <meshStandardMaterial color="#566981" metalness={0.66} roughness={0.35} emissive={color} emissiveIntensity={0.18} />
      </mesh>
      <mesh position={[0.95, 1.42, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.11, 0.11, 1.5, 12]} />
        <meshStandardMaterial color="#7d8fa9" metalness={0.7} roughness={0.24} />
      </mesh>
      <mesh position={[0, 0.18, 0]} castShadow>
        <boxGeometry args={[2.0, 0.24, 1.4]} />
        <meshStandardMaterial color="#2a3b52" metalness={0.34} roughness={0.56} />
      </mesh>
    </group>
  )
}

function BuildingAssembly({ color, scale = 1 }: { color: string; scale?: number }) {
  return (
    <group scale={scale}>
      <mesh position={[0, 0.8, 0]} castShadow>
        <boxGeometry args={[2.0, 1.6, 1.4]} />
        <meshStandardMaterial color="#243b58" metalness={0.22} roughness={0.72} emissive={color} emissiveIntensity={0.05} />
      </mesh>
      <mesh position={[0, 1.7, 0.3]} castShadow>
        <boxGeometry args={[1.2, 0.22, 0.8]} />
        <meshStandardMaterial color="#1a2f47" metalness={0.3} roughness={0.64} />
      </mesh>
      <mesh position={[0.74, 0.7, 0.76]} castShadow>
        <boxGeometry args={[0.34, 0.7, 0.2]} />
        <meshStandardMaterial color="#6786ab" metalness={0.45} roughness={0.45} emissive="#6cb8ff" emissiveIntensity={0.18} />
      </mesh>
    </group>
  )
}

function LoadingAssembly({ color, scale = 1 }: { color: string; scale?: number }) {
  return (
    <group scale={scale}>
      <mesh position={[0, 0.35, 0]} castShadow>
        <boxGeometry args={[2.6, 0.7, 1.5]} />
        <meshStandardMaterial color="#39506a" metalness={0.24} roughness={0.67} emissive={color} emissiveIntensity={0.06} />
      </mesh>
      <mesh position={[0.7, 1.05, 0]} castShadow>
        <boxGeometry args={[1.0, 0.28, 1.2]} />
        <meshStandardMaterial color="#31475f" metalness={0.3} roughness={0.65} />
      </mesh>
      <mesh position={[-0.95, 0.22, 0.46]} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 0.36, 12]} />
        <meshStandardMaterial color="#8aa2bf" metalness={0.6} roughness={0.3} />
      </mesh>
    </group>
  )
}

function PumpAssembly({ color, scale = 1 }: { color: string; scale?: number }) {
  return (
    <group scale={scale}>
      <mesh position={[0, 0.36, 0]} castShadow>
        <boxGeometry args={[1.4, 0.5, 0.9]} />
        <meshStandardMaterial color="#3f536b" metalness={0.35} roughness={0.56} emissive={color} emissiveIntensity={0.07} />
      </mesh>
      <mesh position={[0.62, 0.42, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.22, 0.22, 1.05, 14]} />
        <meshStandardMaterial color="#6d829d" metalness={0.65} roughness={0.31} />
      </mesh>
      <mesh position={[-0.56, 0.22, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.18, 0.42, 12]} />
        <meshStandardMaterial color="#8aa4c3" metalness={0.65} roughness={0.3} />
      </mesh>
    </group>
  )
}

function ExchangerAssembly({ color, scale = 1 }: { color: string; scale?: number }) {
  return (
    <group scale={scale}>
      <mesh position={[0, 0.5, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.32, 0.32, 2.1, 16]} />
        <meshStandardMaterial color="#5f738f" metalness={0.68} roughness={0.3} emissive={color} emissiveIntensity={0.09} />
      </mesh>
      <mesh position={[-0.9, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.22, 0.34, 14]} />
        <meshStandardMaterial color="#7f95b2" metalness={0.6} roughness={0.35} />
      </mesh>
      <mesh position={[0.9, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.22, 0.34, 14]} />
        <meshStandardMaterial color="#7f95b2" metalness={0.6} roughness={0.35} />
      </mesh>
    </group>
  )
}

function PipelineNodeAssembly({ color, scale = 1 }: { color: string; scale?: number }) {
  return (
    <group scale={scale}>
      <mesh position={[0, 0.34, 0]} castShadow>
        <boxGeometry args={[0.9, 0.54, 0.9]} />
        <meshStandardMaterial color="#41556f" metalness={0.44} roughness={0.52} emissive={color} emissiveIntensity={0.08} />
      </mesh>
      <mesh position={[0.45, 0.36, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.1, 0.1, 0.7, 12]} />
        <meshStandardMaterial color="#8ea5c4" metalness={0.65} roughness={0.28} />
      </mesh>
      <mesh position={[0, 0.7, 0]} castShadow>
        <cylinderGeometry args={[0.11, 0.11, 0.48, 12]} />
        <meshStandardMaterial color="#8ea5c4" metalness={0.65} roughness={0.28} />
      </mesh>
    </group>
  )
}

function ValveAssembly({ color, scale = 1 }: { color: string; scale?: number }) {
  return (
    <group scale={scale}>
      <mesh position={[0, 0.2, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.18, 0.18, 0.65, 12]} />
        <meshStandardMaterial color="#748ba9" metalness={0.68} roughness={0.31} emissive={color} emissiveIntensity={0.08} />
      </mesh>
      <mesh position={[0, 0.44, 0]} castShadow>
        <torusGeometry args={[0.18, 0.05, 10, 20]} />
        <meshStandardMaterial color="#9fb7d4" metalness={0.74} roughness={0.25} />
      </mesh>
    </group>
  )
}

function CoolingAssembly({ color, scale = 1 }: { color: string; scale?: number }) {
  return (
    <group scale={scale}>
      <mesh position={[0, 1, 0]} castShadow>
        <cylinderGeometry args={[0.95, 0.72, 1.9, 22]} />
        <meshStandardMaterial color="#60718a" metalness={0.62} roughness={0.33} emissive={color} emissiveIntensity={0.08} />
      </mesh>
      <mesh position={[0, 1.98, 0]} castShadow>
        <cylinderGeometry args={[0.66, 0.78, 0.2, 20]} />
        <meshStandardMaterial color="#7f93b0" metalness={0.68} roughness={0.25} />
      </mesh>
      <mesh position={[0, 2.1, 0]} castShadow>
        <boxGeometry args={[0.08, 0.14, 1.2]} />
        <meshStandardMaterial color="#a3b8d6" metalness={0.74} roughness={0.2} emissive="#8ac5ff" emissiveIntensity={0.3} />
      </mesh>
    </group>
  )
}

function EquipmentMesh({
  equipment,
  selected,
  onSelect,
}: {
  equipment: PlantEquipment
  selected: boolean
  onSelect: () => void
}) {
  const color = equipmentHex(equipment.status)
  const zoneColor = zoneRiskHex(equipment.failureProbability * 100)
  const highlightRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (!highlightRef.current) return
    const mat = highlightRef.current.material as THREE.MeshStandardMaterial
    const t = clock.elapsedTime
    const statusPulse = equipment.status === 'Critical' ? 0.56 + Math.sin(t * 3.4) * 0.2 : 0.22
    mat.opacity = selected ? 0.52 + Math.sin(t * 3) * 0.14 : statusPulse
    mat.emissiveIntensity = selected ? 1 : equipment.status === 'Critical' ? 0.85 : 0.45
  })

  const shape = equipmentShape(equipment.type)

  return (
    <group position={[equipment.position.x, 0, equipment.position.z]} onClick={onSelect}>
      {shape === 'tank' && <TankAssembly color={color} scale={Math.max(0.8, equipment.scale.x * 0.7)} />}
      {shape === 'tower' && <TowerAssembly color={color} scale={Math.max(0.8, equipment.scale.y * 0.46)} />}
      {shape === 'reactor' && <ReactorAssembly color={color} scale={Math.max(0.8, equipment.scale.x * 0.74)} />}
      {shape === 'pump' && <PumpAssembly color={color} scale={Math.max(0.8, equipment.scale.x * 0.84)} />}
      {shape === 'building' && <BuildingAssembly color={color} scale={Math.max(0.8, equipment.scale.x * 0.72)} />}
      {shape === 'loading' && <LoadingAssembly color={color} scale={Math.max(0.8, equipment.scale.x * 0.76)} />}
      {shape === 'pipelineNode' && <PipelineNodeAssembly color={color} scale={Math.max(0.8, equipment.scale.x * 0.78)} />}
      {shape === 'exchanger' && <ExchangerAssembly color={color} scale={Math.max(0.8, equipment.scale.x * 0.84)} />}
      {shape === 'valve' && <ValveAssembly color={color} scale={Math.max(0.8, equipment.scale.x * 0.96)} />}
      {shape === 'cooling' && <CoolingAssembly color={color} scale={Math.max(0.8, equipment.scale.x * 0.66)} />}

      <mesh ref={highlightRef} position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.74, 1.0, 30]} />
        <meshStandardMaterial color={selected ? '#60a5fa' : zoneColor} emissive={selected ? '#60a5fa' : zoneColor} transparent opacity={0.26} side={THREE.DoubleSide} />
      </mesh>

      {selected && (
        <Html center position={[0, 2.8, 0]} style={{ pointerEvents: 'none' }}>
          <div
            style={{
              border: '1px solid #60a5fa88',
              background: '#081326d9',
              color: '#dbeafe',
              borderRadius: 6,
              padding: '3px 7px',
              fontSize: 8,
              fontWeight: 600,
              letterSpacing: '0.08em',
            }}
          >
            {equipment.id}
          </div>
        </Html>
      )}
    </group>
  )
}

function ProcessPipelines({ zones }: { zones: ZoneState[] }) {
  const zoneRiskMap = useMemo(() => {
    const map = new Map<string, number>()
    zones.forEach((zone) => map.set(zone.id, zone.riskScore))
    return map
  }, [zones])

  return (
    <group>
      {PIPELINES.map((pipe, index) => {
        const transform = lineSegmentTransform(pipe.from, pipe.to)
        const zone = ZONE_AREAS[index % ZONE_AREAS.length]
        const risk = zoneRiskMap.get(zone.id) ?? 30
        const color = zoneRiskHex(risk)

        return (
          <group key={pipe.id} position={transform.mid} rotation={[transform.pitch, transform.yaw, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.1, 0.1, transform.len, 12]} />
              <meshStandardMaterial color="#5b6e88" metalness={0.7} roughness={0.28} emissive={color} emissiveIntensity={0.22 + risk / 200} />
            </mesh>
            <mesh position={[0, transform.len / 4, 0]}>
              <torusGeometry args={[0.16, 0.03, 10, 22]} />
              <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.7} />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}

function SensorMarker({
  sensorId,
  type,
  value,
  unit,
  position,
  level,
  selected,
  onSelect,
}: {
  sensorId: string
  type: string
  value: number
  unit: string
  position: { x: number; y: number; z: number }
  level: RiskLevel
  selected: boolean
  onSelect: () => void
}) {
  const color = sensorHex(level)
  const markerRef = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (!markerRef.current) return
    const t = clock.elapsedTime
    markerRef.current.position.y = position.y + 0.55 + Math.sin(t * 2.8 + position.x) * 0.07
    const mat = markerRef.current.material as THREE.MeshStandardMaterial
    mat.emissiveIntensity = 0.5 + Math.sin(t * 4.2 + position.z) * 0.24
  })

  return (
    <group onClick={onSelect}>
      <mesh ref={markerRef} position={[position.x, position.y + 0.55, position.z]}>
        <sphereGeometry args={[0.11, 10, 10]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} />
      </mesh>
      <mesh position={[position.x, position.y + 0.52, position.z]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.17, 0.22, 20]} />
        <meshBasicMaterial color={color} transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>
      {selected && (
        <Html center position={[position.x, position.y + 1.2, position.z]} style={{ pointerEvents: 'none' }}>
          <div
            style={{
              border: `1px solid ${color}aa`,
              background: '#081326de',
              color: '#dbeafe',
              borderRadius: 6,
              padding: '3px 7px',
              fontSize: 8,
              whiteSpace: 'nowrap',
            }}
          >
            {sensorId} · {type.toUpperCase()} · {value.toFixed(1)} {unit}
          </div>
        </Html>
      )}
    </group>
  )
}

function ZoneClickSurface({ zone, onSelect }: { zone: ZoneState; onSelect: () => void }) {
  return (
    <mesh position={[zone.position.x, 0.03, zone.position.z]} onClick={onSelect}>
      <boxGeometry args={[zone.size.width + 0.35, 0.08, zone.size.depth + 0.35]} />
      <meshBasicMaterial transparent opacity={0} depthWrite={false} />
    </mesh>
  )
}

function RefineryScene({
  zones,
  equipment,
  selectedZone,
  selectedEquipmentId,
  selectedSensorId,
  showSensors,
  cameraView,
  heatMapMode,
  cameraResetTick,
  onSelectZone,
  onSelectEquipment,
  onSelectSensor,
}: {
  zones: ZoneState[]
  equipment: PlantEquipment[]
  selectedZone: ZoneState | null
  selectedEquipmentId: string | null
  selectedSensorId: string | null
  showSensors: boolean
  cameraView: ViewState
  heatMapMode: HeatMode
  cameraResetTick: number
  onSelectZone: (id: string | null) => void
  onSelectEquipment: (id: string | null) => void
  onSelectSensor: (id: string | null) => void
}) {
  const sensors = usePlantStore((s) => s.sensors)

  return (
    <>
      <CameraRig view={cameraView} selectedZone={selectedZone} trigger={cameraResetTick} />

      <ambientLight intensity={0.45} />
      <directionalLight position={[9, 16, 8]} intensity={1.0} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
      <pointLight position={[-4, 6, -5]} intensity={0.42} color="#7dd3fc" />
      <pointLight position={[4, 5, -2]} intensity={0.44} color="#fb7185" />
      <pointLight position={[9, 4, 3]} intensity={0.35} color="#f59e0b" />

      <GroundAndAtmosphere />

      {zones.map((zone) => (
        <group key={zone.id}>
          <ZoneHeatSurface zone={zone} selected={selectedZone?.id === zone.id} mode={heatMapMode} />
          <ZoneClickSurface zone={zone} onSelect={() => onSelectZone(selectedZone?.id === zone.id ? null : zone.id)} />
        </group>
      ))}

      <ProcessPipelines zones={zones} />

      {equipment.map((item) => (
        <EquipmentMesh
          key={item.id}
          equipment={item}
          selected={selectedEquipmentId === item.id}
          onSelect={() => onSelectEquipment(selectedEquipmentId === item.id ? null : item.id)}
        />
      ))}

      {showSensors &&
        sensors.map((sensor) => {
          const level = sensorRiskLevel(sensor.value, sensor.normalMin, sensor.normalMax)
          return (
            <SensorMarker
              key={sensor.id}
              sensorId={sensor.id}
              type={sensor.type}
              value={sensor.value}
              unit={sensor.unit}
              position={sensor.position}
              level={level}
              selected={selectedSensorId === sensor.id}
              onSelect={() => onSelectSensor(selectedSensorId === sensor.id ? null : sensor.id)}
            />
          )
        })}
    </>
  )
}

function ZoneLegend() {
  const levels = [
    { label: 'Critical (81-100)', color: '#ef4444' },
    { label: 'High (61-80)', color: '#f97316' },
    { label: 'Medium (41-60)', color: '#facc15' },
    { label: 'Low (21-40)', color: '#22c55e' },
    { label: 'Safe (0-20)', color: '#3b82f6' },
  ]

  return (
    <div className="rounded-md border border-border/60 bg-card/85 p-2 shadow-[0_0_24px_rgba(0,0,0,0.35)] backdrop-blur-sm">
      <div className="mb-1 text-[8px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Risk Level</div>
      <div className="space-y-1">
        {levels.map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <div className="size-2 rounded-sm" style={{ backgroundColor: item.color }} />
            <span className="text-[8px] text-muted-foreground">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function SelectedInfoOverlay() {
  const selectedEquipmentId = usePlantStore((s) => s.selectedEquipmentId)
  const selectedZoneId = usePlantStore((s) => s.selectedZoneId)
  const selectedSensorId = usePlantStore((s) => s.selectedSensorId)
  const equipment = usePlantStore((s) => s.equipment)
  const zones = usePlantStore((s) => s.zones)
  const sensors = usePlantStore((s) => s.sensors)

  const selectedEquipment = selectedEquipmentId ? equipment.find((item) => item.id === selectedEquipmentId) : null
  const selectedZone = selectedZoneId ? zones.find((zone) => zone.id === selectedZoneId) : null
  const selectedSensor = selectedSensorId ? sensors.find((sensor) => sensor.id === selectedSensorId) : null

  if (selectedEquipment) {
    const riskLevel = sensorRiskLevel(selectedEquipment.failureProbability * 100, 0, 100)

    return (
      <div className="absolute bottom-2 left-2 z-20 w-[300px] rounded-md border border-border/60 bg-card/92 p-2.5 text-[9px] shadow-[0_10px_25px_rgba(0,0,0,0.35)] backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="text-[10px] font-bold text-primary">{selectedEquipment.id}</div>
          <span className={`text-[9px] font-semibold ${selectedEquipment.status === 'Critical' ? 'text-critical' : selectedEquipment.status === 'Warning' ? 'text-orange-500' : 'text-success'}`}>
            {selectedEquipment.status}
          </span>
        </div>
        <div className="mt-0.5 text-[10px] text-foreground/90">{selectedEquipment.name}</div>
        <div className="mt-1 grid grid-cols-2 gap-x-2 gap-y-1 text-muted-foreground">
          <span>Temperature: <span className="text-foreground">{selectedEquipment.temperature.toFixed(0)} C</span></span>
          <span>Pressure: <span className="text-foreground">{selectedEquipment.pressure.toFixed(1)} bar</span></span>
          <span>Flow: <span className="text-foreground">{selectedEquipment.flow.toFixed(0)} m3/h</span></span>
          <span>Gas: <span className="text-foreground">{selectedEquipment.gas.toFixed(0)} %LEL</span></span>
          <span>Vibration: <span className="text-foreground">{selectedEquipment.vibration.toFixed(1)} mm/s</span></span>
          <span>Humidity: <span className="text-foreground">{selectedEquipment.humidity.toFixed(0)} %</span></span>
          <span>Workers: <span className="text-foreground">{selectedEquipment.workersNearby}</span></span>
          <span>Failure Prob: <span className={`font-semibold ${severityTextClass(riskLevel)}`}>{Math.round(selectedEquipment.failureProbability * 100)}%</span></span>
        </div>
        <div className="mt-1 border-t border-border/40 pt-1 text-muted-foreground">Root Cause: <span className="text-foreground/90">{selectedEquipment.rootCause}</span></div>
        <div className="mt-1 text-muted-foreground">Maintenance: <span className="text-foreground/90">{selectedEquipment.maintenanceOverdue ? 'Overdue' : 'On schedule'}</span></div>
        <div className="mt-1 text-muted-foreground">Recommendation: <span className="text-foreground/90">{selectedEquipment.recommendation}</span></div>
      </div>
    )
  }

  if (selectedZone) {
    const zoneColor = zoneRiskHex(selectedZone.riskScore)
    return (
      <div className="absolute bottom-2 left-2 z-20 w-[255px] rounded-md border border-border/60 bg-card/92 p-2.5 text-[9px] shadow-[0_10px_25px_rgba(0,0,0,0.35)] backdrop-blur-sm">
        <div className="text-[10px] font-bold" style={{ color: zoneColor }}>{selectedZone.label}</div>
        <div className="mt-0.5 text-foreground/90">{selectedZone.description}</div>
        <div className="mt-1 text-muted-foreground">Risk Score: <span className="font-bold" style={{ color: zoneColor }}>{selectedZone.riskScore}</span></div>
        <div className="text-muted-foreground">Risk Band: <span className="text-foreground">{zoneRiskLabel(selectedZone.riskScore)}</span></div>
        <div className="text-muted-foreground">Permits: <span className="text-foreground">{selectedZone.activePermits}</span></div>
        {selectedZone.hotWorkActive ? <div className="mt-1 text-warning">Hot Work Active</div> : null}
      </div>
    )
  }

  if (selectedSensor) {
    const level = sensorRiskLevel(selectedSensor.value, selectedSensor.normalMin, selectedSensor.normalMax)
    return (
      <div className="absolute bottom-2 left-2 z-20 w-[250px] rounded-md border border-border/60 bg-card/92 p-2.5 text-[9px] shadow-[0_10px_25px_rgba(0,0,0,0.35)] backdrop-blur-sm">
        <div className="text-[10px] font-bold text-primary">{selectedSensor.id}</div>
        <div className="text-foreground/90 capitalize">{selectedSensor.type} sensor</div>
        <div className="mt-1 text-muted-foreground">
          Value: <span className="font-semibold text-foreground">{selectedSensor.value.toFixed(2)} {selectedSensor.unit}</span>
        </div>
        <div className="text-muted-foreground">Zone: <span className="text-foreground">{selectedSensor.zoneId}</span></div>
        <div className="text-muted-foreground">Equipment: <span className="text-foreground">{selectedSensor.equipmentId}</span></div>
        <div className={`mt-1 font-semibold ${severityTextClass(level)}`}>Severity: {level.toUpperCase()}</div>
      </div>
    )
  }

  return null
}

export function PlantRiskHeatMap() {
  const zones = usePlantStore((s) => s.zones)
  const equipment = usePlantStore((s) => s.equipment)
  const selectedZoneId = usePlantStore((s) => s.selectedZoneId)
  const selectedEquipmentId = usePlantStore((s) => s.selectedEquipmentId)
  const selectedSensorId = usePlantStore((s) => s.selectedSensorId)
  const showSensors = usePlantStore((s) => s.showSensors)
  const cameraView = usePlantStore((s) => s.cameraView)
  const heatMapMode = usePlantStore((s) => s.heatMapMode)
  const zoneFilter = usePlantStore((s) => s.zoneFilter)

  const selectZone = usePlantStore((s) => s.selectZone)
  const selectEquipment = usePlantStore((s) => s.selectEquipment)
  const selectSensor = usePlantStore((s) => s.selectSensor)
  const setShowSensors = usePlantStore((s) => s.setShowSensors)
  const setCameraView = usePlantStore((s) => s.setCameraView)
  const setHeatMapMode = usePlantStore((s) => s.setHeatMapMode)
  const setZoneFilter = usePlantStore((s) => s.setZoneFilter)

  const [isReady, setIsReady] = useState(false)
  const [cameraResetTick, setCameraResetTick] = useState(0)

  useEffect(() => {
    const t = window.setTimeout(() => setIsReady(true), 100)
    return () => window.clearTimeout(t)
  }, [])

  useEffect(() => {
    if (zoneFilter === 'All Zones') {
      selectZone(null)
    } else {
      selectZone(zoneFilter)
    }
  }, [zoneFilter, selectZone])

  const selectedZone = useMemo(() => {
    if (!selectedZoneId) return null
    return zones.find((zone) => zone.id === selectedZoneId) ?? null
  }, [selectedZoneId, zones])

  const visibleEquipment = useMemo(() => {
    if (zoneFilter === 'All Zones') return equipment
    return equipment.filter((item) => item.zoneId === zoneFilter)
  }, [equipment, zoneFilter])

  const visibleZones = useMemo(() => {
    if (zoneFilter === 'All Zones') return zones
    return zones.filter((zone) => zone.id === zoneFilter)
  }, [zones, zoneFilter])

  const handleResetCamera = useCallback(() => {
    setCameraResetTick((v) => v + 1)
  }, [])

  const zoneOptions = ['All Zones', ...PLANT_ZONES.map((zone) => zone.id)]

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-lg border border-border/80 bg-card/85 shadow-[0_4px_20px_rgba(0,0,0,0.35)] backdrop-blur-sm">
      <div className="flex items-center justify-between border-b border-border/50 px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-400/90">Plant Risk Heat Map</span>
          <div className="flex rounded border border-border/50 bg-background/40">
            {(['heat', 'bubble'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setHeatMapMode(mode)}
                className={`px-2 py-0.5 text-[8.5px] font-semibold uppercase tracking-[0.08em] transition-colors ${
                  heatMapMode === mode ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {mode === 'heat' ? 'Heat Map' : 'Bubble Map'}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex rounded border border-border/50 bg-background/40">
            {(['3d', 'top'] as const).map((view) => (
              <button
                key={view}
                type="button"
                onClick={() => setCameraView(view)}
                className={`px-2 py-0.5 text-[8.5px] font-semibold uppercase tracking-[0.08em] transition-colors ${
                  cameraView === view ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {view === '3d' ? '3D View' : 'Top View'}
              </button>
            ))}
          </div>

          <label className="flex cursor-pointer items-center gap-1 text-[8.5px] text-muted-foreground hover:text-foreground">
            <input
              type="checkbox"
              checked={showSensors}
              onChange={(event) => setShowSensors(event.target.checked)}
              className="size-3 accent-primary"
            />
            Show Sensors
          </label>

          <select
            value={zoneFilter}
            onChange={(event) => setZoneFilter(event.target.value)}
            className="h-6 rounded border border-border/50 bg-background/60 px-1 text-[8.5px] text-muted-foreground"
          >
            {zoneOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>

          <button
            type="button"
            onClick={handleResetCamera}
            className="h-6 rounded border border-border/50 bg-background/60 px-2 text-[8.5px] font-semibold uppercase tracking-[0.08em] text-muted-foreground transition-colors hover:text-foreground"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="relative min-h-0 flex-1 overflow-hidden" style={{ background: 'radial-gradient(circle at 40% 25%, #0a1c2d 0%, #050d16 48%, #030810 100%)' }}>
        {isReady ? (
          <Suspense
            fallback={
              <div className="flex h-full items-center justify-center text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                Loading 3D plant...
              </div>
            }
          >
            <Canvas camera={{ position: [0, 13, 18], fov: 52 }} gl={{ antialias: true, alpha: false }} shadows>
              <RefineryScene
                zones={visibleZones}
                equipment={visibleEquipment}
                selectedZone={selectedZone}
                selectedEquipmentId={selectedEquipmentId}
                selectedSensorId={selectedSensorId}
                showSensors={showSensors}
                cameraView={cameraView}
                heatMapMode={heatMapMode}
                cameraResetTick={cameraResetTick}
                onSelectZone={(id) => selectZone(id)}
                onSelectEquipment={(id) => selectEquipment(id)}
                onSelectSensor={(id) => selectSensor(id)}
              />
            </Canvas>
          </Suspense>
        ) : null}

        <SelectedInfoOverlay />

        <div className="absolute right-2 bottom-2 z-20">
          <ZoneLegend />
        </div>

        <div className="absolute left-2 top-2 z-20 rounded border border-warning/40 bg-card/85 px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-[0.1em] text-warning backdrop-blur-sm">
          Simulation
        </div>
      </div>
    </div>
  )
}
