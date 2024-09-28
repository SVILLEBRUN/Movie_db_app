#!/bin/bash

cd /Volumes/Films/Films/James\ Bond/

for dir in *; do
    if [ -d "$dir" ]; then
		if [[ "$dir" =~ ^James\ Bond\ [0-9]{2}\ \-\ .*\ \([0-9]{4}\)$ ]]; then
			# Si le fichier est déjà dans le bon format, on passe au suivant
			continue
		fi
		echo $dir
        # Extraire le numéro à deux chiffres
        number=$(echo "$dir" | grep -oE 'James Bond ([0-9]{2})' | grep -oE '[0-9]{2}')
        # echo "Nombre : $number"

        # Extraire l'année à 4 chiffres
        year=$(echo "$dir" | grep -oE '[0-9]{4}')    # Trouve l'année à 4 chiffres
		# echo "Année : $year"

        # Remplacer tous les points par des espaces
        dir_clean=$(echo "$dir" | tr '.' ' ')

		# Extraire le titre en supprimant "James Bond" et le numéro
        title=$(echo "$dir_clean" | sed -E "s/^James Bond [0-9]{2}-//; s/ *$//")

        # Supprimer tout ce qui vient après l'année
        title=$(echo "$title" | sed "s/$year.*//")  # Enlève tout après l'année
		

        # Supprimer les espaces superflus en début et fin de chaîne
        title=$(echo "$title" | sed 's/^ *//; s/ *$//')
		# echo "Titre : $title"

        # # Si on a trouvé un numéro, un titre et une année, on formate correctement
        if [ -n "$number" ] && [ -n "$year" ] && [ -n "$title" ]; then
            new_name="James Bond $number - $title ($year)"
			mv "$dir" "$new_name" # Renomme le dossier
            echo "Renommé en '$new_name'"
        else
            echo "Impossible de renommer '$dir', informations manquantes."
        fi
		echo '-------------------'
    fi
done