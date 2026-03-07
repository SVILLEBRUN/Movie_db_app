require 'json'

puts 'Scanning disk for movie names...'

# --- 1. Récupération des données selon l'OS ---
if RUBY_PLATFORM =~ /mswin|msys|mingw|cygwin|bccwin|wince|emc/
  puts 'Platform: Windows'
  raw_data = `powershell.exe -ExecutionPolicy Bypass -Command "(Get-ChildItem D:\\Film -Directory).Name"`.strip.split("\r\n")
elsif RUBY_PLATFORM =~ /darwin/
  puts 'Platform: Mac'
  raw_data = `find /Volumes/Films/Films -maxdepth 1 -type d -not -path "/Volumes/Films/Films"`.strip.split("\n")
  raw_data.map! { |dir| File.basename(dir) }
else
  puts 'Platform: Linux => Non testé. Script annulé.'
  exit
end


# --- 2. Chargement de l'existant pour éviter les doublons ---
def load_existing_titles(filename)
  if File.exist?(filename)
    file_content = File.read(filename)
    data = JSON.parse(file_content)
    return data['names'] || []
  end
  []
rescue JSON::ParserError
  []
end

existing_valid = load_existing_titles('movie_titles.json')
existing_errors = load_existing_titles('titles_errors.json')

# --- 3. Tri et filtrage des nouveaux films uniquement ---
new_valid_titles = []
new_non_valid_titles = []

raw_data.each do |title|
  # On vérifie si le titre n'est pas déjà dans l'un des deux fichiers
  next if existing_valid.include?(title) || existing_errors.include?(title)

  if title.match?(/\(\d{4}\)$/)
    new_valid_titles << title
  else
    new_non_valid_titles << title
  end
end

# --- 4. Mise à jour des fichiers JSON ---
def update_json_file(filename, existing_titles, new_titles)
  if new_titles.empty?
    puts "Aucune nouveauté pour #{filename}."
    return
  end

  updated_list = (existing_titles + new_titles).sort.uniq
  result = { names: updated_list }
  
  File.write(filename, JSON.pretty_generate(result))
  puts "#{new_titles.size} nouveau(x) titre(s) ajouté(s) à #{filename}."
end

update_json_file('movie_titles.json', existing_valid, new_valid_titles)
update_json_file('titles_errors.json', existing_errors, new_non_valid_titles)

puts 'Script finished.'