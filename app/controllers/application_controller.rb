class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :null_session  # ***   replace :null_session for connecting Backbone with Rails   ***

  def not_authenticated 
    redirect_to login_url
  end
end
