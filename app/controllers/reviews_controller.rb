class ReviewsController < ApplicationController

  before_filter :require_login, only: [ :create, :update, :destroy ]

  def index
    reviews = Review.all
    render json: reviews.to_json
  end

  def show
    review = Review.find( params[:id] )
    render json: review.to_json 
  end

  def create
    review = Review.create( review_params )
    render json: review.to_json
  end

  def update
    review = Review.find( params[:id] )
    review.update( review_params )
    render json: review.to_json  
  end

  def destroy    
    review = Review.find( params[:id] )
    review.destroy
    render json: review.to_json
  end

  #TODO get rid of me
  def filter_by_package   
    reviews = Review.where(package_name: params[:package_name] )
    
    unless reviews == nil
      render json: reviews.map(&:to_display).to_json
    end
  end

  private

  def review_params
    params.require(:review).permit(:package_name, :title, :description, :platform, :rating, :datetime, :user_id)
  end

end
