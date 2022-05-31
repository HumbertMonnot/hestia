# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

puts "cleaning database"
User.destroy_all
Search.destroy_all
Indicator.destroy_all
IndicatorTitle.destroy_all
Infrastructure.destroy_all

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
search_5 =Search.create!(user: user_5, address:"16 rue des remparts 33000 bordeaux", duration: 25, profile: "walking")

puts 'finished for searches...'

puts 'Creating indicator_title...'
indi_1 = IndicatorTitle.create!(name: "vie culturelle")
indi_2 = IndicatorTitle.create!(name: "shopping")
indi_3 = IndicatorTitle.create!(name: "services de proximite")
indi_4 = IndicatorTitle.create!(name: "restauration")
indi_5 = IndicatorTitle.create!(name: "petite enfance")
indi_6 = IndicatorTitle.create!(name: "medecine specialisee")
indi_7 = IndicatorTitle.create!(name: "medecine courante")
indi_8 = IndicatorTitle.create!(name: "installation sportive")
indi_9 = IndicatorTitle.create!(name: "grandes surfaces")
indi_10 = IndicatorTitle.create!(name: "etablissement scolaire")
indi_11 = IndicatorTitle.create!(name: "commerce de bouche")
indi_12 = IndicatorTitle.create!(name: "animaux")
puts 'finished for indicator_titles...'


puts 'Creating infrastructures...'
infra_1 = Infrastructure.create!(indicator_title: indi_11, equipment: "boulangerie", domain: "commerces")
infra_2 = Infrastructure.create!(indicator_title: indi_11, equipment: "boucherie,", domain: "commerces")
infra_3 = Infrastructure.create!(indicator_title: indi_11, equipment: "poissonnerie", domain: "commerces")
infra_4 = Infrastructure.create!(indicator_title: indi_10, equipment: "ecole maternelle", domain: "enseignement")
infra_5 = Infrastructure.create!(indicator_title: indi_10, equipment: "College", domain: "enseignement")
puts 'finished for infrastructures...'

puts 'Creating Indicators...'
indicator_1 = Indicator.create!(indicator_title: indi_10, weight: 0.8, search: search_5)
indicator_2 = Indicator.create!(indicator_title: indi_9, weight: 0.3, search: search_2)
indicator_3 = Indicator.create!(indicator_title: indi_7, weight: 0.5, search: search_3)
puts 'finished for Indicators...'
