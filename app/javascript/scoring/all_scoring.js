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

export default async (hexagon) => {
  await animaux(hexagon)
  await commerce_de_bouche(hexagon)
  await etablissements_scolaires(hexagon)
  await grandes_surfaces(hexagon)
  await installations_sportives(hexagon)
  await medecine_courante(hexagon)
  await medecine_specialisee(hexagon)
  await petite_enfance(hexagon)
  await restauration(hexagon)
  await services_de_proximite(hexagon)
  await shopping(hexagon)
  await vie_culturelle(hexagon)
  return hexagon
}
