const { Entity } = require('../models');

// Ajouter une nouvelle entité
const addEntity = async (req, res) => {
  const { name, type, apiId, imageUrl, description } = req.body;

  // Validation des champs obligatoires
  if (!name || !type || !apiId) {
    return res.status(400).json({ message: 'Les champs nom, type et apiId sont requis.' });
  }

  try {
    // Vérifie si l'entité existe déjà
    const existingEntity = await Entity.findOne({ where: { apiId } });
    if (existingEntity) {
      return res.status(400).json({ message: 'Cette entité existe déjà.' });
    }

    // Création de l'entité
    const entity = await Entity.create({
      name,
      type,
      apiId,
      imageUrl,
      description,
    });

    res.status(201).json({
      message: 'Entité ajoutée avec succès.',
      entity,
    });
  } catch (error) {
    console.error('Erreur lors de l’ajout de l’entité :', error);
    res.status(500).json({ message: 'Erreur serveur, veuillez réessayer plus tard.' });
  }
};

// Récupérer toutes les entités
const getAllEntities = async (req, res) => {
  try {
    const entities = await Entity.findAll();
    res.json(entities);
  } catch (error) {
    console.error('Erreur lors de la récupération des entités :', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// Récupérer toutes les entités
const getAllEntitiesByPoints = async (req, res) => {
  try {
    const entities = await Entity.findAll();
    res.json('[TO-DO]: Récupérer toutes les entités par points');
  } catch (error) {
    console.error('TODO :', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// Récupérer une entité par son ID
const getEntityById = async (req, res) => {
  const { id } = req.params;

  try {
    const entity = await Entity.findByPk(id);

    if (!entity) {
      return res.status(404).json({ message: 'Entité non trouvée.' });
    }

    res.json(entity);
  } catch (error) {
    console.error('Erreur lors de la récupération de l’entité :', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// Supprimer une entité
const deleteEntity = async (req, res) => {
  const { id } = req.params;

  try {
    const entity = await Entity.findByPk(id);
    if (!entity) {
      return res.status(404).json({ message: 'Entité non trouvée.' });
    }

    await entity.destroy();
    res.json({ message: 'Entité supprimée avec succès.' });
  } catch (error) {
    console.error('Erreur lors de la suppression de l’entité :', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

module.exports = {
  addEntity,
  getAllEntities,
  getEntityById,
  deleteEntity,
  getAllEntitiesByPoints,
};
