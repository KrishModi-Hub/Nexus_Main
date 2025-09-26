import { Request, Response, NextFunction } from 'express';
import costService from '../services/costService';
import { costEstimateSchema, insuranceQuoteSchema } from '../validators/costValidators';
import { CostEstimateRequest, InsuranceQuoteRequest } from '../types/cost';

export class CostController {
  async generateCostEstimate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Validate request body
      const { error, value } = costEstimateSchema.validate(req.body);
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

      const estimateRequest: CostEstimateRequest = value;
      const estimate = await costService.generateCostEstimate(estimateRequest);

      res.status(200).json({
        success: true,
        message: 'Cost estimate generated successfully',
        data: estimate
      });
    } catch (error) {
      next(error);
    }
  }

  async getCostComponents(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const components = await costService.getCostComponents();

      res.status(200).json({
        success: true,
        message: 'Cost components retrieved successfully',
        data: {
          components,
          total_count: components.length
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async generateInsuranceQuote(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Validate request body
      const { error, value } = insuranceQuoteSchema.validate(req.body);
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

      const quoteRequest: InsuranceQuoteRequest = value;
      const quote = await costService.generateInsuranceQuote(quoteRequest);

      res.status(200).json({
        success: true,
        message: 'Insurance quote generated successfully',
        data: quote
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new CostController();