class ChangeColumnDateTimeInTableReviews < ActiveRecord::Migration
  def change
    remove_column :reviews, :datetime
    add_column :reviews, :datetime, :string
  end
end
