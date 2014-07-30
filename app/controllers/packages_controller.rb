class PackagesController < ApplicationController

require 'sublime_package_API'

  def index
    packages = Package.all
    render json: packages.to_json
  end

  def show
    package = Package.find( params[:id] )
    render json: package.to_json 
  end

  def create
    package = Package.create( package_params )
    render json: package.to_json   
  end
 
  def update
    package = Package.find( params[:id] )
    package.update( package_params )
    render json: package.to_json  
  end

  def destroy    
    package = Package.find( params[:id] )
    package.destroy
    render json: package.to_json
  end

  def search
    packages = SublimePackageAPI.find_package( params[:package_name] ) 
    
    packages_and_reviews = packages.map do |package|
      if reviews = Review.order(datetime: :desc).where( package_name: package['name'] ).map(&:to_display)  
        package['reviews'] = reviews
      end
      package
    end

    unless packages_and_reviews == nil
      render json: packages_and_reviews.to_json
    end
  end

  def gettop25
    packages = SublimePackageAPI.get_top25() 
    
    packages_and_reviews = packages.map do |package|     
      if reviews = Review.order(datetime: :desc).where( package_name: package['name'] ).map(&:to_display)  
        package['reviews'] = reviews
      end
      package
    end

    unless packages_and_reviews == nil
      render json: packages_and_reviews.to_json
    end
  end

  private

  def package_params
    params.require(:package).permit(:name)
  end

end

