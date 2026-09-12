import { Html, OrbitControls } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import type { Mesh } from 'three'

import type { PlantEquipment, PlantSensor } from '@/data/plant/types'
import type { SimulationSnapshot } from '@/modules/decisionSimulation/services/simulationTypes'

import { levelColor } from '../services/simulationEngine'

type SimulationPlantViewProps = {
  snapshot: SimulationSnapshot
  mode: 'before' | 'after'
  selectedEquipmentId?: string
}

function zoneColor(score: number): string {
  if (score >= 80) return '#dc2626'
  if (score >= 60) return '#f97316'
  if (score >= 40) return '#eab308'
  if (score >= 20) return '#22c55e'
  return '#3b82f6'
}

function equipmentColor(item: PlantEquipment): string {
  if (item.status === 'Critical') return '#ef4444'
  if (item.status === 'Warning') return '#f97316'
  if (item.status === 'Maintenance') return '#3b82f6'
  if (item.status === 'Offline') return '#64748b'
  return '#22c55e'
}

function equipmentShape(type: string): 'box' | 'tower' | 'tank' {
  if (type.includes('Reactor') || type.includes('Distillation')) return 'tower'
  if (type.includes('Storage') || type.includes('Cooling')) return 'tank'
  return 'box'
}

function ReactorLabel({ equipment, color }: { equipment: PlantEquipment; color: string }) {
  return (
    <Html center position={[equipment.position.x, 3.6, equipment.position.z]} style={{ pointerEvents: 'none' }}>
      <div style={{ border: `1px solid ${color}90`, background: '#071325dc', color: '#dbeafe', borderRadius: 6, padding: '3px 6px', fontSize: 9 }}>
        {equipment.id} {Math.round(equipment.temperature)} C
      </div>
    </Html>
  )
}

function EquipmentMesh({ item, highlight }: { item: PlantEquipment; highlight: boolean }) {
  const color = equipmentColor(item)
  const ringRef = useRef<Mesh>(null)

  useFrame(({ clock }) => {
    if (!ringRef.current) return
    const t = clock.elapsedTime
    ringRef.current.scale.setScalar(highlight ? 1.02 + Math.sin(t * 2.2) * 0.06 : 1)
  })

  const shape = equipmentShape(item.type)

  return (
    <group position={[item.position.x, 0, item.position.z]}>
      {shape === 'tower' ? (
        <mesh castShadow position={[0, 1.7, 0]}>
          <cylinderGeometry args={[0.35, 0.45, 3.3, 18]} />
          <meshStandardMaterial color="#64748b" emissive={color} emissiveIntensity={0.22} metalness={0.6} roughness={0.35} />
        </mesh>
      ) : shape === 'tank' ? (
        <mesh castShadow position={[0, 1.0, 0]}>
          <cylinderGeometry args={[0.75, 0.8, 1.8, 18]} />
          <meshStandardMaterial color="#64748b" emissive={color} emissiveIntensity={0.2} metalness={0.58} roughness={0.35} />
        </mesh>
      ) : (
        <mesh castShadow position={[0, 0.6, 0]}>
          <boxGeometry args={[1.7, 1.2, 1.1]} />
          <meshStandardMaterial color="#334155" emissive={color} emissiveIntensity={0.14} metalness={0.3} roughness={0.55} />
        </mesh>
      )}

      <mesh ref={ringRef} position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.68, 0.9, 24]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={highlight ? 0.9 : 0.4} transparent opacity={highlight ? 0.45 : 0.2} />
      </mesh>

      {item.id === 'R-101' ? <ReactorLabel equipment={item} color={color} /> : null}
    </group>
  )
}

function SensorDots({ sensors }: { sensors: PlantSensor[] }) {
  return (
    <group>
      {sensors.map((sensor) => {
        const color = sensor.value > sensor.normalMax ? '#ef4444' : '#22c55e'
        return (
          <mesh key={sensor.id} position={[sensor.position.x, sensor.position.y, sensor.position.z]}>
            <sphereGeometry args={[0.1, 10, 10]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.55} />
          </mesh>
        )
      })}
    </group>
  )
}

function Scene({ snapshot }: { snapshot: SimulationSnapshot }) {
  const reactor = useMemo(() => snapshot.equipment.find((item) => item.id === 'R-101'), [snapshot.equipment])

  return (
    <>
      <ambientLight intensity={0.45} />
      <directionalLight position={[8, 12, 8]} intensity={0.95} castShadow />
      <pointLight position={[4, 6, -3]} intensity={0.45} color="#f97316" />
      <pointLight position={[-4, 5, -5]} intensity={0.35} color="#38bdf8" />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[54, 54]} />
        <meshStandardMaterial color="#040b14" />
      </mesh>
      <gridHelper args={[54, 48, '#17324a', '#0e2436']} position={[0, 0.002, 0]} />

      {snapshot.zones.map((zone) => {
        const color = zoneColor(zone.riskScore)
        return (
          <group key={zone.id} position={[zone.position.x, 0, zone.position.z]}>
            <mesh position={[0, 0.03, 0]}>
              <boxGeometry args={[zone.size.width, 0.05, zone.size.depth]} />
              <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.18} transparent opacity={0.25} />
            </mesh>
            <mesh position={[0, 0.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[Math.max(zone.size.width, zone.size.depth) * 0.42, Math.max(zone.size.width, zone.size.depth) * 0.51, 26]} />
              <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.52} transparent opacity={0.2} />
            </mesh>
          </group>
        )
      })}

      {snapshot.equipment.map((item) => (
        <EquipmentMesh key={item.id} item={item} highlight={item.id === 'R-101' || item.status === 'Critical'} />
      ))}

      <SensorDots sensors={snapshot.sensors} />

      {reactor ? (
        <Html center position={[0, 5.4, 0]} style={{ pointerEvents: 'none' }}>
          <div style={{ border: '1px solid #1f3147', background: '#071325e0', color: '#dbeafe', borderRadius: 6, padding: '4px 8px', fontSize: 9 }}>
            CRI {snapshot.riskScores.cri} | Reactor {Math.round(reactor.temperature)} C | Risk {snapshot.metrics.riskSpread.toUpperCase()}
          </div>
        </Html>
      ) : null}

      <OrbitControls enablePan enableZoom enableRotate minDistance={8} maxDistance={36} maxPolarAngle={Math.PI / 2.05} />
    </>
  )
}

export function SimulationPlantView({ snapshot, mode }: SimulationPlantViewProps) {
  const riskColor = levelColor(snapshot.metrics.predictedIncidents)

  return (
    <div className="relative h-[300px] overflow-hidden rounded-md border border-border/70 bg-[radial-gradient(circle_at_38%_20%,#0a1c2d_0%,#040b14_48%,#02070f_100%)] shadow-[inset_0_0_0_1px_rgba(59,130,246,0.08)]">
      <div className="absolute left-2 top-2 z-20 rounded border border-border/70 bg-background/80 px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        {mode === 'before' ? 'Before' : 'After'} Simulation
      </div>
      <div className="absolute right-2 top-2 z-20 rounded border px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-[0.1em] shadow-[0_0_14px_rgba(15,23,42,0.5)]" style={{ borderColor: `${riskColor}66`, color: riskColor, background: '#050f1fcc' }}>
        {snapshot.metrics.predictedIncidents.toUpperCase()}
      </div>

      <div className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-md border border-border/70 bg-background/80 p-1">
        <div className="flex flex-col gap-1 text-[8px] text-muted-foreground">
          <button type="button" className="rounded border border-border/70 bg-background/70 px-1.5 py-0.5 hover:text-foreground">3D</button>
          <button type="button" className="rounded border border-border/70 bg-background/70 px-1.5 py-0.5 hover:text-foreground">Layers</button>
          <button type="button" className="rounded border border-border/70 bg-background/70 px-1.5 py-0.5 hover:text-foreground">Temp</button>
          <button type="button" className="rounded border border-border/70 bg-background/70 px-1.5 py-0.5 hover:text-foreground">FS</button>
        </div>
      </div>

      <Canvas shadows camera={{ position: [0, 12, 18], fov: 50 }}>
        <Scene snapshot={snapshot} />
      </Canvas>

      <div className="absolute bottom-2 right-2 z-20 flex items-center gap-1.5 rounded border border-border/70 bg-background/80 px-1.5 py-1 text-[8px] text-muted-foreground">
        <span className="rounded border border-success/35 bg-success/10 px-1 py-0.5 text-success">Live</span>
        <span className="rounded border border-border/70 bg-background/70 px-1 py-0.5">Orbit</span>
        <span className="rounded border border-border/70 bg-background/70 px-1 py-0.5">Zoom</span>
      </div>
    </div>
  )
}
