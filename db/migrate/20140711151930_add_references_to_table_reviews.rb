class AddReferencesToTableReviews < ActiveRecord::Migration
  def change
    add_column :reviews, :user_id, :integer
    add_column :reviews, :package_id, :integer
  end
end
