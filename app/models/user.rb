class User < ActiveRecord::Base
  authenticates_with_sorcery!

  validates :password, length: { minimum: 8 }
  validates :password, confirmation: true
  validates :password_confirmation, presence: true
  
  # validates_presence_of :password, on: :create
  # validates_presence_of :email, on: :create
  # validates_presence_of :username, on: :create
  # validates_uniqueness_of :email
  # validates_uniqueness_of :username

  has_many  :reviews
end
