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
    
    # render json: JSON.parse('[{
    #   "id": 14829,
    #   "indicator_title_id": 4,
    #   "equipment": "Supermarché",
    #   "domain": null,
    #   "created_at": "2022-05-31T15:57:37.504Z",
    #   "updated_at": "2022-05-31T15:57:37.504Z",
    #   "latitude": 44.844804,
    #   "longitude": -0.601117
    #   },
    #   {
    #   "id": 14814,
    #   "indicator_title_id": 4,
    #   "equipment": "Supermarché",
    #   "domain": null,
    #   "created_at": "2022-05-31T15:57:37.404Z",
    #   "updated_at": "2022-05-31T15:57:37.404Z",
    #   "latitude": 44.804188,
    #   "longitude": -0.558063
    #   }]')
  end
end
