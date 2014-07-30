class UsersController < ApplicationController
  
  # only to see the profile view it is required to be logged in
  # or else NoMethodError in Users#profile
  before_action :require_login, only: [:profile]

  def index
  end

  def new
    @user = User.new
  end

  def create
    # in case the form data could not be saved, the form input data is still being displayed to the user to try again
    @user = User.new(user_params)
    if @user.save
      redirect_to login_path
    else
      flash.now[:alert] = 'Signup failed'      
      render :new
    end
  end

  def edit
  end

  def update
  end

  def show
  end

  def destroy
  end

  def profile
  end

  private

  def user_params
    params.require(:user).permit(:username, :email, :password, :password_confirmation, :avatar_url, :authentications_attributes)
  end

end
