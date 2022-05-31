class UpdateStatusDefaultToIndicatorWeights < ActiveRecord::Migration[6.1]
  def change
    change_column_default :indicators, :weight, from: nil, to: 1
  end
end
