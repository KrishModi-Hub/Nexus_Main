import { Request, Response, NextFunction } from 'express';
import missionService from '../services/missionService';
import { createMissionSchema, updateMissionSchema, missionIdSchema } from '../validators/missionValidators';
import { CreateMissionRequest, UpdateMissionRequest } from '../types/mission';

export class MissionController {
  async createMission(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Validate request body
      const { error, value } = createMissionSchema.validate(req.body);
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

      const missionData: CreateMissionRequest = value;
      const mission = await missionService.createMission(missionData);

      res.status(201).json({
        success: true,
        message: 'Mission created successfully',
        data: mission
      });
    } catch (error) {
      next(error);
    }
  }

  async getMissionById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Validate mission ID
      const { error, value } = missionIdSchema.validate({ id: req.params.id });
      if (error) {
        res.status(400).json({
          success: false,
          message: 'Invalid mission ID',
          errors: error.details.map(detail => ({
            field: detail.path.join('.'),
            message: detail.message
          }))
        });
        return;
      }

      const missionId = parseInt(value.id);
      const mission = await missionService.getMissionById(missionId);

      if (!mission) {
        res.status(404).json({
          success: false,
          message: `Mission with ID ${missionId} not found`
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Mission retrieved successfully',
        data: mission
      });
    } catch (error) {
      next(error);
    }
  }

  async updateMission(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Validate mission ID
      const idValidation = missionIdSchema.validate({ id: req.params.id });
      if (idValidation.error) {
        res.status(400).json({
          success: false,
          message: 'Invalid mission ID',
          errors: idValidation.error.details.map(detail => ({
            field: detail.path.join('.'),
            message: detail.message
          }))
        });
        return;
      }

      // Validate request body
      const { error, value } = updateMissionSchema.validate(req.body);
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

      const missionId = parseInt(idValidation.value.id);
      const updateData: UpdateMissionRequest = value;
      const mission = await missionService.updateMission(missionId, updateData);

      if (!mission) {
        res.status(404).json({
          success: false,
          message: `Mission with ID ${missionId} not found`
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Mission updated successfully',
        data: mission
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteMission(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Validate mission ID
      const { error, value } = missionIdSchema.validate({ id: req.params.id });
      if (error) {
        res.status(400).json({
          success: false,
          message: 'Invalid mission ID',
          errors: error.details.map(detail => ({
            field: detail.path.join('.'),
            message: detail.message
          }))
        });
        return;
      }

      const missionId = parseInt(value.id);
      const deleted = await missionService.deleteMission(missionId);

      if (!deleted) {
        res.status(404).json({
          success: false,
          message: `Mission with ID ${missionId} not found`
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Mission deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  async simulateMission(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Validate mission ID
      const { error, value } = missionIdSchema.validate({ id: req.params.id });
      if (error) {
        res.status(400).json({
          success: false,
          message: 'Invalid mission ID',
          errors: error.details.map(detail => ({
            field: detail.path.join('.'),
            message: detail.message
          }))
        });
        return;
      }

      const missionId = parseInt(value.id);
      const simulationResult = await missionService.simulateMission(missionId);

      res.status(200).json({
        success: true,
        message: 'Mission simulation completed successfully',
        data: simulationResult
      });
    } catch (error) {
      next(error);
    }
  }

  async generateMissionReport(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Validate mission ID
      const { error, value } = missionIdSchema.validate({ id: req.params.id });
      if (error) {
        res.status(400).json({
          success: false,
          message: 'Invalid mission ID',
          errors: error.details.map(detail => ({
            field: detail.path.join('.'),
            message: detail.message
          }))
        });
        return;
      }

      const missionId = parseInt(value.id);
      const report = await missionService.generateMissionReport(missionId);

      res.status(200).json({
        success: true,
        message: 'Mission report generated successfully',
        data: report
      });
    } catch (error) {
      next(error);
    }
  }

  async optimizeMission(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Validate mission ID
      const { error, value } = missionIdSchema.validate({ id: req.params.id });
      if (error) {
        res.status(400).json({
          success: false,
          message: 'Invalid mission ID',
          errors: error.details.map(detail => ({
            field: detail.path.join('.'),
            message: detail.message
          }))
        });
        return;
      }

      const missionId = parseInt(value.id);
      const optimizationResult = await missionService.optimizeMission(missionId);

      res.status(200).json({
        success: true,
        message: 'Mission optimization completed successfully',
        data: optimizationResult
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new MissionController();