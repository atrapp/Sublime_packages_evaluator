class Review < ActiveRecord::Base

  validates_presence_of :title, on: :create
  # validates_presence_of :datetime, on: :create 
  validates_presence_of :user_id, on: :create
  
  belongs_to  :user
  belongs_to  :package

  def to_display
    {
      title: self.title,
      user_id: self.user_id,
      username: user.username,
      email: user.email,
      description: self.description,
      platform: self.platform,
      rating: self.rating,
      datetime: self.datetime,
      id: self.id
    }
  end
end
