class CreateReviews < ActiveRecord::Migration
  def change
    create_table :reviews do |t|
      t.string  :description
      t.string  :platform
      t.date    :datetime

    end
  end
end
