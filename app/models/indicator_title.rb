class IndicatorTitle < ApplicationRecord
  has_many :infrastructures
  has_many :indicators

  validates :name, presence: true
end
