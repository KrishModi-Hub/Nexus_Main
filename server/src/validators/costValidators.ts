import Joi from 'joi';

export const costEstimateSchema = Joi.object({
  mission_type: Joi.string().min(3).max(100).required().messages({
    'string.min': 'Mission type must be at least 3 characters long',
    'string.max': 'Mission type cannot exceed 100 characters',
    'any.required': 'Mission type is required'
  }),
  
  satellite_count: Joi.number().integer().min(1).max(100000).required().messages({
    'number.integer': 'Satellite count must be an integer',
    'number.min': 'Satellite count must be at least 1',
    'number.max': 'Satellite count cannot exceed 100,000',
    'any.required': 'Satellite count is required'
  }),
  
  satellite_mass_kg: Joi.number().positive().max(10000).optional().messages({
    'number.positive': 'Satellite mass must be positive',
    'number.max': 'Satellite mass cannot exceed 10,000 kg'
  }),
  
  mission_duration_years: Joi.number().positive().max(50).optional().messages({
    'number.positive': 'Mission duration must be positive',
    'number.max': 'Mission duration cannot exceed 50 years'
  }),
  
  orbital_altitude_km: Joi.number().min(150).max(50000).optional().messages({
    'number.min': 'Orbital altitude must be at least 150 km',
    'number.max': 'Orbital altitude cannot exceed 50,000 km'
  }),
  
  launch_vehicle_type: Joi.string().max(100).optional().messages({
    'string.max': 'Launch vehicle type cannot exceed 100 characters'
  }),
  
  insurance_coverage_required: Joi.boolean().optional(),
  
  cost_categories: Joi.array().items(
    Joi.string().valid('DEVELOPMENT', 'MANUFACTURING', 'LAUNCH', 'OPERATIONS', 'INSURANCE', 'DEORBIT', 'REGULATORY')
  ).optional().messages({
    'any.only': 'Cost categories must be one of: DEVELOPMENT, MANUFACTURING, LAUNCH, OPERATIONS, INSURANCE, DEORBIT, REGULATORY'
  })
});

export const insuranceQuoteSchema = Joi.object({
  coverage_type: Joi.string().valid('PRE_LAUNCH', 'LAUNCH', 'IN_ORBIT_LIFE', 'THIRD_PARTY_LIABILITY', 'COMPREHENSIVE').required().messages({
    'any.only': 'Coverage type must be one of: PRE_LAUNCH, LAUNCH, IN_ORBIT_LIFE, THIRD_PARTY_LIABILITY, COMPREHENSIVE',
    'any.required': 'Coverage type is required'
  }),
  
  satellite_value_usd: Joi.number().positive().max(1e12).required().messages({
    'number.positive': 'Satellite value must be positive',
    'number.max': 'Satellite value cannot exceed $1 trillion',
    'any.required': 'Satellite value is required'
  }),
  
  mission_duration_months: Joi.number().integer().min(1).max(600).required().messages({
    'number.integer': 'Mission duration must be an integer',
    'number.min': 'Mission duration must be at least 1 month',
    'number.max': 'Mission duration cannot exceed 600 months',
    'any.required': 'Mission duration is required'
  }),
  
  orbital_altitude_km: Joi.number().min(150).max(50000).optional().messages({
    'number.min': 'Orbital altitude must be at least 150 km',
    'number.max': 'Orbital altitude cannot exceed 50,000 km'
  }),
  
  launch_vehicle_type: Joi.string().max(100).optional().messages({
    'string.max': 'Launch vehicle type cannot exceed 100 characters'
  }),
  
  collision_avoidance_capability: Joi.boolean().optional()
});