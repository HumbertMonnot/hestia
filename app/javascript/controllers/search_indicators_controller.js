import { Controller } from "stimulus"

export default class extends Controller {

  connect() {
  }


  update(event) {
    event.preventDefault()
    this.element.submit();
}
}
