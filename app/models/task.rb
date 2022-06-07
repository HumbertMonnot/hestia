class Task < ApplicationRecord
  belongs_to :user

  validates :title, presence: true
  validates :description, presence: true
  validates :state, presence: true, inclusion: { in: ["fait", "en cours", "pas fait"] }
end
