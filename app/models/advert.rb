class Advert < ApplicationRecord
  belongs_to :user

  validates :title, presence: true
  validates :url, presence: true

  # pending as initial state
  validates :state, presence: true, inclusion: { in: ["pending", "liked", "not liked"]}
end
