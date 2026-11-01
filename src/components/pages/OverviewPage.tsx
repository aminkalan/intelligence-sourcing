import React, { useState } from 'react';
import {
  TrendingUp,
  Package,
  Users,
  AlertTriangle,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  ChevronLeft,
  FileCheck,
  CheckCircle,
  FileDown,
  Sparkles,
} from 'lucide-react';
import { OrangeFeaturePanel } from '../common/OrangeFeaturePanel';
import { MOCK_SUPPLIERS, BUYER_PROFILE, MOCK_RFQS } from '../../data/mockData';
import { toPersianDigits, formatPersianCurrency, formatPersianPercent } from '../../utils/persian';
import { useToast } from '../common/Toast';
import { PageId } from '../../types';

interface OverviewPageProps {
  onNavigate: (page: PageId, extra?: any) => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({ onNavigate }) => {
  const { showToast } = useToast();
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const [timeRange, setTimeRange] = useState<'6m' | '12m' | '24m'>('12m');

  // Sparkline data for 12 months (RTL reading)
  const priceTrend12M = [
    { month: 'آبان ۰۳', price: 3.55 },
    { month: 'آذر ۰۳', price: 3.52 },
    { month: 'دی ۰۳', price: 3.48 },
    { month: 'بهمن ۰۳', price: 3.44 },
    { month: 'اسفند ۰۳', price: 3.40 },
    { month: 'فروردین ۰۴', price: 3.38 },
    { month: 'اردیبهشت ۰۴', price: 3.32 },
    { month: 'خرداد ۰۴', price: 3.28 },
    { month: 'تیر ۰۴', price: 3.22 },
    { month: 'مرداد ۰۴', price: 3.18 },
    { month: 'شهریور ۰۴', price: 3.12 },
    { month: 'مهر ۰۴', price: 2.95 },
  ];

  // SVG chart dimensions
  const maxPrice = 3.65;
  const minPrice = 2.85;
  const chartHeight = 160;
  const chartWidth = 520;

  const points = priceTrend12M.map((pt, idx) => {
    // In RTL, 0 starts from right
    const x = chartWidth - (idx / (priceTrend12M.length - 1)) * chartWidth;
    const y = chartHeight - ((pt.price - minPrice) / (maxPrice - minPrice)) * (chartHeight - 30) - 15;
    return { ...pt, x, y };
  });

  const svgPath = points.reduce((acc, pt, idx) => {
    return idx === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, '');

  const areaPath = `${svgPath} L ${points[points.length - 1].x} ${chartHeight} L ${points[0].x} ${chartHeight} Z`;

  const handleDownloadReport = () => {
    setDownloadModalOpen(false);
    showToast(
      'گزارش جامع مدیر خرید آماده شد',
      'فایل PDF تحلیلی شامل صرفه‌جویی $۴۱۲K و وضعیت ۱۴ استعلام تولید گردید.',
      'success'
    );
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      {/* Main Content Area (Right Side ~70%) */}
      <div className="flex-1 w-full space-y-6">
        {/* 4 KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {/* KPI 1: کالاهای تحت پایش ۲۴ */}
          <div className="swiss-card p-5 relative overflow-hidden group hover:border-[#EE6123]/30 transition-all">
            <div className="flex items-center justify-between text-xs text-[#7E7D7A]">
              <span className="font-medium">کالاهای تحت پایش</span>
              <Package className="w-4 h-4 text-[#7E7D7A]" />
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-[#141414] tabular-nums">
                {toPersianDigits(BUYER_PROFILE.activeMonitoredProducts)}
              </span>
              <span className="inline-flex items-center text-xs font-semibold text-[#52C41A]">
                <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                {toPersianDigits('+۳ کالا')}
              </span>
            </div>
            <p className="mt-1 text-[11px] text-[#7E7D7A]">۸ گروه کالایی با کد HS معتبر</p>
          </div>

          {/* KPI 2: تأمین‌کنندگان فعال ۱۳۸ */}
          <div className="swiss-card p-5 relative overflow-hidden group hover:border-[#EE6123]/30 transition-all">
            <div className="flex items-center justify-between text-xs text-[#7E7D7A]">
              <span className="font-medium">تأمین‌کنندگان فعال</span>
              <Users className="w-4 h-4 text-[#7E7D7A]" />
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-[#141414] tabular-nums">
                {toPersianDigits(BUYER_PROFILE.activeSuppliers)}
              </span>
              <span className="inline-flex items-center text-xs font-semibold text-[#52C41A]">
                <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                {toPersianDigits('+۱۲٪ این ماه')}
              </span>
            </div>
            <p className="mt-1 text-[11px] text-[#7E7D7A]">در کشورهای چین، ویتنام، ترکیه و هند</p>
          </div>

          {/* KPI 3: صرفه‌جویی احتمالی $۴۱۲K */}
          <div className="swiss-card p-5 relative overflow-hidden group hover:border-[#EE6123]/30 transition-all">
            <div className="flex items-center justify-between text-xs text-[#7E7D7A]">
              <span className="font-medium">صرفه‌جویی احتمالی سالانه</span>
              <TrendingUp className="w-4 h-4 text-[#EE6123]" />
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-[#141414] tabular-nums">
                {toPersianDigits('$۴۱۲,۰۰۰')}
              </span>
              <span className="inline-flex items-center text-xs font-semibold text-[#52C41A]">
                <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
                {toPersianDigits('-۸.۷٪ قیمت')}
              </span>
            </div>
            <p className="mt-1 text-[11px] text-[#7E7D7A]">مبتنی بر تنوع‌بخشی به تأمین‌کننده ویتنام</p>
          </div>

          {/* KPI 4: ریسک‌های فعال ۳ */}
          <div className="swiss-card p-5 relative overflow-hidden group hover:border-[#EE6123]/30 transition-all">
            <div className="flex items-center justify-between text-xs text-[#7E7D7A]">
              <span className="font-medium">ریسک‌های فعال زنجیره</span>
              <AlertTriangle className="w-4 h-4 text-[#FA8C16]" />
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-[#E5484D] tabular-nums">
                {toPersianDigits(BUYER_PROFILE.activeRisksCount)}
              </span>
              <span className="inline-flex items-center text-xs font-medium text-[#FA8C16]">
                نیازمند اقدام
              </span>
            </div>
            <p className="mt-1 text-[11px] text-[#7E7D7A]">تراکم بندر نانگبو و نوسان فولاد خام</p>
          </div>
        </div>

        {/* 12-Month Price Trend Chart */}
        <div className="swiss-card p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="text-base font-bold text-[#141414]">
                روند ۱۲ ماهه میانگین بهای تمام‌شده خرید (USD / Unit)
              </h3>
              <p className="text-xs text-[#7E7D7A] mt-0.5">
                نمودار راست‌به‌چپ: کاهش تدریجی بهای خرید از $۳.۵۵ به $۲.۹۵ با تغییر سبد تأمین
              </p>
            </div>
            <div className="flex items-center gap-1 bg-[#F5F4F0] p-1 rounded-lg text-xs">
              {(['6m', '12m', '24m'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setTimeRange(r)}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    timeRange === r ? 'bg-white font-bold text-[#181818] shadow-sm' : 'text-[#7E7D7A]'
                  }`}
                >
                  {r === '6m' ? '۶ ماه' : r === '12m' ? '۱۲ ماه' : '۲۴ ماه'}
                </button>
              ))}
            </div>
          </div>

          {/* SVG Trend Line Chart */}
          <div className="relative w-full overflow-x-auto pt-2">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full h-44 overflow-visible"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#EE6123" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#EE6123" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              <line x1="0" y1="30" x2={chartWidth} y2="30" stroke="#E3E1DD" strokeDasharray="3 3" />
              <line x1="0" y1="80" x2={chartWidth} y2="80" stroke="#E3E1DD" strokeDasharray="3 3" />
              <line x1="0" y1="130" x2={chartWidth} y2="130" stroke="#E3E1DD" strokeDasharray="3 3" />

              {/* Shaded Area */}
              <path d={areaPath} fill="url(#trendGradient)" />

              {/* Solid Line */}
              <path
                d={svgPath}
                fill="none"
                stroke="#EE6123"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data points */}
              {points.map((pt, i) => (
                <g key={i}>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={i === points.length - 1 || i === 0 ? 5 : 3.5}
                    fill={i === points.length - 1 ? '#FDF498' : '#FFFFFF'}
                    stroke="#EE6123"
                    strokeWidth="2.5"
                  />
                  {/* Values for key points */}
                  {(i === 0 || i === 5 || i === points.length - 1) && (
                    <text
                      x={pt.x}
                      y={pt.y - 10}
                      textAnchor="middle"
                      className="text-[10px] fill-[#141414] font-bold"
                    >
                      ${toPersianDigits(pt.price.toFixed(2))}
                    </text>
                  )}
                </g>
              ))}
            </svg>

            {/* X Axis Labels */}
            <div className="flex justify-between items-center text-[10px] text-[#7E7D7A] mt-2 px-1">
              {priceTrend12M.filter((_, idx) => idx % 2 === 0 || idx === priceTrend12M.length - 1).map((pt, i) => (
                <span key={i}>{pt.month}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Two-Column Quick Status: Open RFQs & Samples/Inspections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Open RFQs Box */}
          <div className="swiss-card p-5">
            <div className="flex items-center justify-between pb-3 hairline-b">
              <div>
                <h4 className="text-sm font-bold text-[#141414]">استعلام‌های قیمت فعال (RFQ)</h4>
                <p className="text-[11px] text-[#7E7D7A] mt-0.5">۳ فقره در جریان مذاکره و تکمیل قیمت</p>
              </div>
              <button
                onClick={() => onNavigate('rfq')}
                className="text-xs font-semibold text-[#EE6123] hover:underline flex items-center gap-1"
              >
                مشاهده همه
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="mt-3 space-y-3">
              {MOCK_RFQS.map((rfq) => (
                <div
                  key={rfq.id}
                  onClick={() => onNavigate('rfq', { selectedRfqId: rfq.id })}
                  className="p-3 rounded-lg bg-[#F9F9F8] hover:bg-[#F3F2EE] transition-colors cursor-pointer flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-[#141414]">{rfq.title}</div>
                    <div className="text-[11px] text-[#7E7D7A]">
                      {rfq.productName} · {toPersianDigits(rfq.quantity.toLocaleString())} {rfq.unit}
                    </div>
                  </div>
                  <div className="text-left shrink-0">
                    <span className="inline-block px-2 py-0.5 rounded bg-white text-[#181818] font-medium text-[11px] shadow-xs">
                      {toPersianDigits(rfq.respondedCount)} از {toPersianDigits(rfq.invitedCount)} پاسخ
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Samples & Inspections Status */}
          <div className="swiss-card p-5">
            <div className="flex items-center justify-between pb-3 hairline-b">
              <div>
                <h4 className="text-sm font-bold text-[#141414]">وضعیت نمونه‌ها و ممیزی حضوری</h4>
                <p className="text-[11px] text-[#7E7D7A] mt-0.5">رهگیری محموله‌های آزمایشی و ارزیابی کیفی</p>
              </div>
              <button
                onClick={() => onNavigate('trust-score')}
                className="text-xs font-semibold text-[#EE6123] hover:underline flex items-center gap-1"
              >
                لایه اعتماد
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="mt-3 space-y-2.5">
              <div className="p-3 rounded-lg bg-[#F9F9F8] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#52C41A]/10 text-[#52C41A] flex items-center justify-center shrink-0">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-[#141414]">تأییدیه تست متالورژی نمونه VinaPrecision</div>
                    <div className="text-[11px] text-[#7E7D7A]">سختی راکول HRC 62.4 · انطباق کامل استاندارد</div>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-[#52C41A]">تأیید شد</span>
              </div>

              <div className="p-3 rounded-lg bg-[#F9F9F8] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#FA8C16]/10 text-[#FA8C16] flex items-center justify-center shrink-0">
                    <FileCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-[#141414]">ممیزی حضوری خطوط اکستروژن Anatolia Bursa</div>
                    <div className="text-[11px] text-[#7E7D7A]">بازرس SGS اعزام شد · زمان تحویل گزارش: ۲ روز کاری</div>
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-[#FA8C16]">در حال اجرا</span>
              </div>

              <div className="p-3 rounded-lg bg-[#F9F9F8] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#BFBDB8]/20 text-[#7E7D7A] flex items-center justify-center shrink-0">
                    <Package className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-[#141414]">ارسال نمونه ۵ تایی شیرآلات Orient Ningbo</div>
                    <div className="text-[11px] text-[#7E7D7A]">کد رهگیری DHL: 749204128 · گمرک فرودگاه امام</div>
                  </div>
                </div>
                <span className="text-[11px] text-[#7E7D7A]">در گمرک</span>
              </div>
            </div>
          </div>
        </div>

        {/* Current Active Suppliers List */}
        <div className="swiss-card p-5">
          <div className="flex items-center justify-between pb-3 hairline-b mb-3">
            <div>
              <h4 className="text-sm font-bold text-[#141414]">تأمین‌کنندگان برتر و مورد اعتماد فعلی</h4>
              <p className="text-[11px] text-[#7E7D7A] mt-0.5">کارخانجات با قرارداد باز یا سفارش فعال در ۳ ماه اخیر</p>
            </div>
            <button
              onClick={() => onNavigate('suppliers')}
              className="text-xs font-semibold text-[#181818] bg-[#F5F4F0] px-3 py-1.5 rounded-lg hover:bg-[#EBEAE5] transition-colors"
            >
              مدیریت کل تأمین‌کنندگان ({toPersianDigits(MOCK_SUPPLIERS.length)})
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-right">
              <thead>
                <tr className="text-[#7E7D7A] hairline-b pb-2">
                  <th className="py-2 font-medium">نام تجاری و مبدأ</th>
                  <th className="py-2 font-medium">نوع فعالیت</th>
                  <th className="py-2 font-medium">امتیاز اعتماد</th>
                  <th className="py-2 font-medium">تحویل به‌موقع</th>
                  <th className="py-2 font-medium">حداقل سفارش (MOQ)</th>
                  <th className="py-2 font-medium text-left">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3E1DD]">
                {MOCK_SUPPLIERS.slice(0, 4).map((sup) => (
                  <tr key={sup.id} className="hover:bg-[#FAF9F6] transition-colors">
                    <td className="py-3 font-semibold text-[#141414] flex items-center gap-2">
                      <span className="text-base">{sup.flag}</span>
                      <div>
                        <div>{sup.tradeName}</div>
                        <div className="text-[11px] text-[#7E7D7A] font-normal">{sup.city}</div>
                      </div>
                    </td>
                    <td className="py-3 text-[#141414]">{sup.type}</td>
                    <td className="py-3 font-bold text-[#181818]">
                      <span className="px-2 py-0.5 rounded bg-[#FDF498] text-[#181818] text-[11px] font-bold">
                        {toPersianDigits(sup.trustScore)}/۱۰۰
                      </span>
                    </td>
                    <td className="py-3 text-[#52C41A] font-semibold tabular-nums">
                      {formatPersianPercent(sup.onTimeDeliveryRate)}
                    </td>
                    <td className="py-3 text-[#141414] tabular-nums">
                      {toPersianDigits(sup.moq.toLocaleString())} عدد
                    </td>
                    <td className="py-3 text-left">
                      <button
                        onClick={() => onNavigate('suppliers', { selectedSupplierId: sup.id })}
                        className="px-2.5 py-1 text-[11px] rounded bg-[#181818] text-white hover:bg-black transition-colors"
                      >
                        مشاهده پرونده
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Solid Orange Feature Panel on Left (~30% width) */}
      <OrangeFeaturePanel
        title="فرصت‌های جدید تأمین"
        badge="هوش تحلیلی"
        subtitle="۳ پیشنهاد ارزیابی‌شده با بیشترین صرفه‌جویی نسبت به خرید سنتی"
        footerActions={
          <button
            onClick={() => setDownloadModalOpen(true)}
            className="w-full bg-[#181818] text-white hover:bg-black py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4 text-[#FDF498]" />
            دانلود گزارش برای مدیر خرید (PDF)
          </button>
        }
      >
        {/* Opportunity 1: VinaPrecision */}
        <div className="bg-white/10 rounded-xl p-3.5 backdrop-blur-xs border border-white/15 space-y-2">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">🇻🇳</span>
              <div>
                <div className="font-bold text-white text-sm">VinaPrecision Industries</div>
                <div className="text-[11px] text-white/80">هانوی، ویتنام</div>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-[#FDF498] text-[#181818] text-[11px] font-bold">
              ۸۳ / ۱۰۰
            </span>
          </div>
          <div className="flex items-center justify-between text-xs pt-1 border-t border-white/10">
            <span className="text-white/80">کاهش بهای تمام‌شده:</span>
            <span className="font-extrabold text-[#FDF498] text-sm tabular-nums">
              {toPersianDigits('۸.۷٪')} صرفه‌جویی
            </span>
          </div>
          <p className="text-[11px] text-white/80 leading-relaxed">
            ظرفیت تولید ۱.۸ میلیون قطعه، استاندارد ISO 9001، زمان حمل ۲۰ روز.
          </p>
          <button
            onClick={() => onNavigate('suppliers', { selectedSupplierId: 'sup-2' })}
            className="w-full mt-1 bg-white text-[#EE6123] hover:bg-white/90 py-1.5 px-3 rounded-lg text-xs font-bold transition-colors"
          >
            بررسی پرونده و استعلام
          </button>
        </div>

        {/* Opportunity 2: Anatolia Bursa */}
        <div className="bg-white/10 rounded-xl p-3.5 backdrop-blur-xs border border-white/15 space-y-2">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">🇹🇷</span>
              <div>
                <div className="font-bold text-white text-sm">Anatolia Forging & Metal</div>
                <div className="text-[11px] text-white/80">بورسا، ترکیه</div>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-bold">
              ۸۸ / ۱۰۰
            </span>
          </div>
          <div className="flex items-center justify-between text-xs pt-1 border-t border-white/10">
            <span className="text-white/80">مزیت اصلی:</span>
            <span className="font-bold text-white text-xs">ترانزیت زمینی ۱۲ روزه</span>
          </div>
          <p className="text-[11px] text-white/80 leading-relaxed">
            معافیت تعرفه ترجیحی دوجانبه و مناسب سفارش‌های قطعات فوری و پرتیراژ.
          </p>
          <button
            onClick={() => onNavigate('suppliers', { selectedSupplierId: 'sup-3' })}
            className="w-full mt-1 bg-white/15 hover:bg-white/25 text-white py-1.5 px-3 rounded-lg text-xs font-semibold transition-colors"
          >
            مشاهده شرایط تحویل
          </button>
        </div>

        {/* Opportunity 3: Bharat Bearings */}
        <div className="bg-white/10 rounded-xl p-3.5 backdrop-blur-xs border border-white/15 space-y-2">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">🇮🇳</span>
              <div>
                <div className="font-bold text-white text-sm">Bharat Mechanicals</div>
                <div className="text-[11px] text-white/80">راجکوت، هند</div>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-bold">
              ۸۱ / ۱۰۰
            </span>
          </div>
          <div className="flex items-center justify-between text-xs pt-1 border-t border-white/10">
            <span className="text-white/80">صرفه‌جویی کرایه دریایی:</span>
            <span className="font-bold text-[#FDF498] text-xs">حمل مستقیم چابهار</span>
          </div>
          <p className="text-[11px] text-white/80 leading-relaxed">
            امکان تسویه ارزی بدون دلار با مکانیزم مستقیم روپیه/درهم.
          </p>
        </div>
      </OrangeFeaturePanel>

      {/* Report Modal */}
      {downloadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="swiss-card max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#EE6123]/10 text-[#EE6123] flex items-center justify-center">
                  <FileDown className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#141414]">گزارش جامع مدیر خرید</h3>
                  <p className="text-xs text-[#7E7D7A]">تهیه گزارش مدیریتی دوره پاییز ۱۴۰۴</p>
                </div>
              </div>
            </div>

            <div className="bg-[#F5F4F0] p-3 rounded-lg text-xs space-y-1.5 text-[#141414]">
              <div className="flex justify-between">
                <span>تعداد کالاهای تحلیل‌شده:</span>
                <span className="font-bold">{toPersianDigits('۲۴ کالا')}</span>
              </div>
              <div className="flex justify-between">
                <span>پیش‌بینی صرفه‌جویی سالانه:</span>
                <span className="font-bold text-[#52C41A]">{toPersianDigits('$۴۱۲,۰۰۰')}</span>
              </div>
              <div className="flex justify-between">
                <span>فرمت فایل خروجی:</span>
                <span className="font-bold">PDF استاندارد گزارش هیئت مدیره</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleDownloadReport}
                className="flex-1 bg-[#181818] text-white py-2 rounded-xl text-xs font-bold hover:bg-black transition-colors"
              >
                تأیید و دریافت فایل
              </button>
              <button
                onClick={() => setDownloadModalOpen(false)}
                className="px-4 py-2 bg-[#F5F4F0] text-[#141414] hover:bg-[#EAE8E4] rounded-xl text-xs font-medium transition-colors"
              >
                انصراف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
