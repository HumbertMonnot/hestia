Rails.application.routes.draw do
  devise_for :users
  root to: 'searches#new'

  get "infras/api", to: 'infrastructures#send_coords'

  resources :searches, only: [:create, :show] do
    resources :indicators, only: [:index, :update]
  end

  resources :searches, only: [:index]

  resources :users, only: [] do
    resources :ads, only: [:index, :delete]
    resources :tasks, only: [:index, :create, :update, :delete]
  end
  resources :ads, only: [:create, :update]


end
