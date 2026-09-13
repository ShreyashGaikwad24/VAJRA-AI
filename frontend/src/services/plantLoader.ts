
import { plantApi } from './plantApi'
import { adaptPlantData } from './plantAdapter'

export async function loadPlantData() {
  const plants = await plantApi.getPlants()

  if (plants.length === 0) {
    throw new Error('SAFE-AI backend returned no plants.')
  }

  const plant = plants[0]

  const [zones, risk] = await Promise.all([
    plantApi.getZones(plant.id),
    plantApi.getRisk(),
  ])

  const equipmentResults = await Promise.all(
    zones.map((zone) => plantApi.getEquipment(zone.id)),
  )

  const equipment = equipmentResults.flat()

  const sensorResults = await Promise.all(
    zones.map((zone) => plantApi.getSensors(zone.id)),
  )

  const sensors = sensorResults.flat()

  const adapted = adaptPlantData({
    plant,
    zones,
    equipment,
    sensors,
  })

  const sensorCodeByBackendId = Object.fromEntries(
    sensors.map((sensor) => [sensor.id, sensor.code]),
  ) as Record<number, string>

  return {
    ...adapted,
    risk,
    sensorCodeByBackendId,
  }
}