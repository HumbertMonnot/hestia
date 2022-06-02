Rails.application.routes.draw do
  devise_for :users
  root to: 'searches#new'

  # get "polygons/compute", to: 'polygons#compute'

  resources :searches, only: [:create, :show] do
    resources :indicators, only: [:index, :update]
  end

  resources :users, only: [] do
    resources :searches, only: [:index]
  end
end
