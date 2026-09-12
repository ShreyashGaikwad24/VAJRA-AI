import type { PlantEquipment, PlantSensor } from '@/data/plant/types'

const SEED = 42

function seededNoise(seed: number, t: number) {
  const x = Math.sin(seed * 12.9898 + t * 78.233) * 43758.5453
  return x - Math.floor(x)
}

function smoothDelta(seed: number, t: number, amplitude: number) {
  return (seededNoise(seed, t) - 0.5) * amplitude
}

export type TelemetryContext = {
  tick: number
  weatherWind: number
  shiftFatigue: number
}

export function createTelemetryContext(): TelemetryContext {
  return { tick: 0, weatherWind: 11, shiftFatigue: 75 }
}

export function advanceTelemetry(
  equipment: PlantEquipment[],
  sensors: PlantSensor[],
  context: TelemetryContext,
): { equipment: PlantEquipment[]; sensors: PlantSensor[]; context: TelemetryContext } {
  const tick = context.tick + 1
  const t = tick / 10

  const nextEquipment = equipment.map((item, index) => {
    const seed = SEED + index * 17
    let temperature = item.temperature
    let pressure = item.pressure
    let gas = item.gas
    let vibration = item.vibration
    let humidity = item.humidity
    let flow = item.flow

    if (item.id === 'R-101') {
      temperature += smoothDelta(seed, t, 0.35) + Math.sin(t / 8) * 0.12
      pressure += smoothDelta(seed + 1, t, 0.04)
      gas += item.gas > 35 && seededNoise(seed + 2, t) > 0.985 ? 1.2 : smoothDelta(seed + 2, t, 0.08)
      vibration += smoothDelta(seed + 3, t, 0.03) + 0.005
    } else if (item.type === 'Pump Stations') {
      vibration += smoothDelta(seed, t, 0.025) + 0.003
      temperature += smoothDelta(seed + 1, t, 0.08)
    } else if (item.type === 'Pipeline Junctions') {
      gas += seededNoise(seed, t) > 0.992 ? 0.8 : smoothDelta(seed, t, 0.05)
      pressure += smoothDelta(seed + 1, t, 0.03)
    } else {
      temperature += smoothDelta(seed, t, 0.06)
      pressure += smoothDelta(seed + 1, t, 0.02)
      gas += smoothDelta(seed + 2, t, 0.03)
      vibration += smoothDelta(seed + 3, t, 0.01)
    }

    humidity += smoothDelta(seed + 4, t, 0.04)
    flow += smoothDelta(seed + 5, t, 0.2)

    return {
      ...item,
      temperature: Math.max(0, temperature),
      pressure: Math.max(0, pressure),
      gas: Math.max(0, gas),
      vibration: Math.max(0, vibration),
      humidity: Math.max(0, humidity),
      flow: Math.max(0, flow),
      failureProbability: clampFailure(item.id, temperature, gas, vibration, item.failureProbability),
    }
  })

  const nextSensors = sensors.map((sensor, index) => {
    const linked = nextEquipment.find((item) => item.id === sensor.equipmentId)
    let value = sensor.value
    if (linked) {
      switch (sensor.type) {
        case 'temperature':
          value = linked.temperature
          break
        case 'pressure':
          value = linked.pressure
          break
        case 'gas':
          value = linked.gas
          break
        case 'vibration':
          value = linked.vibration
          break
        case 'humidity':
          value = linked.humidity
          break
        case 'flow':
          value = linked.flow
          break
      }
    } else {
      value += smoothDelta(SEED + index * 11, t, sensor.type === 'gas' ? 0.15 : 0.05)
    }

    const history = [...sensor.history.slice(-23), value]
    return { ...sensor, value, history }
  })

  const weatherWind = clamp(context.weatherWind + smoothDelta(SEED + 99, t, 0.08), 6, 22)
  const shiftFatigue = clamp(context.shiftFatigue + smoothDelta(SEED + 100, t, 0.05), 55, 92)

  return {
    equipment: nextEquipment,
    sensors: nextSensors,
    context: { tick, weatherWind, shiftFatigue },
  }
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function clampFailure(id: string, temperature: number, gas: number, vibration: number, current: number) {
  let next = current
  if (id === 'R-101') {
    next += temperature > 410 ? 0.002 : -0.0005
    next += gas > 35 ? 0.003 : 0
  }
  if (vibration > 2.8) next += 0.0015
  return clamp(next, 0.01, 0.95)
}
