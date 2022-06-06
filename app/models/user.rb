class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  # validates :username, presence: true
  has_many :searches, dependent: :destroy
  has_many :tasks, dependent: :destroy
  has_many :ads, dependent: :destroy
end
