import React, { useMemo } from 'react'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../SharedUI'
import { TrendingUp, TrendingDown, DollarSign, Target, AlertTriangle, CheckCircle } from 'lucide-react'
import { cn } from '../../utils/cn'
import type { FinancialChartData } from './types'

interface FinancialDashboardProps {
  data: FinancialChartData
  missionData?: any
  costEstimate?: any
}

const formatCurrency = (value: number) => {
  if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`
  if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`
  if (value >= 1e3) return `$${(value / 1e3).toFixed(1)}K`
  return `$${value.toFixed(0)}`
}

const formatPercent = (value: number) => `${value.toFixed(1)}%`

const CustomTooltip = ({ active, payload, label, formatter }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-neutral-900/95 backdrop-blur-sm border border-neutral-700 rounded-lg p-3 shadow-xl">
        <p className="text-stellar-white font-medium mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {formatter ? formatter(entry.value) : entry.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export const FinancialDashboard: React.FC<FinancialDashboardProps> = ({ 
  data, 
  missionData, 
  costEstimate 
}) => {
  const financialMetrics = useMemo(() => {
    const lastCashFlow = data.cashFlow[data.cashFlow.length - 1]
    const lastROI = data.roi[data.roi.length - 1]
    const breakEvenPoint = data.breakEven.find(point => point.profit >= 0)
    
    const totalInvestment = data.roi.reduce((sum, point) => sum + point.investment, 0)
    const totalReturns = data.roi.reduce((sum, point) => sum + point.returns, 0)
    const netProfit = totalReturns - totalInvestment
    
    return {
      totalInvestment,
      totalReturns,
      netProfit,
      finalROI: lastROI?.cumulativeROI || 0,
      breakEvenMonth: breakEvenPoint?.month || null,
      finalCashFlow: lastCashFlow?.cumulativeCashFlow || 0,
      profitMargin: totalReturns > 0 ? (netProfit / totalReturns) * 100 : 0
    }
  }, [data])

  const riskIndicators = useMemo(() => {
    const indicators = []
    
    if (financialMetrics.breakEvenMonth === null || financialMetrics.breakEvenMonth > 60) {
      indicators.push({
        type: 'warning',
        message: 'Break-even point beyond 5 years or not achieved',
        icon: AlertTriangle
      })
    }
    
    if (financialMetrics.finalROI < 15) {
      indicators.push({
        type: 'warning',
        message: 'ROI below industry benchmark (15%)',
        icon: TrendingDown
      })
    }
    
    if (financialMetrics.finalCashFlow < 0) {
      indicators.push({
        type: 'error',
        message: 'Negative cumulative cash flow',
        icon: AlertTriangle
      })
    }
    
    if (indicators.length === 0) {
      indicators.push({
        type: 'success',
        message: 'Financial projections look healthy',
        icon: CheckCircle
      })
    }
    
    return indicators
  }, [financialMetrics])

  return (
    <div className="space-y-6">
      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card variant="glass">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-inter text-neutral-400">Total Investment</p>
                <p className="text-2xl font-space font-bold text-stellar-white">
                  {formatCurrency(financialMetrics.totalInvestment)}
                </p>
              </div>
              <div className="p-3 bg-red-500/20 rounded-lg">
                <DollarSign className="h-6 w-6 text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-inter text-neutral-400">Expected Returns</p>
                <p className="text-2xl font-space font-bold text-stellar-white">
                  {formatCurrency(financialMetrics.totalReturns)}
                </p>
              </div>
              <div className="p-3 bg-green-500/20 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-inter text-neutral-400">Net Profit</p>
                <p className={cn(
                  "text-2xl font-space font-bold",
                  financialMetrics.netProfit >= 0 ? "text-green-400" : "text-red-400"
                )}>
                  {formatCurrency(financialMetrics.netProfit)}
                </p>
              </div>
              <div className={cn(
                "p-3 rounded-lg",
                financialMetrics.netProfit >= 0 ? "bg-green-500/20" : "bg-red-500/20"
              )}>
                {financialMetrics.netProfit >= 0 ? (
                  <TrendingUp className="h-6 w-6 text-green-400" />
                ) : (
                  <TrendingDown className="h-6 w-6 text-red-400" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="glass">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-inter text-neutral-400">ROI</p>
                <p className={cn(
                  "text-2xl font-space font-bold",
                  financialMetrics.finalROI >= 15 ? "text-green-400" : "text-yellow-400"
                )}>
                  {formatPercent(financialMetrics.finalROI)}
                </p>
              </div>
              <div className="p-3 bg-electric-blue/20 rounded-lg">
                <Target className="h-6 w-6 text-electric-blue" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Indicators */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle>Financial Risk Assessment</CardTitle>
          <CardDescription>Key financial indicators and risk factors</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {riskIndicators.map((indicator, index) => {
              const Icon = indicator.icon
              return (
                <div key={index} className={cn(
                  "flex items-center space-x-3 p-3 rounded-lg",
                  indicator.type === 'success' && "bg-green-500/10 border border-green-500/20",
                  indicator.type === 'warning' && "bg-yellow-500/10 border border-yellow-500/20",
                  indicator.type === 'error' && "bg-red-500/10 border border-red-500/20"
                )}>
                  <Icon className={cn(
                    "h-5 w-5",
                    indicator.type === 'success' && "text-green-400",
                    indicator.type === 'warning' && "text-yellow-400",
                    indicator.type === 'error' && "text-red-400"
                  )} />
                  <span className="text-sm font-inter text-stellar-white">
                    {indicator.message}
                  </span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cash Flow Projection */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle>Cash Flow Projection</CardTitle>
            <CardDescription>Monthly cash flow and cumulative position</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data.cashFlow}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="month" 
                  stroke="#9CA3AF"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  fontSize={12}
                  tickFormatter={formatCurrency}
                />
                <Tooltip 
                  content={<CustomTooltip formatter={formatCurrency} />}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="cumulativeCashFlow"
                  stackId="1"
                  stroke="#00D4FF"
                  fill="#00D4FF"
                  fillOpacity={0.3}
                  name="Cumulative Cash Flow"
                />
                <Area
                  type="monotone"
                  dataKey="netCashFlow"
                  stackId="2"
                  stroke="#6366F1"
                  fill="#6366F1"
                  fillOpacity={0.3}
                  name="Monthly Net Cash Flow"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Break-Even Analysis */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle>Break-Even Analysis</CardTitle>
            <CardDescription>Revenue vs costs over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.breakEven}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="month" 
                  stroke="#9CA3AF"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  fontSize={12}
                  tickFormatter={formatCurrency}
                />
                <Tooltip 
                  content={<CustomTooltip formatter={formatCurrency} />}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10B981"
                  strokeWidth={2}
                  name="Revenue"
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="costs"
                  stroke="#EF4444"
                  strokeWidth={2}
                  name="Costs"
                  dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="profit"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  name="Profit"
                  dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* ROI Projection */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle>ROI Projection</CardTitle>
            <CardDescription>Return on investment over mission lifetime</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.roi}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="year" 
                  stroke="#9CA3AF"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  fontSize={12}
                  tickFormatter={formatPercent}
                />
                <Tooltip 
                  content={<CustomTooltip formatter={formatPercent} />}
                />
                <Legend />
                <Bar
                  dataKey="roi"
                  fill="#EC4899"
                  name="Annual ROI"
                  radius={[4, 4, 0, 0]}
                />
                <Line
                  type="monotone"
                  dataKey="cumulativeROI"
                  stroke="#00D4FF"
                  strokeWidth={3}
                  name="Cumulative ROI"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Cost Breakdown */}
        <Card variant="glass">
          <CardHeader>
            <CardTitle>Cost Breakdown</CardTitle>
            <CardDescription>Distribution of mission costs by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.costBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="amount"
                >
                  {data.costBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  content={<CustomTooltip formatter={formatCurrency} />}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Financial Summary */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle>Financial Summary</CardTitle>
          <CardDescription>Key financial metrics and projections</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <p className="text-sm font-inter text-neutral-400">Break-Even Point</p>
              <p className="text-lg font-space font-semibold text-stellar-white">
                {financialMetrics.breakEvenMonth 
                  ? `Month ${financialMetrics.breakEvenMonth}` 
                  : 'Not achieved in projection period'
                }
              </p>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-inter text-neutral-400">Profit Margin</p>
              <p className="text-lg font-space font-semibold text-stellar-white">
                {formatPercent(financialMetrics.profitMargin)}
              </p>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-inter text-neutral-400">Final Cash Position</p>
              <p className={cn(
                "text-lg font-space font-semibold",
                financialMetrics.finalCashFlow >= 0 ? "text-green-400" : "text-red-400"
              )}>
                {formatCurrency(financialMetrics.finalCashFlow)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}