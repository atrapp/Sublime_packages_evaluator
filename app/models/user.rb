class User < ActiveRecord::Base

  # attr_accessible :email, :password, :password_confirmation, :authentications_attributes
  authenticates_with_sorcery! do |config|
    config.authentications_class = Authentication
  end

  has_many :authentications, :dependent => :destroy
  accepts_nested_attributes_for :authentications
  
  validates_presence_of :password, on: :create
  validates_presence_of :password_confirmation, on: :create
  validates_presence_of :email, on: :create
  validates_presence_of :username, on: :create

  validates :password, length: { minimum: 8 }
  validates :password, confirmation: true

  validates_uniqueness_of :email
  validates_uniqueness_of :username

  has_many  :reviews

end
