import animaux from "./animaux.js"
import commerce_de_bouche from "./commerce_de_bouche.js"
import etablissements_scolaires from "./etablissements_scolaires.js"
import grandes_surfaces from "./grandes_surfaces.js"
import installations_sportives from "./installations_sportives.js"
import medecine_courante from "./medecine_courante.js"
import medecine_specialisee from "./medecine_specialisee.js"
import petite_enfance from "./petite_enfance.js"
import restauration from "./restauration.js"
import services_de_proximite from "./services_de_proximite.js"
import shopping from "./shopping.js"
import vie_culturelle from "./vie_culturelle.js"

export default (hexagon) => {
  animaux(hexagon)
  commerce_de_bouche(hexagon)
  etablissements_scolaires(hexagon)
  grandes_surfaces(hexagon)
  installations_sportives(hexagon)
  medecine_courante(hexagon)
  medecine_specialisee(hexagon)
  petite_enfance(hexagon)
  restauration(hexagon)
  services_de_proximite(hexagon)
  shopping(hexagon)
  vie_culturelle(hexagon)
  return hexagon
}
