export default (hexagon) => {
  const base_url = "/infras/api?"
  const dist = 1
  const url = `${base_url}coords=${hexagon.geometry.coordinates[0][3][0]},${hexagon.geometry.coordinates[0][3][1]}&dist=${dist}&type=medecine_courante`
  return fetch(url, { headers: { "Accept": "application/json" } })
    .then(response => response.json())
    .then((data) => {return data.length})
}