class RenameNameToDomainInInfrastructures < ActiveRecord::Migration[6.1]
  def change
    rename_column :infrastructures, :name, :domain
  end
end
