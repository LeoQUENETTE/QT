import os
from PIL import Image  # Nécessite l'installation de la bibliothèque Pillow
import sys

def convert_webp_to_png(directory):
    """
    Convertit tous les fichiers WebP en PNG dans le répertoire spécifié.
    """
    # Compter les fichiers convertis
    converted_count = 0
    
    # Parcourir tous les fichiers du répertoire
    for filename in os.listdir(directory):
        # Vérifier si le fichier est un WebP
        if filename.lower().endswith('.webp'):
            # Chemin complet du fichier source
            source_path = os.path.join(directory, filename)
            
            # Créer le chemin pour le fichier de destination (remplacer .webp par .png)
            dest_filename = os.path.splitext(filename)[0] + '.png'
            dest_path = os.path.join(directory, dest_filename)
            
            try:
                # Ouvrir l'image WebP et la sauvegarder en PNG
                with Image.open(source_path) as img:
                    img.save(dest_path, 'PNG')
                
                print(f"Converti: {filename} -> {dest_filename}")
                converted_count += 1
            except Exception as e:
                print(f"Erreur lors de la conversion de {filename}: {e}")
    
    return converted_count

if __name__ == "__main__":
    # Obtenir le répertoire du script en cours d'exécution
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    print(f"Recherche de fichiers WebP dans: {script_dir}")
    
    # Convertir les fichiers
    count = convert_webp_to_png(script_dir)
    
    if count > 0:
        print(f"\nConversion terminée! {count} fichier(s) WebP ont été convertis en PNG.")
    else:
        print("\nAucun fichier WebP trouvé dans le répertoire.")