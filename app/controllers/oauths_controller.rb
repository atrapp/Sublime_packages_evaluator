class OauthsController < ApplicationController
  skip_before_filter :require_login

  # sends the user on a trip to the provider,
  # and after authorizing there back to the callback url.
  def oauth
    login_at(auth_params[:provider])
  end

  def callback
    provider = auth_params[:provider]
   
    if auth_params[:denied]
      redirect_to root_path, :alert => "Failed to login from #{provider.titleize}!"
    else
      if @user = login_from(provider)      
        redirect_to root_path, :notice => "Logged in from #{provider.titleize}!"
      else
        begin
          @user = create_from(provider)
          
          reset_session # protect from session fixation attack
          auto_login(@user)
          redirect_to root_path, :notice => "Logged in from #{provider.titleize}!"
        rescue
          redirect_to root_path, :alert => "Failed to login from #{provider.titleize}!"
        end
      end
    end
  end

  private
  def auth_params
    params.permit(:code, :provider, :denied)
  end

end