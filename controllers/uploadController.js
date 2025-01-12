const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { User } = require('../models'); // Import du modèle User
const { extractUserFromToken } = require('../utils/jwt');

// Configurer le stockage avec Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '..', 'uploads');
    cb(null, uploadPath); // Répertoire où stocker les fichiers
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`); // Nom unique pour chaque fichier
  },
});

// Filtrer les fichiers acceptés (uniquement des images)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Seules les images sont autorisées.'), false);
  }
};

// Configurer Multer avec les limitations et le filtrage
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Taille maximale : 5 Mo
});

// Fonction utilitaire pour supprimer un fichier
const deleteFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(`Erreur lors de la suppression du fichier ${filePath} :`, err);
      } else {
        console.log(`Fichier supprimé : ${filePath}`);
      }
    });
  }
};

module.exports.uploadPhoto = [
  upload.single('photo'), // Le champ "photo" dans la requête
  async (req, res) => {
    try {
      // Vérification si un fichier a été envoyé
      if (!req.file) {
        return res.status(400).json({ message: 'Aucun fichier envoyé.' });
      }

      // Récupérer l'utilisateur à partir du token
      const decodedUser = extractUserFromToken(req);
      if (!decodedUser) {
        return res.status(401).json({ message: 'Utilisateur non authentifié.' });
      }

      // Trouver l'utilisateur dans la base de données
      const user = await User.findByPk(decodedUser.id);
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur introuvable.' });
      }

      // Supprimer l'ancien fichier si imageUrl existe
      if (user.imageUrl) {
        const oldFilePath = path.join(__dirname, '..', user.imageUrl.replace('/uploads/', 'uploads/'));
        deleteFile(oldFilePath);
      }

      // Générer l'URL publique du fichier
      const filePath = `/uploads/${req.file.filename}`;
      const fullUrl = `${req.protocol}://${req.get('host')}${filePath}`;

      // Mettre à jour l'imageUrl de l'utilisateur
      await user.update({ imageUrl: fullUrl });

      // Répondre avec le chemin du fichier et confirmation
      res.status(200).json({
        message: 'Photo uploadée et mise à jour du profil avec succès.',
        imageUrl: fullUrl,
      });
    } catch (error) {
      console.error("Erreur lors de l'upload de la photo :", error);

      // Supprimer le fichier téléchargé en cas d'erreur
      if (req.file) {
        const uploadedFilePath = path.join(__dirname, '..', 'uploads', req.file.filename);
        deleteFile(uploadedFilePath);
      }

      res.status(500).json({ message: 'Erreur serveur.' });
    }
  },
];
