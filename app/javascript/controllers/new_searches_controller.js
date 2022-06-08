import { Controller } from "stimulus"

export default class extends Controller {
  static targets = ["duration"]
  connect() {
  }

  update(event) {
    event.preventDefault()
    console.log(event.target.value)
    this.durationTarget.innerText = event.target.value
    this.element.submit();
}
}
