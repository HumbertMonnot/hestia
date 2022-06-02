# class PolygonsController < ApplicationController
#   def compute
#     centers_hash = get_params(params)
#     centers_list = centers_hash_to_list(centers_hash)
#     raise
#   end

#   private

#   def get_params(truc)
#   # Pour récupérer le centre des points uniquement et enlever les autres Keys
#     transmitted = truc
#     transmitted.permit!
#     transmitted = transmitted.to_h
#     transmitted.delete("action")
#     transmitted.delete("controller")
#     return transmitted
#   end

#   def centers_hash_to_list(a_hash)
#   #Pour transformer le dictionnaire en une liste de coords des centres des hexagones
#     a_hash.map {|_, value| value.split(",").map(&:to_f)}
#   end
# end
