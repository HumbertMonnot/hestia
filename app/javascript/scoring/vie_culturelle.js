export default async (hexagon) => {
  const base_url = "/infras/api?"
  const dist = 1
  const url = `${base_url}coords=${hexagon.geometry.coordinates[0][3][0]},${hexagon.geometry.coordinates[0][3][1]}&dist=${dist}&type=vie_culturelle`
  const response = await fetch(url, { headers: { "Accept": "application/json" } })
  const data = await response.json()
  const nombre = await data.length
  return hexagon.properties.vie_culturelle = await nombre
  // return hexagon.properties.vie_culturelle = 23
}