require 'json'

file = File.read('movie_titlesv3.json')
data = JSON.parse(file)
puts data['names']
