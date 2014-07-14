class AddColumnPackageNameToTableReviews < ActiveRecord::Migration
  def change
     add_column :reviews, :package_name, :string
  end
end
