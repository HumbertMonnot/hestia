class Infrastructure < ApplicationRecord
  belongs_to :indicator_title
  validates :equipment, presence: true
  validates :longitude, presence: true
  validates :latitude, presence: true
end
