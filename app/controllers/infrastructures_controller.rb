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
    t= Time.now
    # center = params[:address].split(",").map(&:to_f)
    # infras = Infrastructure.near(center.reverse, 1.5)
    scores = []
    params[:coords].split(",").map(&:to_f).each_slice(2).with_index do |coords, ind|
      deb = Time.now
      puts "#{ind + 1}ème polygone"
      infras_700 = Infrastructure.near(coords.reverse, 0.7)
      scores << {
                  "animaux" => Geocoder::Calculations.distance_between(coords.reverse, Infrastructure.where(indicator_title_id: 1).near(coords.reverse).first),
                  "commerce_de_bouche" => infras_700.select{ |infra| infra.indicator_title_id == 2 }.length,
                  "etablissement_scolaire" => Geocoder::Calculations.distance_between(coords.reverse, Infrastructure.where(indicator_title_id: 3).near(coords.reverse).first),
                  "grandes_surfaces" => Geocoder::Calculations.distance_between(coords.reverse, Infrastructure.where(indicator_title_id: 4).near(coords.reverse).first),
                  "installation_sportive" => infras_700.select{ |infra| infra.indicator_title_id == 5 }.length,
                  "medecine_courante" => infras_700.select{ |infra| infra.indicator_title_id == 6 }.length,
                  "medecine_specialisee" => infras_700.select{ |infra| infra.indicator_title_id == 7 }.length,
                  "petite_enfance" => infras_700.select{ |infra| infra.indicator_title_id == 8 }.length,
                  "restauration" => infras_700.select{ |infra| infra.indicator_title_id == 9 }.length,
                  "services_de_proximite" => infras_700.select{ |infra| infra.indicator_title_id == 10 }.length,
                  "shopping" => infras_700.select{ |infra| infra.indicator_title_id == 11 }.length,
                  "vie_culturelle" => infras_700.select{ |infra| infra.indicator_title_id == 12 }.length
                }
    puts Time.now - deb
    end
    puts "--------------"
    puts Time.now - t
    puts "--------------"
    # distance = params[:dist].to_f
    # type = params[:type]
    # min_long = coords[0] - distance * 0.02
    # max_long = coords[0] + distance * 0.02
    # min_lat = coords[1] - distance * 0.01
    # max_lat = coords[1] + distance * 0.01
    # @infras = Infrastructure.near(coords, 1)

    render json: scores
    
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
