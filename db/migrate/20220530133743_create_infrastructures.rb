class CreateInfrastructures < ActiveRecord::Migration[6.1]
  def change
    create_table :infrastructures do |t|
      t.references :indicator_title, null: false, foreign_key: true
      t.string :equipment
      t.string :name

      t.timestamps
    end
  end
end
