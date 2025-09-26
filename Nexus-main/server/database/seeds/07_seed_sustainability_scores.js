const faker = require('faker');

const entityTypes = ['SATELLITE', 'CONSTELLATION', 'MISSION', 'OPERATOR', 'ORBITAL_SHELL'];
const certificationLevels = ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'NONE'];
const scoreTrends = ['IMPROVING', 'STABLE', 'DECLINING', 'NEW'];

const sustainabilityProfiles = [
  {
    entity_name: 'Starlink Constellation',
    entity_type: 'CONSTELLATION',
    overall_score: 72.5,
    environmental_impact_score: 68.0,
    debris_mitigation_score: 85.0,
    end_of_life_planning_score: 90.0,
    collision_avoidance_score: 78.0,
    regulatory_compliance_score: 65.0,
    innovation_sustainability_score: 82.0,
    certification_level: 'SILVER',
    score_trend: 'IMPROVING'
  },
  {
    entity_name: 'OneWeb Constellation',
    entity_type: 'CONSTELLATION',
    overall_score: 84.2,
    environmental_impact_score: 88.0,
    debris_mitigation_score: 92.0,
    end_of_life_planning_score: 95.0,
    collision_avoidance_score: 85.0,
    regulatory_compliance_score: 78.0,
    innovation_sustainability_score: 87.0,
    certification_level: 'GOLD',
    score_trend: 'STABLE'
  },
  {
    entity_name: 'Planet Labs Fleet',
    entity_type: 'CONSTELLATION',
    overall_score: 79.8,
    environmental_impact_score: 82.0,
    debris_mitigation_score: 88.0,
    end_of_life_planning_score: 85.0,
    collision_avoidance_score: 75.0,
    regulatory_compliance_score: 72.0,
    innovation_sustainability_score: 77.0,
    certification_level: 'SILVER',
    score_trend: 'IMPROVING'
  },
  {
    entity_name: 'SpaceX',
    entity_type: 'OPERATOR',
    overall_score: 76.3,
    environmental_impact_score: 70.0,
    debris_mitigation_score: 88.0,
    end_of_life_planning_score: 92.0,
    collision_avoidance_score: 82.0,
    regulatory_compliance_score: 68.0,
    innovation_sustainability_score: 85.0,
    certification_level: 'SILVER',
    score_trend: 'IMPROVING'
  },
  {
    entity_name: 'OneWeb',
    entity_type: 'OPERATOR',
    overall_score: 86.7,
    environmental_impact_score: 90.0,
    debris_mitigation_score: 94.0,
    end_of_life_planning_score: 96.0,
    collision_avoidance_score: 88.0,
    regulatory_compliance_score: 82.0,
    innovation_sustainability_score: 90.0,
    certification_level: 'GOLD',
    score_trend: 'STABLE'
  },
  {
    entity_name: 'ESA',
    entity_type: 'OPERATOR',
    overall_score: 91.2,
    environmental_impact_score: 95.0,
    debris_mitigation_score: 98.0,
    end_of_life_planning_score: 97.0,
    collision_avoidance_score: 92.0,
    regulatory_compliance_score: 88.0,
    innovation_sustainability_score: 95.0,
    certification_level: 'PLATINUM',
    score_trend: 'STABLE'
  }
];

function generateSustainabilityScore(index) {
  const entityType = faker.random.arrayElement(entityTypes);
  const overallScore = faker.datatype.float({ min: 45, max: 95, precision: 0.1 });
  
  // Generate component scores that are correlated with overall score
  const variance = 15;
  const environmentalScore = Math.max(0, Math.min(100, overallScore + faker.datatype.float({ min: -variance, max: variance, precision: 0.1 })));
  const debrisMitigationScore = Math.max(0, Math.min(100, overallScore + faker.datatype.float({ min: -variance, max: variance, precision: 0.1 })));
  const endOfLifeScore = Math.max(0, Math.min(100, overallScore + faker.datatype.float({ min: -variance, max: variance, precision: 0.1 })));
  const collisionAvoidanceScore = Math.max(0, Math.min(100, overallScore + faker.datatype.float({ min: -variance, max: variance, precision: 0.1 })));
  const regulatoryComplianceScore = Math.max(0, Math.min(100, overallScore + faker.datatype.float({ min: -variance, max: variance, precision: 0.1 })));
  const innovationScore = Math.max(0, Math.min(100, overallScore + faker.datatype.float({ min: -variance, max: variance, precision: 0.1 })));
  
  // Determine certification level based on overall score
  let certificationLevel;
  if (overallScore >= 90) certificationLevel = 'PLATINUM';
  else if (overallScore >= 80) certificationLevel = 'GOLD';
  else if (overallScore >= 70) certificationLevel = 'SILVER';
  else if (overallScore >= 60) certificationLevel = 'BRONZE';
  else certificationLevel = 'NONE';
  
  const assessmentDate = faker.date.between('2023-01-01', '2024-12-31');
  const nextAssessmentDue = new Date(assessmentDate);
  nextAssessmentDue.setFullYear(nextAssessmentDue.getFullYear() + 1);
  
  return {
    entity_type: entityType,
    entity_id: `${entityType.toLowerCase()}_${String(index).padStart(4, '0')}`,
    entity_name: `${faker.company.companyName()} ${entityType.toLowerCase()}`,
    overall_score: overallScore,
    environmental_impact_score: environmentalScore,
    debris_mitigation_score: debrisMitigationScore,
    end_of_life_planning_score: endOfLifeScore,
    collision_avoidance_score: collisionAvoidanceScore,
    regulatory_compliance_score: regulatoryComplianceScore,
    innovation_sustainability_score: innovationScore,
    scoring_methodology_version: '2.1',
    assessment_date: assessmentDate,
    assessor_organization: faker.random.arrayElement(['Space Sustainability Rating', 'ESA Clean Space', 'IADC Guidelines', 'UN COPUOS']),
    certification_level: certificationLevel,
    improvement_recommendations: [
      'Enhance debris mitigation protocols',
      'Improve end-of-life disposal planning',
      'Increase collision avoidance capabilities'
    ].slice(0, faker.datatype.number({ min: 1, max: 3 })),
    compliance_gaps: overallScore < 70 ? ['Regulatory filing delays', 'Insufficient debris tracking'] : [],
    next_assessment_due: nextAssessmentDue,
    public_disclosure_approved: faker.datatype.boolean(),
    score_trend: faker.random.arrayElement(scoreTrends),
    benchmark_percentile: faker.datatype.float({ min: 10, max: 95, precision: 0.1 }),
    supporting_documentation: {
      mission_design_document: faker.datatype.boolean(),
      debris_mitigation_plan: faker.datatype.boolean(),
      end_of_life_disposal_plan: faker.datatype.boolean(),
      collision_avoidance_procedures: faker.datatype.boolean()
    }
  };
}

async function seed(client) {
  try {
    // Clear existing data
    await client.query('TRUNCATE TABLE sustainability_scores RESTART IDENTITY CASCADE');
    
    // Insert predefined sustainability profiles
    for (const profile of sustainabilityProfiles) {
      const query = `
        INSERT INTO sustainability_scores (
          entity_type, entity_id, entity_name, overall_score, environmental_impact_score,
          debris_mitigation_score, end_of_life_planning_score, collision_avoidance_score,
          regulatory_compliance_score, innovation_sustainability_score, scoring_methodology_version,
          assessment_date, assessor_organization, certification_level, improvement_recommendations,
          compliance_gaps, next_assessment_due, public_disclosure_approved, score_trend,
          benchmark_percentile, supporting_documentation
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21
        )
      `;
      
      const entityId = `${profile.entity_type.toLowerCase()}_${profile.entity_name.toLowerCase().replace(/\s+/g, '_')}`;
      const assessmentDate = faker.date.between('2023-01-01', '2024-12-31');
      const nextAssessmentDue = new Date(assessmentDate);
      nextAssessmentDue.setFullYear(nextAssessmentDue.getFullYear() + 1);
      
      await client.query(query, [
        profile.entity_type,
        entityId,
        profile.entity_name,
        profile.overall_score,
        profile.environmental_impact_score,
        profile.debris_mitigation_score,
        profile.end_of_life_planning_score,
        profile.collision_avoidance_score,
        profile.regulatory_compliance_score,
        profile.innovation_sustainability_score,
        '2.1',
        assessmentDate,
        'Space Sustainability Rating',
        profile.certification_level,
        ['Enhance operational transparency', 'Improve data sharing protocols'],
        [],
        nextAssessmentDue,
        true,
        profile.score_trend,
        faker.datatype.float({ min: 60, max: 95, precision: 0.1 }),
        JSON.stringify({
          mission_design_document: true,
          debris_mitigation_plan: true,
          end_of_life_disposal_plan: true,
          collision_avoidance_procedures: true
        })
      ]);
    }
    
    // Generate additional random sustainability scores
    const additionalScores = [];
    for (let i = 0; i < 50; i++) {
      additionalScores.push(generateSustainabilityScore(i));
    }
    
    // Insert additional scores
    for (const score of additionalScores) {
      const query = `
        INSERT INTO sustainability_scores (
          entity_type, entity_id, entity_name, overall_score, environmental_impact_score,
          debris_mitigation_score, end_of_life_planning_score, collision_avoidance_score,
          regulatory_compliance_score, innovation_sustainability_score, scoring_methodology_version,
          assessment_date, assessor_organization, certification_level, improvement_recommendations,
          compliance_gaps, next_assessment_due, public_disclosure_approved, score_trend,
          benchmark_percentile, supporting_documentation
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21
        )
      `;
      
      await client.query(query, [
        score.entity_type,
        score.entity_id,
        score.entity_name,
        score.overall_score,
        score.environmental_impact_score,
        score.debris_mitigation_score,
        score.end_of_life_planning_score,
        score.collision_avoidance_score,
        score.regulatory_compliance_score,
        score.innovation_sustainability_score,
        score.scoring_methodology_version,
        score.assessment_date,
        score.assessor_organization,
        score.certification_level,
        score.improvement_recommendations,
        score.compliance_gaps,
        score.next_assessment_due,
        score.public_disclosure_approved,
        score.score_trend,
        score.benchmark_percentile,
        JSON.stringify(score.supporting_documentation)
      ]);
    }
    
    console.log(`   ✓ Inserted ${sustainabilityProfiles.length + additionalScores.length} sustainability scores`);
    
  } catch (error) {
    console.error('Error seeding sustainability scores:', error);
    throw error;
  }
}

module.exports = { seed };