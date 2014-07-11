class AddColumnTitleToTableReviews < ActiveRecord::Migration
  def change
    add_column :reviews, :title, :string
  end
end
