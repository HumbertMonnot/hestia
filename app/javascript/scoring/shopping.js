export default async (hexagon) => {
  const base_url = "/infras/api?"
  const dist = 1
  const url = `${base_url}coords=${hexagon.geometry.coordinates[0][3][0]},${hexagon.geometry.coordinates[0][3][1]}&dist=${dist}&type=shopping`
  const response = await fetch(url, { headers: { "Accept": "application/json" } })
  const data = await response.json()
  const nombre = await data.length
  return hexagon.properties.shopping = await nombre
  // return hexagon.properties.shopping = 12
}