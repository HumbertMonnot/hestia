class CreateSearches < ActiveRecord::Migration[6.1]
  def change
    create_table :searches do |t|
      t.references :user, null: false, foreign_key: true
      t.string :address
      t.integer :time
      t.string :profile

      t.timestamps
    end
  end
end
