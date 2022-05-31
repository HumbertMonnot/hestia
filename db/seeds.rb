# require "csv"

# filepath = "bdd_infras_bdx.csv"

# if IndicatorTitle.count == 0
#   puts 'Creating indicator_title...'
#   IndicatorTitle.create!(name: "animaux".capitalize)
#   IndicatorTitle.create!(name: "commerce de bouche".capitalize)
#   IndicatorTitle.create!(name: "etablissement scolaire".capitalize)
#   IndicatorTitle.create!(name: "grandes surfaces".capitalize)
#   IndicatorTitle.create!(name: "installation sportive".capitalize)
#   IndicatorTitle.create!(name: "médecine courante".capitalize)
#   IndicatorTitle.create!(name: "médecine spécialisée".capitalize)
#   IndicatorTitle.create!(name: "petite enfance".capitalize)
#   IndicatorTitle.create!(name: "restauration".capitalize)
#   IndicatorTitle.create!(name: "services de proximite".capitalize)
#   IndicatorTitle.create!(name: "shopping".capitalize)
#   IndicatorTitle.create!(name: "vie culturelle".capitalize)
#   puts 'finished for indicator_titles...'
# end

# Infrastructure.destroy_all

# CSV.foreach(filepath, headers: :first_row) do |row|
#   Infrastructure.create!(
#     longitude: row['lon'],
#     latitude: row['lat'],
#     equipment: row['equipment'],
#     indicator_title_id: row['indicator_title_id']
#   )
#   if Infrastructure.count % 8000 == 0
#     puts Infrastructure.count
#   end
# end


