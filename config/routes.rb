Rails.application.routes.draw do

  root 'welcome#index'

  get '/login' => 'sessions#new', as: 'login'
  post '/sessions' => 'sessions#create', as: 'sessions'
  delete '/logout' => 'sessions#destroy', as: 'logout'

  get '/signup' => 'users#new', as: 'signup'
  post '/users' => 'users#create', as: 'users'  # as: users, 1. because its nicer to read, 2. the form "new" will need it to post the data

  get '/profile' => 'users#profile', as: 'profile'


end


#   Prefix Verb   URI Pattern         Controller#Action
#     root GET    /                   welcome#index
#    login GET    /login(.:format)    sessions#new
# sessions POST   /sessions(.:format) sessions#create
#   logout DELETE /logout(.:format)   sessions#destroy
#   signup GET    /signup(.:format)   users#new
#    users POST   /users(.:format)    users#create
#  profile GET    /profile(.:format)  users#profile