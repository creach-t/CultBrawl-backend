const { Entity, Vote } = require('../models');
const Sequelize = require('sequelize');


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


  const getTop5EntityByVotes = async (req, res) => {
    try {
      const topEntities = await Vote.findAll({
        attributes: [
          'votedEntityId',
          [Sequelize.fn('COUNT', Sequelize.col('votedEntityId')), 'voteCount'],
        ],
        group: ['votedEntityId', 'VotedEntity.id'], // Group by l'id de l'entité votée et de l'association
        order: [[Sequelize.literal('"voteCount"'), 'DESC']], // Utilise des guillemets doubles pour l'alias
        limit: 5,
        include: [
          {
            model: Entity,
            as: 'VotedEntity', // Correspond à l'alias défini dans le modèle
            attributes: ['id', 'name', 'type', 'imageUrl'],
          },
        ],
      });

      const formattedTopEntities = topEntities.map((entity) => ({
        id: entity.votedEntityId,
        name: entity.VotedEntity.name,
        type: entity.VotedEntity.type,
        imageUrl: entity.VotedEntity.imageUrl,
        votes: parseInt(entity.dataValues.voteCount, 10), // Convertir en entier
      }));

      res.status(200).json(formattedTopEntities);
    } catch (error) {
      console.error('Erreur lors de la récupération des entités les plus votées :', error);
      res.status(500).json({ message: 'Erreur serveur lors de la récupération des entités les plus votées.' });
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
  getTop5EntityByVotes,
};
