# CultBrawl Backend

## 📋 Description

Backend pour l'application CultBrawl - une plateforme de versus culturel permettant aux utilisateurs de voter entre différentes entités culturelles (films, livres, musiques, etc.).

## 🚀 Fonctionnalités

### ✅ Implémentées
- **Authentification JWT** - Inscription, connexion, middleware d'auth
- **Gestion des utilisateurs** - CRUD complet avec rôles
- **Entités culturelles** - Création et gestion des films, livres, etc.
- **Batailles** - Système de versus entre entités
- **Votes complets** - CRUD avec validation et statistiques
- **Upload de fichiers** - Gestion des images avec Multer
- **Rate Limiting** - Protection contre le spam
- **Validation robuste** - Schemas Joi pour tous les endpoints
- **Tests complets** - Suite de tests avec Jest

### 🏗️ Architecture

```
├── controllers/     # Logique métier
├── models/         # Modèles Sequelize
├── routes/         # Définition des routes
├── middlewares/    # Middlewares personnalisés
├── validations/    # Schemas de validation Joi
├── utils/          # Utilitaires
├── tests/          # Tests unitaires et d'intégration
├── migrations/     # Migrations de base de données
└── uploads/        # Fichiers uploadés
```

## 📦 Installation

```bash
# Cloner le repository
git clone https://github.com/creach-t/CultBrawl-backend.git
cd CultBrawl-backend

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
# Éditer le fichier .env avec vos configurations

# Lancer en mode développement
npm run dev
```

## 🔧 Variables d'environnement

```env
# Base de données
DB_NAME=cultbrawl
DB_USER=postgres
DB_PASSWORD=password
DB_HOST=localhost
DB_PORT=5432

# JWT
SECRET_KEY=your-super-secret-key

# Serveur
PORT=3000
```

## 🧪 Tests

```bash
# Lancer tous les tests
npm test

# Tests en mode watch
npm run test:watch

# Tests avec couverture
npm run test:coverage
```

## 📚 API Endpoints

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `POST /api/auth/logout` - Déconnexion

### Utilisateurs
- `GET /api/users` - Liste des utilisateurs
- `GET /api/users/:id` - Détails utilisateur
- `PUT /api/users/:id` - Modifier utilisateur
- `DELETE /api/users/:id` - Supprimer utilisateur

### Entités
- `GET /api/entities` - Liste des entités
- `POST /api/entities` - Créer entité
- `GET /api/entities/:id` - Détails entité
- `PUT /api/entities/:id` - Modifier entité
- `DELETE /api/entities/:id` - Supprimer entité

### Batailles
- `GET /api/battles` - Liste des batailles
- `POST /api/battles` - Créer bataille
- `GET /api/battles/:id` - Détails bataille
- `PUT /api/battles/:id` - Modifier bataille
- `DELETE /api/battles/:id` - Supprimer bataille

### 🆕 Votes (Nouveau)
- `GET /api/votes` - Liste des votes avec pagination
- `POST /api/votes` - Créer un vote
- `GET /api/votes/:id` - Détails du vote
- `PUT /api/votes/:id` - Modifier un vote
- `DELETE /api/votes/:id` - Supprimer un vote
- `GET /api/votes/stats/:battleId` - Statistiques de votes
- `GET /api/votes/user/:userId` - Historique des votes utilisateur

### Upload
- `POST /api/upload` - Upload de fichier

## 🛡️ Sécurité

- **Rate Limiting** - Protection contre les attaques par déni de service
- **Validation stricte** - Tous les inputs sont validés avec Joi
- **Authentification JWT** - Tokens sécurisés
- **Gestion d'erreurs robuste** - Pas de fuite d'informations sensibles
- **CORS configuré** - Protection cross-origin

## 📈 Monitoring

- **Health Check** - `GET /api/health`
- **Logs structurés** - Logging des erreurs et actions importantes
- **Métriques** - Suivi des performances

## 🔄 Prochaines améliorations

1. **Cache Redis** - Amélioration des performances
2. **Notifications push** - Alertes en temps réel
3. **Analytics avancées** - Statistiques détaillées
4. **API GraphQL** - Alternative REST
5. **Docker** - Containerisation

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/amazing-feature`)
3. Commit les changements (`git commit -m 'Add amazing feature'`)
4. Push vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT.
