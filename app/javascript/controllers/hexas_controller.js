import * as turf from '@turf/turf';
import { add, Controller } from "stimulus"
import mapboxgl from "mapbox-gl"

export default class extends Controller {
  static targets = [ "output" , "scorecard", "gaugecard", "annoncecard"]
  static values = { apiKey: String, hexalist: Array, weights: Array, annonce: String }

  connect = async () => {
    var startTime = performance.now()
    // On récup la requête au centre de bordeaux (qui sert de test, à effacer)
    const api_base_url = `https://api.notif.immo/documents/properties?lon=-0.57918&lat=44.837789&radius=1&transactionType=1&itemsPerPage=30&expired=false`
    const api_token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImN0eSI6IkpXVCJ9.eyJpYXQiOjE2NTQ1MTE1NzgsImV4cCI6MTY1NTExNjM3OCwiZW1haWwiOiJhcGlfZGVtb19oZXN0eWFAbWVsby5pbyIsImlwIjoiODYuMjEzLjEzLjEyNCIsInVzZXIiOnsiaWQiOiJcL3VzZXJzXC80NTQyNjNmNC01MTgyLTExZWMtYTBhNi03YzEwYzkyMWY1YjMiLCJyb2xlcyI6WyJST0xFX0FQSSIsIlJPTEVfQ1VTVE9NRVIiLCJST0xFX1VTRVIiXSwicGxhdGZvcm0iOnsiaWQiOjIsImlkZW50aWZpZXIiOiJtZWxvIiwibmFtZSI6Ik1lbG8iLCJiYXNlVXJsIjoiaHR0cHM6XC9cL3d3dy5tZWxvLmlvIn19fQ.mctvuXTPKIcDK5Fqa8cJcWHz9cg9vSOg3xLacT_GLoXga50dOALoKa4-jE3BGWzAKgnsvoq55dVLbyJWElTc0KMpR6REi80oMym1WAOsthXZNPuhEfnEgjxH1szFl3uLSdkgZj8e7LEKGtMEkr0LwLUMf4Nh2bMYI0RfXNwx024lkL010Zq8BW-fnC78M3y87VAIB-fcWt4CSIuPW7uxHVdObnSXEseE-Tr_3e3AAEMYQ5A9gSnvbXLtlipXZIswj56ysiJSD-nQPYGHSdM1BuVWSPq_bvq531pCC0WnprkiNuGfCtm0N0vRAT_xkBLAAuikFs7aFRFScszfA7A2pLNF23YtxWPjwblsLevdZofzEx7l7XO3cXWUSSBRDCrpSqNdfih7TsAh4AAkEzYMd94KZwuMPCBeohpGbhdVbFWJ9ABhupu0c8I3TE147Z8XyI1F2U7wHvZ82Cti2yn8DaHAFeP7xu-zWca_0VuezlfQoRZ_AXaNzwxGIiKLrBu8aCNCGUBrCZDU8eOGEsPhS6hgrPxuSUgPaNNqa1r6DO5TLlTff2XYppef4pC9BAkqrBCbqBNifC-nM2iPLsDGgT0KryMGaBloXfTsUWe7jRvFM8w1h3Wwe_5pUj3CxgEdJd7bR5yLsojRrpaQoH8st40S8Tnt0OdiEoSmC55Exho"
    const my_headers = new Headers({ 'Authorization': `Bearer ${api_token}`, 'Content-Type': 'application/json', 'platformOrigin': "melo" })
    const options = { method: 'GET', withCredentials: true, headers: my_headers}
    fetch(api_base_url, options).then(response => response.json()).then(data => console.log(data))
    
    // On construit la map
    this.map = this.#buildMap()
    this.map.resize()

    // On récupère l'isochrone
    const data = await this.#getIso()

    // On l'ajoute à la carte
    this.map.on('load', () => {
      this.map.addLayer({ id: 'isotime', type: 'line',
        source: { type: 'geojson', data: data },
        layout: {},
        paint: { "line-color": "#61E294", 'line-width': 5 } });
    
    // On ajoute le marqueur de l'adresse
    this.map.addSource('my-address', {'type': 'geojson', 'data': { 'type': 'FeatureCollection', 'features': [{
      'type': 'Feature',
      'geometry': {
      'type': 'Point',
      'coordinates': this.hexalistValue[0]
      }
      }] }});
    
    // Add a symbol layer
    this.map.addLayer({'id': 'my-address', 'type': 'symbol', 'source': 'my-address',
                        'layout': { 'icon-image': 'star-11', 'icon-size': 1.5}});});

    // On construit la grid
    const poly = data.features[0].geometry.coordinates
    this.hexas = await this.#getGrid(poly)

    // On récupère les scores pour chaque hexagone
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
      i += 1}   
      
    // On lisse les scores
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

    // On calcul la moyenne puis on la lisse, on trie par meilleur score et on affiche la grid colorée
    this.#weightedAverageScore(this.hexas, this.weightsValue)
    this.#smoothScore(this.hexas, "weight_average")
    this.hexas.sort((a,b) => (a.properties.weight_average < b.properties.weight_average) ? 1 : -1)
    this.buildGrid(this.hexas, this.map, "weight_average")
    this.map.moveLayer('isotime')
    this.map.moveLayer('my-address')
    var endTime = performance.now()
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
  #weightedAverageScore = (hexas, weights) => {
    hexas.forEach((hexa) => {
      let total = 0
      let compt = 0 
      for (const property of Object.entries(hexa.properties)) {
        if (compt === 12) break;
        total += hexa.properties[property[0]] * weights[compt]
        compt += 1
      }
      hexa.properties.weight_average = Math.round(total / compt)
      hexa.properties.weight_average_height = Math.round(total / compt) * 10
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
    // On ajout le calque des hexagones
    the_map.addLayer({
      id: 'maine',
      type: 'fill',
      source: { type: 'geojson', data: hexas_object },
      layout: {},
      paint: {
        "fill-color": [ "interpolate", ["linear"], ["get", attr], 0, "#EC1162", 50, "orange", 100, "#61E294"],
        "fill-opacity": 0.7
      },
    });

    // On ajout le layer symbole (vide) à la map                                                  
    const icon_url = "https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png"
    this.map.loadImage(icon_url, (error, image) => { if (error) throw error;
      this.map.addImage('custom-marker', image);
      this.map.addSource('points', {'type': 'geojson', 'data': { 'type': 'FeatureCollection', 'features': [] }});
      
      // Add a symbol layer
      this.map.addLayer({'id': 'points', 'type': 'symbol', 'source': 'points',
                          'layout': { 'icon-image': 'custom-marker',
                                      'text-field': ['get', 'price'],
                                      'text-font': ['Open Sans Semibold'],
                                      'text-offset': [0, 1.25],
                                      'text-anchor': 'top'}});});
    
    // On ajout une action en cas de clique sur un hexagone
    the_map.on('click', async (e) => {
      const selectedFeatures = the_map.queryRenderedFeatures(e.point, {layers: ['maine', 'points']});
      console.log(selectedFeatures)
      if (the_map.getLayer("contour")) {
        the_map.removeLayer('contour')
        the_map.removeSource('contour')
      }
      this.scorecardTarget.innerHTML = ""
      this.scorecardTarget.classList.add("d-none")
      this.annoncecardTarget.classList.add("d-none")
      if (selectedFeatures.length == 0) {
        this.scorecardTarget.classList.add("d-none")
        this.annoncecardTarget.classList.add("d-none")
      } else {
        for (const selectedFeature of selectedFeatures) {
          if (selectedFeature.layer.id == 'maine') this.#reactToClickHexa(selectedFeature)
          else this.#reactToClickAnnonce(selectedFeature)
        }            
      }})
      this.map.moveLayer('my-address')
  }

  #reactToClickHexa = async (hexa) => {
    this.scorecardTarget.classList.remove("d-none")
    this.#addScoreDiv(hexa.properties)
    this.map.flyTo({center: hexa.geometry.coordinates[0][3], zoom:15, pitch:45});
    this.map.addLayer({id: 'contour', type: 'line',
                      source: { type: 'geojson', data: hexa },
                      layout: {},
                      paint: { "line-color": "#61E294", 'line-width': 6 }});
    // On prépare la requête
    const coords = hexa.geometry.coordinates[0][3]
    const api_base_url = `https://api.notif.immo/documents/properties?lon=${coords[0]}&lat=${coords[1]}&radius=1&transactionType=1&itemsPerPage=30&expired=false&propertyTypes[]=0&propertyTypes[]=1`
    const api_token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImN0eSI6IkpXVCJ9.eyJpYXQiOjE2NTQ1MTE1NzgsImV4cCI6MTY1NTExNjM3OCwiZW1haWwiOiJhcGlfZGVtb19oZXN0eWFAbWVsby5pbyIsImlwIjoiODYuMjEzLjEzLjEyNCIsInVzZXIiOnsiaWQiOiJcL3VzZXJzXC80NTQyNjNmNC01MTgyLTExZWMtYTBhNi03YzEwYzkyMWY1YjMiLCJyb2xlcyI6WyJST0xFX0FQSSIsIlJPTEVfQ1VTVE9NRVIiLCJST0xFX1VTRVIiXSwicGxhdGZvcm0iOnsiaWQiOjIsImlkZW50aWZpZXIiOiJtZWxvIiwibmFtZSI6Ik1lbG8iLCJiYXNlVXJsIjoiaHR0cHM6XC9cL3d3dy5tZWxvLmlvIn19fQ.mctvuXTPKIcDK5Fqa8cJcWHz9cg9vSOg3xLacT_GLoXga50dOALoKa4-jE3BGWzAKgnsvoq55dVLbyJWElTc0KMpR6REi80oMym1WAOsthXZNPuhEfnEgjxH1szFl3uLSdkgZj8e7LEKGtMEkr0LwLUMf4Nh2bMYI0RfXNwx024lkL010Zq8BW-fnC78M3y87VAIB-fcWt4CSIuPW7uxHVdObnSXEseE-Tr_3e3AAEMYQ5A9gSnvbXLtlipXZIswj56ysiJSD-nQPYGHSdM1BuVWSPq_bvq531pCC0WnprkiNuGfCtm0N0vRAT_xkBLAAuikFs7aFRFScszfA7A2pLNF23YtxWPjwblsLevdZofzEx7l7XO3cXWUSSBRDCrpSqNdfih7TsAh4AAkEzYMd94KZwuMPCBeohpGbhdVbFWJ9ABhupu0c8I3TE147Z8XyI1F2U7wHvZ82Cti2yn8DaHAFeP7xu-zWca_0VuezlfQoRZ_AXaNzwxGIiKLrBu8aCNCGUBrCZDU8eOGEsPhS6hgrPxuSUgPaNNqa1r6DO5TLlTff2XYppef4pC9BAkqrBCbqBNifC-nM2iPLsDGgT0KryMGaBloXfTsUWe7jRvFM8w1h3Wwe_5pUj3CxgEdJd7bR5yLsojRrpaQoH8st40S8Tnt0OdiEoSmC55Exho"
    const my_headers = new Headers({'Authorization': `Bearer ${api_token}`, 'Content-Type': 'application/json', 'platformOrigin': "melo"})
    const options = { method: 'GET', withCredentials: true, headers: my_headers}
      
    // On fait la requête
    const response = await fetch(api_base_url, options)
    const data = await response.json()
    const annonces = []
    const annoncesfeatured = []
    for (const annonce of data['hydra:member']) {annonces.push({price: annonce.price,
                                                                url_annonce: annonce.adverts[0].url,
                                                                title: annonce.adverts[0].title,
                                                                contact: annonce.adverts[0].contact,
                                                                picture: annonce.pictures[0],
                                                                surface: annonce.surface,
                                                                description: annonce.description,
                                                                coords: annonce.location})}
    // On prépare les features suivant le retour de la requête
    annonces.forEach((ann) => {annoncesfeatured.push({type: 'Feature',
                                                      geometry: { type: 'Point', coordinates: [ann.coords.lon, ann.coords.lat]},
                                                      properties: ann})})
    
    // On modifie la source
    this.map.getSource('points').setData({ 'type': 'FeatureCollection', 'features': annoncesfeatured });
    }


  #reactToClickAnnonce = (annonce) => {
    this.#addAnnonceCard(annonce.properties)
    this.map.moveLayer('points')
  }

  #addAnnonceCard = (properties) => {
    this.annonce = properties
    this.annoncecardTarget.classList.remove("d-none")
    this.annoncecardTarget.innerHTML = ""
    let html_to_insert = `<i class="fa-solid fa-heart favoris" data-hexas-annonce-value=${[properties.price, properties.surface]}></i><div class="d-flex mb-3">`
    if (typeof(properties.picture) != 'undefined') {html_to_insert += `<div class="img-annonces"> <img src='${properties.picture}' alt=""></div>`}
    html_to_insert += `<div class=" mt-0">
                          <p>Surface : ${properties.surface}m2</p>
                          <p>Prix : ${properties.price}€</p>
                        </div>
                      </div>
                      <p><strong>${properties.title}</strong></p>
                      <p>${properties.description.slice(0, 60)}...</p>`
    if (typeof(properties.url_annonce) != 'undefined') {html_to_insert += `<a href='${properties.url_annonce}' target="_blank"><i class="fa-solid fa-link"></i></a>`}
    this.annoncecardTarget.innerHTML = html_to_insert
    console.log(this.annonce)
  }

  #addScoreDiv = (properties) => {
    let html_to_insert = "<h4>SCORES</h4><div class='d-flex'><div class='d-flex flex-column left-column-scores'>"
    let i = 0
    for (const prop of Object.entries(properties)) {
      if (i === 12) break;
      if (i === 6) html_to_insert += "</div><div class='d-flex flex-column'>"
      let to_add = `<label for="file">${this.#capitalize(prop[0].split("_").join(" "))}</label>
      <progress id="file" max="100" value="${prop[1]}"> ${prop[1]}% </progress>`
      html_to_insert += to_add
      i += 1
    }
    this.scorecardTarget.innerHTML = html_to_insert + "</div></div>"
  }

  filter = (event) => {
    event.preventDefault()
    const attr = event.currentTarget.id.toLowerCase().replaceAll(' ', '_').replaceAll('é', 'e')
    console.log(attr)
    if (attr === "weight_average") {
      this.gaugecardTarget.classList.remove("d-none")
    } else {
      this.gaugecardTarget.classList.add("d-none")
    }
    this.map.removeLayer('maine')
    this.map.removeSource('maine')
    this.buildGrid(this.hexas, this.map, attr)
    if (this.map.getLayer("points")) {
      this.map.moveLayer('points')
    }  
  }

  #capitalize = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  changeweights = (event) => {
    event.preventDefault()
    if (typeof(this.new_weights) == 'undefined') {
      this.new_weights = this.weightsValue
    }
    this.new_weights[event.currentTarget.id - 1] = Number(event.currentTarget.value) / 10
    console.log(this.hexas[0])
    this.#weightedAverageScore(this.hexas, this.new_weights)
    this.#smoothScore(this.hexas, "weight_average")
    console.log(this.hexas[0])
    this.map.removeLayer('maine')
    this.map.removeSource('maine')
    this.buildGrid(this.hexas, this.map, "weight_average")
  }
}
