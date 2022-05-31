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

puts "cleaning database"
User.destroy_all
Search.destroy_all
Indicator.destroy_all

puts 'Creating users...'
user_1 = User.create!(email: "johnnymancha@gmail.com", password: "secret", username: "johnnymancha")
user_2 = User.create!(email: "oceane@gmail.com", password: "secret", username: "oceane")
user_3 = User.create!(email: "humbert@gmail.com", password: "secret", username: "humbert")
user_4 = User.create!(email: "farah@gmail.com", password: "secret", username: "farah")
user_5 = User.create!(email: "jojo@gmail.com", password: "secret", username: "jojo")
puts 'finished for users...'


puts 'Creating searches...'
search_1 = Search.create!(user: user_1 , address:"20 rue gounod 33110 le bouscat", duration: 15, profile: "cycling")
search_2 = Search.create!(user: user_2, address:"33 route de verac 33133 galgon", duration: 40, profile: "driving")
search_3 = Search.create!(user: user_3, address:"38 rue marsan 33000 bordeaux", duration: 15, profile: "walking")
search_4 = Search.create!(user: user_4, address:"5 rue de bouliac 33100 bordeaux", duration: 25, profile: "cycling")
search_5 = Search.create!(user: user_5, address:"16 rue des remparts 33000 bordeaux", duration: 25, profile: "walking")

puts 'finished for searches...'

puts 'Creating Indicators...'
indicator_1 = Indicator.create!(indicator_title_id: 2, weight: 0.8, search: search_5)
indicator_2 = Indicator.create!(indicator_title_id: 3, weight: 0.3, search: search_2)
indicator_3 = Indicator.create!(indicator_title_id: 7, weight: 0.5, search: search_3)
puts 'finished for Indicators...'

