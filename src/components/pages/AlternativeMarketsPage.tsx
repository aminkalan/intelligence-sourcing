import React, { useState } from 'react';
import {
  Globe2,
  TrendingDown,
  TrendingUp,
  ShieldAlert,
  Ship,
  FileCheck,
  Scale,
  Compass,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { OrangeFeaturePanel } from '../common/OrangeFeaturePanel';
import { MOCK_ALTERNATIVE_COUNTRIES } from '../../data/mockData';
import { AlternativeCountry, PageId } from '../../types';
import { toPersianDigits, formatPersianCurrency, formatPersianPercent } from '../../utils/persian';
import { useToast } from '../common/Toast';

interface AlternativeMarketsPageProps {
  onNavigate: (page: PageId, extra?: any) => void;
}

export const AlternativeMarketsPage: React.FC<AlternativeMarketsPageProps> = ({ onNavigate }) => {
  const { showToast } = useToast();

  const [selectedCountry, setSelectedCountry] = useState<AlternativeCountry>(
    MOCK_ALTERNATIVE_COUNTRIES[0] // Vietnam
  );

  const handleSelectCountry = (country: AlternativeCountry) => {
    setSelectedCountry(country);
  };

  const handleExploreSuppliers = () => {
    showToast(
      'جست‌وجوی سازندگان کشور منتخب',
      `انتقال به بانک تأمین‌کنندگان برای کشور ${selectedCountry.name}.`,
      'info'
    );
    onNavigate('suppliers');
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      {/* Main Content Area (Right Side ~70%) */}
      <div className="flex-1 w-full space-y-6">
        {/* Stylized SVG Map Card with Shipping Arcs */}
        <div className="swiss-card p-6 overflow-hidden relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 hairline-b mb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EE6123]" />
                <h3 className="text-base font-black text-[#141414]">
                  نقشه کریدورهای ترانزیتی و مقایسه بازارهای جایگزین چین
                </h3>
              </div>
              <p className="text-xs text-[#7E7D7A] mt-0.5">
                مبدأ مرجع: چین (شانگهای/نانگبو) · خطوط منحنی: مسیرهای ترانزیتی به ایران (بندرعباس / بازرگان)
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="px-2.5 py-1 rounded bg-[#181818] text-white font-bold">
                مبدأ فعلی: چین 🇨🇳 ($۳.۴۰)
              </span>
            </div>
          </div>

          {/* SVG Map Canvas */}
          <div className="relative w-full h-[260px] bg-[#FAF9F7] rounded-xl border border-[#E3E1DD] overflow-hidden flex items-center justify-center p-2">
            <svg
              viewBox="0 0 900 360"
              className="w-full h-full select-none"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                {/* Arc Gradient */}
                <linearGradient id="arcVietnam" x1="1" y1="0" x2="0" y2="0">
                  <stop offset="0%" stopColor="#EE6123" />
                  <stop offset="100%" stopColor="#181818" />
                </linearGradient>
                <linearGradient id="arcTurkey" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#FA8C16" />
                  <stop offset="100%" stopColor="#181818" />
                </linearGradient>
                <linearGradient id="arcIndia" x1="1" y1="0" x2="0" y2="0">
                  <stop offset="0%" stopColor="#EE6123" />
                  <stop offset="100%" stopColor="#181818" />
                </linearGradient>
              </defs>

              {/* Stylized continent landmass silhouettes (Eurasia & Middle East) */}
              <g fill="#EAE8E4" stroke="#DCD9D3" strokeWidth="1">
                {/* Europe */}
                <path d="M 120,60 Q 200,50 260,80 Q 280,110 240,140 Q 180,150 140,110 Z" />
                {/* Middle East & Iran */}
                <path d="M 280,140 Q 380,130 420,180 Q 390,240 330,220 Q 270,180 280,140 Z" fill="#E2DFD9" />
                {/* South Asia / India */}
                <path d="M 450,180 Q 520,190 540,250 Q 480,290 450,230 Z" />
                {/* East Asia / China */}
                <path d="M 540,90 Q 720,80 750,170 Q 660,220 560,180 Z" />
                {/* Southeast Asia / Vietnam / Malaysia */}
                <path d="M 620,190 Q 690,210 670,290 Q 620,280 600,230 Z" />
              </g>

              {/* Iran / Destination Target Marker (Bandar Abbas: 360, 200) */}
              <g className="cursor-pointer">
                <circle cx="360" cy="195" r="14" fill="#181818" fillOpacity="0.1" />
                <circle cx="360" cy="195" r="6" fill="#181818" />
                <text x="360" y="222" textAnchor="middle" className="text-[11px] font-black fill-[#181818]">
                  مقصد: ایران (بندرعباس / بازرگان)
                </text>
              </g>

              {/* Benchmark Source: China (Shanghai: 700, 140) */}
              <g>
                <circle cx="700" cy="140" r="5" fill="#BFBDB8" />
                <path
                  d="M 700,140 Q 530,90 360,195"
                  fill="none"
                  stroke="#BFBDB8"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
                <text x="700" y="125" textAnchor="middle" className="text-[10px] fill-[#7E7D7A]">
                  چین (پایه سنتی)
                </text>
              </g>

              {/* Route 1: Vietnam (Hanoi: 630, 190) -> Iran Arc */}
              <g
                className="cursor-pointer"
                onClick={() => setSelectedCountry(MOCK_ALTERNATIVE_COUNTRIES[0])}
              >
                <path
                  d="M 630,190 Q 500,260 360,195"
                  fill="none"
                  stroke="url(#arcVietnam)"
                  strokeWidth={selectedCountry.code === 'VN' ? '3.5' : '2'}
                  strokeLinecap="round"
                />
                <circle
                  cx="630"
                  cy="190"
                  r={selectedCountry.code === 'VN' ? '8' : '6'}
                  fill="#EE6123"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                />
                <text
                  x="630"
                  y="175"
                  textAnchor="middle"
                  className="text-[11px] font-bold fill-[#EE6123]"
                >
                  ویتنام 🇻🇳 (صرفه‌جویی ۸.۷٪)
                </text>
              </g>

              {/* Route 2: Turkey (Bursa: 250, 120) -> Iran Overland Route */}
              <g
                className="cursor-pointer"
                onClick={() => setSelectedCountry(MOCK_ALTERNATIVE_COUNTRIES[1])}
              >
                <path
                  d="M 250,120 Q 295,135 360,195"
                  fill="none"
                  stroke="url(#arcTurkey)"
                  strokeWidth={selectedCountry.code === 'TR' ? '3.5' : '2'}
                  strokeLinecap="round"
                />
                <circle
                  cx="250"
                  cy="120"
                  r={selectedCountry.code === 'TR' ? '8' : '6'}
                  fill="#FA8C16"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                />
                <text
                  x="235"
                  y="105"
                  textAnchor="middle"
                  className="text-[11px] font-bold fill-[#181818]"
                >
                  ترکیه 🇹🇷 (زمینی ۹ روزه)
                </text>
              </g>

              {/* Route 3: India (Gujarat: 470, 210) -> Iran Arc */}
              <g
                className="cursor-pointer"
                onClick={() => setSelectedCountry(MOCK_ALTERNATIVE_COUNTRIES[2])}
              >
                <path
                  d="M 470,210 Q 420,230 360,195"
                  fill="none"
                  stroke="url(#arcIndia)"
                  strokeWidth={selectedCountry.code === 'IN' ? '3.5' : '2'}
                  strokeLinecap="round"
                />
                <circle
                  cx="470"
                  cy="210"
                  r={selectedCountry.code === 'IN' ? '8' : '6'}
                  fill="#EE6123"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                />
                <text
                  x="480"
                  y="235"
                  textAnchor="middle"
                  className="text-[11px] font-bold fill-[#181818]"
                >
                  هند 🇮🇳 (مسیر چابهار)
                </text>
              </g>
            </svg>

            {/* Floating selected badge */}
            <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-[#E3E1DD] text-xs flex items-center gap-2">
              <span className="font-semibold text-[#7E7D7A]">کشور فعال:</span>
              <span className="font-black text-[#141414] flex items-center gap-1">
                <span>{selectedCountry.flag}</span>
                <span>{selectedCountry.name}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Alternative Countries Ranked Table */}
        <div className="swiss-card p-6">
          <div className="flex items-center justify-between pb-3 hairline-b mb-3">
            <div>
              <h4 className="text-sm font-bold text-[#141414]">
                رتبه‌بندی بازارهای آلترناتیو بر مبنای نرخ صرفه‌جویی و ریسک زنجیره
              </h4>
              <p className="text-xs text-[#7E7D7A] mt-0.5">
                کلیک روی هر سطر، پرونده ریسک و استراتژی پوشش در پنل چپ را بروز می‌کند
              </p>
            </div>
            <span className="text-xs text-[#7E7D7A]">مرجع: قیمت FOB چین ($۳.۴۰)</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-right border-collapse">
              <thead>
                <tr className="text-[#7E7D7A] hairline-b pb-2">
                  <th className="py-2.5 font-medium">کشور جایگزین</th>
                  <th className="py-2.5 font-medium">قیمت صادراتی تقریبی</th>
                  <th className="py-2.5 font-medium">روند ۲۴ ماهه</th>
                  <th className="py-2.5 font-medium">کرایه حمل تا ایران</th>
                  <th className="py-2.5 font-medium">زمان ترانزیت</th>
                  <th className="py-2.5 font-medium">صرفه‌جویی نسبت به چین</th>
                  <th className="py-2.5 font-medium">ریسک تحریم/سیاسی</th>
                  <th className="py-2.5 font-medium text-left">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3E1DD]">
                {MOCK_ALTERNATIVE_COUNTRIES.map((c) => {
                  const isSelected = selectedCountry.id === c.id;
                  const isPositiveSaving = c.estimatedSavingPct > 0;

                  return (
                    <tr
                      key={c.id}
                      onClick={() => handleSelectCountry(c)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-[#FDF498]/40 font-semibold' : 'hover:bg-[#FAF9F7]'
                      }`}
                    >
                      <td className="py-3 font-bold text-[#141414] flex items-center gap-2">
                        <span className="text-lg">{c.flag}</span>
                        <div>
                          <div>{c.name}</div>
                          <div className="text-[10px] text-[#7E7D7A] font-normal">
                            صادرات: ${toPersianDigits((c.annualExportVolumeMUsd / 1000).toFixed(1))}B
                          </div>
                        </div>
                      </td>

                      <td className="py-3 font-bold text-[#181818] tabular-nums">
                        ${toPersianDigits(c.approxExportPrice.toFixed(2))}
                      </td>

                      {/* Sparkline trend */}
                      <td className="py-3">
                        <div className="flex items-center gap-1 w-20 h-6">
                          {c.priceTrend24m.map((val, idx) => (
                            <div
                              key={idx}
                              style={{
                                height: `${Math.round(((val - 2.8) / 2.2) * 20)}px`,
                              }}
                              className={`w-2 rounded-t-xs ${
                                isPositiveSaving ? 'bg-[#52C41A]' : 'bg-[#FA8C16]'
                              }`}
                            />
                          ))}
                        </div>
                      </td>

                      <td className="py-3 text-[#141414] tabular-nums">
                        ${toPersianDigits(c.freightEstUsd.toLocaleString())}
                      </td>

                      <td className="py-3 text-[#141414] tabular-nums">
                        {toPersianDigits(c.transitDays)} روز
                      </td>

                      <td className="py-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold ${
                            isPositiveSaving
                              ? 'bg-[#52C41A]/10 text-[#52C41A]'
                              : 'bg-[#E5484D]/10 text-[#E5484D]'
                          }`}
                        >
                          {isPositiveSaving ? '+' : ''}
                          {formatPersianPercent(c.estimatedSavingPct, 1)}
                        </span>
                      </td>

                      <td className="py-3">
                        <div className="flex items-center gap-1 text-[11px]">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              c.sanctionRisk === 'پایین' ? 'bg-[#52C41A]' : 'bg-[#FA8C16]'
                            }`}
                          />
                          <span>{c.sanctionRisk}</span>
                        </div>
                      </td>

                      <td className="py-3 text-left">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectCountry(c);
                            onNavigate('suppliers');
                          }}
                          className="px-2.5 py-1 text-[11px] rounded bg-[#181818] text-white hover:bg-black transition-colors"
                        >
                          یافتن کارخانه
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Solid Orange Feature Panel on Left: Selected Country Deep Risk Profile */}
      <OrangeFeaturePanel
        title={`شناسنامه ریسک ${selectedCountry.name}`}
        badge={selectedCountry.flag}
        subtitle="ارزیابی گلوگاه‌های تجاری، نوسان ارزی و استراتژی پوشش ریسک"
        footerActions={
          <button
            onClick={handleExploreSuppliers}
            className="w-full bg-[#181818] text-white hover:bg-black py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
          >
            <span>مشاهده سازندگان در {selectedCountry.name}</span>
            <ArrowRight className="w-4 h-4 text-[#FDF498]" />
          </button>
        }
      >
        {/* Saving vs Baseline Highlight */}
        <div className="bg-white/10 rounded-xl p-3.5 border border-white/15 flex items-center justify-between">
          <div>
            <div className="text-[11px] text-white/80">تغییر بهای تمام‌شده نسبت به چین:</div>
            <div className="text-xl font-black text-white tabular-nums mt-0.5">
              {selectedCountry.estimatedSavingPct > 0 ? '+' : ''}
              {formatPersianPercent(selectedCountry.estimatedSavingPct, 1)}
            </div>
          </div>
          <div className="text-left text-xs text-[#FDF498] font-bold">
            {selectedCountry.tariffStatus}
          </div>
        </div>

        {/* 4 Risk Dimensions */}
        <div className="space-y-2.5">
          <div className="bg-black/15 rounded-xl p-3 border border-white/10 text-xs space-y-1">
            <span className="font-bold text-[#FDF498] block">۱. ثبات ژئوپلیتیک و دیپلماتیک:</span>
            <p className="text-white/90 text-[11px] leading-relaxed">
              {selectedCountry.riskProfileSummary.geopolitical}
            </p>
          </div>

          <div className="bg-black/15 rounded-xl p-3 border border-white/10 text-xs space-y-1">
            <span className="font-bold text-[#FDF498] block">۲. نوسان ارزی و مکانیزم بانکی:</span>
            <p className="text-white/90 text-[11px] leading-relaxed">
              {selectedCountry.riskProfileSummary.fxVolatility}
            </p>
          </div>

          <div className="bg-black/15 rounded-xl p-3 border border-white/10 text-xs space-y-1">
            <span className="font-bold text-[#FDF498] block">۳. گلوگاه‌های ترانزیت و لاینر دریایی:</span>
            <p className="text-white/90 text-[11px] leading-relaxed">
              {selectedCountry.riskProfileSummary.transitChokepoints}
            </p>
          </div>

          <div className="bg-black/15 rounded-xl p-3 border border-white/10 text-xs space-y-1">
            <span className="font-bold text-[#FDF498] block">۴. استراتژی پیشنهادی خرید:</span>
            <p className="text-white/90 text-[11px] leading-relaxed">
              {selectedCountry.riskProfileSummary.suggestedStrategy}
            </p>
          </div>
        </div>
      </OrangeFeaturePanel>
    </div>
  );
};
