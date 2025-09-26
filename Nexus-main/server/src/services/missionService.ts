import { Pool, PoolClient } from 'pg';
import pool from '../config/database';
import { 
  Mission, 
  CreateMissionRequest, 
  UpdateMissionRequest, 
  MissionStatus,
  MissionSimulationResult,
  MissionReport,
  MissionOptimizationResult
} from '../types/mission';

export class MissionService {
  private pool: Pool;

  constructor() {
    this.pool = pool;
  }

  async createMission(missionData: CreateMissionRequest): Promise<Mission> {
    const client: PoolClient = await this.pool.connect();
    
    try {
      await client.query('BEGIN');

      // Validate foreign key references
      if (missionData.target_orbital_shell_id) {
        const shellExists = await client.query(
          'SELECT id FROM orbital_shells WHERE id = $1',
          [missionData.target_orbital_shell_id]
        );
        if (shellExists.rows.length === 0) {
          throw new Error(`Orbital shell with ID ${missionData.target_orbital_shell_id} not found`);
        }
      }

      if (missionData.satellite_configuration_id) {
        const configExists = await client.query(
          'SELECT id FROM satellite_configurations WHERE id = $1',
          [missionData.satellite_configuration_id]
        );
        if (configExists.rows.length === 0) {
          throw new Error(`Satellite configuration with ID ${missionData.satellite_configuration_id} not found`);
        }
      }

      if (missionData.launch_vehicle_id) {
        const vehicleExists = await client.query(
          'SELECT id FROM launch_vehicles WHERE id = $1 AND active_status = true',
          [missionData.launch_vehicle_id]
        );
        if (vehicleExists.rows.length === 0) {
          throw new Error(`Active launch vehicle with ID ${missionData.launch_vehicle_id} not found`);
        }
      }

      // Insert mission profile
      const insertQuery = `
        INSERT INTO mission_profiles (
          mission_name, mission_operator, mission_type, planned_satellites,
          target_orbital_shell_id, launch_campaign_start, mission_duration_years,
          total_mission_cost_usd, sustainability_commitments, regulatory_approvals,
          mission_status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *
      `;

      const values = [
        missionData.name,
        missionData.operator,
        missionData.mission_type,
        missionData.total_satellites,
        missionData.target_orbital_shell_id || null,
        missionData.planned_launch_date || null,
        missionData.mission_duration_years || null,
        missionData.total_cost_usd || null,
        missionData.sustainability_commitments || [],
        missionData.regulatory_approvals || {},
        MissionStatus.PLANNING
      ];

      const result = await client.query(insertQuery, values);
      await client.query('COMMIT');

      return this.mapRowToMission(result.rows[0]);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async getMissionById(id: number): Promise<Mission | null> {
    const query = `
      SELECT 
        mp.*,
        os.name as orbital_shell_name,
        sc.name as satellite_config_name,
        lv.name as launch_vehicle_name
      FROM mission_profiles mp
      LEFT JOIN orbital_shells os ON mp.target_orbital_shell_id = os.id
      LEFT JOIN satellite_configurations sc ON mp.target_orbital_shell_id = sc.id
      LEFT JOIN launch_vehicles lv ON mp.target_orbital_shell_id = lv.id
      WHERE mp.id = $1
    `;

    const result = await this.pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return null;
    }

    return this.mapRowToMission(result.rows[0]);
  }

  async updateMission(id: number, updateData: UpdateMissionRequest): Promise<Mission | null> {
    const client: PoolClient = await this.pool.connect();
    
    try {
      await client.query('BEGIN');

      // Check if mission exists
      const existsResult = await client.query('SELECT id FROM mission_profiles WHERE id = $1', [id]);
      if (existsResult.rows.length === 0) {
        return null;
      }

      // Validate foreign key references if provided
      if (updateData.target_orbital_shell_id) {
        const shellExists = await client.query(
          'SELECT id FROM orbital_shells WHERE id = $1',
          [updateData.target_orbital_shell_id]
        );
        if (shellExists.rows.length === 0) {
          throw new Error(`Orbital shell with ID ${updateData.target_orbital_shell_id} not found`);
        }
      }

      if (updateData.satellite_configuration_id) {
        const configExists = await client.query(
          'SELECT id FROM satellite_configurations WHERE id = $1',
          [updateData.satellite_configuration_id]
        );
        if (configExists.rows.length === 0) {
          throw new Error(`Satellite configuration with ID ${updateData.satellite_configuration_id} not found`);
        }
      }

      if (updateData.launch_vehicle_id) {
        const vehicleExists = await client.query(
          'SELECT id FROM launch_vehicles WHERE id = $1 AND active_status = true',
          [updateData.launch_vehicle_id]
        );
        if (vehicleExists.rows.length === 0) {
          throw new Error(`Active launch vehicle with ID ${updateData.launch_vehicle_id} not found`);
        }
      }

      // Build dynamic update query
      const updateFields: string[] = [];
      const values: any[] = [];
      let paramCount = 1;

      const fieldMappings: Record<string, string> = {
        name: 'mission_name',
        operator: 'mission_operator',
        mission_type: 'mission_type',
        total_satellites: 'planned_satellites',
        deployed_satellites: 'deployed_satellites',
        operational_satellites: 'operational_satellites',
        target_orbital_shell_id: 'target_orbital_shell_id',
        planned_launch_date: 'launch_campaign_start',
        mission_duration_years: 'mission_duration_years',
        total_cost_usd: 'total_mission_cost_usd',
        mission_status: 'mission_status',
        risk_assessment_score: 'risk_assessment_score',
        sustainability_commitments: 'sustainability_commitments',
        regulatory_approvals: 'regulatory_approvals'
      };

      Object.entries(updateData).forEach(([key, value]) => {
        if (value !== undefined && fieldMappings[key]) {
          updateFields.push(`${fieldMappings[key]} = $${paramCount}`);
          values.push(value);
          paramCount++;
        }
      });

      if (updateFields.length === 0) {
        throw new Error('No valid fields provided for update');
      }

      updateFields.push(`updated_at = CURRENT_TIMESTAMP`);
      values.push(id);

      const updateQuery = `
        UPDATE mission_profiles 
        SET ${updateFields.join(', ')}
        WHERE id = $${paramCount}
        RETURNING *
      `;

      const result = await client.query(updateQuery, values);
      await client.query('COMMIT');

      return this.mapRowToMission(result.rows[0]);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async deleteMission(id: number): Promise<boolean> {
    const client: PoolClient = await this.pool.connect();
    
    try {
      await client.query('BEGIN');

      const result = await client.query('DELETE FROM mission_profiles WHERE id = $1', [id]);
      await client.query('COMMIT');

      return result.rowCount !== null && result.rowCount > 0;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async simulateMission(id: number): Promise<MissionSimulationResult> {
    // Check if mission exists
    const mission = await this.getMissionById(id);
    if (!mission) {
      throw new Error(`Mission with ID ${id} not found`);
    }

    // Stub implementation - return mock simulation results
    const simulationId = `sim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      mission_id: id,
      simulation_id: simulationId,
      status: 'success',
      message: 'Mission simulation completed successfully',
      results: {
        collision_risk_assessment: Math.random() * 0.1, // 0-10% risk
        orbital_capacity_utilization: 0.65 + Math.random() * 0.3, // 65-95%
        mission_success_probability: 0.85 + Math.random() * 0.14, // 85-99%
        estimated_debris_generation: Math.floor(Math.random() * 5) // 0-4 pieces
      },
      timestamp: new Date()
    };
  }

  async generateMissionReport(id: number): Promise<MissionReport> {
    // Check if mission exists
    const mission = await this.getMissionById(id);
    if (!mission) {
      throw new Error(`Mission with ID ${id} not found`);
    }

    // Stub implementation - return mock report data
    const progressPercentage = mission.deployed_satellites / mission.total_satellites * 100;
    
    return {
      mission_id: id,
      report_type: 'summary',
      generated_at: new Date(),
      data: {
        mission_overview: {
          name: mission.name,
          status: mission.mission_status,
          progress_percentage: Math.round(progressPercentage * 100) / 100,
          satellites_deployed: mission.deployed_satellites,
          satellites_operational: mission.operational_satellites
        },
        financial_summary: {
          total_budget: mission.total_cost_usd || 0,
          spent_to_date: Math.floor((mission.total_cost_usd || 0) * progressPercentage / 100),
          remaining_budget: Math.floor((mission.total_cost_usd || 0) * (100 - progressPercentage) / 100),
          cost_per_satellite: mission.total_satellites > 0 ? Math.floor((mission.total_cost_usd || 0) / mission.total_satellites) : 0
        },
        risk_assessment: {
          overall_risk_score: mission.risk_assessment_score || Math.random() * 100,
          collision_risk: Math.random() * 30,
          technical_risk: Math.random() * 25,
          regulatory_risk: Math.random() * 20
        },
        sustainability_metrics: {
          debris_mitigation_score: 75 + Math.random() * 20,
          end_of_life_planning: 80 + Math.random() * 15,
          environmental_impact: 70 + Math.random() * 25
        }
      }
    };
  }

  async optimizeMission(id: number): Promise<MissionOptimizationResult> {
    // Check if mission exists
    const mission = await this.getMissionById(id);
    if (!mission) {
      throw new Error(`Mission with ID ${id} not found`);
    }

    // Stub implementation - return mock optimization results
    const optimizationId = `opt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      mission_id: id,
      optimization_id: optimizationId,
      status: 'success',
      message: 'Mission optimization analysis completed successfully',
      recommendations: {
        optimal_launch_window: {
          start_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
          end_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
          cost_savings_usd: Math.floor(Math.random() * 5000000) + 1000000 // $1M-$6M savings
        },
        satellite_configuration: {
          recommended_config_id: Math.floor(Math.random() * 10) + 1,
          efficiency_improvement: Math.random() * 15 + 5, // 5-20% improvement
          cost_impact_usd: Math.floor(Math.random() * 2000000) - 1000000 // -$1M to +$1M
        },
        orbital_shell: {
          recommended_shell_id: Math.floor(Math.random() * 5) + 1,
          collision_risk_reduction: Math.random() * 20 + 10, // 10-30% reduction
          capacity_utilization: Math.random() * 30 + 60 // 60-90% utilization
        },
        launch_vehicle: {
          recommended_vehicle_id: Math.floor(Math.random() * 8) + 1,
          cost_savings_usd: Math.floor(Math.random() * 10000000) + 2000000, // $2M-$12M savings
          reliability_improvement: Math.random() * 5 + 2 // 2-7% improvement
        }
      },
      timestamp: new Date()
    };
  }

  private mapRowToMission(row: any): Mission {
    return {
      id: row.id,
      name: row.mission_name,
      description: row.description || undefined,
      mission_type: row.mission_type,
      operator: row.mission_operator,
      target_orbital_shell_id: row.target_orbital_shell_id || undefined,
      satellite_configuration_id: row.satellite_configuration_id || undefined,
      launch_vehicle_id: row.launch_vehicle_id || undefined,
      planned_launch_date: row.launch_campaign_start || undefined,
      mission_duration_years: row.mission_duration_years || undefined,
      total_satellites: row.planned_satellites,
      deployed_satellites: row.deployed_satellites || 0,
      operational_satellites: row.operational_satellites || 0,
      total_cost_usd: row.total_mission_cost_usd || undefined,
      mission_status: row.mission_status as MissionStatus,
      risk_assessment_score: row.risk_assessment_score || undefined,
      sustainability_commitments: row.sustainability_commitments || [],
      regulatory_approvals: row.regulatory_approvals || {},
      created_at: row.created_at,
      updated_at: row.updated_at
    };
  }
}

export default new MissionService();