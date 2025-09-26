import Joi from 'joi';

export const collisionRiskSchema = Joi.object({
  altitude_km: Joi.number().min(150).max(50000).required().messages({
    'number.min': 'Altitude must be at least 150 km',
    'number.max': 'Altitude cannot exceed 50,000 km',
    'any.required': 'Altitude is required'
  }),
  
  inclination_deg: Joi.number().min(0).max(180).required().messages({
    'number.min': 'Inclination must be at least 0 degrees',
    'number.max': 'Inclination cannot exceed 180 degrees',
    'any.required': 'Inclination is required'
  }),
  
  satellite_count: Joi.number().integer().min(1).max(100000).required().messages({
    'number.integer': 'Satellite count must be an integer',
    'number.min': 'Satellite count must be at least 1',
    'number.max': 'Satellite count cannot exceed 100,000',
    'any.required': 'Satellite count is required'
  }),
  
  mission_duration_years: Joi.number().positive().max(50).required().messages({
    'number.positive': 'Mission duration must be positive',
    'number.max': 'Mission duration cannot exceed 50 years',
    'any.required': 'Mission duration is required'
  }),
  
  collision_avoidance_capability: Joi.boolean().optional(),
  
  satellite_size_category: Joi.string().valid('SMALL', 'MEDIUM', 'LARGE').optional().messages({
    'any.only': 'Satellite size category must be one of: SMALL, MEDIUM, LARGE'
  })
});

export const altitudeParamSchema = Joi.object({
  altitude: Joi.number().min(150).max(50000).required().messages({
    'number.min': 'Altitude must be at least 150 km',
    'number.max': 'Altitude cannot exceed 50,000 km',
    'any.required': 'Altitude is required'
  })
});

export const deorbitAnalysisSchema = Joi.object({
  satellite_mass_kg: Joi.number().positive().max(10000).required().messages({
    'number.positive': 'Satellite mass must be positive',
    'number.max': 'Satellite mass cannot exceed 10,000 kg',
    'any.required': 'Satellite mass is required'
  }),
  
  orbital_altitude_km: Joi.number().min(150).max(50000).required().messages({
    'number.min': 'Orbital altitude must be at least 150 km',
    'number.max': 'Orbital altitude cannot exceed 50,000 km',
    'any.required': 'Orbital altitude is required'
  }),
  
  satellite_area_m2: Joi.number().positive().max(1000).optional().messages({
    'number.positive': 'Satellite area must be positive',
    'number.max': 'Satellite area cannot exceed 1,000 m²'
  }),
  
  propulsion_capability: Joi.boolean().optional(),
  
  target_deorbit_timeline_years: Joi.number().positive().max(50).optional().messages({
    'number.positive': 'Target deorbit timeline must be positive',
    'number.max': 'Target deorbit timeline cannot exceed 50 years'
  })
});