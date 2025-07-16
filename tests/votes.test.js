const request = require('supertest');
const app = require('../app');
const { sequelize, User, Battle, Entity, Vote } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Helper pour générer un token JWT valide
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.SECRET_KEY, { expiresIn: '1h' });
};

describe('Votes API', () => {
  let testUser, testUser2, testBattle, testEntity1, testEntity2, userToken, user2Token;

  beforeAll(async () => {
    // Synchroniser la base de données
    await sequelize.sync({ force: true });
  });

  beforeEach(async () => {
    // Nettoyer la base de données
    await Vote.destroy({ where: {} });
    await Battle.destroy({ where: {} });
    await Entity.destroy({ where: {} });
    await User.destroy({ where: {} });

    // Créer des utilisateurs de test
    const hashedPassword = await bcrypt.hash('password123', 10);
    testUser = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: hashedPassword
    });

    testUser2 = await User.create({
      username: 'testuser2',
      email: 'test2@example.com',
      password: hashedPassword
    });

    // Créer des entités de test
    testEntity1 = await Entity.create({
      name: 'Entity 1',
      type: 'movie',
      description: 'Test entity 1'
    });

    testEntity2 = await Entity.create({
      name: 'Entity 2',
      type: 'movie',
      description: 'Test entity 2'
    });

    // Créer une bataille de test
    testBattle = await Battle.create({
      title: 'Test Battle',
      description: 'Test battle description',
      entity1Id: testEntity1.id,
      entity2Id: testEntity2.id,
      status: 'active',
      startDate: new Date(),
      endDate: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24h plus tard
    });

    // Générer des tokens
    userToken = generateToken(testUser.id);
    user2Token = generateToken(testUser2.id);
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('POST /api/votes', () => {
    it('should create a new vote successfully', async () => {
      const voteData = {
        battleId: testBattle.id,
        votedEntityId: testEntity1.id
      };

      const response = await request(app)
        .post('/api/votes')
        .set('Authorization', `Bearer ${userToken}`)
        .send(voteData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.battleId).toBe(testBattle.id);
      expect(response.body.data.votedEntityId).toBe(testEntity1.id);
      expect(response.body.data.userId).toBe(testUser.id);
    });

    it('should not allow duplicate votes from same user', async () => {
      const voteData = {
        battleId: testBattle.id,
        votedEntityId: testEntity1.id
      };

      // Premier vote
      await request(app)
        .post('/api/votes')
        .set('Authorization', `Bearer ${userToken}`)
        .send(voteData)
        .expect(201);

      // Tentative de deuxième vote
      const response = await request(app)
        .post('/api/votes')
        .set('Authorization', `Bearer ${userToken}`)
        .send(voteData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('déjà voté');
    });

    it('should validate vote data', async () => {
      const invalidVoteData = {
        battleId: 'invalid',
        votedEntityId: testEntity1.id
      };

      const response = await request(app)
        .post('/api/votes')
        .set('Authorization', `Bearer ${userToken}`)
        .send(invalidVoteData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should not allow voting on inactive battles', async () => {
      // Rendre la bataille inactive
      await testBattle.update({ status: 'completed' });

      const voteData = {
        battleId: testBattle.id,
        votedEntityId: testEntity1.id
      };

      const response = await request(app)
        .post('/api/votes')
        .set('Authorization', `Bearer ${userToken}`)
        .send(voteData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('plus active');
    });

    it('should require authentication', async () => {
      const voteData = {
        battleId: testBattle.id,
        votedEntityId: testEntity1.id
      };

      await request(app)
        .post('/api/votes')
        .send(voteData)
        .expect(401);
    });
  });

  describe('GET /api/votes', () => {
    beforeEach(async () => {
      // Créer quelques votes de test
      await Vote.create({
        battleId: testBattle.id,
        userId: testUser.id,
        votedEntityId: testEntity1.id
      });

      await Vote.create({
        battleId: testBattle.id,
        userId: testUser2.id,
        votedEntityId: testEntity2.id
      });
    });

    it('should get votes with pagination', async () => {
      const response = await request(app)
        .get('/api/votes')
        .set('Authorization', `Bearer ${userToken}`)
        .query({ page: 1, limit: 10 })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.votes).toHaveLength(2);
      expect(response.body.data.pagination).toHaveProperty('totalItems', 2);
    });

    it('should filter votes by battleId', async () => {
      const response = await request(app)
        .get('/api/votes')
        .set('Authorization', `Bearer ${userToken}`)
        .query({ battleId: testBattle.id })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.votes).toHaveLength(2);
    });
  });

  describe('GET /api/votes/stats/:battleId', () => {
    beforeEach(async () => {
      // Créer des votes pour les statistiques
      await Vote.bulkCreate([
        { battleId: testBattle.id, userId: testUser.id, votedEntityId: testEntity1.id },
        { battleId: testBattle.id, userId: testUser2.id, votedEntityId: testEntity1.id }
      ]);
    });

    it('should get vote statistics for a battle', async () => {
      const response = await request(app)
        .get(`/api/votes/stats/${testBattle.id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.totalVotes).toBe(2);
      expect(response.body.data.entity1.votes).toBe(2);
      expect(response.body.data.entity1.percentage).toBe(100);
      expect(response.body.data.entity2.votes).toBe(0);
      expect(response.body.data.entity2.percentage).toBe(0);
    });

    it('should return 404 for non-existent battle', async () => {
      await request(app)
        .get('/api/votes/stats/99999')
        .expect(404);
    });
  });

  describe('PUT /api/votes/:id', () => {
    let testVote;

    beforeEach(async () => {
      testVote = await Vote.create({
        battleId: testBattle.id,
        userId: testUser.id,
        votedEntityId: testEntity1.id
      });
    });

    it('should update a vote successfully', async () => {
      const updateData = {
        votedEntityId: testEntity2.id
      };

      const response = await request(app)
        .put(`/api/votes/${testVote.id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.votedEntityId).toBe(testEntity2.id);
    });

    it('should not allow updating votes from other users', async () => {
      const updateData = {
        votedEntityId: testEntity2.id
      };

      await request(app)
        .put(`/api/votes/${testVote.id}`)
        .set('Authorization', `Bearer ${user2Token}`)
        .send(updateData)
        .expect(403);
    });
  });

  describe('DELETE /api/votes/:id', () => {
    let testVote;

    beforeEach(async () => {
      testVote = await Vote.create({
        battleId: testBattle.id,
        userId: testUser.id,
        votedEntityId: testEntity1.id
      });
    });

    it('should delete a vote successfully', async () => {
      const response = await request(app)
        .delete(`/api/votes/${testVote.id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('supprimé');

      // Vérifier que le vote a été supprimé
      const deletedVote = await Vote.findByPk(testVote.id);
      expect(deletedVote).toBeNull();
    });

    it('should not allow deleting votes from other users', async () => {
      await request(app)
        .delete(`/api/votes/${testVote.id}`)
        .set('Authorization', `Bearer ${user2Token}`)
        .expect(403);
    });
  });

  describe('GET /api/votes/user/:userId', () => {
    beforeEach(async () => {
      await Vote.create({
        battleId: testBattle.id,
        userId: testUser.id,
        votedEntityId: testEntity1.id
      });
    });

    it('should get user votes history', async () => {
      const response = await request(app)
        .get(`/api/votes/user/${testUser.id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.votes).toHaveLength(1);
    });

    it('should not allow accessing other users votes', async () => {
      await request(app)
        .get(`/api/votes/user/${testUser.id}`)
        .set('Authorization', `Bearer ${user2Token}`)
        .expect(403);
    });
  });
});
