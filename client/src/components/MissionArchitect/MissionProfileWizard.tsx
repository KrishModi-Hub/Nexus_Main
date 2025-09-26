import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Textarea } from '../SharedUI'
import { ChevronLeft, ChevronRight, Rocket, Satellite, Calculator, Shield, CheckCircle } from 'lucide-react'
import { cn } from '../../utils/cn'
import type { MissionFormData, WizardStep, WizardStepProps } from './types'

// Step Components
const BasicInformationStep: React.FC<WizardStepProps> = ({ data, onUpdate, onNext, isLast }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLast) onNext()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Mission Name"
          value={data.name || ''}
          onChange={(e) => onUpdate({ name: e.target.value })}
          placeholder="Enter mission name"
          required
          fullWidth
        />
        
        <Input
          label="Operator"
          value={data.operator || ''}
          onChange={(e) => onUpdate({ operator: e.target.value })}
          placeholder="Organization or company"
          required
          fullWidth
        />
      </div>

      <Input
        label="Mission Type"
        value={data.mission_type || ''}
        onChange={(e) => onUpdate({ mission_type: e.target.value })}
        placeholder="e.g., Communications, Earth Observation, Navigation"
        required
        fullWidth
      />

      <Textarea
        label="Mission Description"
        value={data.description || ''}
        onChange={(e) => onUpdate({ description: e.target.value })}
        placeholder="Describe the mission objectives and goals"
        rows={4}
        fullWidth
      />

      <div className="flex justify-end">
        <Button type="submit" variant="primary">
          Continue
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </form>
  )
}

const TechnicalSpecificationsStep: React.FC<WizardStepProps> = ({ data, onUpdate, onNext, onPrevious, isFirst, isLast }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLast) onNext()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Number of Satellites"
          type="number"
          value={data.total_satellites || ''}
          onChange={(e) => onUpdate({ total_satellites: parseInt(e.target.value) || 0 })}
          placeholder="1"
          min="1"
          max="100000"
          required
          fullWidth
        />
        
        <Input
          label="Satellite Mass (kg)"
          type="number"
          value={data.satellite_mass_kg || ''}
          onChange={(e) => onUpdate({ satellite_mass_kg: parseFloat(e.target.value) || 0 })}
          placeholder="500"
          min="1"
          max="10000"
          step="0.1"
          fullWidth
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-stellar-white font-inter">
            Satellite Size Category
          </label>
          <select
            value={data.satellite_size_category || 'MEDIUM'}
            onChange={(e) => onUpdate({ satellite_size_category: e.target.value as 'SMALL' | 'MEDIUM' | 'LARGE' })}
            className="w-full px-4 py-2 text-base rounded-lg border border-neutral-700 bg-neutral-900/50 text-stellar-white placeholder-neutral-500 focus:border-electric-blue focus:ring-2 focus:ring-electric-blue/20 focus:outline-none transition-colors"
          >
            <option value="SMALL">Small (1-50 kg)</option>
            <option value="MEDIUM">Medium (50-1000 kg)</option>
            <option value="LARGE">Large (1000+ kg)</option>
          </select>
        </div>

        <Input
          label="Orbital Altitude (km)"
          type="number"
          value={data.orbital_altitude_km || ''}
          onChange={(e) => onUpdate({ orbital_altitude_km: parseFloat(e.target.value) || 0 })}
          placeholder="550"
          min="150"
          max="50000"
          required
          fullWidth
        />
        
        <Input
          label="Inclination (degrees)"
          type="number"
          value={data.inclination_deg || ''}
          onChange={(e) => onUpdate({ inclination_deg: parseFloat(e.target.value) || 0 })}
          placeholder="53.0"
          min="0"
          max="180"
          step="0.1"
          required
          fullWidth
        />
      </div>

      <Input
        label="Mission Duration (years)"
        type="number"
        value={data.mission_duration_years || ''}
        onChange={(e) => onUpdate({ mission_duration_years: parseFloat(e.target.value) || 0 })}
        placeholder="5"
        min="0.1"
        max="50"
        step="0.1"
        required
        fullWidth
      />

      <div className="flex justify-between">
        {!isFirst && (
          <Button type="button" variant="outline" onClick={onPrevious}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
        )}
        <Button type="submit" variant="primary" className="ml-auto">
          Continue
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </form>
  )
}

const LaunchConfigurationStep: React.FC<WizardStepProps> = ({ data, onUpdate, onNext, onPrevious, isFirst, isLast }) => {
  const launchVehicles = [
    'Falcon 9', 'Falcon Heavy', 'Atlas V', 'Delta IV Heavy', 'Ariane 6',
    'Soyuz', 'Long March 3B', 'H3', 'PSLV', 'Electron', 'Neutron', 'New Glenn'
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLast) onNext()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-stellar-white font-inter">
            Launch Vehicle
          </label>
          <select
            value={data.launch_vehicle_type || ''}
            onChange={(e) => onUpdate({ launch_vehicle_type: e.target.value })}
            className="w-full px-4 py-2 text-base rounded-lg border border-neutral-700 bg-neutral-900/50 text-stellar-white placeholder-neutral-500 focus:border-electric-blue focus:ring-2 focus:ring-electric-blue/20 focus:outline-none transition-colors"
            required
          >
            <option value="">Select launch vehicle</option>
            {launchVehicles.map((vehicle) => (
              <option key={vehicle} value={vehicle}>{vehicle}</option>
            ))}
          </select>
        </div>

        <Input
          label="Planned Launch Date"
          type="date"
          value={data.planned_launch_date || ''}
          onChange={(e) => onUpdate({ planned_launch_date: e.target.value })}
          min={new Date().toISOString().split('T')[0]}
          fullWidth
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="collision-avoidance"
            checked={data.collision_avoidance_capability || false}
            onChange={(e) => onUpdate({ collision_avoidance_capability: e.target.checked })}
            className="h-4 w-4 text-electric-blue focus:ring-electric-blue border-neutral-600 rounded bg-neutral-900"
          />
          <label htmlFor="collision-avoidance" className="text-sm font-medium text-stellar-white">
            Collision Avoidance Capability
          </label>
        </div>
        <p className="text-sm text-neutral-400 ml-7">
          Satellites equipped with propulsion systems for collision avoidance maneuvers
        </p>
      </div>

      <div className="flex justify-between">
        {!isFirst && (
          <Button type="button" variant="outline" onClick={onPrevious}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
        )}
        <Button type="submit" variant="primary" className="ml-auto">
          Continue
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </form>
  )
}

const FinancialParametersStep: React.FC<WizardStepProps> = ({ data, onUpdate, onNext, onPrevious, isFirst, isLast }) => {
  const costCategories = [
    'DEVELOPMENT', 'MANUFACTURING', 'LAUNCH', 'OPERATIONS', 
    'INSURANCE', 'DEORBIT', 'REGULATORY'
  ]

  const handleCategoryToggle = (category: string) => {
    const current = data.cost_categories || []
    const updated = current.includes(category)
      ? current.filter(c => c !== category)
      : [...current, category]
    onUpdate({ cost_categories: updated })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLast) onNext()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Total Mission Budget (USD)"
        type="number"
        value={data.total_cost_usd || ''}
        onChange={(e) => onUpdate({ total_cost_usd: parseFloat(e.target.value) || 0 })}
        placeholder="100000000"
        min="0"
        step="1000000"
        fullWidth
      />

      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="insurance-coverage"
            checked={data.insurance_coverage_required || false}
            onChange={(e) => onUpdate({ insurance_coverage_required: e.target.checked })}
            className="h-4 w-4 text-electric-blue focus:ring-electric-blue border-neutral-600 rounded bg-neutral-900"
          />
          <label htmlFor="insurance-coverage" className="text-sm font-medium text-stellar-white">
            Insurance Coverage Required
          </label>
        </div>
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium text-stellar-white font-inter">
          Cost Categories to Include
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {costCategories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`category-${category}`}
                checked={(data.cost_categories || []).includes(category)}
                onChange={() => handleCategoryToggle(category)}
                className="h-4 w-4 text-electric-blue focus:ring-electric-blue border-neutral-600 rounded bg-neutral-900"
              />
              <label htmlFor={`category-${category}`} className="text-sm text-stellar-white capitalize">
                {category.toLowerCase().replace('_', ' ')}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        {!isFirst && (
          <Button type="button" variant="outline" onClick={onPrevious}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
        )}
        <Button type="submit" variant="primary" className="ml-auto">
          Continue
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </form>
  )
}

const SustainabilityStep: React.FC<WizardStepProps> = ({ data, onUpdate, onNext, onPrevious, isFirst, isLast }) => {
  const [newCommitment, setNewCommitment] = useState('')

  const addCommitment = () => {
    if (newCommitment.trim()) {
      const current = data.sustainability_commitments || []
      onUpdate({ sustainability_commitments: [...current, newCommitment.trim()] })
      setNewCommitment('')
    }
  }

  const removeCommitment = (index: number) => {
    const current = data.sustainability_commitments || []
    onUpdate({ sustainability_commitments: current.filter((_, i) => i !== index) })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLast) onNext()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <label className="block text-sm font-medium text-stellar-white font-inter">
          Sustainability Commitments
        </label>
        
        <div className="flex space-x-2">
          <Input
            value={newCommitment}
            onChange={(e) => setNewCommitment(e.target.value)}
            placeholder="Add a sustainability commitment"
            fullWidth
          />
          <Button type="button" onClick={addCommitment} variant="outline">
            Add
          </Button>
        </div>

        {(data.sustainability_commitments || []).length > 0 && (
          <div className="space-y-2">
            {data.sustainability_commitments!.map((commitment, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-neutral-900/50 rounded-lg">
                <span className="text-sm text-stellar-white">{commitment}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeCommitment(index)}
                  className="text-red-400 hover:text-red-300"
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-neutral-900/30 p-4 rounded-lg">
        <h4 className="text-sm font-medium text-stellar-white mb-2">Suggested Commitments:</h4>
        <div className="space-y-1 text-sm text-neutral-400">
          <p>• 25-year deorbit compliance (FCC guidelines)</p>
          <p>• Active debris mitigation measures</p>
          <p>• Collision avoidance coordination</p>
          <p>• End-of-life disposal planning</p>
          <p>• Space traffic management participation</p>
        </div>
      </div>

      <div className="flex justify-between">
        {!isFirst && (
          <Button type="button" variant="outline" onClick={onPrevious}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
        )}
        <Button type="submit" variant="primary" className="ml-auto">
          {isLast ? 'Complete Setup' : 'Continue'}
          {!isLast && <ChevronRight className="h-4 w-4 ml-2" />}
        </Button>
      </div>
    </form>
  )
}

// Main Wizard Component
interface MissionProfileWizardProps {
  onComplete: (data: MissionFormData) => void
  onCancel: () => void
}

export const MissionProfileWizard: React.FC<MissionProfileWizardProps> = ({ onComplete, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<Partial<MissionFormData>>({})

  const steps: WizardStep[] = [
    {
      id: 'basic',
      title: 'Basic Information',
      description: 'Mission name, operator, and objectives',
      component: BasicInformationStep,
      isValid: (data) => Boolean(data.name && data.operator && data.mission_type)
    },
    {
      id: 'technical',
      title: 'Technical Specifications',
      description: 'Satellite configuration and orbital parameters',
      component: TechnicalSpecificationsStep,
      isValid: (data) => Boolean(
        data.total_satellites && 
        data.orbital_altitude_km && 
        data.inclination_deg !== undefined && 
        data.mission_duration_years
      )
    },
    {
      id: 'launch',
      title: 'Launch Configuration',
      description: 'Launch vehicle and deployment timeline',
      component: LaunchConfigurationStep,
      isValid: (data) => Boolean(data.launch_vehicle_type)
    },
    {
      id: 'financial',
      title: 'Financial Parameters',
      description: 'Budget and cost considerations',
      component: FinancialParametersStep,
      isValid: () => true // Optional step
    },
    {
      id: 'sustainability',
      title: 'Sustainability',
      description: 'Environmental and regulatory commitments',
      component: SustainabilityStep,
      isValid: () => true // Optional step
    }
  ]

  const handleUpdate = (updates: Partial<MissionFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }))
  }

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Complete the wizard
      onComplete(formData as MissionFormData)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleStepClick = (stepIndex: number) => {
    // Allow navigation to previous steps or current step
    if (stepIndex <= currentStep) {
      setCurrentStep(stepIndex)
    }
  }

  const currentStepData = steps[currentStep]
  const StepComponent = currentStepData.component

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Header */}
      <Card variant="glass">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-space">Mission Profile Wizard</CardTitle>
              <p className="text-neutral-400 mt-1">
                Step {currentStep + 1} of {steps.length}: {currentStepData.title}
              </p>
            </div>
            <Button variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Step Navigation */}
      <Card variant="glass">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => handleStepClick(index)}
                  className={cn(
                    'flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200',
                    index < currentStep && 'bg-green-600 border-green-600 text-white',
                    index === currentStep && 'bg-electric-blue border-electric-blue text-deep-space-black',
                    index > currentStep && 'border-neutral-600 text-neutral-400 hover:border-neutral-500',
                    index <= currentStep && 'cursor-pointer'
                  )}
                  disabled={index > currentStep}
                >
                  {index < currentStep ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </button>
                
                {index < steps.length - 1 && (
                  <div className={cn(
                    'w-16 h-0.5 mx-2',
                    index < currentStep ? 'bg-green-600' : 'bg-neutral-600'
                  )} />
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 text-center">
            <h3 className="text-lg font-space font-semibold text-stellar-white">
              {currentStepData.title}
            </h3>
            <p className="text-sm text-neutral-400 mt-1">
              {currentStepData.description}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <Card variant="glass">
        <CardContent className="p-6">
          <StepComponent
            data={formData}
            onUpdate={handleUpdate}
            onNext={handleNext}
            onPrevious={handlePrevious}
            isFirst={currentStep === 0}
            isLast={currentStep === steps.length - 1}
          />
        </CardContent>
      </Card>
    </div>
  )
}