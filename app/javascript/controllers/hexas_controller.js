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
    for (const hexa of hexas) {
      const contents = await all_scores(hexa);
      hexas_scored.push(contents);
    }
    this.#smoothScore(hexas_scored, "animaux")
    this.#smoothScore(hexas_scored, "commerce_de_bouche")
    this.#smoothScore(hexas_scored, "etablissements_scolaires")
    this.#smoothScore(hexas_scored, "grandes_surfaces")
    this.#smoothScore(hexas_scored, "installations_sportives")
    this.#smoothScore(hexas_scored, "medecine_courante")
    this.#smoothScore(hexas_scored, "medecine_specialisee")
    this.#smoothScore(hexas_scored, "petite_enfance")
    this.#smoothScore(hexas_scored, "restauration")
    this.#smoothScore(hexas_scored, "services_de_proximite")
    this.#smoothScore(hexas_scored, "shopping")
    this.#smoothScore(hexas_scored, "vie_culturelle")
    this.#weightedAverageScore(hexas_scored)
    this.#smoothScore(hexas_scored, "weight_average")
    hexas_scored.sort((a,b) => (a.properties.weight_average < b.properties.weight_average) ? 1 : -1)
    console.log(hexas_scored)
    const top_hexas = hexas_scored
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
    if (["animaux", "etablissements_scolaires", "grandes_surfaces"].includes(attr)) {
      hexas.forEach(hexa => hexa.properties[attr] = 100 - hexa.properties[attr])
    }
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

  #scores

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
    mapboxgl.accessToken = this.apiKeyValue;
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v9',
      center: [this.hexalistValue[0][0], this.hexalistValue[0][1]],
      pitch: 60,
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
            0, "red",
            25, "orange",
            50, "green",
            100, "purple"
          ],
          "fill-opacity": 0.6
        }
      });
    });
  }
}