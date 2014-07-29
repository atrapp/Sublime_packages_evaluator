module SublimePackageAPI

  def self.find_package(package_name)

    package_name = package_name.gsub(' ', '%20')  
    url = "https://sublime.wbond.net/search/" + package_name + ".json"
    response = HTTParty.get(url)    
    response['packages'] # returns a list of all packages
    
  end 

  def self.get_top25()

    url = "https://sublime.wbond.net/browse/popular.json"
    response = HTTParty.get(url)    
    response['packages'] # returns a list of top 25 packages
    
  end 

end
