#!/bin/bash

cd /Volumes/Films/Films/X\ MEN/

for dir in *; do
    if [ -d "$dir" ]; then
		# echo $dir
		# On ajoute du texte au titre du dossier
		new_name="X-MEN $dir"
		echo $new_name
		mv "$dir" "$new_name" # Renomme le dossier
		echo '-------------------'
    fi
done