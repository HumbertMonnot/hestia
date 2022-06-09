Rails.application.routes.draw do
  devise_for :users
  root to: 'searches#new'

  get "infras/api", to: 'infrastructures#send_coords'

  resources :searches, only: [:create, :show] do
    resources :indicators, only: [:index]
  end

  resources :indicators, only: :update

  resources :searches, only: [:index, :destroy]

  resources :adverts, only: [:create, :update, :index, :destroy]
  resources :tasks, only: [:index, :create, :update, :destroy]
end
