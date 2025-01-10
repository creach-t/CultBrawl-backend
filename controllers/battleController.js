const { Battle, Entity, User, Vote } = require('../models');

const battleController = {
  // Créer une nouvelle bataille
  async createBattle(req, res) {
    try {
      const { entity1Id, entity2Id, durationHours, createdById } = req.body;

      // Vérification des entités
      const entity1 = await Entity.findByPk(entity1Id);
      const entity2 = await Entity.findByPk(entity2Id);

      if (!entity1 || !entity2) {
        return res.status(404).json({ message: "Une ou plusieurs entités n'existent pas." });
      }

      // Créer la bataille
      const endTime = new Date();
      endTime.setHours(endTime.getHours() + durationHours);

      const battle = await Battle.create({
        entity1Id,
        entity2Id,
        durationHours,
        endTime,
        createdById,
        status: 'pending'
      });

      res.status(201).json(battle);
    } catch (error) {
      console.error('Erreur lors de la création de la bataille:', error);
      res.status(500).json({ message: 'Erreur serveur lors de la création de la bataille.' });
    }
  },

  // Récupérer toutes les batailles
async getAllBattles(req, res) {
    try {
      const battles = await Battle.findAll({
        include: [
          { model: Entity, as: 'Entity1' },
          { model: Entity, as: 'Entity2' }
        ],
        order: [['createdAt', 'DESC']]
      });

      // Formatage des données pour l'envoi au frontend
      const formattedBattles = battles.map(battle => ({
        id: battle.id,
        title: `${battle.Entity1.name} vs ${battle.Entity2.name}`,
        category: battle.Entity1.type,
        participants: [battle.Entity1, battle.Entity2],
        status: battle.status
      }));

      res.status(200).json(formattedBattles);
    } catch (error) {
      console.error('Erreur lors de la récupération des battles :', error);
      res.status(500).json({ message: 'Erreur serveur lors de la récupération des battles.' });
    }
  },

  // Récupérer une bataille par ID
  async getBattleById(req, res) {
    try {
      const { id } = req.params;

      const battle = await Battle.findByPk(id, {
        include: [
          { model: Entity, as: 'Entity1' },
          { model: Entity, as: 'Entity2' },
          { model: User, as: 'Creator' }
        ]
      });

      if (!battle) {
        return res.status(404).json({ message: 'Bataille non trouvée.' });
      }

      res.status(200).json(battle);
    } catch (error) {
      console.error('Erreur lors de la récupération de la bataille:', error);
      res.status(500).json({ message: 'Erreur serveur lors de la récupération de la bataille.' });
    }
  },

  // Mettre à jour une bataille
  async updateBattle(req, res) {
    try {
      const { id } = req.params;
      const { status, winnerId } = req.body;

      const battle = await Battle.findByPk(id);

      if (!battle) {
        return res.status(404).json({ message: 'Bataille non trouvée.' });
      }

      if (winnerId) {
        const winner = await Entity.findByPk(winnerId);
        if (!winner) {
          return res.status(404).json({ message: "L'entité gagnante n'existe pas." });
        }
      }

      // Mise à jour
      await battle.update({ status, winnerId });
      res.status(200).json(battle);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la bataille:', error);
      res.status(500).json({ message: 'Erreur serveur lors de la mise à jour de la bataille.' });
    }
  },

  // Supprimer une bataille
  async deleteBattle(req, res) {
    try {
      const { id } = req.params;

      const battle = await Battle.findByPk(id);
      if (!battle) {
        return res.status(404).json({ message: 'Bataille non trouvée.' });
      }

      await battle.destroy();
      res.status(200).json({ message: 'Bataille supprimée avec succès.' });
    } catch (error) {
      console.error('Erreur lors de la suppression de la bataille:', error);
      res.status(500).json({ message: 'Erreur serveur lors de la suppression de la bataille.' });
    }
  },

  async getVotesForBattle(req, res) {
    const { id } = req.params; // ID de la bataille
    try {
      // Vérifie que la bataille existe
      const battle = await Battle.findByPk(id, {
        include: [
          { model: Entity, as: 'Entity1' },
          { model: Entity, as: 'Entity2' },
        ],
      });
  
      if (!battle) {
        return res.status(404).json({ message: 'Battle non trouvée.' });
      }
  
      // Récupère les votes pour la bataille
      const votes = await Vote.findAll({ where: { battleId: id } });
  
      // Compte les votes pour chaque entité
      const entity1Votes = votes.filter((vote) => vote.votedEntityId === battle.entity1Id).length;
      const entity2Votes = votes.filter((vote) => vote.votedEntityId === battle.entity2Id).length;
  
      res.status(200).json({
        entity1Votes,
        entity2Votes,
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des votes :', error);
      res.status(500).json({ message: 'Erreur serveur lors de la récupération des votes.' });
    }
  },

  // Voter pour une entité dans une bataille
  async voteForEntity(req, res) {
    try {
      const { id } = req.params;
      const { votedEntityId, userId } = req.body;

      const battle = await Battle.findByPk(id);
      if (!battle) {
        return res.status(404).json({ message: 'Bataille non trouvée.' });
      }
      console.log('entity : ', votedEntityId);
      const entity = await Entity.findByPk(votedEntityId);
      if (!entity) {
        return res.status(404).json({ message: "L'entité n'existe pas." });
      }

      if (battle.status !== 'pending') {
        return res.status(400).json({ message: 'La bataille est terminée ou annulée.' });
      }

      // Voter
      await Vote.create({
        battleId: id,
        userId,
        votedEntityId,
      });
  
      res.status(200).json({ message: 'Vote enregistré avec succès.' });

    } catch (error) {
      console.error('Erreur lors du vote pour une entité:', error);
      res.status(500).json({ message: 'Erreur serveur lors du vote pour une entité.' });
    }
  }
};
module.exports = battleController;
