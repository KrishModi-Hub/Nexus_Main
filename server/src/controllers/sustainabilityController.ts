import { Request, Response, NextFunction } from 'express';
import sustainabilityService from '../services/sustainabilityService';
import { 
  collisionRiskSchema, 
  altitudeParamSchema, 
  deorbitAnalysisSchema 
} from '../validators/sustainabilityValidators';
import { 
  CollisionRiskRequest, 
  DeorbitAnalysisRequest 
} from '../types/sustainability';

export class SustainabilityController {
  async assessCollisionRisk(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Validate request body
      const { error, value } = collisionRiskSchema.validate(req.body);
      if (error) {
        res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.details.map(detail => ({
            field: detail.path.join('.'),
            message: detail.message
          }))
        });
        return;
      }

      const riskRequest: CollisionRiskRequest = value;
      const assessment = await sustainabilityService.assessCollisionRisk(riskRequest);

      res.status(200).json({
        success: true,
        message: 'Collision risk assessment completed successfully',
        data: assessment
      });
    } catch (error) {
      next(error);
    }
  }

  async getDebrisDensity(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Validate altitude parameter
      const { error, value } = altitudeParamSchema.validate({ altitude: req.params.altitude });
      if (error) {
        res.status(400).json({
          success: false,
          message: 'Invalid altitude parameter',
          errors: error.details.map(detail => ({
            field: detail.path.join('.'),
            message: detail.message
          }))
        });
        return;
      }

      const altitude = parseFloat(value.altitude);
      const debrisDensity = await sustainabilityService.getDebrisDensity(altitude);

      res.status(200).json({
        success: true,
        message: 'Debris density information retrieved successfully',
        data: debrisDensity
      });
    } catch (error) {
      next(error);
    }
  }

  async analyzeDeorbitOptions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Validate request body
      const { error, value } = deorbitAnalysisSchema.validate(req.body);
      if (error) {
        res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.details.map(detail => ({
            field: detail.path.join('.'),
            message: detail.message
          }))
        });
        return;
      }

      const analysisRequest: DeorbitAnalysisRequest = value;
      const analysis = await sustainabilityService.analyzeDeorbitOptions(analysisRequest);

      res.status(200).json({
        success: true,
        message: 'Deorbit analysis completed successfully',
        data: analysis
      });
    } catch (error) {
      next(error);
    }
  }

  async getActiveSatellites(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const satellites = await sustainabilityService.getActiveSatellites();

      res.status(200).json({
        success: true,
        message: 'Active satellites retrieved successfully',
        data: satellites
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new SustainabilityController();