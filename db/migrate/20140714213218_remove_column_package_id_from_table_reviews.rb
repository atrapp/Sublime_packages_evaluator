class RemoveColumnPackageIdFromTableReviews < ActiveRecord::Migration
  def change
    remove_column :reviews, :package_id
  end
end
