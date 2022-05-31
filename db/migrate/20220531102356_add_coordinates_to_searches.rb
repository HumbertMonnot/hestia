class AddCoordinatesToSearches < ActiveRecord::Migration[6.1]
  def change
    add_column :searches, :latitude, :float
    add_column :searches, :longitude, :float
  end
end
