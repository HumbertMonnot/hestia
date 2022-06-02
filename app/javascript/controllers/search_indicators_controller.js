import { Controller } from "stimulus"

export default class extends Controller {
  static targets = ["input", "form"]
  static values = {
    id: Number
  }

  connect() {
  }


  update(event) {
    event.preventDefault()
    this.formTarget.submit()
}
}
