/**
 * Pure calculation logic for Landed Cost and Supplier Weighted Ranking
 */

export interface LandedCostInput {
  unitPrice: number;
  quantity: number;
  freight: number;
  insurance: number;
  dutiesPercent: number; // e.g. 15%
  clearance: number;
  inspection: number;
  packaging: number;
  fxRiskBufferPercent?: number; // e.g. 2%
}

export interface LandedCostResult {
  goodsTotal: number;
  freightTotal: number;
  insuranceTotal: number;
  dutiesTotal: number;
  clearanceTotal: number;
  inspectionTotal: number;
  packagingTotal: number;
  fxRiskTotal: number;
  totalCost: number;
  landedCostPerUnit: number;
}

export function computeLandedCost(input: LandedCostInput): LandedCostResult {
  const units = Math.max(1, input.quantity);
  const goodsTotal = input.unitPrice * units;
  const freightTotal = input.freight;
  const insuranceTotal = input.insurance;
  
  // Customs duty usually applied on CIF value (goods + freight + insurance)
  const cifValue = goodsTotal + freightTotal + insuranceTotal;
  const dutiesTotal = cifValue * ((input.dutiesPercent || 0) / 100);
  
  const clearanceTotal = input.clearance;
  const inspectionTotal = input.inspection;
  const packagingTotal = input.packaging;
  const fxRiskTotal = goodsTotal * ((input.fxRiskBufferPercent || 0) / 100);

  const totalCost =
    goodsTotal +
    freightTotal +
    insuranceTotal +
    dutiesTotal +
    clearanceTotal +
    inspectionTotal +
    packagingTotal +
    fxRiskTotal;

  const landedCostPerUnit = totalCost / units;

  return {
    goodsTotal,
    freightTotal,
    insuranceTotal,
    dutiesTotal,
    clearanceTotal,
    inspectionTotal,
    packagingTotal,
    fxRiskTotal,
    totalCost,
    landedCostPerUnit,
  };
}

export interface SupplierRankingWeights {
  landedCost: number; // default 30
  credibility: number; // default 20
  quality: number; // default 15
  capacity: number; // default 10
  leadTime: number; // default 10
  payment: number; // default 5
  countryRisk: number; // default 5
  responsiveness: number; // default 5
}

export const DEFAULT_WEIGHTS: SupplierRankingWeights = {
  landedCost: 30,
  credibility: 20,
  quality: 15,
  capacity: 10,
  leadTime: 10,
  payment: 5,
  countryRisk: 5,
  responsiveness: 5,
};

export interface SupplierMetricScores {
  // Each metric normalized 0 to 100
  landedCostScore: number; // Higher is better (e.g. lower cost -> higher score)
  credibilityScore: number;
  qualityScore: number;
  capacityScore: number;
  leadTimeScore: number;
  paymentScore: number;
  countryRiskScore: number;
  responsivenessScore: number;
}

export function computeWeightedRanking(
  scores: SupplierMetricScores,
  weights: SupplierRankingWeights = DEFAULT_WEIGHTS
): number {
  const totalWeight =
    weights.landedCost +
    weights.credibility +
    weights.quality +
    weights.capacity +
    weights.leadTime +
    weights.payment +
    weights.countryRisk +
    weights.responsiveness;

  if (totalWeight <= 0) return 0;

  const weightedSum =
    scores.landedCostScore * weights.landedCost +
    scores.credibilityScore * weights.credibility +
    scores.qualityScore * weights.quality +
    scores.capacityScore * weights.capacity +
    scores.leadTimeScore * weights.leadTime +
    scores.paymentScore * weights.payment +
    scores.countryRiskScore * weights.countryRisk +
    scores.responsivenessScore * weights.responsiveness;

  return Number((weightedSum / totalWeight).toFixed(1));
}
