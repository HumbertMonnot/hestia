 // Code pour un appel API
    // console.log(hexas)
    // const centers = hexas.map(x => x.geometry.coordinates[0][3])
    // const base_url = "/polygons/compute?"
    // var query = ""
    // let compt = 0
    // centers.forEach((coord) => {
    //   query = query + compt.toString() + "=" + coord + "&"
    //   compt += 1
    // })
    // console.log(base_url + query)

import * as turf from '@turf/turf';
import { Controller } from "stimulus"
import all_scores from "../scoring/all_scoring.js"
import mapboxgl from "mapbox-gl"

export default class extends Controller {
  static targets = [ "output" ]
  static values = {
    apiKey: String,
    hexalist: Array,
    weights: Array
  }

  connect = async () => {
    const data = await this.#getIso()
    const poly = data.features[0].geometry.coordinates
    const hexas = await this.#getGrid(poly)
    let hexas_scored = []
    // on calcul les scores de chaque hexagone pour les différents critères
    hexas.forEach((hexa)=>{
      hexas_scored.push(all_scores(hexa))
    })
    this.#weightedAverageScore(hexas_scored)
    this.#smoothScore(hexas_scored, "weight_average")
    hexas_scored.sort((a,b) => (a.properties.weight_average < b.properties.weight_average) ? 1 : -1)
    const top_hexas = hexas_scored
    // this.element.insertAdjacentHTML("beforeend", await this.#buildTableLine(top_hexas[0], 1))
    // this.element.insertAdjacentHTML("beforeend", await this.#buildTableLine(top_hexas[1], 2))
    // this.element.insertAdjacentHTML("beforeend", await this.#buildTableLine(top_hexas[2], 3))
    // this.element.insertAdjacentHTML("beforeend", await this.#buildTableLine(top_hexas[3], 4))
    // console.log(top_hexas)
    // let compt = 1
    // top_hexas.forEach(async (hexa) => {
    //   await this.element.insertAdjacentHTML("beforeend", await this.#buildTableLine(hexa, compt))
    //   compt += 1
    // })
    const map = this.#buildMap()
    this.#buildGrid(top_hexas, map)
  }
  
  // Méthode pour obtenir un isochrone après un appel API Mapbox à partir d'une adresse, une distance et un moyen de transport
  #getIso = async () => {
    const url = `https://api.mapbox.com/isochrone/v1/mapbox/${this.hexalistValue[1]}/${this.hexalistValue[0][0]},${this.hexalistValue[0][1]}?contours_minutes=${this.hexalistValue[2]}&polygons=true&access_token=${this.apiKeyValue}`;
    const response = fetch(url)
    const data = (await response).json()
    return data
  };

  // Méthode pour construire la grid dans le polygon passé en object (dans le cas du projet, un isochrone)
  #getGrid = async (polygon) => {
    const bbox = [this.hexalistValue[0][0]-0.3, this.hexalistValue[0][1]-0.3, this.hexalistValue[0][0]+0.3, this.hexalistValue[0][1]+0.3];
    const cellSide = 0.5;
    const options = { mask: turf.polygon(polygon) };
    return turf.hexGrid(bbox, cellSide, options).features;
  };
  
  // Méthode pour ramener la meilleure note dans attr à 100
  #smoothScore = (hexas, attr) => {
    let max = 0
    hexas.forEach((hexa) => {
      if (hexa.properties[attr] > max) {
        max = hexa.properties[attr]
      }
    })
    const coef = 100 / max
    hexas.forEach(hexa => hexa.properties[attr] = Math.round(hexa.properties[attr] * coef))
  }

  // Méthode pour calculer les scores pour chaque hexagone d'une liste d'hexagones
  #weightedAverageScore = (hexas) => {
    hexas.forEach((hexa) => {
      let total = 0
      let compt = 0 
      Object.entries(hexa.properties).forEach((property) => {
        total += hexa.properties[property[0]] * this.weightsValue[compt]
        compt += 1
      })
      hexa.properties.weight_average = Math.round(total / compt)
    })
  }

  // Méthode pour construire le tableau
  #buildTableLine = async (hexa, num) => {
    const address = await this.#getAddFromCoord(hexa)
    let balise = `<td>${num}</td><td>${address}</td>`
    Object.entries(hexa.properties).forEach((key) => {
      balise += `<td>${hexa.properties[key[0]]}</td>`
    })
    return balise
  }

  // Méthode pour obtenir une addresse à partir de coordonnées, pour un hexagone
  #getAddFromCoord = async (hexa) => {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${hexa.geometry.coordinates[0][3][0]},${hexa.geometry.coordinates[0][3][1]}.json?access_token=${this.apiKeyValue}`
    const response = await fetch(url)
    const data = (await response).json()
    const donnes = await data
    // console.log(donnes.features[0].place_name.split(',')[0])
    return donnes.features[0].place_name.split(',')[0]
  }

  #buildMap = () => {
    console.log("on est là")
    mapboxgl.accessToken = this.apiKeyValue;
    console.log("Et là on est là")
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v9',
      center: [this.hexalistValue[0][0], this.hexalistValue[0][1]],
      zoom: 12
    });
    return map
  }

  #buildGrid = (hexas_list, the_map) => {
    const hexas_object = {
      features: hexas_list,
      type: "FeatureCollection" 
    }
    the_map.on('load', () => {
      the_map.addLayer({
        id: 'maine',
        type: 'fill',
        source: {
          type: 'geojson',
          data: hexas_object
        },
        layout: {},
        paint: {
          "fill-color": [
            "interpolate", ["linear"], ["get", "weight_average"],
            50, "red",
            75, "orange",
            100, "green"
          ],
          "fill-opacity": 0.4
        }
      });
    });
  }
}