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

export type IncotermRule = 'EXW' | 'FOB' | 'CFR' | 'CIF' | 'DAP' | 'DDP';

export interface IncotermResponsibility {
  stage: string;
  sellerPays: boolean;
  buyerPays: boolean;
  riskTransfersAt: string;
}

export function getIncoterm2020Obligations(term: IncotermRule): IncotermResponsibility[] {
  switch (term) {
    case 'EXW':
      return [
        { stage: 'بسته‌بندی صادراتی و بارگیری کارخانه', sellerPays: false, buyerPays: true, riskTransfersAt: 'درب کارخانه سازنده' },
        { stage: 'حمل داخلی تا بندر مبدأ', sellerPays: false, buyerPays: true, riskTransfersAt: 'درب کارخانه سازنده' },
        { stage: 'تشریفات و عوارض گمرکی صادرات در مبدأ', sellerPays: false, buyerPays: true, riskTransfersAt: 'درب کارخانه سازنده' },
        { stage: 'هزینه‌های ترمینال و بارگیری در کشتی (THC)', sellerPays: false, buyerPays: true, riskTransfersAt: 'درب کارخانه سازنده' },
        { stage: 'کرایه حمل بین‌المللی اصلی', sellerPays: false, buyerPays: true, riskTransfersAt: 'درب کارخانه سازنده' },
        { stage: 'بیمه حمل و نقل بین‌المللی', sellerPays: false, buyerPays: true, riskTransfersAt: 'درب کارخانه سازنده' },
        { stage: 'ترخیص گمرکی و حقوق ورودی در مقصد', sellerPays: false, buyerPays: true, riskTransfersAt: 'درب کارخانه سازنده' },
        { stage: 'حمل داخلی تا انبار خریدار', sellerPays: false, buyerPays: true, riskTransfersAt: 'درب کارخانه سازنده' },
      ];
    case 'FOB':
      return [
        { stage: 'بسته‌بندی صادراتی و بارگیری کارخانه', sellerPays: true, buyerPays: false, riskTransfersAt: 'روی عرشه کشتی مبدأ' },
        { stage: 'حمل داخلی تا بندر مبدأ', sellerPays: true, buyerPays: false, riskTransfersAt: 'روی عرشه کشتی مبدأ' },
        { stage: 'تشریفات و عوارض گمرکی صادرات در مبدأ', sellerPays: true, buyerPays: false, riskTransfersAt: 'روی عرشه کشتی مبدأ' },
        { stage: 'هزینه‌های ترمینال و بارگیری در کشتی (THC)', sellerPays: true, buyerPays: false, riskTransfersAt: 'روی عرشه کشتی مبدأ' },
        { stage: 'کرایه حمل بین‌المللی اصلی', sellerPays: false, buyerPays: true, riskTransfersAt: 'روی عرشه کشتی مبدأ' },
        { stage: 'بیمه حمل و نقل بین‌المللی', sellerPays: false, buyerPays: true, riskTransfersAt: 'روی عرشه کشتی مبدأ' },
        { stage: 'ترخیص گمرکی و حقوق ورودی در مقصد', sellerPays: false, buyerPays: true, riskTransfersAt: 'روی عرشه کشتی مبدأ' },
        { stage: 'حمل داخلی تا انبار خریدار', sellerPays: false, buyerPays: true, riskTransfersAt: 'روی عرشه کشتی مبدأ' },
      ];
    case 'CFR':
      return [
        { stage: 'بسته‌بندی صادراتی و بارگیری کارخانه', sellerPays: true, buyerPays: false, riskTransfersAt: 'روی عرشه کشتی مبدأ' },
        { stage: 'حمل داخلی تا بندر مبدأ', sellerPays: true, buyerPays: false, riskTransfersAt: 'روی عرشه کشتی مبدأ' },
        { stage: 'تشریفات و عوارض گمرکی صادرات در مبدأ', sellerPays: true, buyerPays: false, riskTransfersAt: 'روی عرشه کشتی مبدأ' },
        { stage: 'هزینه‌های ترمینال و بارگیری در کشتی (THC)', sellerPays: true, buyerPays: false, riskTransfersAt: 'روی عرشه کشتی مبدأ' },
        { stage: 'کرایه حمل بین‌المللی اصلی', sellerPays: true, buyerPays: false, riskTransfersAt: 'روی عرشه کشتی مبدأ' },
        { stage: 'بیمه حمل و نقل بین‌المللی', sellerPays: false, buyerPays: true, riskTransfersAt: 'روی عرشه کشتی مبدأ' },
        { stage: 'ترخیص گمرکی و حقوق ورودی در مقصد', sellerPays: false, buyerPays: true, riskTransfersAt: 'روی عرشه کشتی مبدأ' },
        { stage: 'حمل داخلی تا انبار خریدار', sellerPays: false, buyerPays: true, riskTransfersAt: 'روی عرشه کشتی مبدأ' },
      ];
    case 'CIF':
      return [
        { stage: 'بسته‌بندی صادراتی و بارگیری کارخانه', sellerPays: true, buyerPays: false, riskTransfersAt: 'روی عرشه کشتی مبدأ' },
        { stage: 'حمل داخلی تا بندر مبدأ', sellerPays: true, buyerPays: false, riskTransfersAt: 'روی عرشه کشتی مبدأ' },
        { stage: 'تشریفات و عوارض گمرکی صادرات در مبدأ', sellerPays: true, buyerPays: false, riskTransfersAt: 'روی عرشه کشتی مبدأ' },
        { stage: 'هزینه‌های ترمینال و بارگیری در کشتی (THC)', sellerPays: true, buyerPays: false, riskTransfersAt: 'روی عرشه کشتی مبدأ' },
        { stage: 'کرایه حمل بین‌المللی اصلی', sellerPays: true, buyerPays: false, riskTransfersAt: 'روی عرشه کشتی مبدأ' },
        { stage: 'بیمه حمل و نقل بین‌المللی', sellerPays: true, buyerPays: false, riskTransfersAt: 'روی عرشه کشتی مبدأ' },
        { stage: 'ترخیص گمرکی و حقوق ورودی در مقصد', sellerPays: false, buyerPays: true, riskTransfersAt: 'اسکله بندر مقصد' },
        { stage: 'حمل داخلی تا انبار خریدار', sellerPays: false, buyerPays: true, riskTransfersAt: 'اسکله بندر مقصد' },
      ];
    case 'DAP':
      return [
        { stage: 'بسته‌بندی صادراتی و بارگیری کارخانه', sellerPays: true, buyerPays: false, riskTransfersAt: 'محل تحویل در مقصد آماده تخلیه' },
        { stage: 'حمل داخلی تا بندر مبدأ', sellerPays: true, buyerPays: false, riskTransfersAt: 'محل تحویل در مقصد آماده تخلیه' },
        { stage: 'تشریفات و عوارض گمرکی صادرات در مبدأ', sellerPays: true, buyerPays: false, riskTransfersAt: 'محل تحویل در مقصد آماده تخلیه' },
        { stage: 'کرایه حمل بین‌المللی اصلی', sellerPays: true, buyerPays: false, riskTransfersAt: 'محل تحویل در مقصد آماده تخلیه' },
        { stage: 'بیمه حمل و نقل بین‌المللی', sellerPays: true, buyerPays: false, riskTransfersAt: 'محل تحویل در مقصد آماده تخلیه' },
        { stage: 'ترخیص گمرکی و حقوق ورودی در مقصد', sellerPays: false, buyerPays: true, riskTransfersAt: 'محل تحویل در مقصد آماده تخلیه' },
        { stage: 'حمل داخلی تا انبار خریدار', sellerPays: true, buyerPays: false, riskTransfersAt: 'محل تحویل در مقصد آماده تخلیه' },
      ];
    case 'DDP':
      return [
        { stage: 'بسته‌بندی صادراتی و بارگیری کارخانه', sellerPays: true, buyerPays: false, riskTransfersAt: 'انبار نهایی خریدار' },
        { stage: 'حمل داخلی تا بندر مبدأ', sellerPays: true, buyerPays: false, riskTransfersAt: 'انبار نهایی خریدار' },
        { stage: 'تشریفات و عوارض صادرات در مبدأ', sellerPays: true, buyerPays: false, riskTransfersAt: 'انبار نهایی خریدار' },
        { stage: 'کرایه حمل بین‌المللی اصلی', sellerPays: true, buyerPays: false, riskTransfersAt: 'انبار نهایی خریدار' },
        { stage: 'بیمه حمل و نقل بین‌المللی', sellerPays: true, buyerPays: false, riskTransfersAt: 'انبار نهایی خریدار' },
        { stage: 'ترخیص گمرکی و حقوق ورودی در مقصد', sellerPays: true, buyerPays: false, riskTransfersAt: 'انبار نهایی خریدار' },
        { stage: 'حمل داخلی تا انبار خریدار', sellerPays: true, buyerPays: false, riskTransfersAt: 'انبار نهایی خریدار' },
      ];
    default:
      return [];
  }
}

export interface FraudCheckSignals {
  hasPhysicalFactoryVideo: boolean;
  bankAccountMatchesLegalName: boolean;
  hasCustomsExportRecords: boolean;
  domainAgeYears: number;
  claimedAgeYears: number;
  hasSgsOrTuvAudit: boolean;
  catalogPhotosOriginal: boolean;
}

export interface FraudCheckResult {
  safetyScore: number; // 0 to 100
  isHighRisk: boolean;
  classification: 'سازنده واقعی احراز شده' | 'واسطه تجاری معتبر' | 'پرریسک / نیازمند ممیزی حضوری فوری';
  warningFlags: string[];
  passedTests: string[];
}

export function evaluateSupplierAuthenticity(signals: FraudCheckSignals): FraudCheckResult {
  let score = 30; // base score
  const warningFlags: string[] = [];
  const passedTests: string[] = [];

  if (signals.bankAccountMatchesLegalName) {
    score += 20;
    passedTests.push('تطبیق ۱۰۰٪ نام صاحب حساب بانکی با نام ثبتی در اداره شرکت‌ها');
  } else {
    warningFlags.push('هشدار مغایرت حساب: نام دارنده حساب با نام رسمی شرکت متفاوت است (ریسک حساب واسط)');
  }

  if (signals.hasPhysicalFactoryVideo) {
    score += 15;
    passedTests.push('ویدیو و تصاویر زنده از خطوط تولید CNC و سالن مونتاژ');
  } else {
    warningFlags.push('عدم ثبت ویدیوی زنده از سالن تولید و ماشین‌آلات');
  }

  if (signals.hasCustomsExportRecords) {
    score += 15;
    passedTests.push('ثبت بارنامه‌های رسمی گمرکی خروج کانتینر در ۳ سال اخیر');
  } else {
    warningFlags.push('عدم مشاهده سوابق کوتاژ صادراتی در داده‌های پایانه گمرک');
  }

  if (signals.hasSgsOrTuvAudit) {
    score += 15;
    passedTests.push('ممیزی مستقل شخص ثالث توسط SGS یا TÜV');
  } else {
    warningFlags.push('عدم انجام ممیزی میدانی توسط بازرس مستقل بین‌المللی');
  }

  if (signals.catalogPhotosOriginal) {
    score += 5;
    passedTests.push('اصالت تصاویر کاتالوگ (عدم وجود تصاویر کپی‌شده در اینترنت)');
  } else {
    warningFlags.push('تصاویر کاتالوگ مشابه وب‌سایت‌های دیگر یافت شده است');
  }

  // Check age discrepancy
  if (signals.claimedAgeYears - signals.domainAgeYears > 10 && signals.domainAgeYears < 1) {
    score -= 15;
    warningFlags.push('هشدار دامنه وب‌سایت: ادعای تأسیس قدیمی اما دامنه کمتر از یک سال پیش ثبت شده');
  }

  const finalScore = Math.max(0, Math.min(100, score));

  let classification: FraudCheckResult['classification'] = 'پرریسک / نیازمند ممیزی حضوری فوری';
  if (finalScore >= 80 && signals.hasPhysicalFactoryVideo) {
    classification = 'سازنده واقعی احراز شده';
  } else if (finalScore >= 65) {
    classification = 'واسطه تجاری معتبر';
  }

  return {
    safetyScore: finalScore,
    isHighRisk: finalScore < 65,
    classification,
    warningFlags,
    passedTests,
  };
}

export interface ProformaInvoiceInput {
  proformaNumber: string;
  supplierName: string;
  country: string;
  currency: 'USD' | 'EUR' | 'CNY' | 'AED';
  rawUnitPrice: number;
  quantity: number;
  quotedIncoterm: 'EXW' | 'FOB' | 'CFR' | 'CIF' | 'DAP' | 'DDP';
  portOfLoading?: string;
  freightEstimateUsd?: number;
  insuranceEstimateUsd?: number;
  tariffPercent: number;
  leadTimeDays: number;
  paymentTerms: string;
  benchmarkPriceUsd?: number;
}

export interface NormalizedProformaResult {
  normalizedUnitPriceCifUsd: number;
  landedCostEstimatedPerUnitUsd: number;
  totalOrderLandedUsd: number;
  paymentRiskGrade: 'کم‌ریسک (استاندارد بازرگانی)' | 'ریسک متعادل (نیازمند بازرسی)' | 'پرریسک (پیش‌پرداخت بالا)';
  incotermAdjustmentExplanation: string;
  savingsVsBenchmarkPercent: number;
}

export function normalizeProformaInvoice(input: ProformaInvoiceInput): NormalizedProformaResult {
  // Convert currency to USD if needed (approx FX rates for standard normalization)
  let unitPriceUsd = input.rawUnitPrice;
  if (input.currency === 'EUR') unitPriceUsd *= 1.08;
  if (input.currency === 'CNY') unitPriceUsd /= 7.25;
  if (input.currency === 'AED') unitPriceUsd /= 3.67;

  const qty = Math.max(1, input.quantity);
  const freightTotal = input.freightEstimateUsd ?? (input.quotedIncoterm === 'CIF' ? 0 : 1600);
  const insuranceTotal = input.insuranceEstimateUsd ?? 120;
  const freightPerUnit = freightTotal / qty;
  const insurancePerUnit = insuranceTotal / qty;

  let cifUnitUsd = unitPriceUsd;
  let explanation = '';

  switch (input.quotedIncoterm) {
    case 'EXW':
      cifUnitUsd = unitPriceUsd + freightPerUnit + insurancePerUnit + 0.15; // + inland transport
      explanation = 'مبنای قیمت درب کارخانه است؛ هزینه حمل داخلی مبدأ ($0.15)، کرایه دریایی و بیمه تا بندرعباس اضافه شد.';
      break;
    case 'FOB':
      cifUnitUsd = unitPriceUsd + freightPerUnit + insurancePerUnit;
      explanation = 'هزینه‌های بارگیری تا کشتی در مبدأ لحاظ شده؛ کرایه حمل دریایی و بیمه تا بندر مقصد اضافه شد.';
      break;
    case 'CFR':
      cifUnitUsd = unitPriceUsd + insurancePerUnit;
      explanation = 'کرایه دریایی لحاظ شده؛ تنها حق بیمه دریایی استاندارد اضافه شد.';
      break;
    case 'CIF':
      cifUnitUsd = unitPriceUsd;
      explanation = 'قیمت شامل کالا، کرایه حمل دریایی و بیمه تا بندر مقصد (Bandar Abbas) می‌باشد.';
      break;
    default:
      cifUnitUsd = unitPriceUsd;
      explanation = 'تحویل در مقصد یا محل توافق‌شده.';
  }

  // Duties calculated on CIF
  const dutiesPerUnit = cifUnitUsd * (input.tariffPercent / 100);
  const portClearancePerUnit = 0.08; // port handling & customs brokerage
  const inspectionPerUnit = 0.03; // SGS pre-shipment fee share
  const fxBufferPerUnit = cifUnitUsd * 0.02; // 2% FX buffer

  const landedCostEstimatedPerUnitUsd = Number(
    (cifUnitUsd + dutiesPerUnit + portClearancePerUnit + inspectionPerUnit + fxBufferPerUnit).toFixed(2)
  );

  const totalOrderLandedUsd = Math.round(landedCostEstimatedPerUnitUsd * qty);

  // Payment risk grading
  const lowerTerms = input.paymentTerms.toLowerCase();
  let paymentRiskGrade: NormalizedProformaResult['paymentRiskGrade'] = 'ریسک متعادل (نیازمند بازرسی)';
  if (lowerTerms.includes('100% advance') || lowerTerms.includes('۱۰۰٪ پیش‌پرداخت')) {
    paymentRiskGrade = 'پرریسک (پیش‌پرداخت بالا)';
  } else if (
    lowerTerms.includes('l/c') ||
    lowerTerms.includes('اعتبار اسنادی') ||
    lowerTerms.includes('پس از بازرسی') ||
    lowerTerms.includes('sgs')
  ) {
    paymentRiskGrade = 'کم‌ریسک (استاندارد بازرگانی)';
  }

  const benchmark = input.benchmarkPriceUsd || 3.5;
  const savingsVsBenchmarkPercent = Number(
    (((benchmark - landedCostEstimatedPerUnitUsd) / benchmark) * 100).toFixed(1)
  );

  return {
    normalizedUnitPriceCifUsd: Number(cifUnitUsd.toFixed(2)),
    landedCostEstimatedPerUnitUsd,
    totalOrderLandedUsd,
    paymentRiskGrade,
    incotermAdjustmentExplanation: explanation,
    savingsVsBenchmarkPercent,
  };
}

