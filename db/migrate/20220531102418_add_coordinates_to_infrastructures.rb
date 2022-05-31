class AddCoordinatesToInfrastructures < ActiveRecord::Migration[6.1]
  def change
    add_column :infrastructures, :latitude, :float
    add_column :infrastructures, :longitude, :float
  end
end
