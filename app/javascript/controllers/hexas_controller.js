import * as turf from '@turf/turf';
import { Controller } from "stimulus"

export default class extends Controller {
  static targets = [ "output" ]
  static values = {
    apiKey: String,
    hexalist: Array 
  }

  connect = async () => {
    // console.log(this.hexalistValue)
    const data = await this.#getIso()
    const poly = data.features[0].geometry.coordinates
    const hexas = await this.#getGrid(poly)
    // console.log(hexas)
    const centers = hexas.map(x => x.geometry.coordinates[0][3])
    const base_url = "/polygons/compute?"
    var query = ""
    let compt = 0
    centers.forEach((coord) => {
      query = query + compt.toString() + "=" + coord + "&"
      compt += 1
    })
    console.log(base_url + query)
  }
  
  #getIso = async () => {
    const url = `https://api.mapbox.com/isochrone/v1/mapbox/${this.hexalistValue[1]}/${this.hexalistValue[0][0]},${this.hexalistValue[0][1]}?contours_minutes=${this.hexalistValue[2]}&polygons=true&access_token=${this.apiKeyValue}`;
    const response = fetch(url)
    const data = (await response).json()
    return data
  };

  #getGrid = async (polygon) => {
    const bbox = [this.hexalistValue[0][0]*0.95, this.hexalistValue[0][1]*0.95, this.hexalistValue[0][0]*1.05, this.hexalistValue[0][1]*1.05];
    const cellSide = 0.5;
    const options = { mask: turf.polygon(polygon) };
    return turf.hexGrid(bbox, cellSide, options).features;
  };
  
}