Rails.application.routes.draw do
  devise_for :users
  root to: 'searches#new'

  resources :searches, only: [:create, :index, :show] do
    resources :indicators, only: [:edit, :update]
    resources :polygons, only: [:update]
  end
end
