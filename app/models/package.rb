class Package < ActiveRecord::Base

  validates_presence_of :name, on: :create 
  # validates_presence_of :rating, on: :create 
  validates_uniqueness_of :name

  has_many  :reviews
end
