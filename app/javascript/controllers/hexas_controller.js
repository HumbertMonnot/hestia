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
import { add, Controller } from "stimulus"
import all_scores from "../scoring/all_scoring.js"
import mapboxgl from "mapbox-gl"

export default class extends Controller {
  static targets = [ "output" , "scorecard"]
  static values = {
    apiKey: String,
    hexalist: Array,
    weights: Array
  }

  connect = async () => {
    var startTime = performance.now()
    this.map = this.#buildMap()
    this.map.resize()
    const data = await this.#getIso()
    this.map.addLayer({
      id: 'isotime',
      type: 'line',
      source: {
        type: 'geojson',
        data: data
      },
      layout: {},
      paint: {
        "line-color": "#61E294",
        'line-width': 5
      }
    });
    const poly = data.features[0].geometry.coordinates
    this.hexas = await this.#getGrid(poly)
    const base_url = `/infras/api?address=${this.hexalistValue[0][0]},${this.hexalistValue[0][1]}&coords=`
    var my_query = ""
    for (const hexa of this.hexas) {
      my_query += `${hexa.geometry.coordinates[0][3][0]},${hexa.geometry.coordinates[0][3][1]},`
    }
    const response = await fetch(base_url + my_query)
    const scores = await response.json()
    var i = 0
    for (const hexa of this.hexas) {
      hexa.properties = await scores[i]
      i += 1
    }
    
    //
    // // on calcul les scores de chaque hexagone pour les différents critères
    // for (const hexa of hexas) {
      //   const contents = await all_scores(hexa);
      //   hexas_scored.push(contents);
      // }
      this.#smoothScore(this.hexas, "animaux")
      this.#smoothScore(this.hexas, "commerce_de_bouche")
      this.#smoothScore(this.hexas, "etablissement_scolaire")
      this.#smoothScore(this.hexas, "grandes_surfaces")
      this.#smoothScore(this.hexas, "installation_sportive")
      this.#smoothScore(this.hexas, "medecine_courante")
      this.#smoothScore(this.hexas, "medecine_specialisee")
      this.#smoothScore(this.hexas, "petite_enfance")
      this.#smoothScore(this.hexas, "restauration")
      this.#smoothScore(this.hexas, "services_de_proximite")
      this.#smoothScore(this.hexas, "shopping")
      this.#smoothScore(this.hexas, "vie_culturelle")
      this.#weightedAverageScore(this.hexas)
      this.#smoothScore(this.hexas, "weight_average")
      this.hexas.sort((a,b) => (a.properties.weight_average < b.properties.weight_average) ? 1 : -1)
      // console.log(hexas_scored)
    // const top_hexas = hexas_scored
    // // let compt = 1
    // // top_hexas.forEach(async (hexa) => {
    // //   await this.element.insertAdjacentHTML("beforeend", await this.#buildTableLine(hexa, compt))
    // //   compt += 1
    // // })
    console.log(this.hexas[0])
    this.buildGrid(this.hexas, this.map, "weight_average")
    var endTime = performance.now()
    this.map.moveLayer('isotime')
    console.log(endTime - startTime)
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
    const cellSide = 0.35;
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
    if (["etablissement_scolaire", "grandes_surfaces"].includes(attr)) {
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
      hexa.properties.weight_average_height = Math.round(total / compt) * 10
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
      pitch: 45,
      zoom: 12
    });
    return map
  }

  buildGrid = (hexas_list, the_map, attr) => {
    const hexas_object = {
      features: hexas_list,
      type: "FeatureCollection" 
    }
    // the_map.on('load', () => {
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
            "interpolate", ["linear"], ["get", attr],
            0, "#EC1162",
            50, "orange",
            100, "#61E294"
          ],
          "fill-opacity": 0.7
        },
      });
    //   the_map.addLayer({
    //     'id': 'poly-extrusion',
    //     'type': 'fill-extrusion',
    //     source: {
    //       type: 'geojson',
    //       data: hexas_object
    //     },
    //     'paint': {
    //     // Get the `fill-extrusion-color` from the source `color` property.
    //     'fill-extrusion-color': [
    //       "interpolate", ["linear"], ["get", "weight_average"],
    //       0, "red",
    //       25, "orange",
    //       50, "green",
    //       100, "purple"
    //     ],
         
    //     // Get `fill-extrusion-height` from the source `height` property.
    //     'fill-extrusion-height': ['get', 'weight_average_height'],
         
         
    //     // Make extrusions slightly opaque to see through indoor walls.
    //     'fill-extrusion-opacity': 0.8
    //     }
    // });
      the_map.on('click', (e) => {
        // Find features intersecting the bounding box.
        const selectedFeatures = the_map.queryRenderedFeatures(e.point, {
        layers: ['maine']
        });
        if (the_map.getLayer("contour")) {
          the_map.removeLayer('contour')
          the_map.removeSource('contour')
        }
        this.scorecardTarget.innerHTML = ""
        this.scorecardTarget.classList.add("d-none")
        console.log(selectedFeatures)
        if (selectedFeatures.length == 0) {
          console.log("c'est vide")
          this.scorecardTarget.classList.add("d-none")
        } else {
          this.scorecardTarget.classList.remove("d-none")
          this.#addScoreDiv(selectedFeatures[0].properties)
          the_map.flyTo({center: selectedFeatures[0].geometry.coordinates[0][3], zoom:15, pitch:0});
          the_map.addLayer({
            id: 'contour',
            type: 'line',
            source: {
              type: 'geojson',
              data: selectedFeatures[0]
            },
            layout: {},
            paint: {
              "line-color": "#61E294",
              'line-width': 6
            },
          });
        }
        });
    // });
  }

  #addScoreDiv = (properties) => {
    let html_to_insert = "<h4>SCORES</h4>"
    let i = 0
    for (const prop of Object.entries(properties)) {
      if (i === 11) break;
      let to_add = `<label for="file">${this.#capitalize(prop[0].split("_").join(" "))}</label>
      <progress id="file" max="100" value="${prop[1]}"> ${prop[1]}% </progress>`
      html_to_insert += to_add
      i += 1
    }
    this.scorecardTarget.innerHTML = html_to_insert
  }

  filter = (event) => {
    event.preventDefault()
    const attr = event.currentTarget.id.toLowerCase().replaceAll(' ', '_').replaceAll('é', 'e')
    console.log(attr)
    this.map.removeLayer('maine')
    this.map.removeSource('maine')
    this.buildGrid(this.hexas, this.map, attr)
  }

  #capitalize = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}
