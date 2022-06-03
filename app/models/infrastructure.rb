require "geocoder/stores/active_record"

class Infrastructure < ApplicationRecord
  belongs_to :indicator_title
  validates :equipment, presence: true
  validates :longitude, presence: true
  validates :latitude, presence: true
  
  include Geocoder::Store::ActiveRecord
  
  def self.geocoder_options
    { latitude: 'latitude', longitude: 'longitude' }
  end
end
