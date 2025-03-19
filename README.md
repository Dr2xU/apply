# 🚀 Plateforme de Recherche d'Emplois à Distance

## 🎯 L’objectif du projet

Notre plateforme révolutionnaire simplifie la recherche d'emplois en télétravail en permettant aux utilisateurs d'accéder aux meilleures offres en quelques clics. Grâce à une interface intuitive et des fonctionnalités avancées, postuler à un emploi n’a jamais été aussi rapide et efficace !

## 🌟 Les fonctionnalités principales

### 🔍 Recherche optimisée

- **Filtres intelligents** : Trouvez les offres adaptées grâce à des critères avancés (catégorie, type de contrat, localisation, etc.).
- **Détails complets des offres** : Consultez des informations précises et détaillées avant de postuler.
- **Gestion des favoris** : Sauvegardez les offres qui vous intéressent pour les retrouver facilement.

### 🚀 Expérience utilisateur exceptionnelle

- **Interface moderne et fluide** développée avec Vue.js.
- **Navigation intuitive** avec Vue Router pour une expérience utilisateur optimale.
- **Affichage dynamique** des offres grâce à une gestion réactive des données.

### 🔒 Sécurité & Performance

- **Authentification sécurisée** avec gestion avancée des utilisateurs.
- **Utilisation de Pinia** pour gérer l’état global de l’application et garantir une expérience fluide.
- **Intégration d'une API** pour récupérer les offres d'emploi en temps réel.

## 👥 Qui a fait quoi ?

### Wael & Thanina - Experts en développement Web

- **Wael** : Développement du backend, mise en place de l’API, gestion de la base de données et sécurisation des routes.
- **Thanina** : Développement du frontend, intégration de Vue.js, création des composants et mise en place de l’interface utilisateur.

## 📌 Comment nous nous sommes organisés ?

Nous avons structuré notre travail en deux grandes phases :

1. **Phase backend** :
   - Création de l’API pour récupérer les offres d’emploi.
   - Mise en place de la base de données et des modèles utilisateurs.
   - Sécurisation des endpoints.
2. **Phase frontend** :
   - Développement de l’interface utilisateur avec Vue.js.
   - Création des composants et intégration de Vue Router.
   - Gestion des états globaux avec Pinia.

Nous avons utilisé GitHub pour organiser notre collaboration, gérer les tâches et assurer un suivi efficace du projet.

## 🔧 Les difficultés rencontrées et les solutions apportées

### 📌 Problème : Affichage des offres avec gestion des états dynamiques

- **Difficulté** : La mise à jour des offres en fonction des filtres posait des problèmes de réactivité.
- **Solution** : Mise en place d’une gestion avancée des états avec Pinia pour une mise à jour en temps réel et fluide.

### 📌 Problème : Filtres dynamiques dans la barre de navigation

- **Difficulté** : La synchronisation des filtres avec les résultats affichés provoquait des incohérences.
- **Solution** : Utilisation de **computed properties** et intégration avancée de Vue Router pour une meilleure gestion des requêtes.

## 📥 Comment installer et lancer l’application ?

### 📌 Prérequis

- **Node.js** (version 16+)
- **NPM** ou **Yarn**

### 📌 Installation rapide

1. **Clonez le dépôt**

   ```bash
   git clone https://github.com/nom-du-repo.git
   cd nom-du-repo
   ```

Installez les dépendances

bash
Toujours afficher les détails

Copier
npm install
Configurez votre environnement

Dupliquez .env.example en .env et renseignez vos informations API et base de données.

🚀 Lancer l’application
Backend
bash
Toujours afficher les détails

Copier
cd backend
npm run dev
API en ligne sur <http://localhost:5000>

Frontend
bash
Toujours afficher les détails

Copier
cd ..
npm run dev
Interface accessible sur <http://localhost:5173>

📌 Ne manquez pas cette opportunité de rendre la recherche d'emploi plus simple et efficace !
