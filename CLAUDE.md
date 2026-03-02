# CLAUDE.md — CultBrawl Backend

Instructions pour Claude Code lors des modifications de ce projet.

---

## Contexte du projet

API REST Express/Sequelize pour une application de versus culturel. Les utilisateurs votent entre deux œuvres et gagnent des points.

---

## Conventions de code

### Style général
- **Module system** : CommonJS exclusivement (`require` / `module.exports`)
- **Async** : `async/await`, jamais de callbacks imbriqués
- **Handlers Express** : toujours wrappés avec `routeWrapper` pour la propagation d'erreurs
- **Erreurs métier** : utiliser `AppError` (`utils/AppError.js`) avec un statusCode approprié
- **Pas de console.log** en dehors du démarrage serveur et des tâches planifiées

### Controllers
- Chaque fonction est `async (req, res)`
- Réponses JSON cohérentes : `{ success: true, data: ... }` ou `{ success: false, message: ... }`
- Toujours vérifier l'existence de la ressource avant de la modifier
- Extraire l'utilisateur courant avec `extractUserFromToken(req)` ou `req.user` (si `verifyToken` est en amont)

### Modèles Sequelize
- **Soft deletes** : `paranoid: true` sur la plupart des modèles
- **Associations** : les alias (`as`) sont en PascalCase et doivent correspondre exactement dans les `include`
- Ne pas ajouter de validation `len` sur les champs hashés (bcrypt)

### Routes
- Toutes les routes sont montées sous `/api` dans `app.js`
- Auth : appliquer `verifyToken` avant les routes protégées
- Rate limiting : `authLimiter` sur register/login, `voteLimiter` sur les endpoints de vote

---

## Associations Sequelize (aliases exacts)

```js
// Vote
Vote.belongsTo(Battle, { as: 'Battle' })
Vote.belongsTo(User,   { as: 'User' })
Vote.belongsTo(Entity, { as: 'VotedEntity' })

// Battle
Battle.belongsTo(Entity, { as: 'Entity1' })
Battle.belongsTo(Entity, { as: 'Entity2' })
Battle.belongsTo(Entity, { as: 'Winner' })
Battle.belongsTo(User,   { as: 'Creator' })
```

---

## Règles métier importantes

### Points
- Créer une bataille : **-10 points** (constante `COST_PER_BATTLE = 10` dans `battleController.js`)
- Voter : **+500 points** (hardcodé dans `battleController.js` et `votesController.js`)
- Un utilisateur ne peut pas avoir de points négatifs (validation modèle `min: 0`)

### Votes
- Un seul vote par utilisateur par bataille (contrainte unique en BDD)
- Le `votedEntityId` doit être `entity1Id` ou `entity2Id` de la bataille — **valider avant d'insérer**
- On ne peut voter que si `battle.status === 'pending'`

### Batailles
- Créées avec `status: 'pending'`
- Passent à `status: 'completed'` automatiquement via `updateExpiredBattles()` (tâche toutes les minutes)
- Pas de détermination automatique du gagnant à l'expiration

---

## Ce qu'il ne faut pas toucher

- `migrations/` : ne jamais modifier une migration déjà appliquée, créer une nouvelle migration
- `config/config.json` : contient les configs de BDD par environnement
- Contrainte unique `(battleId, userId)` sur `Vote` — ne pas supprimer

---

## Problèmes connus (ne pas "corriger" sans discussion)

- CORS hardcodé dans `app.js` (IPs de dev local) → prévu pour le dev
- JWT sans refresh token → comportement voulu pour l'instant
- `VersusProposal` : modèle incomplet, à ignorer
- `uploadController.js` : pas d'auth sur la route upload, pas de nettoyage des anciens fichiers

---

## Commandes utiles

```bash
npm run dev          # Démarrage dev (node --watch)
npm start            # Démarrage prod
npm test             # Tests Jest
npm run test:coverage # Couverture de tests
npx sequelize-cli db:migrate  # Appliquer les migrations
```

---

## Structure des réponses API

```json
// Succès
{ "success": true, "data": { ... } }
{ "success": true, "message": "Action réalisée.", "data": { ... } }

// Erreur
{ "success": false, "message": "Description de l'erreur." }

// Pagination
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": { "total": 50, "page": 1, "limit": 10, "totalPages": 5 }
  }
}
```
