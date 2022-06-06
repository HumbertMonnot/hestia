class Task < ApplicationRecord
  belongs_to :user

  validates :title, presence: true
  validates :description, presence: true
  validates :state, presence: true, inclusion: { in: ["done", "not done yet", "not done"] }
end
