class Indicator < ApplicationRecord
  belongs_to :indicator_title
  belongs_to :search

  validates :weight, numericality: { only_float: true, greater_than_or_equal_to: -1, less_than_or_equal_to: 1 }
end
