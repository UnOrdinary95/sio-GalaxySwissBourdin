# Contexte du projet

Le laboratoire pharmaceutique GSB (Galaxy Swiss Bourdin) souhaite une application web pour gérer les visites des médecins par les visiteurs médicaux.

## Activité commerciale

- Les visiteurs médicaux promeuvent les médicaments auprès des praticiens (médecins, spécialistes, services hospitaliers, pharmaciens, infirmiers).
- Chaque visiteur dispose d’un portefeuille de praticiens à visiter.
- Lors de chaque visite, il faut enregistrer :
    - La date
    - Le motif (parmi 6 motifs prédéfinis)
    - Les médicaments présentés
    - Le nombre d’échantillons offerts
    - Le bilan de la visite (convaincu ou non, planification d’une autre visite)

## Les produits

- Médicaments identifiés par un numéro (ex : AMOX45) et un nom commercial (ex : AMOXAR)
- Composition détaillée et interactions avec d’autres médicaments
- Appartiennent à une famille (antihistaminique, antidépresseur, antibiotique, etc.)
- Lors d’une visite, plusieurs produits peuvent être présentés et des échantillons offerts

## Les médecins

- Les médecins sont la cible principale du laboratoire
- Informations d’état civil et spécialité complémentaire tenues à jour via des fichiers achetés à des organismes spécialisés

## Base de données

- La base comporte 6 tables : famille, medecin, medicament, offrir, rapport, visiteur
- Jeu d’essai fourni avec :
    - 20 familles de médicaments
    - 1000 médecins
    - 28 médicaments
    - 1589 rapports de visite
    - 27 visiteurs

## Cas d’utilisation principaux

- Se connecter en tant que visiteur médical
- Gérer les médecins :
    - Lister tous les médecins
    - Filtrer par nom
    - Voir le détail d’un médecin
    - Lister les rapports d’un médecin
- Gérer les rapports de visite :
    - Créer un nouveau rapport
    - Modifier un rapport (motif, bilan)
    - Lister les rapports d’un visiteur à une date

## Organisation du projet

- Application web avec interface pour visiteurs médicaux
- Accès sécurisé
- Navigation intuitive (liste paginée des médecins, filtrage, création/modification de rapports)
- Utilisation du jeu d’essai pour le développement
