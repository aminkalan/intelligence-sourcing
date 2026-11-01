import test from 'node:test';
import assert from 'node:assert/strict';
import { computeLandedCost, computeWeightedRanking, DEFAULT_WEIGHTS } from './calculations';
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
