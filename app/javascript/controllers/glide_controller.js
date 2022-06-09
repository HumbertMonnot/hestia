import { Controller } from "stimulus"
import Glide, { Controls, Breakpoints } from '@glidejs/glide/dist/glide.modular.esm'

export default class extends Controller {
  static targets = [ "glide" ]

  connect() {
    console.log("ici")
    new Glide(this.element, {
      autoplay: 2000,
      gap: 16,
      peek: {
        before: 150,
        after: 150
      },
      perView: 1,
      breakpoints: {
        576: {
          perView: 1
        }
      },
      type: "carousel"
    }
    ).mount({ Controls, Breakpoints })

  }
}
