class CreateIndicators < ActiveRecord::Migration[6.1]
  def change
    create_table :indicators do |t|
      t.references :indicator_title, null: false, foreign_key: true
      t.references :search, null: false, foreign_key: true
      t.float :weight

      t.timestamps
    end
  end
end
