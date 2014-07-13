class PackagesController < ApplicationController

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

  private

  def package_params
    params.require(:package).permit(:name)
  end

end

