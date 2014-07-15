Rails.application.routes.draw do

  root 'welcome#index'

  get '/login' => 'sessions#new', as: 'login'
  post '/sessions' => 'sessions#create', as: 'sessions'
  delete '/logout' => 'sessions#destroy', as: 'logout'

  get '/signup' => 'users#new', as: 'signup'
  post '/users' => 'users#create', as: 'users'  
  
  get '/profile' => 'users#profile', as: 'profile'


  resources :packages, except: [:new, :edit]
  get '/search' => 'packages#search'

  resources :reviews, except: [:new, :edit]
    
end


#       Prefix Verb   URI Pattern                  Controller#Action
#         root GET    /                            welcome#index

#        login GET    /login(.:format)             sessions#new
#     sessions POST   /sessions(.:format)          sessions#create
#       logout DELETE /logout(.:format)            sessions#destroy

#       signup GET    /signup(.:format)            users#new
#        users POST   /users(.:format)             users#create
#      profile GET    /profile(.:format)           users#profile

#       search GET    /search(.:format)            packages#search

#     packages GET    /packages(.:format)          packages#index
#              POST   /packages(.:format)          packages#create
#      package GET    /packages/:id(.:format)      packages#show
#              PATCH  /packages/:id(.:format)      packages#update
#              PUT    /packages/:id(.:format)      packages#update
#              DELETE /packages/:id(.:format)      packages#destroy

#      reviews GET    /reviews(.:format)           reviews#index
#              POST   /reviews(.:format)           reviews#create
#       review GET    /reviews/:id(.:format)       reviews#show
#              PATCH  /reviews/:id(.:format)       reviews#update
#              PUT    /reviews/:id(.:format)       reviews#update
#              DELETE /reviews/:id(.:format)       reviews#destroy

