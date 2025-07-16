const { Vote, Battle, Entity, User } = require("../models");

// Fonctions temporaires pour démarrer le serveur
const createVote = (req, res) => {
  res.json({
    success: true,
    message: "createVote - Fonction à implémenter",
    data: null,
  });
};

const getVotes = (req, res) => {
  res.json({
    success: true,
    message: "getVotes - Fonction à implémenter",
    data: { votes: [], pagination: {} },
  });
};

const getVoteById = (req, res) => {
  res.json({
    success: true,
    message: "getVoteById - Fonction à implémenter",
    data: null,
  });
};

const updateVote = (req, res) => {
  res.json({
    success: true,
    message: "updateVote - Fonction à implémenter",
    data: null,
  });
};

const deleteVote = (req, res) => {
  res.json({
    success: true,
    message: "deleteVote - Fonction à implémenter",
  });
};

const getBattleVoteStats = (req, res) => {
  res.json({
    success: true,
    message: "getBattleVoteStats - Fonction à implémenter",
    data: {
      battleId: parseInt(req.params.battleId),
      totalVotes: 0,
      entity1: { votes: 0, percentage: 0 },
      entity2: { votes: 0, percentage: 0 },
    },
  });
};

const getUserVotes = (req, res) => {
  res.json({
    success: true,
    message: "getUserVotes - Fonction à implémenter",
    data: { votes: [], pagination: {} },
  });
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
