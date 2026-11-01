import React, { useState, useMemo } from 'react';
import {
  Scale,
  Sparkles,
  Trophy,
  ArrowRight,
  TrendingDown,
  Sliders,
  DollarSign,
  HelpCircle,
  RotateCcw,
} from 'lucide-react';
import { OrangeFeaturePanel } from '../common/OrangeFeaturePanel';
import { MOCK_LANDED_OFFERS } from '../../data/mockData';
import {
  computeLandedCost,
  computeWeightedRanking,
  DEFAULT_WEIGHTS,
  SupplierRankingWeights,
} from '../../utils/calculations';
import {
  toPersianDigits,
  formatPersianCurrency,
  formatPersianPercent,
} from '../../utils/persian';
import { useToast } from '../common/Toast';
import { PageId } from '../../types';

interface ComparisonPageProps {
  onNavigate: (page: PageId, extra?: any) => void;
}

export const ComparisonPage: React.FC<ComparisonPageProps> = ({ onNavigate }) => {
  const { showToast } = useToast();

  // Toggles: Incoterm basis, currency, quantity
  const [incotermBasis, setIncotermBasis] = useState<'FOB' | 'CIF' | 'DDP' | 'EXW'>('CIF');
  const [currency, setCurrency] = useState<'USD' | 'EUR' | 'AED'>('USD');
  const [quantity, setQuantity] = useState<number>(10000);

  // Currency multiplier
  const currencyRate = currency === 'USD' ? 1.0 : currency === 'EUR' ? 0.92 : 3.67;
  const currencySymbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : 'د.إ';

  // Live editable ranking weights
  const [weights, setWeights] = useState<SupplierRankingWeights>({ ...DEFAULT_WEIGHTS });

  const totalWeights = useMemo(() => {
    return (
      weights.landedCost +
      weights.credibility +
      weights.quality +
      weights.capacity +
      weights.leadTime +
      weights.payment +
      weights.countryRisk +
      weights.responsiveness
    );
  }, [weights]);

  const updateWeight = (key: keyof SupplierRankingWeights, value: number) => {
    setWeights((prev) => ({
      ...prev,
      [key]: Math.max(0, value),
    }));
  };

  const handleResetWeights = () => {
    setWeights({ ...DEFAULT_WEIGHTS });
    showToast('اوزان بازنشانی شدند', 'ضرایب ارزیابی به حالت استاندارد ۳۰-۲۰-۱۵ بازگشتند.', 'info');
  };

  // Compute Landed Cost for each offer
  const computedOffers = useMemo(() => {
    return MOCK_LANDED_OFFERS.map((offer) => {
      // Adjust costs based on incoterm basis
      const freightCost =
        incotermBasis === 'EXW'
          ? offer.freight * 1.2
          : incotermBasis === 'FOB'
          ? offer.freight
          : offer.freight;

      const calc = computeLandedCost({
        unitPrice: offer.unitPrice * currencyRate,
        quantity,
        freight: freightCost * currencyRate,
        insurance: offer.insurance * currencyRate,
        dutiesPercent: incotermBasis === 'DDP' ? 0 : offer.dutiesPercent,
        clearance: offer.clearance * currencyRate,
        inspection: offer.inspection * currencyRate,
        packaging: offer.packaging * currencyRate,
        fxRiskBufferPercent: offer.fxRiskBufferPercent,
      });

      // Score normalized: lower cost -> higher score (between 70 and 100)
      const baseCost = 3.5;
      const landedCostScore = Math.max(
        60,
        Math.min(99, Math.round(100 - (calc.landedCostPerUnit / baseCost - 0.8) * 60))
      );

      const weightedScore = computeWeightedRanking(
        {
          landedCostScore,
          credibilityScore: offer.scoreBreakdown.credibilityScore,
          qualityScore: offer.scoreBreakdown.qualityScore,
          capacityScore: offer.scoreBreakdown.capacityScore,
          leadTimeScore: offer.scoreBreakdown.leadTimeScore,
          paymentScore: offer.scoreBreakdown.paymentScore,
          countryRiskScore: offer.scoreBreakdown.countryRiskScore,
          responsivenessScore: offer.scoreBreakdown.responsivenessScore,
        },
        weights
      );

      return {
        ...offer,
        calc,
        landedCostScore,
        weightedScore,
      };
    });
  }, [quantity, incotermBasis, currencyRate, weights]);

  // Find lowest landed cost and highest weighted rank
  const lowestCost = Math.min(...computedOffers.map((o) => o.calc.landedCostPerUnit));
  const highestScore = Math.max(...computedOffers.map((o) => o.weightedScore));

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      {/* Main Content Area (Right Side ~70%) */}
      <div className="flex-1 w-full space-y-6">
        {/* Top Control Bar: Incoterm basis, Currency, Quantity */}
        <div className="swiss-card p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
          {/* Incoterm Basis */}
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-[#7E7D7A]">مبنای اینکوترمز:</span>
            <div className="flex items-center gap-1 bg-[#F5F4F0] p-1 rounded-lg">
              {(['CIF', 'FOB', 'DDP', 'EXW'] as const).map((term) => (
                <button
                  key={term}
                  onClick={() => setIncotermBasis(term)}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-colors ${
                    incotermBasis === term
                      ? 'bg-[#181818] text-white shadow-xs'
                      : 'text-[#7E7D7A] hover:text-[#141414]'
                  }`}
                >
                  {term}
                </button>
              ))}
            </div>
          </div>

          {/* Currency Toggle */}
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-[#7E7D7A]">ارز محاسباتی:</span>
            <div className="flex items-center gap-1 bg-[#F5F4F0] p-1 rounded-lg">
              {(['USD', 'EUR', 'AED'] as const).map((c) => (
                <button
                  key={c}
                  onClick={() => setCurrency(c)}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-colors ${
                    currency === c
                      ? 'bg-[#181818] text-white shadow-xs'
                      : 'text-[#7E7D7A] hover:text-[#141414]'
                  }`}
                >
                  {c === 'USD' ? 'دلار ($)' : c === 'EUR' ? 'یورو (€)' : 'درهم (AED)'}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-[#7E7D7A]">تیراژ سفارش:</span>
            <div className="flex items-center gap-1 bg-[#F5F4F0] p-1 rounded-lg">
              {[5000, 10000, 25000].map((qty) => (
                <button
                  key={qty}
                  onClick={() => setQuantity(qty)}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-colors ${
                    quantity === qty
                      ? 'bg-[#181818] text-white shadow-xs'
                      : 'text-[#7E7D7A] hover:text-[#141414]'
                  }`}
                >
                  {toPersianDigits(qty.toLocaleString())} عدد
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 4 Offers Comparison Table */}
        <div className="swiss-card p-6 overflow-hidden">
          <div className="flex items-center justify-between pb-4 hairline-b mb-4">
            <div>
              <h3 className="text-base font-bold text-[#141414]">
                جدول نرمال‌سازی و تفکیک بهای تمام‌شده (Landed Cost per Unit)
              </h3>
              <p className="text-xs text-[#7E7D7A] mt-0.5">
                فرمول بهای نهایی: (ارزش کالا + حمل + بیمه + حقوق گمرکی + ترخیص + بازرسی + بافر ارز) ÷
                تعداد
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[#FDF498] text-[#181818]">
              ستون زرد = بهترین ارزش خرید
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-right border-collapse">
              <thead>
                <tr className="hairline-b text-[#7E7D7A]">
                  <th className="py-3 px-3 font-semibold w-1/5">آیتم هزینه / شاخص</th>
                  {computedOffers.map((offer) => {
                    const isBest = offer.calc.landedCostPerUnit === lowestCost;
                    return (
                      <th
                        key={offer.supplierId}
                        className={`py-3 px-4 font-bold text-center w-1/5 transition-all ${
                          isBest ? 'bg-[#FDF498]/60 text-[#181818] rounded-t-xl' : 'text-[#141414]'
                        }`}
                      >
                        <div className="flex items-center justify-center gap-1.5 text-sm">
                          <span>{offer.flag}</span>
                          <span>{offer.supplierName}</span>
                        </div>
                        <div className="text-[11px] font-normal text-[#7E7D7A] mt-0.5">
                          {offer.country}
                        </div>
                        {isBest && (
                          <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#181818] text-[#FDF498] text-[10px] font-bold">
                            <Trophy className="w-3 h-3" />
                            بهترین ارزش خرید
                          </div>
                        )}
                      </th>
                    );
                  })}
                </tr>
              </thead>

              <tbody className="divide-y divide-[#E3E1DD]">
                {/* Row: Factory Price */}
                <tr className="hover:bg-[#FAF9F7]">
                  <td className="py-2.5 px-3 font-medium text-[#141414]">قیمت فاکتور کارخانه (EXW)</td>
                  {computedOffers.map((o) => (
                    <td
                      key={o.supplierId}
                      className={`py-2.5 px-4 text-center font-bold tabular-nums ${
                        o.calc.landedCostPerUnit === lowestCost ? 'bg-[#FDF498]/40' : ''
                      }`}
                    >
                      {formatPersianCurrency(o.unitPrice * currencyRate, currencySymbol, 2)}
                    </td>
                  ))}
                </tr>

                {/* Row: Freight */}
                <tr className="hover:bg-[#FAF9F7]">
                  <td className="py-2.5 px-3 font-medium text-[#141414]">کرایه حمل بین‌المللی</td>
                  {computedOffers.map((o) => (
                    <td
                      key={o.supplierId}
                      className={`py-2.5 px-4 text-center tabular-nums text-[#7E7D7A] ${
                        o.calc.landedCostPerUnit === lowestCost ? 'bg-[#FDF498]/40' : ''
                      }`}
                    >
                      {formatPersianCurrency(o.calc.freightTotal, currencySymbol)}
                    </td>
                  ))}
                </tr>

                {/* Row: Insurance */}
                <tr className="hover:bg-[#FAF9F7]">
                  <td className="py-2.5 px-3 font-medium text-[#141414]">حق بیمه باربری دریایی/زمینی</td>
                  {computedOffers.map((o) => (
                    <td
                      key={o.supplierId}
                      className={`py-2.5 px-4 text-center tabular-nums text-[#7E7D7A] ${
                        o.calc.landedCostPerUnit === lowestCost ? 'bg-[#FDF498]/40' : ''
                      }`}
                    >
                      {formatPersianCurrency(o.calc.insuranceTotal, currencySymbol)}
                    </td>
                  ))}
                </tr>

                {/* Row: Customs Duties */}
                <tr className="hover:bg-[#FAF9F7]">
                  <td className="py-2.5 px-3 font-medium text-[#141414]">
                    حقوق و عوارض گمرکی ({toPersianDigits(computedOffers[0].dutiesPercent)}٪)
                  </td>
                  {computedOffers.map((o) => (
                    <td
                      key={o.supplierId}
                      className={`py-2.5 px-4 text-center tabular-nums text-[#7E7D7A] ${
                        o.calc.landedCostPerUnit === lowestCost ? 'bg-[#FDF498]/40' : ''
                      }`}
                    >
                      {formatPersianCurrency(o.calc.dutiesTotal, currencySymbol)}
                    </td>
                  ))}
                </tr>

                {/* Row: Port Clearance */}
                <tr className="hover:bg-[#FAF9F7]">
                  <td className="py-2.5 px-3 font-medium text-[#141414]">ترخیص، انبارداری و دموراژ</td>
                  {computedOffers.map((o) => (
                    <td
                      key={o.supplierId}
                      className={`py-2.5 px-4 text-center tabular-nums text-[#7E7D7A] ${
                        o.calc.landedCostPerUnit === lowestCost ? 'bg-[#FDF498]/40' : ''
                      }`}
                    >
                      {formatPersianCurrency(o.calc.clearanceTotal, currencySymbol)}
                    </td>
                  ))}
                </tr>

                {/* Row: Inspection SGS */}
                <tr className="hover:bg-[#FAF9F7]">
                  <td className="py-2.5 px-3 font-medium text-[#141414]">بازرسی فنی پیش از حمل (SGS)</td>
                  {computedOffers.map((o) => (
                    <td
                      key={o.supplierId}
                      className={`py-2.5 px-4 text-center tabular-nums text-[#7E7D7A] ${
                        o.calc.landedCostPerUnit === lowestCost ? 'bg-[#FDF498]/40' : ''
                      }`}
                    >
                      {formatPersianCurrency(o.calc.inspectionTotal, currencySymbol)}
                    </td>
                  ))}
                </tr>

                {/* Row: FX Risk Buffer */}
                <tr className="hover:bg-[#FAF9F7]">
                  <td className="py-2.5 px-3 font-medium text-[#141414]">بافر نوسان ارز و تسویه</td>
                  {computedOffers.map((o) => (
                    <td
                      key={o.supplierId}
                      className={`py-2.5 px-4 text-center tabular-nums text-[#7E7D7A] ${
                        o.calc.landedCostPerUnit === lowestCost ? 'bg-[#FDF498]/40' : ''
                      }`}
                    >
                      {formatPersianPercent(o.fxRiskBufferPercent, 1)}
                    </td>
                  ))}
                </tr>

                {/* Row: Lead Time */}
                <tr className="hover:bg-[#FAF9F7]">
                  <td className="py-2.5 px-3 font-medium text-[#141414]">زمان کل تحویل در مقصد</td>
                  {computedOffers.map((o) => (
                    <td
                      key={o.supplierId}
                      className={`py-2.5 px-4 text-center font-semibold text-[#141414] ${
                        o.calc.landedCostPerUnit === lowestCost ? 'bg-[#FDF498]/40' : ''
                      }`}
                    >
                      {toPersianDigits(o.leadTimeWeeks)} هفته
                    </td>
                  ))}
                </tr>

                {/* Row: Payment Terms */}
                <tr className="hover:bg-[#FAF9F7]">
                  <td className="py-2.5 px-3 font-medium text-[#141414]">شرایط پرداخت</td>
                  {computedOffers.map((o) => (
                    <td
                      key={o.supplierId}
                      className={`py-2.5 px-4 text-center text-[11px] text-[#7E7D7A] ${
                        o.calc.landedCostPerUnit === lowestCost ? 'bg-[#FDF498]/40' : ''
                      }`}
                    >
                      {o.paymentTerms}
                    </td>
                  ))}
                </tr>

                {/* HERO ROW: COMPUTED LANDED COST PER UNIT */}
                <tr className="bg-[#181818] text-white">
                  <td className="py-4 px-3 font-black text-sm">
                    بهای تمام‌شده هر واحد (Landed Cost)
                  </td>
                  {computedOffers.map((o) => {
                    const isLowest = o.calc.landedCostPerUnit === lowestCost;
                    return (
                      <td
                        key={o.supplierId}
                        className={`py-4 px-4 text-center font-black text-base lg:text-lg tabular-nums ${
                          isLowest ? 'bg-[#EE6123] text-white shadow-inner' : 'text-white'
                        }`}
                      >
                        {formatPersianCurrency(o.calc.landedCostPerUnit, currencySymbol, 2)}
                        {isLowest && (
                          <div className="text-[10px] text-[#FDF498] font-bold block mt-0.5">
                            کاهش ۸.۷٪
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>

                {/* Weighted Ranking Score */}
                <tr className="bg-[#FAF9F7]">
                  <td className="py-3 px-3 font-bold text-[#141414]">
                    رتبه وزنی ترکیبی (از ۱۰۰)
                  </td>
                  {computedOffers.map((o) => {
                    const isTopScore = o.weightedScore === highestScore;
                    return (
                      <td
                        key={o.supplierId}
                        className={`py-3 px-4 text-center font-black text-sm tabular-nums ${
                          isTopScore ? 'text-[#EE6123]' : 'text-[#141414]'
                        }`}
                      >
                        {toPersianDigits(o.weightedScore.toFixed(1))}
                        {isTopScore && (
                          <span className="block text-[10px] text-[#52C41A] font-bold">
                            رتبه ۱
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Stacked Cost Bars Visualization */}
        <div className="swiss-card p-6">
          <h4 className="text-sm font-bold text-[#141414] mb-3">
            ترکیب سهم اجزای بهای تمام‌شده (نسبت کالا، حمل، گمرک و متفرقه)
          </h4>

          <div className="space-y-3">
            {computedOffers.map((o) => {
              const total = o.calc.totalCost;
              const goodsPct = Math.round((o.calc.goodsTotal / total) * 100);
              const freightPct = Math.round((o.calc.freightTotal / total) * 100);
              const dutiesPct = Math.round((o.calc.dutiesTotal / total) * 100);
              const otherPct = 100 - goodsPct - freightPct - dutiesPct;

              return (
                <div key={o.supplierId} className="space-y-1 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[#141414] flex items-center gap-1.5">
                      <span>{o.flag}</span>
                      <span>{o.supplierName}</span>
                    </span>
                    <span className="font-bold text-[#181818] tabular-nums">
                      کل سفارش: {formatPersianCurrency(total, currencySymbol)} (واحد:{' '}
                      {formatPersianCurrency(o.calc.landedCostPerUnit, currencySymbol, 2)})
                    </span>
                  </div>

                  {/* Stacked bar */}
                  <div className="h-4 w-full rounded-md overflow-hidden flex bg-[#E3E1DD]">
                    <div
                      style={{ width: `${goodsPct}%` }}
                      className="bg-[#181818] h-full"
                      title={`ارزش کالا: ${goodsPct}٪`}
                    />
                    <div
                      style={{ width: `${freightPct}%` }}
                      className="bg-[#EE6123] h-full"
                      title={`کرایه حمل: ${freightPct}٪`}
                    />
                    <div
                      style={{ width: `${dutiesPct}%` }}
                      className="bg-[#FA8C16] h-full"
                      title={`حقوق گمرکی: ${dutiesPct}٪`}
                    />
                    <div
                      style={{ width: `${otherPct}%` }}
                      className="bg-[#C9C7C2] h-full"
                      title={`ترخیص و بازرسی: ${otherPct}٪`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 mt-4 pt-3 hairline-t text-[11px] text-[#7E7D7A]">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-[#181818]" />
              <span>ارزش کالا</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-[#EE6123]" />
              <span>کرایه حمل بین‌المللی</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-[#FA8C16]" />
              <span>حقوق و عوارض گمرکی</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-[#C9C7C2]" />
              <span>ترخیص، بازرسی و سایر</span>
            </div>
          </div>
        </div>
      </div>

      {/* Solid Orange Feature Panel on Left: Editable Ranking Weight Sliders */}
      <OrangeFeaturePanel
        title="تنظیم اوزان رتبه‌بندی هوشمند"
        badge={`مجموع: ${toPersianDigits(totalWeights)}٪`}
        subtitle="با تغییر اسلایدرها، رتبه وزنی ۴ تأمین‌کننده زنده بازنویسی می‌شود"
        footerActions={
          <div className="space-y-2">
            <button
              onClick={handleResetWeights}
              className="w-full bg-white/20 hover:bg-white/30 text-white py-2 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              بازنشانی اوزان پیش‌فرض (مجموع ۱۰۰)
            </button>
            <button
              onClick={() => onNavigate('rfq')}
              className="w-full bg-[#181818] text-white hover:bg-black py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>صدور استعلام برای پیشنهاد برتر</span>
              <ArrowRight className="w-4 h-4 text-[#FDF498]" />
            </button>
          </div>
        }
      >
        <div className="space-y-3.5">
          {/* Slider 1: Landed cost (30) */}
          <div>
            <div className="flex justify-between text-xs font-bold text-white mb-1">
              <span>بهای تمام‌شده نهایی (Landed Cost)</span>
              <span className="tabular-nums">{toPersianDigits(weights.landedCost)}٪</span>
            </div>
            <input
              type="range"
              min="0"
              max="60"
              value={weights.landedCost}
              onChange={(e) => updateWeight('landedCost', Number(e.target.value))}
              className="w-full accent-white cursor-pointer"
            />
          </div>

          {/* Slider 2: Credibility (20) */}
          <div>
            <div className="flex justify-between text-xs font-bold text-white mb-1">
              <span>اعتبار حقوقی و مالی</span>
              <span className="tabular-nums">{toPersianDigits(weights.credibility)}٪</span>
            </div>
            <input
              type="range"
              min="0"
              max="40"
              value={weights.credibility}
              onChange={(e) => updateWeight('credibility', Number(e.target.value))}
              className="w-full accent-white cursor-pointer"
            />
          </div>

          {/* Slider 3: Quality (15) */}
          <div>
            <div className="flex justify-between text-xs font-bold text-white mb-1">
              <span>کیفیت و استانداردهای فنی</span>
              <span className="tabular-nums">{toPersianDigits(weights.quality)}٪</span>
            </div>
            <input
              type="range"
              min="0"
              max="40"
              value={weights.quality}
              onChange={(e) => updateWeight('quality', Number(e.target.value))}
              className="w-full accent-white cursor-pointer"
            />
          </div>

          {/* Slider 4: Capacity (10) */}
          <div>
            <div className="flex justify-between text-xs font-bold text-white mb-1">
              <span>ظرفیت تولید و مقیاس‌پذیری</span>
              <span className="tabular-nums">{toPersianDigits(weights.capacity)}٪</span>
            </div>
            <input
              type="range"
              min="0"
              max="30"
              value={weights.capacity}
              onChange={(e) => updateWeight('capacity', Number(e.target.value))}
              className="w-full accent-white cursor-pointer"
            />
          </div>

          {/* Slider 5: Lead Time (10) */}
          <div>
            <div className="flex justify-between text-xs font-bold text-white mb-1">
              <span>سرعت تحویل و ترانزیت</span>
              <span className="tabular-nums">{toPersianDigits(weights.leadTime)}٪</span>
            </div>
            <input
              type="range"
              min="0"
              max="30"
              value={weights.leadTime}
              onChange={(e) => updateWeight('leadTime', Number(e.target.value))}
              className="w-full accent-white cursor-pointer"
            />
          </div>

          {/* Slider 6: Payment Terms (5) */}
          <div>
            <div className="flex justify-between text-xs font-bold text-white mb-1">
              <span>انعطاف در شرایط پرداخت</span>
              <span className="tabular-nums">{toPersianDigits(weights.payment)}٪</span>
            </div>
            <input
              type="range"
              min="0"
              max="20"
              value={weights.payment}
              onChange={(e) => updateWeight('payment', Number(e.target.value))}
              className="w-full accent-white cursor-pointer"
            />
          </div>

          {/* Slider 7: Country Risk (5) */}
          <div>
            <div className="flex justify-between text-xs font-bold text-white mb-1">
              <span>ریسک ژئوپلیتیک و تعرفه کشور</span>
              <span className="tabular-nums">{toPersianDigits(weights.countryRisk)}٪</span>
            </div>
            <input
              type="range"
              min="0"
              max="20"
              value={weights.countryRisk}
              onChange={(e) => updateWeight('countryRisk', Number(e.target.value))}
              className="w-full accent-white cursor-pointer"
            />
          </div>

          {/* Slider 8: Responsiveness (5) */}
          <div>
            <div className="flex justify-between text-xs font-bold text-white mb-1">
              <span>پاسخگویی و تعهد در پلتفرم</span>
              <span className="tabular-nums">{toPersianDigits(weights.responsiveness)}٪</span>
            </div>
            <input
              type="range"
              min="0"
              max="20"
              value={weights.responsiveness}
              onChange={(e) => updateWeight('responsiveness', Number(e.target.value))}
              className="w-full accent-white cursor-pointer"
            />
          </div>
        </div>
      </OrangeFeaturePanel>
    </div>
  );
};
