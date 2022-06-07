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
#   longitude: row['lon'],
#   latitude: row['lat'],
#   equipment: row['equipment'],
#   indicator_title_id: row['indicator_title_id']
#  )
#  if Infrastructure.count % 8000 == 0
#   puts Infrastructure.count
#   end
# end

puts "cleaning database"
User.destroy_all
Search.destroy_all
Indicator.destroy_all
Advert.destroy_all


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

puts 'Creating ads...'
# user: not user_id: !!
ad_1 = Advert.create!(title: "Appartement 4 pièces", size: 85, price: 455_000, address: "Rue Saint Genès", state: "pending", url: "https://www.leboncoin.fr/ventes_immobilieres/2169390755.htm", user: user_1 )
ad_2 = Advert.create!(title: "Appartement 2 pièces", size: 36, price: 207_500, address: "Tram B arrêt cours du Médoc", state: "liked", url: "https://www.leboncoin.fr/ventes_immobilieres/2168280014.htm", user: user_2 )
ad_3 = Advert.create!(title: "Appartement 5 pièces", size: 129, price: 618_000, address: "Rive droite, tram A station Jean Jaures", state: "pending", url: "https://www.leboncoin.fr/ventes_immobilieres/2169495252.htm", user: user_3 )
ad_4 = Advert.create!(title: "Appartement meublé et rénové", size: 53, price: 997, address: "Quartier St Michel", state: "pending", url:"https://www.leboncoin.fr/locations/2170818126.htm", user: user_4 )
ad_5 = Advert.create!(title: "Appartement 4 pièces", size: 84, price: 1517, address: "Rue Tanesse, Bordeaux", state: "liked", comment: "Super vue",url: "https://www.leboncoin.fr/locations/2170042943.htm", user: user_5 )
ad_6 = Advert.create!(title: "Duplex avec terrasse", size: 84, price: 486_000, address: "Quai des Chartrons", state: "pending", url: "https://www.leboncoin.fr/ventes_immobilieres/2153445419.htm", user: user_1 )
ad_7 = Advert.create!(title: "Superbe T3", size: 63, price: 285_000, address: "Rue Pasteur, Caudéran", state: "pending", url: "https://www.leboncoin.fr/ventes_immobilieres/2168020019.htm", user: user_2 )
ad_8 = Advert.create!(title: "Maison 9 pièces", size: 257, price: 799_500, address: "Rive droite, Camblanes-et-Meynac", state: "pending", url: "https://www.leboncoin.fr/ventes_immobilieres/2156512151.htm", user: user_3 )
ad_9 = Advert.create!(title: "T2 Bis centre ville", size: 45, price: 895, address: "Gambetta Meriadeck", state: "not liked", url: "https://www.leboncoin.fr/locations/2170339515.htm", user: user_4 )
ad_10 = Advert.create!(title: "Superbe T3", size: 76, price: 1250, address: "Quartier Saint Genès", state: "not liked", url: "https://www.leboncoin.fr/locations/2166977373.htm", user: user_5 )
puts 'finished for ads...'
