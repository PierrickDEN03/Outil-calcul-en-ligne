# Outil de Calcul en Ligne

## Description

Application web de calcul en ligne développée avec une architecture moderne combinant PHP pour le backend, JavaScript pour le frontend, et une API REST pour la communication entre les composants.

## 🏗️ Architecture

- **Backend** : PHP avec architecture API REST
- **Frontend** : JavaScript
- **Base de données** : MySQL/MariaDB
- **Serveur web** : Apache/Nginx recommandé

## 📋 Prérequis

Avant d'installer l'application, assurez-vous d'avoir :

- **PHP** >= 7.4 (recommandé 8.0+)
- **MySQL** >= 5.7 ou **MariaDB** >= 10.2
- **Serveur web** (Apache, Nginx, ou serveur de développement PHP)
- **Composer** (optionnel, si des dépendances PHP sont utilisées)

## 🚀 Installation

### 1. Cloner le repository

```bash
git clone [URL_DU_REPOSITORY]
cd [NOM_DU_PROJET]
```

### 2. Configuration de la base de données

#### Importer la base de données

1. Créez une nouvelle base de données MySQL :
```sql
CREATE DATABASE nom_de_votre_bdd CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. Importez le fichier SQL fourni dans le repository :
```bash
mysql -u votre_utilisateur -p nom_de_votre_bdd < database.sql
```

Ou via phpMyAdmin :
- Sélectionnez votre base de données
- Cliquez sur "Importer"
- Sélectionnez le fichier `.sql` du repository
- Cliquez sur "Exécuter"

#### Configurer la connexion à la base de données

Modifiez les paramètres de connexion dans le fichier `utils/db_login.php` avec vos informations de base de données.

## 🎯 Utilisation

### Démarrage de l'application

1. Assurez-vous que votre serveur web est démarré
2. Accédez à l'application via votre navigateur :
   - Serveur local : `http://localhost:8000`
   - Serveur web : `http://votre-domaine.local`

### API Endpoints

L'application expose plusieurs endpoints API :

- `GET /api/impressions.php` - Données des impressions
- `POST /api/matieres.php` - Données des matières
- etc

Exemple d'utilisation :
```javascript
// Effectuer un calcul
fetch('/api/impressions.php', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        operation: 'add',
        values: [10, 20]
    })
})
.then(response => response.json())
.then(data => console.log(data));
```

## 🔍 Dépannage

### Problèmes courants

**Erreur de connexion à la base de données**
- Vérifiez les paramètres dans `utils/db_login.php`
- Assurez-vous que MySQL est démarré
- Vérifiez les permissions de l'utilisateur MySQL

**Erreurs 404 sur les endpoints API**
- Vérifiez la configuration du serveur web

## 👥 Auteur

DENNEMONT Pierrick- [pierrick.dennemont@gmail.com]
