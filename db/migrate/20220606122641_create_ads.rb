class CreateAds < ActiveRecord::Migration[6.1]
  def change
    create_table :ads do |t|
      t.string :title
      t.string :url
      t.integer :size
      t.integer :price
      t.string :address
      t.string :state
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
