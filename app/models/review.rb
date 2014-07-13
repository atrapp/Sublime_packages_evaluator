class Review < ActiveRecord::Base

  validates_presence_of :title, on: :create
  # validates_presence_of :datetime, on: :create 
  # validates_presence_of :user_id, on: :create
  # validates_presence_of :package_id, on: :create
  
  belongs_to  :user
  belongs_to  :package
end
