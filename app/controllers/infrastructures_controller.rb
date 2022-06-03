class InfrastructuresController < ApplicationController
  TYPE_DICO = {
    "animaux" => 1,
    "commerce_de_bouche" => 2,
    "etablissements_scolaires" => 3,
    "grandes_surfaces" => 4,
    "installations_sportives" => 5,
    "medecine_courante" => 6,
    "medecine_specialisee" => 7,
    "petite_enfance" => 8,
    "restauration" => 9,
    "services_de_proximite" => 10,
    "shopping" => 11,
    "vie_culturelle" => 12
  }

  def send_coords
    puts("------ on est là --------------")
    coords = params[:coords].split(",").map(&:to_f)
    distance = params[:dist].to_f
    type = params[:type]
    min_long = coords[0] - distance * 0.02
    max_long = coords[0] + distance * 0.02
    min_lat = coords[1] - distance * 0.01
    max_lat = coords[1] + distance * 0.01
    @infras = Infrastructure.where([
      "indicator_title_id  = ? and latitude > ? and latitude < ? and longitude > ? and longitude < ?",
      TYPE_DICO[type],
      min_lat,
      max_lat,
      min_long,
      max_long
    ])
    
    render json: @infras
  end
end
