class Search < ApplicationRecord
  belongs_to :user
  has_many :indicators
  validates :address, presence: true
  validates :duration, presence: true, inclusion: {in: (5..60)}
  validates :profile, presence: true, inclusion: {in: ['walking', 'driving', 'cycling']}
end
