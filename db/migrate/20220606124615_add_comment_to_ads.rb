class AddCommentToAds < ActiveRecord::Migration[6.1]
  def change
    add_column :ads, :comment, :string
  end
end
