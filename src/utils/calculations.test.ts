import test from 'node:test';
import assert from 'node:assert/strict';
import {
  computeLandedCost,
  computeWeightedRanking,
  DEFAULT_WEIGHTS,
  getIncoterm2020Obligations,
  evaluateSupplierAuthenticity,
  normalizeProformaInvoice,
} from './calculations';
import { toPersianDigits, formatPersianCurrency, formatPersianPercent } from './persian';

test('computeLandedCost computes accurate total and per unit cost', () => {
  const input = {
    unitPrice: 10,
    quantity: 1000,
    freight: 1500,
    insurance: 100,
    dutiesPercent: 10, // 10% of CIF (10000 + 1500 + 100) = 1160
    clearance: 300,
    inspection: 200,
    packaging: 200,
    fxRiskBufferPercent: 2, // 2% of 10000 = 200
  };

  const result = computeLandedCost(input);
  assert.equal(result.goodsTotal, 10000);
  assert.equal(result.freightTotal, 1500);
  assert.equal(result.insuranceTotal, 100);
  assert.equal(result.dutiesTotal, 1160);
  assert.equal(result.fxRiskTotal, 200);
  // Total = 10000 + 1500 + 100 + 1160 + 300 + 200 + 200 + 200 = 13660
  assert.equal(result.totalCost, 13660);
  assert.equal(result.landedCostPerUnit, 13.66);
});

test('computeWeightedRanking accurately computes normalized weighted score', () => {
  const scores = {
    landedCostScore: 90,
    credibilityScore: 80,
    qualityScore: 85,
    capacityScore: 90,
    leadTimeScore: 70,
    paymentScore: 80,
    countryRiskScore: 75,
    responsivenessScore: 95,
  };

  const result = computeWeightedRanking(scores, DEFAULT_WEIGHTS);
  // Total weight = 30 + 20 + 15 + 10 + 10 + 5 + 5 + 5 = 100
  // Sum = 90*30 + 80*20 + 85*15 + 90*10 + 70*10 + 80*5 + 75*5 + 95*5
  // = 2700 + 1600 + 1275 + 900 + 700 + 400 + 375 + 475 = 8425 / 100 = 84.3 (approx)
  assert.equal(result, 84.3);
});

test('Persian formatting transforms Latin digits to Persian glyphs', () => {
  assert.equal(toPersianDigits(12345), '۱۲۳۴۵');
  assert.equal(toPersianDigits('HS 8483.40'), 'HS ۸۴۸۳.۴۰');
  assert.equal(formatPersianCurrency(412000, '$'), '$۴۱۲,۰۰۰');
  assert.equal(formatPersianPercent(8.7, 1), '۸.۷٪');
});

test('getIncoterm2020Obligations correctly sets buyer vs seller rules', () => {
  const exw = getIncoterm2020Obligations('EXW');
  assert.equal(exw[0].sellerPays, false);
  assert.equal(exw[0].buyerPays, true);

  const ddp = getIncoterm2020Obligations('DDP');
  assert.equal(ddp[6].sellerPays, true); // seller pays import clearance in DDP
  assert.equal(ddp[6].buyerPays, false);
});

test('evaluateSupplierAuthenticity detects legitimate factories vs brokers', () => {
  const factorySignals = {
    hasPhysicalFactoryVideo: true,
    bankAccountMatchesLegalName: true,
    hasCustomsExportRecords: true,
    domainAgeYears: 8,
    claimedAgeYears: 10,
    hasSgsOrTuvAudit: true,
    catalogPhotosOriginal: true,
  };

  const result = evaluateSupplierAuthenticity(factorySignals);
  assert.equal(result.isHighRisk, false);
  assert.equal(result.classification, 'سازنده واقعی احراز شده');
  assert.ok(result.safetyScore >= 80);
});

test('normalizeProformaInvoice normalizes FOB terms to CIF and estimates landed cost', () => {
  const pi = {
    proformaNumber: 'PI-VN-2026-904',
    supplierName: 'VinaPrecision JSC',
    country: 'ویتنام',
    currency: 'USD' as const,
    rawUnitPrice: 2.85,
    quantity: 10000,
    quotedIncoterm: 'FOB' as const,
    portOfLoading: 'Haiphong',
    freightEstimateUsd: 1400, // $0.14 / unit
    insuranceEstimateUsd: 100, // $0.01 / unit
    tariffPercent: 15,
    leadTimeDays: 28,
    paymentTerms: '۲۰٪ پیش‌پرداخت، ۸۰٪ پس از بازرسی SGS قبل از بارگیری',
    benchmarkPriceUsd: 4.2, // current China landed benchmark $4.22
  };

  const normalized = normalizeProformaInvoice(pi);
  assert.equal(normalized.normalizedUnitPriceCifUsd, 3.0); // 2.85 + 0.14 + 0.01 = 3.00
  assert.ok(normalized.landedCostEstimatedPerUnitUsd > 3.0);
  assert.equal(normalized.paymentRiskGrade, 'کم‌ریسک (استاندارد بازرگانی)');
  assert.ok(normalized.savingsVsBenchmarkPercent > 0);
});

test('marketDataService provides live rates and handles market shock simulations', async () => {
  const { marketDataService } = await import('../services/marketDataService.ts');
  const initialRates = marketDataService.getState();
  
  // Verify basic baseline market data
  assert.ok(initialRates.currencies.length >= 6);
  assert.ok(initialRates.freightRoutes.length >= 4);
  assert.ok(initialRates.rawMaterials.length >= 4);
  assert.ok(initialRates.portStatuses.length >= 4);
  assert.ok(initialRates.riskCorridors.length >= 4);

  const nimaRate = marketDataService.getUsdNimaRate();
  assert.ok(nimaRate > 50000, 'NIMA rate should be realistic > 50k Toman');

  const shanghaiFreight = marketDataService.getShanghaiFreightRate();
  assert.ok(shanghaiFreight > 2000, 'Shanghai 40ft container freight should be > $2,000');

  // Test conversion
  const tomanValue = marketDataService.convertUsdToToman(1000, 'nima');
  assert.equal(tomanValue, 1000 * nimaRate);

  // Test Freight Spike Shock (+32%)
  marketDataService.triggerMarketShock('freight_spike');
  const shockedState = marketDataService.getState();
  assert.equal(shockedState.activeShock, 'freight_spike');
  assert.ok(marketDataService.getShanghaiFreightRate() > shanghaiFreight);

  // Test Reset back to baseline
  marketDataService.triggerMarketShock('none');
  const resetState = marketDataService.getState();
  assert.equal(resetState.activeShock, 'none');
  assert.equal(marketDataService.getShanghaiFreightRate(), 2850);
});


