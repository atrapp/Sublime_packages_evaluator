class SessionsController < ApplicationController

  def new #login-form
  end

  def create
    @user = login(params[:email], params[:password])
    if @user
      redirect_back root_path
    else
      flash.now[:alert] = 'Login failed'
      render :new
    end 
  end

  def destroy #logout
    logout # this is sorcery logout method
    redirect_to root_path
  end
  
end
