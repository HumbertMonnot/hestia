class RenameAdToAdvert < ActiveRecord::Migration[6.1]
  def change
    rename_table :ads, :adverts
  end
end
