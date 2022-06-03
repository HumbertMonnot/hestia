import * as turf from '@turf/turf';

export default async (hexagon) => {
  // const base_url = "/infras/api?"
  // const dist = 3
  // const url = `${base_url}coords=${hexagon.geometry.coordinates[0][3][0]},${hexagon.geometry.coordinates[0][3][1]}&dist=${dist}&type=etablissements_scolaires`
  // const response = await fetch(url, { headers: { "Accept": "application/json" } })
  // const data = await response.json()
  // let points = [] 
  // await data.forEach (async (infra) => {

  //    points.push(turf.point([await infra.longitude, await infra.latitude]))
  // })
  // points = await turf.featureCollection(points)
  // const my_variable = hexagon.geometry.coordinates[0][3]
  // const nearest = turf.nearestPoint(my_variable, points)
  // return hexagon.properties.etablissements_scolaires = await turf.distance(my_variable, nearest)
  return hexagon.properties.etablissements_scolaires = 9
}