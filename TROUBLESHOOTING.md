# Guide de résolution des erreurs

## 🚨 Erreur résolue : Route.get() requires a callback function

### Problème
L'erreur était causée par un mauvais import du middleware d'authentification dans `voteRoutes.js`.

### Solution appliquée
- ✅ Corrigé l'import : `{ authMiddleware }` → `{ verifyToken }`
- ✅ Mis à jour les routes pour utiliser `verifyToken`

## 📦 Installation des dépendances manquantes

Certaines nouvelles dépendances ont été ajoutées. Installez-les :

```bash
npm install joi express-rate-limit
```

## 🔧 Dépendances de développement pour les tests

```bash
npm install --save-dev jest supertest @types/jest
```

## 🎯 Test du serveur

Après installation, le serveur devrait démarrer correctement :

```bash
npm run dev
```

## 📍 Endpoints disponibles

Avec le système de votes implémenté, vous avez maintenant accès à :

### Routes publiques
- `GET /api/votes/stats/:battleId` - Statistiques d'une bataille

### Routes privées (token requis)
- `POST /api/votes` - Créer un vote
- `GET /api/votes` - Liste des votes (avec pagination)
- `GET /api/votes/:id` - Détails d'un vote
- `PUT /api/votes/:id` - Modifier un vote  
- `DELETE /api/votes/:id` - Supprimer un vote
- `GET /api/votes/user/:userId` - Votes d'un utilisateur

## 🧪 Lancer les tests

```bash
npm test
npm run test:coverage
```

## 🔗 Health check

```bash
GET /api/health
```

Le serveur devrait maintenant fonctionner correctement ! 🎉
