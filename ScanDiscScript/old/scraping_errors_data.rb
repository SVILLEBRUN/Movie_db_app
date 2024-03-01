# frozen_string_literal: true

require 'json'
require 'net/http'
require 'uri'
require 'nokogiri'

$base_url = 'https://www.themoviedb.org'

errors_string = File.read('../errors.json')

errors = JSON.parse(errors_string)

movie_titles = []
titles_origin = []

errors.each do |title|
  title = title.split('(')[0].strip
  title = title.gsub(' ', '-')
  movie_titles << title.downcase
end

def get_url(movie_title)
  url = URI.parse("#{$base_url}/search?query=#{movie_title}")
  http = Net::HTTP.new(url.host, url.port)
  http.use_ssl = (url.scheme == 'https')

  request = Net::HTTP::Get.new(url.request_uri)

  response = http.request(request)
  doc = Nokogiri::HTML(response.body)

  hrefs = doc.css('.result').map { |link| link['href'] }

  incomplet_url = "#{$base_url}#{hrefs[0]}"

  uri = URI(incomplet_url)
  response = Net::HTTP.get_response(uri)
  puts response['location']

  first_movie_link = response['location']

  puts first_movie_link
  first_movie_link
end

get_url(movie_titles[0])
