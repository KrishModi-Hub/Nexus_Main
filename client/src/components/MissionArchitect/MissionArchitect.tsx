import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Spinner, LoadingOverlay } from '../SharedUI'
import { MissionProfileWizard } from './MissionProfileWizard'
import { FinancialDashboard } from './FinancialDashboard'
import { ArrowLeft, Rocket, Calculator, Shield, ChartBar as BarChart3, Download, Share, RefreshCw } from 'lucide-react'
import { cn } from '../../utils/cn'
import { 
  useCreateMissionMutation,
  useGenerateCostEstimateMutation,
  useAssessCollisionRiskMutation,
  useOptimizeMissionMutation
} from '../../services/api'
import type { MissionFormData, FinancialChartData, MissionAnalysisResult } from './types'

type ViewMode = 'wizard' | 'analysis' | 'financial'

interface MissionArchitectProps {
  onClose?: () => void
}

// Generate mock financial data for demonstration
const generateFinancialData = (missionData: MissionFormData, costEstimate: any): FinancialChartData => {
  const totalCost = costEstimate?.total_cost_usd || missionData.total_cost_usd || 100000000
  const missionDuration = missionData.mission_duration_years || 5
  const satelliteCount = missionData.total_satellites || 1
  
  // Generate cash flow data (monthly for first 5 years)
  const cashFlow = []
  const monthlyRevenue = (totalCost * 1.3) / (missionDuration * 12) // 30% profit margin
  const monthlyExpenses = totalCost / (missionDuration * 12)
  let cumulativeCashFlow = -totalCost * 0.3 // Initial investment
  
  for (let month = 1; month <= missionDuration * 12; month++) {
    const income = month > 12 ? monthlyRevenue : 0 // Revenue starts after year 1
    const expenses = monthlyExpenses
    const netCashFlow = income - expenses
    cumulativeCashFlow += netCashFlow
    
    cashFlow.push({
      month,
      income,
      expenses,
      netCashFlow,
      cumulativeCashFlow
    })
  }
  
  // Generate break-even data
  const breakEven = []
  let cumulativeRevenue = 0
  let cumulativeCosts = totalCost * 0.3 // Initial costs
  
  for (let month = 1; month <= missionDuration * 12; month++) {
    const revenue = month > 12 ? monthlyRevenue : 0
    const costs = monthlyExpenses
    cumulativeRevenue += revenue
    cumulativeCosts += costs
    const profit = cumulativeRevenue - cumulativeCosts
    
    breakEven.push({
      month,
      revenue: cumulativeRevenue,
      costs: cumulativeCosts,
      profit
    })
  }
  
  // Generate ROI data (yearly)
  const roi = []
  let cumulativeInvestment = totalCost
  let cumulativeReturns = 0
  
  for (let year = 1; year <= missionDuration; year++) {
    const yearlyReturns = year > 1 ? monthlyRevenue * 12 : 0
    cumulativeReturns += yearlyReturns
    const yearlyROI = cumulativeInvestment > 0 ? (yearlyReturns / cumulativeInvestment) * 100 : 0
    const cumulativeROI = cumulativeInvestment > 0 ? ((cumulativeReturns - cumulativeInvestment) / cumulativeInvestment) * 100 : 0
    
    roi.push({
      year,
      investment: cumulativeInvestment,
      returns: yearlyReturns,
      roi: yearlyROI,
      cumulativeROI
    })
  }
  
  // Generate cost breakdown
  const costBreakdown = [
    { category: 'Development', amount: totalCost * 0.25, percentage: 25, color: '#00D4FF' },
    { category: 'Manufacturing', amount: totalCost * 0.20, percentage: 20, color: '#6366F1' },
    { category: 'Launch', amount: totalCost * 0.30, percentage: 30, color: '#EC4899' },
    { category: 'Operations', amount: totalCost * 0.15, percentage: 15, color: '#F59E0B' },
    { category: 'Insurance', amount: totalCost * 0.05, percentage: 5, color: '#10B981' },
    { category: 'Regulatory', amount: totalCost * 0.05, percentage: 5, color: '#EF4444' }
  ]
  
  return {
    cashFlow,
    breakEven,
    roi,
    costBreakdown
  }
}

export const MissionArchitect: React.FC<MissionArchitectProps> = ({ onClose }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('wizard')
  const [missionData, setMissionData] = useState<MissionFormData | null>(null)
  const [analysisResult, setAnalysisResult] = useState<MissionAnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  // RTK Query mutations
  const [createMission] = useCreateMissionMutation()
  const [generateCostEstimate] = useGenerateCostEstimateMutation()
  const [assessCollisionRisk] = useAssessCollisionRiskMutation()
  const [optimizeMission] = useOptimizeMissionMutation()

  const handleWizardComplete = async (data: MissionFormData) => {
    setMissionData(data)
    setIsAnalyzing(true)
    
    try {
      // Run all analyses in parallel
      const [missionResult, costResult, riskResult] = await Promise.allSettled([
        createMission({
          name: data.name,
          description: data.description,
          mission_type: data.mission_type,
          operator: data.operator,
          total_satellites: data.total_satellites,
          planned_launch_date: data.planned_launch_date,
          mission_duration_years: data.mission_duration_years,
          total_cost_usd: data.total_cost_usd,
          sustainability_commitments: data.sustainability_commitments,
          regulatory_approvals: data.regulatory_approvals
        }).unwrap(),
        
        generateCostEstimate({
          mission_type: data.mission_type,
          satellite_count: data.total_satellites,
          satellite_mass_kg: data.satellite_mass_kg,
          mission_duration_years: data.mission_duration_years,
          orbital_altitude_km: data.orbital_altitude_km,
          launch_vehicle_type: data.launch_vehicle_type,
          insurance_coverage_required: data.insurance_coverage_required,
          cost_categories: data.cost_categories
        }).unwrap(),
        
        assessCollisionRisk({
          altitude_km: data.orbital_altitude_km,
          inclination_deg: data.inclination_deg,
          satellite_count: data.total_satellites,
          mission_duration_years: data.mission_duration_years,
          collision_avoidance_capability: data.collision_avoidance_capability,
          satellite_size_category: data.satellite_size_category
        }).unwrap()
      ])

      // Extract successful results
      const mission = missionResult.status === 'fulfilled' ? missionResult.value.data : null
      const costEstimate = costResult.status === 'fulfilled' ? costResult.value.data : null
      const collisionRisk = riskResult.status === 'fulfilled' ? riskResult.value.data : null

      // Generate optimization if mission was created successfully
      let optimization = null
      if (mission) {
        try {
          const optimizationResult = await optimizeMission(mission.id).unwrap()
          optimization = optimizationResult.data
        } catch (error) {
          console.warn('Optimization failed:', error)
        }
      }

      // Generate financial projection data
      const financialProjection = generateFinancialData(data, costEstimate)

      setAnalysisResult({
        mission,
        costEstimate,
        collisionRisk,
        optimization,
        financialProjection
      })

      setViewMode('analysis')
    } catch (error) {
      console.error('Analysis failed:', error)
      // Still show results with available data
      const financialProjection = generateFinancialData(data, null)
      setAnalysisResult({
        mission: null,
        costEstimate: null,
        collisionRisk: null,
        optimization: null,
        financialProjection
      })
      setViewMode('analysis')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleRerunAnalysis = async () => {
    if (!missionData) return
    await handleWizardComplete(missionData)
  }

  const handleExportResults = () => {
    if (!analysisResult || !missionData) return
    
    const exportData = {
      mission: missionData,
      analysis: analysisResult,
      exportedAt: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `mission-analysis-${missionData.name.replace(/\s+/g, '-').toLowerCase()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (isAnalyzing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card variant="glass" className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <div className="mb-6">
              <Spinner size="xl" />
            </div>
            <h3 className="text-xl font-space font-semibold text-stellar-white mb-2">
              Analyzing Mission Profile
            </h3>
            <p className="text-neutral-400 mb-4">
              Running cost estimation, risk assessment, and optimization analysis...
            </p>
            <div className="space-y-2 text-sm text-neutral-500">
              <p>• Creating mission profile</p>
              <p>• Calculating cost estimates</p>
              <p>• Assessing collision risks</p>
              <p>• Generating optimization recommendations</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-deep-space-black">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-deep-space-black/90 backdrop-blur-xl border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {onClose && (
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              )}
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Rocket className="h-6 w-6 text-deep-space-black" />
                </div>
                <div>
                  <h1 className="text-xl font-space font-bold text-gradient-primary">
                    Intelligent Mission Architect
                  </h1>
                  <p className="text-sm text-neutral-400">
                    {viewMode === 'wizard' && 'Mission Profile Setup'}
                    {viewMode === 'analysis' && 'Mission Analysis Results'}
                    {viewMode === 'financial' && 'Financial Deep Dive'}
                  </p>
                </div>
              </div>
            </div>

            {viewMode !== 'wizard' && (
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewMode('wizard')}
                >
                  Edit Mission
                </Button>
                
                {analysisResult && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRerunAnalysis}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Rerun Analysis
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleExportResults}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {viewMode === 'wizard' && (
          <MissionProfileWizard
            onComplete={handleWizardComplete}
            onCancel={onClose}
          />
        )}

        {viewMode === 'analysis' && analysisResult && (
          <div className="space-y-6">
            {/* Navigation Tabs */}
            <Card variant="glass">
              <CardContent className="p-4">
                <div className="flex space-x-1">
                  <Button
                    variant={viewMode === 'analysis' ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('analysis')}
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Analysis Overview
                  </Button>
                  <Button
                    variant={viewMode === 'financial' ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('financial')}
                  >
                    <Calculator className="h-4 w-4 mr-2" />
                    Financial Deep Dive
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Analysis Results */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Mission Overview */}
              <Card variant="glass">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Rocket className="h-5 w-5 mr-2" />
                    Mission Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-neutral-400">Mission Name</p>
                    <p className="font-semibold text-stellar-white">{missionData?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-400">Operator</p>
                    <p className="font-semibold text-stellar-white">{missionData?.operator}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-400">Mission Type</p>
                    <p className="font-semibold text-stellar-white">{missionData?.mission_type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-400">Satellites</p>
                    <p className="font-semibold text-stellar-white">{missionData?.total_satellites}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-400">Orbital Altitude</p>
                    <p className="font-semibold text-stellar-white">{missionData?.orbital_altitude_km} km</p>
                  </div>
                </CardContent>
              </Card>

              {/* Cost Analysis */}
              <Card variant="glass">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calculator className="h-5 w-5 mr-2" />
                    Cost Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {analysisResult.costEstimate ? (
                    <>
                      <div>
                        <p className="text-sm text-neutral-400">Total Cost</p>
                        <p className="text-xl font-bold text-stellar-white">
                          ${(analysisResult.costEstimate.total_cost_usd / 1e6).toFixed(1)}M
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-neutral-400">Cost per Satellite</p>
                        <p className="font-semibold text-stellar-white">
                          ${(analysisResult.costEstimate.cost_per_satellite_usd / 1e6).toFixed(1)}M
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-neutral-400">Confidence Level</p>
                        <p className="font-semibold text-stellar-white">
                          {(analysisResult.costEstimate.confidence_level * 100).toFixed(0)}%
                        </p>
                      </div>
                    </>
                  ) : (
                    <p className="text-neutral-400">Cost analysis unavailable</p>
                  )}
                </CardContent>
              </Card>

              {/* Risk Assessment */}
              <Card variant="glass">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Risk Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {analysisResult.collisionRisk ? (
                    <>
                      <div>
                        <p className="text-sm text-neutral-400">Risk Level</p>
                        <p className={cn(
                          "font-bold",
                          analysisResult.collisionRisk.risk_level === 'LOW' && "text-green-400",
                          analysisResult.collisionRisk.risk_level === 'MEDIUM' && "text-yellow-400",
                          analysisResult.collisionRisk.risk_level === 'HIGH' && "text-orange-400",
                          analysisResult.collisionRisk.risk_level === 'CRITICAL' && "text-red-400"
                        )}>
                          {analysisResult.collisionRisk.risk_level}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-neutral-400">Collision Probability</p>
                        <p className="font-semibold text-stellar-white">
                          {(analysisResult.collisionRisk.overall_collision_probability * 100).toFixed(4)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-neutral-400">Confidence</p>
                        <p className="font-semibold text-stellar-white">
                          {(analysisResult.collisionRisk.confidence_level * 100).toFixed(0)}%
                        </p>
                      </div>
                    </>
                  ) : (
                    <p className="text-neutral-400">Risk assessment unavailable</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Recommendations */}
            {analysisResult.optimization?.recommendations && (
              <Card variant="glass">
                <CardHeader>
                  <CardTitle>Optimization Recommendations</CardTitle>
                  <CardDescription>AI-generated suggestions to improve mission performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-stellar-white">Launch Window</h4>
                      <p className="text-sm text-neutral-400">
                        Optimal launch between {new Date(analysisResult.optimization.recommendations.optimal_launch_window.start_date).toLocaleDateString()} 
                        and {new Date(analysisResult.optimization.recommendations.optimal_launch_window.end_date).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-green-400">
                        Potential savings: ${(analysisResult.optimization.recommendations.optimal_launch_window.cost_savings_usd / 1e6).toFixed(1)}M
                      </p>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-semibold text-stellar-white">Launch Vehicle</h4>
                      <p className="text-sm text-neutral-400">
                        Recommended vehicle ID: {analysisResult.optimization.recommendations.launch_vehicle.recommended_vehicle_id}
                      </p>
                      <p className="text-sm text-green-400">
                        Cost savings: ${(analysisResult.optimization.recommendations.launch_vehicle.cost_savings_usd / 1e6).toFixed(1)}M
                      </p>
                      <p className="text-sm text-blue-400">
                        Reliability improvement: {analysisResult.optimization.recommendations.launch_vehicle.reliability_improvement.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {viewMode === 'financial' && analysisResult && (
          <FinancialDashboard
            data={analysisResult.financialProjection}
            missionData={missionData}
            costEstimate={analysisResult.costEstimate}
          />
        )}
      </div>
    </div>
  )
}