import Joi from 'joi';
import { MissionStatus } from '../types/mission';

export const createMissionSchema = Joi.object({
  name: Joi.string().min(3).max(255).required().messages({
    'string.min': 'Mission name must be at least 3 characters long',
    'string.max': 'Mission name cannot exceed 255 characters',
    'any.required': 'Mission name is required'
  }),
  
  description: Joi.string().max(1000).optional().messages({
    'string.max': 'Description cannot exceed 1000 characters'
  }),
  
  mission_type: Joi.string().min(3).max(100).required().messages({
    'string.min': 'Mission type must be at least 3 characters long',
    'string.max': 'Mission type cannot exceed 100 characters',
    'any.required': 'Mission type is required'
  }),
  
  operator: Joi.string().min(2).max(255).required().messages({
    'string.min': 'Operator name must be at least 2 characters long',
    'string.max': 'Operator name cannot exceed 255 characters',
    'any.required': 'Operator is required'
  }),
  
  target_orbital_shell_id: Joi.number().integer().positive().optional().messages({
    'number.integer': 'Target orbital shell ID must be an integer',
    'number.positive': 'Target orbital shell ID must be positive'
  }),
  
  satellite_configuration_id: Joi.number().integer().positive().optional().messages({
    'number.integer': 'Satellite configuration ID must be an integer',
    'number.positive': 'Satellite configuration ID must be positive'
  }),
  
  launch_vehicle_id: Joi.number().integer().positive().optional().messages({
    'number.integer': 'Launch vehicle ID must be an integer',
    'number.positive': 'Launch vehicle ID must be positive'
  }),
  
  planned_launch_date: Joi.date().iso().min('now').optional().messages({
    'date.format': 'Planned launch date must be in ISO format',
    'date.min': 'Planned launch date cannot be in the past'
  }),
  
  mission_duration_years: Joi.number().positive().max(50).optional().messages({
    'number.positive': 'Mission duration must be positive',
    'number.max': 'Mission duration cannot exceed 50 years'
  }),
  
  total_satellites: Joi.number().integer().min(1).max(100000).required().messages({
    'number.integer': 'Total satellites must be an integer',
    'number.min': 'Total satellites must be at least 1',
    'number.max': 'Total satellites cannot exceed 100,000',
    'any.required': 'Total satellites is required'
  }),
  
  total_cost_usd: Joi.number().positive().max(1e12).optional().messages({
    'number.positive': 'Total cost must be positive',
    'number.max': 'Total cost cannot exceed $1 trillion'
  }),
  
  sustainability_commitments: Joi.array().items(Joi.string().max(500)).max(20).optional().messages({
    'array.max': 'Cannot have more than 20 sustainability commitments',
    'string.max': 'Each sustainability commitment cannot exceed 500 characters'
  }),
  
  regulatory_approvals: Joi.object().optional()
});

export const updateMissionSchema = Joi.object({
  name: Joi.string().min(3).max(255).optional().messages({
    'string.min': 'Mission name must be at least 3 characters long',
    'string.max': 'Mission name cannot exceed 255 characters'
  }),
  
  description: Joi.string().max(1000).optional().messages({
    'string.max': 'Description cannot exceed 1000 characters'
  }),
  
  mission_type: Joi.string().min(3).max(100).optional().messages({
    'string.min': 'Mission type must be at least 3 characters long',
    'string.max': 'Mission type cannot exceed 100 characters'
  }),
  
  operator: Joi.string().min(2).max(255).optional().messages({
    'string.min': 'Operator name must be at least 2 characters long',
    'string.max': 'Operator name cannot exceed 255 characters'
  }),
  
  target_orbital_shell_id: Joi.number().integer().positive().optional().messages({
    'number.integer': 'Target orbital shell ID must be an integer',
    'number.positive': 'Target orbital shell ID must be positive'
  }),
  
  satellite_configuration_id: Joi.number().integer().positive().optional().messages({
    'number.integer': 'Satellite configuration ID must be an integer',
    'number.positive': 'Satellite configuration ID must be positive'
  }),
  
  launch_vehicle_id: Joi.number().integer().positive().optional().messages({
    'number.integer': 'Launch vehicle ID must be an integer',
    'number.positive': 'Launch vehicle ID must be positive'
  }),
  
  planned_launch_date: Joi.date().iso().optional().messages({
    'date.format': 'Planned launch date must be in ISO format'
  }),
  
  mission_duration_years: Joi.number().positive().max(50).optional().messages({
    'number.positive': 'Mission duration must be positive',
    'number.max': 'Mission duration cannot exceed 50 years'
  }),
  
  total_satellites: Joi.number().integer().min(1).max(100000).optional().messages({
    'number.integer': 'Total satellites must be an integer',
    'number.min': 'Total satellites must be at least 1',
    'number.max': 'Total satellites cannot exceed 100,000'
  }),
  
  deployed_satellites: Joi.number().integer().min(0).optional().messages({
    'number.integer': 'Deployed satellites must be an integer',
    'number.min': 'Deployed satellites cannot be negative'
  }),
  
  operational_satellites: Joi.number().integer().min(0).optional().messages({
    'number.integer': 'Operational satellites must be an integer',
    'number.min': 'Operational satellites cannot be negative'
  }),
  
  total_cost_usd: Joi.number().positive().max(1e12).optional().messages({
    'number.positive': 'Total cost must be positive',
    'number.max': 'Total cost cannot exceed $1 trillion'
  }),
  
  mission_status: Joi.string().valid(...Object.values(MissionStatus)).optional().messages({
    'any.only': `Mission status must be one of: ${Object.values(MissionStatus).join(', ')}`
  }),
  
  risk_assessment_score: Joi.number().min(0).max(100).optional().messages({
    'number.min': 'Risk assessment score cannot be negative',
    'number.max': 'Risk assessment score cannot exceed 100'
  }),
  
  sustainability_commitments: Joi.array().items(Joi.string().max(500)).max(20).optional().messages({
    'array.max': 'Cannot have more than 20 sustainability commitments',
    'string.max': 'Each sustainability commitment cannot exceed 500 characters'
  }),
  
  regulatory_approvals: Joi.object().optional()
}).min(1).messages({
  'object.min': 'At least one field must be provided for update'
});

export const missionIdSchema = Joi.object({
  id: Joi.number().integer().positive().required().messages({
    'number.integer': 'Mission ID must be an integer',
    'number.positive': 'Mission ID must be positive',
    'any.required': 'Mission ID is required'
  })
});