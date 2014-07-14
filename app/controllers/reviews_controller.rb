class ReviewsController < ApplicationController

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

  def filter_by_package   
    package = Review.where(package_name: params[:package_name] )   
    
    unless package == nil
      render json: package.to_json     
    end
  end

  private

  def review_params
    params.require(:review).permit(:package_name, :title, :description, :platform, :rating, :datetime)
  end

end
