import { Controller } from "stimulus"

export default class extends Controller {
  static targets = [ "output" ]
  static values = {
    hexalist: Array 
  }

  connect() {
    
  }
}