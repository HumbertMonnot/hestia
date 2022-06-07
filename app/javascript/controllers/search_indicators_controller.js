import { Controller } from "stimulus"

export default class extends Controller {
  static targets = ["weight"]
  connect() {
  }

  update(event) {
    event.preventDefault()
    console.log(event.target.value)
    this.weightTarget.innerText = event.target.value
    this.element.submit();
}
}
