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
    let class_indic = ""
    if (event.currentTarget.value < -4) {
      class_indic = "red-range"
    } else if (event.currentTarget.value < 4) {
      class_indic = "orange-range"
    } else {
      class_indic = "green-range"
    }
    event.currentTarget.classList.remove("red-range")
    event.currentTarget.classList.remove("orange-range")
    event.currentTarget.classList.remove("green-range")
    event.currentTarget.classList.add(class_indic)
}
}
