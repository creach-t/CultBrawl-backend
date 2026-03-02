/**
 * Mise à jour du mot de passe admin.
 * Usage : node scripts/setAdminPassword.js <nouveauMotDePasse>
 * Ou     : ADMIN_PASSWORD=xxx node scripts/setAdminPassword.js
 *
 * Le mot de passe doit contenir : 8+ caractères, 1 majuscule, 1 chiffre, 1 caractère spécial.
 */

require('dotenv').config();
const bcrypt = require('bcrypt');
const { User } = require('../models');

const password = process.argv[2] || process.env.ADMIN_PASSWORD;

if (!password) {
  console.error('Usage : node scripts/setAdminPassword.js <nouveauMotDePasse>');
  process.exit(1);
}

// Validation basique (même règles que authController)
const valid =
  password.length >= 8 &&
  /[A-Z]/.test(password) &&
  /\d/.test(password) &&
  /[!@#$%^&*()/,.?":{}|<>]/.test(password);

if (!valid) {
  console.error('Mot de passe invalide : 8+ caractères, 1 majuscule, 1 chiffre, 1 caractère spécial requis.');
  process.exit(1);
}

(async () => {
  try {
    const admin = await User.findOne({ where: { roleId: 2 } });
    if (!admin) {
      console.error('Aucun utilisateur admin (roleId=2) trouvé.');
      process.exit(1);
    }

    const hash = await bcrypt.hash(password, 10);
    await admin.update({ password: hash });
    console.log(`Mot de passe admin mis à jour pour : ${admin.username}`);
    process.exit(0);
  } catch (err) {
    console.error('Erreur :', err.message);
    process.exit(1);
  }
})();
