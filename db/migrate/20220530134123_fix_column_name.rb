class FixColumnName < ActiveRecord::Migration[6.1]
  def change
    rename_column :searches, :time, :duration
  end
end
