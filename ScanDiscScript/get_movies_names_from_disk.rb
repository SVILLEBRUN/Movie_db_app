require 'json'

puts 'Scaning disk for movies names'

# On détermine le système d'exploitation
if RUBY_PLATFORM =~ /mswin|msys|mingw|cygwin|bccwin|wince|emc/
	puts 'Starting script Windows'
	data = `powershell.exe -ExecutionPolicy Bypass -Command "(Get-ChildItem D:\\Film -Directory).Name"`.strip.split("\r\n")
elsif RUBY_PLATFORM =~ /darwin/
	puts 'Starting script Mac'
	data = `find /Volumes/Films/Films -maxdepth 1 -type d -not -path "/Volumes/Films/Films"`.strip.split("\n")
	data.map! { |dir| File.basename(dir) }
else
	puts 'Starting script Linux => Non testé'
	puts 'Script cancelled'
	exit
	# data = `ls /media/Seagate/Film`.strip.split("\n")
	# puts 'Script finished'
end




# Vérifier le format de chaque nom de film
valid_titles = []
non_valid_titles = []
data.each do |title|
	if title.match?(/\(\d{4}\)$/)
		valid_titles << title
	else
		non_valid_titles << title
	end
end

# Créer un fichier JSON avec les noms de films valides
valid_result = { names: valid_titles.sort! }
valid_json_str = JSON.pretty_generate(valid_result)
File.write('movie_titles.json', valid_json_str)

# Créer un fichier JSON avec les noms de films non valides
non_valid_result = { names: non_valid_titles.sort! }
non_valid_json_str = JSON.pretty_generate(non_valid_result)
File.write('titles_errors.json', non_valid_json_str)

puts 'Script finished'
