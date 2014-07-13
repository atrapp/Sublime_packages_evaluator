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

  private

  def review_params
    params.require(:review).permit(:title, :description, :platform, :rating, :datetime)
  end

end


# class MonkeysController < ApplicationController

#   # monkeys GET    /monkeys(.:format)     monkeys#index
#   #         POST   /monkeys(.:format)     monkeys#create
#   #  monkey GET    /monkeys/:id(.:format) monkeys#show
#   #         PATCH  /monkeys/:id(.:format) monkeys#update
#   #         PUT    /monkeys/:id(.:format) monkeys#update
#   #         DELETE /monkeys/:id(.:format) monkeys#destroy


#   def index
#     monkeys = Monkey.all
#     render json: monkeys.to_json
#   end

#   def show
#     monkey = Monkey.find(params[:id])
#     render json: monkey.to_json
#   end

#   def create
#     monkey = Monkey.create( monkey_params )
#     render json: monkey.to_json
#   end

#   def update
#     monkey = Monkey.find(params[:id])
#     monkey.update( monkey_params )
#     render json: monkey.to_json    
#   end

#   def destroy
#     # Monkey.delete(params[:id])
#     monkey = Monkey.find(params[:id])
#     monkey.destroy
#     render json: monkey.to_json
#   end


#   private

#   def monkey_params
#     params.require(:monkey).permit(:name)
#   end

# end