const Joi = require('joi');

/**
 * Schema de validation pour créer un vote
 */
const createVoteSchema = Joi.object({
  battleId: Joi.number().integer().positive().required()
    .messages({
      'number.base': 'L\'ID de la bataille doit être un nombre',
      'number.integer': 'L\'ID de la bataille doit être un entier',
      'number.positive': 'L\'ID de la bataille doit être positif',
      'any.required': 'L\'ID de la bataille est obligatoire'
    }),
  
  votedEntityId: Joi.number().integer().positive().required()
    .messages({
      'number.base': 'L\'ID de l\'entité votée doit être un nombre',
      'number.integer': 'L\'ID de l\'entité votée doit être un entier',
      'number.positive': 'L\'ID de l\'entité votée doit être positif',
      'any.required': 'L\'ID de l\'entité votée est obligatoire'
    })
});

/**
 * Schema de validation pour mettre à jour un vote
 */
const updateVoteSchema = Joi.object({
  votedEntityId: Joi.number().integer().positive().required()
    .messages({
      'number.base': 'L\'ID de l\'entité votée doit être un nombre',
      'number.integer': 'L\'ID de l\'entité votée doit être un entier',
      'number.positive': 'L\'ID de l\'entité votée doit être positif',
      'any.required': 'L\'ID de l\'entité votée est obligatoire'
    })
});

/**
 * Schema de validation pour les paramètres de pagination
 */
const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1)
    .messages({
      'number.base': 'La page doit être un nombre',
      'number.integer': 'La page doit être un entier',
      'number.min': 'La page doit être supérieure ou égale à 1'
    }),
  
  limit: Joi.number().integer().min(1).max(100).default(10)
    .messages({
      'number.base': 'La limite doit être un nombre',
      'number.integer': 'La limite doit être un entier',
      'number.min': 'La limite doit être supérieure ou égale à 1',
      'number.max': 'La limite ne peut pas dépasser 100'
    }),
  
  battleId: Joi.number().integer().positive().optional()
    .messages({
      'number.base': 'L\'ID de la bataille doit être un nombre',
      'number.integer': 'L\'ID de la bataille doit être un entier',
      'number.positive': 'L\'ID de la bataille doit être positif'
    }),
  
  userId: Joi.number().integer().positive().optional()
    .messages({
      'number.base': 'L\'ID de l\'utilisateur doit être un nombre',
      'number.integer': 'L\'ID de l\'utilisateur doit être un entier',
      'number.positive': 'L\'ID de l\'utilisateur doit être positif'
    }),
  
  entityId: Joi.number().integer().positive().optional()
    .messages({
      'number.base': 'L\'ID de l\'entité doit être un nombre',
      'number.integer': 'L\'ID de l\'entité doit être un entier',
      'number.positive': 'L\'ID de l\'entité doit être positif'
    }),
  
  sortBy: Joi.string().valid('createdAt', 'battleId', 'userId', 'votedEntityId').default('createdAt')
    .messages({
      'any.only': 'Le tri doit être par: createdAt, battleId, userId, ou votedEntityId'
    }),
  
  sortOrder: Joi.string().valid('ASC', 'DESC', 'asc', 'desc').default('DESC')
    .messages({
      'any.only': 'L\'ordre de tri doit être ASC ou DESC'
    })
});

/**
 * Fonction de validation pour créer un vote
 */
const validateVote = (data) => {
  return createVoteSchema.validate(data, { abortEarly: false });
};

/**
 * Fonction de validation pour mettre à jour un vote
 */
const validateVoteUpdate = (data) => {
  return updateVoteSchema.validate(data, { abortEarly: false });
};

/**
 * Fonction de validation pour les paramètres de pagination
 */
const validatePagination = (data) => {
  return paginationSchema.validate(data, { abortEarly: false, allowUnknown: true });
};

module.exports = {
  validateVote,
  validateVoteUpdate,
  validatePagination,
  createVoteSchema,
  updateVoteSchema,
  paginationSchema
};
