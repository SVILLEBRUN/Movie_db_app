require 'json'

puts 'Starting script'
data = `powershell.exe -ExecutionPolicy Bypass -Command "(Get-ChildItem D:\\Film -Directory).Name"`.strip.split("\r\n")
result = { names: data }
json_str = JSON.pretty_generate(result)
File.write('movie_titles.json', json_str)
puts 'Script finished'
