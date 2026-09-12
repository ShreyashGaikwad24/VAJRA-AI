import type { PlantSensor } from '@/data/plant/types'
import { PLANT_EQUIPMENT } from '@/data/plant/equipment'

const sensorDefs: Array<Omit<PlantSensor, 'value' | 'history'>> = [
  { id: 'S-TEMP-R101', type: 'temperature', zoneId: 'ZONE C', equipmentId: 'R-101', position: { x: 3.8, y: 2.2, z: -2.8 }, unit: '°C', normalMin: 280, normalMax: 380 },
  { id: 'S-PRES-R101', type: 'pressure', zoneId: 'ZONE C', equipmentId: 'R-101', position: { x: 3.2, y: 1.8, z: -3.2 }, unit: 'bar', normalMin: 10, normalMax: 15 },
  { id: 'S-GAS-PL27A', type: 'gas', zoneId: 'ZONE B', equipmentId: 'PJ-114', position: { x: -1.8, y: 0.8, z: -1.8 }, unit: '% LEL', normalMin: 0, normalMax: 25 },
  { id: 'S-VIB-P204', type: 'vibration', zoneId: 'ZONE D', equipmentId: 'PS-023', position: { x: 8.2, y: 1.1, z: -3.2 }, unit: 'mm/s', normalMin: 0, normalMax: 2.5 },
  { id: 'S-HUM-LB', type: 'humidity', zoneId: 'ZONE E', equipmentId: 'LB-071', position: { x: 7.8, y: 1, z: 4.8 }, unit: '%', normalMin: 35, normalMax: 55 },
  { id: 'S-FLOW-HX', type: 'flow', zoneId: 'ZONE B', equipmentId: 'HX-044', position: { x: -1.2, y: 0.9, z: -2.5 }, unit: 'm³/h', normalMin: 50, normalMax: 80 },
  { id: 'S-TEMP-ST', type: 'temperature', zoneId: 'ZONE A', equipmentId: 'ST-201', position: { x: -10.2, y: 2, z: -5.8 }, unit: '°C', normalMin: 20, normalMax: 45 },
  { id: 'S-GAS-VS', type: 'gas', zoneId: 'ZONE C', equipmentId: 'VS-307', position: { x: 4.7, y: 0.9, z: -1.8 }, unit: '% LEL', normalMin: 0, normalMax: 20 },
]

function initialValue(type: PlantSensor['type'], equipmentId: string): number {
  const eq = PLANT_EQUIPMENT.find((item) => item.id === equipmentId)
  if (!eq) return 0
  switch (type) {
    case 'temperature':
      return eq.temperature
    case 'pressure':
      return eq.pressure
    case 'gas':
      return eq.gas
    case 'vibration':
      return eq.vibration
    case 'humidity':
      return eq.humidity
    case 'flow':
      return eq.flow
    default:
      return 0
  }
}

export const PLANT_SENSORS: PlantSensor[] = sensorDefs.map((sensor) => {
  const value = initialValue(sensor.type, sensor.equipmentId)
  return {
    ...sensor,
    value,
    history: Array.from({ length: 24 }, (_, index) => value + Math.sin(index / 3) * (value * 0.02)),
  }
})
