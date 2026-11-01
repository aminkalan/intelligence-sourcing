/**
 * Type definitions for SourceIQ B2B Platform
 */

export type PageId =
  | 'overview'
  | 'product-definition'
  | 'suppliers'
  | 'trust-score'
  | 'comparison'
  | 'rfq'
  | 'alternative-markets'
  | 'market-watch';

export type SupplierType = 'سازنده مستقیم' | 'عمده‌فروش رسمی' | 'کارگزار و تجاری';

export interface Supplier {
  id: string;
  legalName: string;
  tradeName: string;
  country: string;
  city: string;
  countryCode: string;
  flag: string;
  type: SupplierType;
  foundedYear: number;
  capacityMonthly: string;
  moq: number;
  leadTimeDays: number;
  exportMarkets: string[];
  incoterms: string[];
  paymentTerms: string;
  certifications: string[];
  trustScore: number;
  onTimeDeliveryRate: number; // e.g. 96.4%
  exportHistoryAnnual: { year: number; volumeMUsd: number }[];
  complaintRate: number; // e.g. 0.4%
  verifiedStatus: 'تأیید کامل' | 'ممیزی حضوری' | 'در حال ارزیابی';
  description: string;
  matchScore?: number;
  factoryAudit?: FactoryAuthenticityAudit;
}

export interface FactoryAuthenticityAudit {
  isVerifiedManufacturer: boolean;
  productionLineVerified: boolean;
  registeredCapitalUsd: number;
  operationalSquareMeters: number;
  workerHeadcount: number;
  factoryEquipmentList: string[];
  utilityBillVerified: boolean;
  bankBeneficiaryMatches: boolean;
  domainRegistrationDate: string;
  independentAuditAgency: string;
  riskFlags: string[];
}

export interface ComtradeCommodityFlow {
  hsCode: string;
  productNameFa: string;
  globalExportVolumeBillionUsd: number;
  topExportingCountries: {
    country: string;
    code: string;
    flag: string;
    sharePercent: number;
    avgExportUnitPriceUsd: number;
    growthRateYoY: number;
    primaryIncoterm: string;
  }[];
  iranImportSharePercent: number;
  recommendedTargetCountries: string[];
}

export interface VerificationLayer {
  id: string;
  title: string;
  score: number; // 0-100
  weight: number;
  status: 'verified' | 'warning' | 'pending';
  statusLabel: string;
  evidence: string;
  auditDetails: string;
}

export interface LandedCostOffer {
  supplierId: string;
  supplierName: string;
  country: string;
  countryCode: string;
  flag: string;
  unitPrice: number;
  freight: number;
  insurance: number;
  dutiesPercent: number;
  clearance: number;
  inspection: number;
  packaging: number;
  leadTimeWeeks: number;
  paymentTerms: string;
  fxRiskBufferPercent: number;
  isBest?: boolean;
  scoreBreakdown: {
    credibilityScore: number;
    qualityScore: number;
    capacityScore: number;
    leadTimeScore: number;
    paymentScore: number;
    countryRiskScore: number;
    responsivenessScore: number;
  };
}

export interface RfqItem {
  id: string;
  rfqNumber: string;
  title: string;
  productName: string;
  hsCode: string;
  quantity: number;
  unit: string;
  createdDate: string;
  deadlineDate: string;
  deadlineRemainingDays: number;
  status: 'در حال استعلام' | 'تکمیل پاسخ‌ها' | 'نهایی‌شده' | 'منقضی‌شده';
  invitedCount: number;
  respondedCount: number;
  invitedSuppliers: {
    supplierId: string;
    supplierName: string;
    country: string;
    flag: string;
    status: 'پاسخ داده شد' | 'مشاهده شد' | 'در انتظار پاسخ';
    unitQuote?: number;
    leadTimeDays?: number;
    quoteDate?: string;
  }[];
}

export interface AlternativeCountry {
  id: string;
  name: string;
  code: string;
  flag: string;
  approxExportPrice: number;
  priceTrend24m: number[]; // 6 points
  annualExportVolumeMUsd: number;
  freightEstUsd: number;
  transitDays: number;
  tariffStatus: 'تعرفه ترجیحی' | 'تعرفه استاندارد' | 'ریسک تغییر تعرفه';
  sanctionRisk: 'پایین' | 'متوسط' | 'تحت نظر';
  politicalRisk: 'کم‌ریسک' | 'متوسط' | 'بالا';
  logisticsReliability: 'عالی' | 'خوب' | 'متوسط';
  capacityFit: 'بالا' | 'بسیار بالا' | 'متوسط';
  estimatedSavingPct: number; // vs China base
  riskProfileSummary: {
    geopolitical: string;
    fxVolatility: string;
    transitChokepoints: string;
    tradeTreaty: string;
    suggestedStrategy: string;
  };
}

export interface MarketAlert {
  id: string;
  date: string;
  type:
    | 'new-supplier'
    | 'price'
    | 'capacity'
    | 'lead-time'
    | 'freight'
    | 'fx'
    | 'tariff'
    | 'origin-disruption'
    | 'alternative-market'
    | 'supplier-rating';
  typeLabel: string;
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'info';
  supplierName?: string;
  country?: string;
  savingPct?: number;
  actionRequired?: boolean;
  actionType?: 'review-supplier' | 'request-sample' | 'adjust-orders';
  relatedSupplierId?: string;
}

export interface MonitoredProduct {
  id: string;
  name: string;
  hsCode: string;
  activeSuppliers: number;
  monthlyImportVolume: string;
  currentAvgPrice: number;
  priceChangePct: number; // e.g. -3.4%
  priceHistory: number[];
  riskLevel: 'پایین' | 'متوسط' | 'بالا';
}

export interface CurrencyRate {
  id: string;
  code: string;
  nameFa: string;
  category: 'سامانه نیما' | 'مرکز مبادله (تالار دوم)' | 'بازار آزاد' | 'منطقه‌ای';
  rateToman: number;
  change24hPct: number;
  high24h: number;
  low24h: number;
  sparkline: number[];
  updatedAt: string;
}

export interface FreightRouteIndex {
  id: string;
  routeNameFa: string;
  origin: string;
  destination: string;
  transportType: 'دریایی ۴۰ فوت' | 'دریایی ۲۰ فوت' | 'جاده‌ای ترانزیت (تیر)' | 'هوایی فله';
  rateUsd: number;
  changeWeeklyPct: number;
  transitDays: number;
  congestionDays: number;
  surchargeUsd: number;
  statusLabel: 'روان و فعال' | 'افزایش تقاضا' | 'هشدار هزینه جنگی' | 'تأخیر جاده‌ای';
}

export interface RawMaterialIndex {
  id: string;
  nameFa: string;
  symbol: string;
  market: 'LME' | 'SHFE' | 'SMM' | 'Iran IME';
  priceUsdPerTon: number;
  unit: string;
  changePct: number;
  sparkline: number[];
  impactOnComponents: string;
}

export interface PortLogisticsStatus {
  id: string;
  portNameFa: string;
  portCode: string;
  country: string;
  flag: string;
  avgDwellDays: number;
  clearanceEfficiencyPct: number;
  congestionStatus: 'عادی و روان' | 'ترافیک متوسط' | 'تراکم و کندی';
  statusColor: 'green' | 'orange' | 'red';
  recentNote: string;
}

export interface RiskCorridorIndex {
  id: string;
  corridorNameFa: string;
  geographicZone: string;
  riskScore: number; // 0 - 100
  riskLevel: 'پایین (سبز)' | 'متوسط (زرد)' | 'هشدار بالا (نارنجی)' | 'بحرانی (قرمز)';
  securityStatus: string;
  financialChannelStatus: string;
  recommendedAction: string;
}

export type MarketShockType = 'none' | 'freight_spike' | 'fx_spike' | 'port_congestion';

export interface MarketDataState {
  currencies: CurrencyRate[];
  freightRoutes: FreightRouteIndex[];
  rawMaterials: RawMaterialIndex[];
  portStatuses: PortLogisticsStatus[];
  riskCorridors: RiskCorridorIndex[];
  lastUpdated: Date;
  activeShock: MarketShockType;
  isAutoSyncActive: boolean;
}

