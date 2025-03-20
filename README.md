# 🚀 Apply: Plateforme de Recherche d'Emplois à Distance

## 🎯 L’objectif du projet

Apply est une plateforme innovante qui simplifie la recherche d'emplois en télétravail. Elle permet aux utilisateurs d’accéder rapidement aux meilleures offres, de filtrer les résultats selon leurs critères, et de postuler en quelques clics. Grâce à une **interface fluide et intuitive**, ainsi qu’une **gestion dynamique des offres en temps réel**, cette plateforme optimise l’expérience utilisateur pour les chercheurs d’emploi.

---

## 🌟 Les fonctionnalités principales

### 🔍 Recherche avancée et gestion des offres

- **Filtres intelligents** : Recherche par **catégorie**, **localisation**, **type de contrat**, et **mots-clés**.
- **Favoris et gestion des candidatures** : Les utilisateurs peuvent **enregistrer** les offres qui les intéressent et suivre celles pour lesquelles ils ont postulé.
- **Affichage des offres en temps réel** : Synchronisation avec une API d'offres d'emploi.

### 🚀 Expérience utilisateur optimisée

- **Interface moderne et fluide** développée avec **Vue.js** et **Naive UI**.
- **Navigation intuitive** avec **Vue Router** et une gestion **optimisée des états** via **Pinia**.
- **Accessibilité améliorée** : Navigation **100% clavier compatible**, support **ARIA**, et **mode sombre**.

### 🔒 Sécurité & Performance

- **Authentification sécurisée** avec gestion des utilisateurs via **JWT**.
- **Optimisation des performances** via **lazy loading des composants et routes**.
- **Gestion centralisée de l’état** avec **Pinia**, garantissant une mise à jour **instantanée et fluide** des offres.

---

## 👥 Qui a fait quoi ?

### **Wael & Thanina**

- **Wael** : Développement du backend (création des routes, middleware, contrôleurs et services), la mise en place de l’API pour récupérer les offres d’emploi, la gestion complète de la base de données (modèles et schémas), ainsi que la sécurisation des routes et de l’authentification des utilisateurs.
- **Thanina** : A contribué en réalisant la recherche et l’intégration de l’API, en participant à la conception et au design du frontend (maquettage et mise en page des composants Vue.js), ainsi qu’en aidant à la structuration de la base de données et à son initialisation.

---

## 📌 Comment nous nous sommes organisés ?

Le projet a été structuré en **deux grandes phases** :

1️⃣ **Phase Backend**

- Création de l’API pour récupérer les offres d’emploi.
- Mise en place de la base de données CosmosDB.
- Sécurisation des endpoints et gestion des utilisateurs.

2️⃣ **Phase Frontend**

- Développement de l'interface utilisateur avec **Vue.js**.
- Mise en place des **composants interactifs et réactifs**.
- Gestion des états avec **Pinia**, et optimisation des **transitions et animations**.

Nous avons utilisé **GitHub** pour suivre nos tâches et assurer une gestion efficace du projet.

---

## 🔧 Les difficultés rencontrées et solutions apportées

### 📌 Problème : Affichage des offres avec gestion des états dynamiques

- **Difficulté** : Les offres ne se mettaient pas à jour en fonction des filtres.
- **Solution** : **Pinia** a été utilisé pour une mise à jour en **temps réel** et fluide.

### 📌 Problème : Filtres dynamiques dans la barre de navigation

- **Difficulté** : L’application des filtres perturbait l’affichage des résultats.
- **Solution** : Utilisation de **computed properties** et **Vue Router** pour une gestion optimisée.

### 📌 Problème : Navigation et accessibilité

- **Difficulté** : L’application n’était pas totalement accessible au clavier et aux lecteurs d’écran.
- **Solution** : Ajout des **raccourcis clavier (`Tab`, `Enter`, `Arrow Keys`)**, gestion **ARIA**, et implémentation du **mode sombre**.

---

## 📥 Comment installer et lancer l’application ?

### 📌 Prérequis

- **Node.js** (version 16+)
- **NPM** ou **Yarn**
- **MongoDB CosmosDB** pour la base de données (ou une alternative locale).

### 📌 Installation rapide

1️⃣ **Clonez le dépôt :**

```bash
git clone https://github.com/Dr2xU/apply.git apply
cd apply
```

2️⃣ **Installez les dépendances :**

```bash
npm install
```

3️⃣ **Configurez votre environnement :**

- **Backend** : Dupliquez `.env.example` en `.env` et ajoutez vos informations CosmosDB & JWT.
- **Frontend** : Vérifiez l'URL API dans `api/jobs.js` et `api/auth.js`.

---

### 🚀 **Lancer l’application**

#### **Backend**

```bash
cd backend
npm run dev
```

📌 **API en ligne sur** `http://localhost:5000`

#### **Frontend**

```bash
cd frontend
npm run dev
```

📌 **Interface accessible sur** `http://localhost:5173`

---

## **🚀 Fonctionnalités supplémentaires**

| **Fonctionnalité**           | **Description**                                      | **Impact**                 |
| ---------------------------- | ---------------------------------------------------- | -------------------------- |
| ✅ **Lazy Loading**          | Chargement **à la demande** des composants et routes | ⬆️ **Rapidité**            |
| ✅ **Accessibilité Avancée** | Navigation **100% clavier**, support **ARIA**        | ♿ **Meilleure inclusion** |
| ✅ **Animations Fluides**    | Transitions douces sur les changements d’état        | 🔄 **UX améliorée**        |

📌 **Ne manquez pas cette opportunité de rendre la recherche d'emploi plus simple et efficace !** 🎯
