# frozen_string_literal: true

require 'net/http'
require 'uri'
require 'nokogiri'
require 'csv'
require 'json'
require 'ruby-progressbar'

API_KEY = "fde5eec290651347ef46855a96301aaa"

movie_titles = []
titles_origin = []

file = File.read('movie_titles.json')
data = JSON.parse(file)
titles_origin = data['names']

titles_origin.each do |title_origin|
	title = title_origin.split('(')[0].strip
	title = title.gsub(' ', '-')
	date = title_origin[-6..]
	date&.delete!('()')
	movie_titles << [title.downcase, date, title_origin]
end

$errors = []

def get_movie_id(movie_title)
	title = movie_title[0]
	year = movie_title[1]
	folder_title = movie_title[2]
	if !year 
		$errors << { title: folder_title, error: 'No year found' }
		return false
	end
	if !year.match?(/^\d{4}$/)
		$errors << { title: folder_title, error: 'Year not in correct format' }
		return false
	end

	# url = "https://api.themoviedb.org/3/search/movie?api_key=#{API_KEY}&query=#{title}&year=#{year}&language=fr-FR"
	# url = "https://api.themoviedb.org/3/search/movie?api_key=fde5eec290651347ef46855a96301aaa&query=#{title}&year=#{year}&language=fr-FR"
	base_url = "https://api.themoviedb.org/3/search/movie"
	params = {
		api_key: API_KEY,
		query: title,
		year: year,
		language: "fr-FR"
	}
	uri = URI(base_url)
	uri.query = URI.encode_www_form(params)

	response = Net::HTTP.get(uri)
	api_query = JSON.parse(response)

	if api_query['results'] != [] && api_query['results'].length == 1  	# Si il n'y a qu'un seul résultat, on le prends, si non c'est une erreur
		return api_query['results'][0]['id']
	else
		# On filtre les paramètres des réponses pour ne garder que id original_language, original_title, title, overview, et release_date
		if api_query['results'].length > 1
			api_query['results'].each do |result|
				result.delete_if { |key, value| !['id', 'original_language', 'original_title', 'title', 'overview', 'release_date'].include?(key) }
			end
			$errors << { title: folder_title, error: 'Multiple movies found', results: api_query['results'] }
		else
			$errors << { title: folder_title, error: 'Movie not found' }
		end
		return false
	end
end

def get_data(movie_id)
	data = {}
	url_details = "https://api.themoviedb.org/3/movie/#{movie_id}?api_key=#{API_KEY}&language=fr-FR"
	uri_details = URI(url_details)
	response_details = Net::HTTP.get(uri_details)
	api_data_details = JSON.parse(response_details)

	data = Marshal.load(Marshal.dump(api_data_details)) 		# Deep copy pour éviter les problèmes de références

	base_poster_url = 'https://www.themoviedb.org/t/p/w300_and_h450_bestv2'

	# data[:title] = api_data_details["original_title"]
	# data[:original_language] = api_data_details['original_language']
	data.delete("genres")
	data[:genres] = api_data_details['genres'].map { |genre| genre['name'] }
	# data[:overview] = api_data_details['overview']
	if(base_poster_url && api_data_details['poster_path'])
		data[:poster_url] = base_poster_url + api_data_details['poster_path']
	end

	url_credits = "https://api.themoviedb.org/3/movie/#{movie_id}/credits?api_key=#{API_KEY}&language=fr-FR"
	uri_credits = URI(url_credits)
	response_credits = Net::HTTP.get(uri_credits)
	api_data_credits = JSON.parse(response_credits)

	data.delete(:cast)
	data[:actors] = api_data_credits['cast'].map do |cast_member|
		cast_member['profile_path'] ? img_link = base_poster_url + cast_member['profile_path'] : img_link = nil
		{ name: cast_member['name'], profile_path: img_link }
	end

	url_keywords = "https://api.themoviedb.org/3/movie/#{movie_id}/keywords?api_key=#{API_KEY}&language=fr-FR"
	uri_keywords = URI(url_keywords)
	response_keywords = Net::HTTP.get(uri_keywords)
	api_data_keywords = JSON.parse(response_keywords)

	data[:keywords] = api_data_keywords['keywords'].map { |keyword| keyword['name'] }

	data
end

existing_data = []
file = File.read('movies_data.json')                                                      # Comment to rescrape all movies
existing_data = JSON.parse(file)                                                          # Comment to rescrape all movies
existing_folder_names = existing_data.map { |hash| hash['folder_name'] }                  # Comment to rescrape all movies

progressbar = ProgressBar.create(total: movie_titles.count, format: '%t |%B| %p%%')

num_new_movies = 0
puts 'Starting to scrape data...'
movie_titles.each_with_index do |movie_title, i|
	title = titles_origin[i]
	storage_title = movie_title[2]
	unless existing_folder_names.include?(title)                                            # Comment to rescrape all movies
		movie_id = get_movie_id(movie_title)
		if movie_id
			data = get_data(movie_id)
			data[:folder_name] = title
			existing_data << data
			num_new_movies += 1
		end
	end                                                                                     # Comment to rescrape all movies
	progressbar.increment
end
puts "\n\n#{num_new_movies} new movies scraped !\n\n"
puts "\n\n#{existing_data.count} movies total in database !\n\n"
puts "\n#{$errors.count} movies not scraped:\n\n#{'-' * 55}\n\n"

$errors.each do |error|
  	puts error[:title]
end

File.open('movies_data.json', 'w') do |file|
  	file.write(JSON.pretty_generate(existing_data))
end

File.open('errors.json', 'w') do |file|
  	file.write(JSON.pretty_generate($errors))
end

puts 'Done scraping data!'


puts 'Fixing Errors ...'
file = File.read('errors.json')
errors = JSON.parse(file)

end_errors = Marshal.load(Marshal.dump($errors))

errors.each do |error|
	if error[:results] && error[:results].length > 1
		puts ' '
		puts '-------------------------------'
		puts error[:title]
		error[:results].each_with_index do |result, i|
			puts "#{i+1} - #{result["original_title"]} - #{result["release_date"]}"
		end
		puts ' '
		puts "X - None of the above"
		puts ' '
		puts '-------------------------------'
		puts ' '
		choice = gets.chomp.downcase
		if choice != 'x' && choice.to_i > 0 && choice.to_i < error[:results].length
			id = error[:results][choice.to_i - 1]["id"]
			data = get_data(id)
			data[:folder_name] = error[:title]
			existing_data << data
			end_errors.delete(error)
		elsif choice == 'x'
			# On passe au suivant
			next
		else
			# On stope la boucle 
			break
		end
	end
end

File.open('movies_data.json', 'w') do |file|
	file.write(JSON.pretty_generate(existing_data))
end

File.open('errors.json', 'w') do |file|
	file.write(JSON.pretty_generate(end_errors))
end

