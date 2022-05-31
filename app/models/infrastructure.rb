class Infrastructure < ApplicationRecord
  belongs_to :indicator_title

  validates :equipment, presence: true
end
