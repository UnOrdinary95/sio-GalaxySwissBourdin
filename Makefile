.PHONY: help d-db d-up d-down d-ps

help:
	@echo .
	@echo "Commandes disponibles :"
	@echo "make d-db     : Démarrer la base de données PostgreSQL en mode détaché"
	@echo "make d-up     : Démarrer tous les conteneurs en mode détaché"
	@echo "make d-down   : Arrêter tous les conteneurs"
	@echo "make d-ps     : Afficher l'état des conteneurs"
	@echo .

d-db:
	docker-compose up -d postgres

d-up:
	docker-compose up -d

d-down:
	docker-compose down

d-ps:
	docker-compose ps
