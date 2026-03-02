const { Vote, Battle, Entity, User } = require("../models");
const { Op } = require("sequelize");

const createVote = async (req, res) => {
  try {
    const { battleId, votedEntityId } = req.body;
    const userId = req.user.id;

    const battle = await Battle.findByPk(battleId);
    if (!battle) {
      return res.status(404).json({ success: false, message: "Bataille non trouvée." });
    }

    if (battle.status !== "pending") {
      return res.status(400).json({ success: false, message: "La bataille est terminée ou annulée." });
    }

    if (votedEntityId !== battle.entity1Id && votedEntityId !== battle.entity2Id) {
      return res.status(400).json({ success: false, message: "L'entité votée n'appartient pas à cette bataille." });
    }

    const existingVote = await Vote.findOne({ where: { battleId, userId } });
    if (existingVote) {
      return res.status(400).json({ success: false, message: "Vous avez déjà voté pour cette bataille." });
    }

    const vote = await Vote.create({ battleId, userId, votedEntityId });

    const user = await User.findByPk(userId);
    if (user) {
      await user.update({ points: user.points + 500 });
    }

    return res.status(201).json({
      success: true,
      message: "Vote enregistré avec succès.",
      data: vote,
      newPoints: user ? user.points : undefined,
    });
  } catch (error) {
    console.error("Erreur createVote:", error);
    return res.status(500).json({ success: false, message: "Erreur serveur." });
  }
};

const getVotes = async (req, res) => {
  try {
    const { page = 1, limit = 10, battleId, userId, entityId, sortBy = "createdAt", sortOrder = "DESC" } = req.query;

    const where = {};
    if (battleId) where.battleId = battleId;
    if (userId) where.userId = userId;
    if (entityId) where.votedEntityId = entityId;

    const offset = (page - 1) * limit;

    const { count, rows: votes } = await Vote.findAndCountAll({
      where,
      include: [
        { model: Battle, as: "Battle", attributes: ["id", "entity1Id", "entity2Id", "status"] },
        { model: User, as: "User", attributes: ["id", "username"] },
        { model: Entity, as: "VotedEntity", attributes: ["id", "name", "type"] },
      ],
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    return res.status(200).json({
      success: true,
      data: {
        votes,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit),
        },
      },
    });
  } catch (error) {
    console.error("Erreur getVotes:", error);
    return res.status(500).json({ success: false, message: "Erreur serveur." });
  }
};

const getVoteById = async (req, res) => {
  try {
    const vote = await Vote.findByPk(req.params.id, {
      include: [
        { model: Battle, as: "Battle", attributes: ["id", "entity1Id", "entity2Id", "status"] },
        { model: User, as: "User", attributes: ["id", "username"] },
        { model: Entity, as: "VotedEntity", attributes: ["id", "name", "type"] },
      ],
    });

    if (!vote) {
      return res.status(404).json({ success: false, message: "Vote non trouvé." });
    }

    return res.status(200).json({ success: true, data: vote });
  } catch (error) {
    console.error("Erreur getVoteById:", error);
    return res.status(500).json({ success: false, message: "Erreur serveur." });
  }
};

const updateVote = async (req, res) => {
  try {
    const { votedEntityId } = req.body;
    const userId = req.user.id;

    const vote = await Vote.findByPk(req.params.id);
    if (!vote) {
      return res.status(404).json({ success: false, message: "Vote non trouvé." });
    }

    if (vote.userId !== userId) {
      return res.status(403).json({ success: false, message: "Vous ne pouvez modifier que vos propres votes." });
    }

    const battle = await Battle.findByPk(vote.battleId);
    if (!battle || battle.status !== "pending") {
      return res.status(400).json({ success: false, message: "Impossible de modifier le vote : la bataille est terminée." });
    }

    if (votedEntityId !== battle.entity1Id && votedEntityId !== battle.entity2Id) {
      return res.status(400).json({ success: false, message: "L'entité votée n'appartient pas à cette bataille." });
    }

    await vote.update({ votedEntityId });
    return res.status(200).json({ success: true, data: vote });
  } catch (error) {
    console.error("Erreur updateVote:", error);
    return res.status(500).json({ success: false, message: "Erreur serveur." });
  }
};

const deleteVote = async (req, res) => {
  try {
    const userId = req.user.id;

    const vote = await Vote.findByPk(req.params.id);
    if (!vote) {
      return res.status(404).json({ success: false, message: "Vote non trouvé." });
    }

    if (vote.userId !== userId) {
      return res.status(403).json({ success: false, message: "Vous ne pouvez supprimer que vos propres votes." });
    }

    const battle = await Battle.findByPk(vote.battleId);
    if (!battle || battle.status !== "pending") {
      return res.status(400).json({ success: false, message: "Impossible de supprimer le vote : la bataille est terminée." });
    }

    await vote.destroy();

    // Retirer les 500 points accordés lors du vote
    const user = await User.findByPk(userId);
    if (user && user.points >= 500) {
      await user.update({ points: user.points - 500 });
    }

    return res.status(200).json({ success: true, message: "Vote supprimé." });
  } catch (error) {
    console.error("Erreur deleteVote:", error);
    return res.status(500).json({ success: false, message: "Erreur serveur." });
  }
};

const getBattleVoteStats = async (req, res) => {
  try {
    const battleId = parseInt(req.params.battleId);

    const battle = await Battle.findByPk(battleId, {
      include: [
        { model: Entity, as: "Entity1", attributes: ["id", "name"] },
        { model: Entity, as: "Entity2", attributes: ["id", "name"] },
      ],
    });

    if (!battle) {
      return res.status(404).json({ success: false, message: "Bataille non trouvée." });
    }

    const votes = await Vote.findAll({ where: { battleId } });

    const entity1Votes = votes.filter((v) => v.votedEntityId === battle.entity1Id).length;
    const entity2Votes = votes.filter((v) => v.votedEntityId === battle.entity2Id).length;
    const totalVotes = entity1Votes + entity2Votes;

    return res.status(200).json({
      success: true,
      data: {
        battleId,
        totalVotes,
        entity1: {
          id: battle.entity1Id,
          name: battle.Entity1?.name,
          votes: entity1Votes,
          percentage: totalVotes ? Math.round((entity1Votes / totalVotes) * 100) : 0,
        },
        entity2: {
          id: battle.entity2Id,
          name: battle.Entity2?.name,
          votes: entity2Votes,
          percentage: totalVotes ? Math.round((entity2Votes / totalVotes) * 100) : 0,
        },
      },
    });
  } catch (error) {
    console.error("Erreur getBattleVoteStats:", error);
    return res.status(500).json({ success: false, message: "Erreur serveur." });
  }
};

const getUserVotes = async (req, res) => {
  try {
    const targetUserId = parseInt(req.params.userId);
    const { page = 1, limit = 10, sortBy = "createdAt", sortOrder = "DESC" } = req.query;

    const offset = (page - 1) * limit;

    const { count, rows: votes } = await Vote.findAndCountAll({
      where: { userId: targetUserId },
      include: [
        {
          model: Battle,
          as: "Battle",
          attributes: ["id", "entity1Id", "entity2Id", "status", "endTime"],
          include: [
            { model: Entity, as: "Entity1", attributes: ["id", "name", "type", "imageUrl"] },
            { model: Entity, as: "Entity2", attributes: ["id", "name", "type", "imageUrl"] },
          ],
        },
        { model: Entity, as: "VotedEntity", attributes: ["id", "name", "type", "imageUrl"] },
      ],
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    return res.status(200).json({
      success: true,
      data: {
        votes,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(count / limit),
        },
      },
    });
  } catch (error) {
    console.error("Erreur getUserVotes:", error);
    return res.status(500).json({ success: false, message: "Erreur serveur." });
  }
};

module.exports = {
  createVote,
  getVotes,
  getVoteById,
  updateVote,
  deleteVote,
  getBattleVoteStats,
  getUserVotes,
};
