import { add, Controller } from "stimulus"
import mapboxgl from "mapbox-gl"
import { buildGrid, hexas } from "./hexas_controller"

export default class extends Controller {
  static targets = []
  static values = {}

  connect = () => {
    console.log("on est là, au calme")
  }

  filter = (event) => {
    event.preventDefault()
    const attr = event.currentTarget.id.toLowerCase().replace(' ', '_').replace('é', 'e')
    console.log(hexas)
  }
}