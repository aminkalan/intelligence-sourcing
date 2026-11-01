import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  Building2,
  Clock,
  Package,
  Shield,
  FileCheck2,
  Send,
  X,
  ChevronLeft,
  Award,
  Globe,
  SlidersHorizontal,
  ShieldCheck,
  Factory,
  Zap,
  Check,
  AlertTriangle,
  Video,
  FileCheck,
  Layers,
} from 'lucide-react';
import { OrangeFeaturePanel } from '../common/OrangeFeaturePanel';
import { MOCK_SUPPLIERS } from '../../data/mockData';
import { Supplier, SupplierType, PageId } from '../../types';
import { toPersianDigits, formatPersianPercent } from '../../utils/persian';
import { useToast } from '../common/Toast';

interface SuppliersPageProps {
  onNavigate: (page: PageId, extra?: any) => void;
  initialSupplierId?: string;
}

export const SuppliersPage: React.FC<SuppliersPageProps> = ({
  onNavigate,
  initialSupplierId,
}) => {
  const { showToast } = useToast();

  // Filters
  const [search, setSearch] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [minTrustScore, setMinTrustScore] = useState<number>(75);
  const [profileTab, setProfileTab] = useState<'overview' | 'factory_audit' | 'anti_fraud'>('overview');

  // Selected Supplier for Detail Modal / Profile View
  const [activeSupplier, setActiveSupplier] = useState<Supplier | null>(() => {
    if (initialSupplierId) {
      return MOCK_SUPPLIERS.find((s) => s.id === initialSupplierId) || MOCK_SUPPLIERS[1]; // default Vietnam
    }
    return MOCK_SUPPLIERS[1]; // VinaPrecision default
  });

  const filteredSuppliers = useMemo(() => {
    return MOCK_SUPPLIERS.filter((s) => {
      const matchSearch =
        s.tradeName.toLowerCase().includes(search.toLowerCase()) ||
        s.legalName.toLowerCase().includes(search.toLowerCase()) ||
        s.country.includes(search) ||
        s.city.toLowerCase().includes(search.toLowerCase());

      const matchCountry = selectedCountry === 'all' || s.country === selectedCountry;
      const matchType = selectedType === 'all' || s.type === selectedType;
      const matchScore = s.trustScore >= minTrustScore;

      return matchSearch && matchCountry && matchType && matchScore;
    });
  }, [search, selectedCountry, selectedType, minTrustScore]);

  const handleRequestQuote = (supplier: Supplier) => {
    showToast(
      'انتقال به صدور استعلام قیمت',
      `تأمین‌کننده ${supplier.tradeName} در پیش‌نویس استعلام قرار گرفت.`,
      'info'
    );
    onNavigate('rfq', { preselectedSupplierId: supplier.id });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      {/* Main Content Area (Right Side ~70%) */}
      <div className="flex-1 w-full space-y-6">
        {/* Search & Filter Toolbar */}
        <div className="swiss-card p-4 sm:p-5 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="جست‌وجوی نام کارخانه، شهر یا کشور..."
                className="w-full bg-[#F5F4F0] text-xs text-[#141414] rounded-lg py-2 pl-3 pr-8 focus:outline-none focus:bg-white border border-transparent focus:border-[#EE6123] transition-all"
              />
              <Search className="w-3.5 h-3.5 text-[#7E7D7A] absolute right-2.5 top-2.5" />
            </div>

            {/* Country Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto p-1 bg-[#F5F4F0] rounded-lg text-xs">
              {[
                { id: 'all', label: 'همه کشورها' },
                { id: 'چین', label: 'چین 🇨🇳' },
                { id: 'ویتنام', label: 'ویتنام 🇻🇳' },
                { id: 'ترکیه', label: 'ترکیه 🇹🇷' },
                { id: 'هند', label: 'هند 🇮🇳' },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCountry(c.id)}
                  className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap ${
                    selectedCountry === c.id
                      ? 'bg-white font-bold text-[#181818] shadow-xs'
                      : 'text-[#7E7D7A] hover:text-[#141414]'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sub Filters: Type & Min Trust Score */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 hairline-t text-xs">
            {/* Type selector */}
            <div className="flex items-center gap-2">
              <span className="text-[#7E7D7A]">نوع تأمین‌کننده:</span>
              <div className="flex items-center gap-1">
                {(['all', 'سازنده مستقیم', 'عمده‌فروش رسمی', 'کارگزار و تجاری'] as const).map(
                  (t) => (
                    <button
                      key={t}
                      onClick={() => setSelectedType(t)}
                      className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                        selectedType === t
                          ? 'bg-[#181818] text-white font-semibold'
                          : 'bg-[#F5F4F0] text-[#7E7D7A] hover:text-[#141414]'
                      }`}
                    >
                      {t === 'all' ? 'همه' : t}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Min Trust Score Slider */}
            <div className="flex items-center gap-2">
              <span className="text-[#7E7D7A]">حداقل نمره اعتماد:</span>
              <span className="font-bold text-[#181818] tabular-nums">
                {toPersianDigits(minTrustScore)}/۱۰۰
              </span>
              <input
                type="range"
                min="70"
                max="90"
                value={minTrustScore}
                onChange={(e) => setMinTrustScore(Number(e.target.value))}
                className="w-24 accent-[#EE6123] cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Suppliers Grid / List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSuppliers.map((supplier) => {
            const isSelected = activeSupplier?.id === supplier.id;
            return (
              <div
                key={supplier.id}
                onClick={() => setActiveSupplier(supplier)}
                className={`swiss-card p-5 cursor-pointer transition-all relative ${
                  isSelected
                    ? 'ring-2 ring-[#181818] shadow-lg'
                    : 'hover:border-[#EE6123]/40 hover:shadow-md'
                }`}
              >
                {/* Header with Flag, Trade Name and Trust Badge */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{supplier.flag}</span>
                    <div>
                      <h4 className="font-bold text-sm text-[#141414] leading-snug">
                        {supplier.tradeName}
                      </h4>
                      <p className="text-[11px] text-[#7E7D7A]">{supplier.city}</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-[#FDF498] text-[#181818] text-xs font-bold shrink-0">
                    {toPersianDigits(supplier.trustScore)}/۱۰۰
                  </span>
                </div>

                {/* Type and Verification Status */}
                <div className="mt-3 flex items-center gap-2 text-[11px]">
                  <span className="px-2 py-0.5 rounded bg-[#F5F4F0] text-[#141414] font-medium">
                    {supplier.type}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#52C41A]/10 text-[#52C41A] font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {supplier.verifiedStatus}
                  </span>
                  <span className="text-[#7E7D7A] mr-auto">
                    تأسیس {toPersianDigits(supplier.foundedYear)}
                  </span>
                </div>

                {/* Key Metrics Strip */}
                <div className="grid grid-cols-3 gap-2 mt-4 pt-3 hairline-t text-center text-xs">
                  <div>
                    <div className="text-[10px] text-[#7E7D7A]">حداقل سفارش</div>
                    <div className="font-bold text-[#141414] mt-0.5 tabular-nums">
                      {toPersianDigits(supplier.moq.toLocaleString())}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#7E7D7A]">زمان تحویل</div>
                    <div className="font-bold text-[#141414] mt-0.5 tabular-nums">
                      {toPersianDigits(supplier.leadTimeDays)} روز
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#7E7D7A]">تحویل به‌موقع</div>
                    <div className="font-bold text-[#52C41A] mt-0.5 tabular-nums">
                      {formatPersianPercent(supplier.onTimeDeliveryRate)}
                    </div>
                  </div>
                </div>

                {/* Footer Certifications */}
                <div className="mt-3 pt-2 hairline-t flex items-center justify-between text-[11px] text-[#7E7D7A]">
                  <div className="truncate max-w-[200px]">
                    {supplier.certifications.join(' · ')}
                  </div>
                  <span className="text-[#EE6123] font-semibold flex items-center gap-0.5">
                    مشاهده پرونده
                    <ChevronLeft className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Supplier Profile Drawer / Modal (When activeSupplier is chosen) */}
        {activeSupplier && (
          <div className="swiss-card p-6 border-2 border-[#181818]/10 space-y-6">
            {/* Profile Top Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 hairline-b">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{activeSupplier.flag}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-[#141414]">
                      {activeSupplier.legalName}
                    </h3>
                    <span className="px-2 py-0.5 rounded bg-[#FDF498] text-[#181818] text-xs font-bold">
                      امتیاز اعتماد: {toPersianDigits(activeSupplier.trustScore)}/۱۰۰
                    </span>
                  </div>
                  <p className="text-xs text-[#7E7D7A] mt-0.5">
                    {activeSupplier.tradeName} · {activeSupplier.city} · سال تأسیس:{' '}
                    {toPersianDigits(activeSupplier.foundedYear)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleRequestQuote(activeSupplier)}
                  className="bg-[#181818] text-white hover:bg-black px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5 text-[#FDF498]" />
                  استعلام قیمت (RFQ)
                </button>
              </div>
            </div>

            {/* Profile Sub-Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-[#E3E1DD] pb-2 text-xs overflow-x-auto">
              <button
                onClick={() => setProfileTab('overview')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors flex items-center gap-1.5 shrink-0 ${
                  profileTab === 'overview'
                    ? 'bg-[#181818] text-white shadow-xs'
                    : 'text-[#7E7D7A] hover:text-[#141414] hover:bg-[#F5F4F0]'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>مشخصات فنی و عملکرد تجاری</span>
              </button>

              <button
                onClick={() => setProfileTab('factory_audit')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors flex items-center gap-1.5 shrink-0 ${
                  profileTab === 'factory_audit'
                    ? 'bg-[#181818] text-white shadow-xs'
                    : 'text-[#7E7D7A] hover:text-[#141414] hover:bg-[#F5F4F0]'
                }`}
              >
                <Factory className="w-3.5 h-3.5" />
                <span>ممیزی فیزیکی کارخانه و ماشین‌آلات</span>
              </button>

              <button
                onClick={() => setProfileTab('anti_fraud')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors flex items-center gap-1.5 shrink-0 ${
                  profileTab === 'anti_fraud'
                    ? 'bg-[#181818] text-white shadow-xs'
                    : 'text-[#7E7D7A] hover:text-[#141414] hover:bg-[#F5F4F0]'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>احراز تولیدکننده واقعی در برابر دلال (Anti-Fraud)</span>
              </button>
            </div>

            {/* TAB 1: OVERVIEW & PERFORMANCE */}
            {profileTab === 'overview' && (
              <>
                {/* Description & Capacity */}
                <div className="bg-[#FAF9F7] p-4 rounded-xl text-xs text-[#141414] leading-relaxed">
                  <div className="font-semibold text-sm mb-1 text-[#181818]">درباره کارخانه:</div>
                  {activeSupplier.description}
                </div>

                {/* Data Grid: Terms, Capacity & Export Markets */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div className="p-3 rounded-lg bg-[#F5F4F0]">
                    <span className="text-[#7E7D7A] text-[11px] block">ظرفیت تولید ماهانه</span>
                    <span className="font-bold text-[#141414] mt-1 block">
                      {toPersianDigits(activeSupplier.capacityMonthly)}
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#F5F4F0]">
                    <span className="text-[#7E7D7A] text-[11px] block">اینکوترمز تحویل</span>
                    <span className="font-bold text-[#141414] mt-1 block truncate">
                      {activeSupplier.incoterms.join(' · ')}
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#F5F4F0]">
                    <span className="text-[#7E7D7A] text-[11px] block">شرایط پرداخت متعارف</span>
                    <span className="font-bold text-[#141414] mt-1 block truncate">
                      {activeSupplier.paymentTerms}
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-[#F5F4F0]">
                    <span className="text-[#7E7D7A] text-[11px] block">بازارهای صادراتی فعال</span>
                    <span className="font-bold text-[#141414] mt-1 block truncate">
                      {activeSupplier.exportMarkets.join(' · ')}
                    </span>
                  </div>
                </div>

                {/* Charts Section: On-time Delivery Donut & Export History Bar Chart */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  {/* Donut Gauge: On-time delivery rate */}
                  <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E3E1DD] flex items-center justify-between">
                    <div>
                      <h5 className="font-bold text-xs text-[#141414]">نرخ تحویل به‌موقع سفارشات</h5>
                      <p className="text-[11px] text-[#7E7D7A] mt-1">
                        ثبت خروج به موقع کالا در گمرک مبدأ بر اساس اسناد بارنامه
                      </p>
                      <div className="mt-3 flex items-center gap-2">
                        <span className="text-2xl font-black text-[#52C41A] tabular-nums">
                          {formatPersianPercent(activeSupplier.onTimeDeliveryRate)}
                        </span>
                        <span className="text-[11px] text-[#7E7D7A]">
                          شکایت/تأخیر: {formatPersianPercent(activeSupplier.complaintRate)}
                        </span>
                      </div>
                    </div>

                    {/* SVG Donut */}
                    <div className="relative w-20 h-20 shrink-0">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                        <path
                          className="text-[#E3E1DD]"
                          strokeWidth="3.5"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                        <path
                          className="text-[#52C41A]"
                          strokeDasharray={`${activeSupplier.onTimeDeliveryRate}, 100`}
                          strokeWidth="3.5"
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="none"
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-[#141414]">
                        {toPersianDigits(Math.round(activeSupplier.onTimeDeliveryRate))}٪
                      </div>
                    </div>
                  </div>

                  {/* Bar Chart: Export history (M USD) */}
                  <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#E3E1DD]">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-bold text-xs text-[#141414]">روند حجم صادرات سالانه (M USD)</h5>
                      <span className="text-[10px] text-[#7E7D7A]">داده‌های رسمی گمرک مبدأ</span>
                    </div>

                    <div className="flex items-end justify-between gap-3 h-20 pt-2">
                      {activeSupplier.exportHistoryAnnual.map((item) => {
                        const maxVol = 30;
                        const heightPct = Math.round((item.volumeMUsd / maxVol) * 100);
                        return (
                          <div key={item.year} className="flex-1 flex flex-col items-center gap-1.5">
                            <span className="text-[10px] font-bold text-[#141414] tabular-nums">
                              ${toPersianDigits(item.volumeMUsd.toFixed(1))}M
                            </span>
                            <div className="w-full bg-[#F5F4F0] rounded-t-md h-12 flex items-end">
                              <div
                                style={{ height: `${heightPct}%` }}
                                className="w-full bg-[#181818] rounded-t-md transition-all duration-300 group-hover:bg-[#EE6123]"
                              />
                            </div>
                            <span className="text-[10px] text-[#7E7D7A]">
                              {toPersianDigits(item.year)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* TAB 2: FACTORY PHYSICAL AUDIT */}
            {profileTab === 'factory_audit' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-[#FAF9F7] border border-[#E3E1DD] space-y-1">
                    <span className="text-[#7E7D7A] block text-[11px]">مساحت سالن تولید و انبار</span>
                    <span className="font-bold text-sm text-[#141414] block">۲۸,۰۰۰ متر مربع</span>
                    <span className="text-[10px] text-[#52C41A] font-semibold">مالکیت ثبتی تأییدشده</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#FAF9F7] border border-[#E3E1DD] space-y-1">
                    <span className="text-[#7E7D7A] block text-[11px]">تعداد پرسنل فنی و مهندسی</span>
                    <span className="font-bold text-sm text-[#141414] block">۲۴۰ نفر در ۳ شیفت کاری</span>
                    <span className="text-[10px] text-[#52C41A] font-semibold">بیمه تأمین اجتماعی فعال</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#FAF9F7] border border-[#E3E1DD] space-y-1">
                    <span className="text-[#7E7D7A] block text-[11px]">مصرف برق صنعتی ماهانه</span>
                    <span className="font-bold text-sm text-[#141414] block">۲۲۰ کیلووات ساعت دیماند</span>
                    <span className="text-[10px] text-[#52C41A] font-semibold">اثبات کارکرد مستمر خطوط</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#FAF9F7] border border-[#E3E1DD] space-y-3 text-xs">
                  <h5 className="font-bold text-sm text-[#141414] flex items-center gap-2">
                    <Factory className="w-4 h-4 text-[#EE6123]" />
                    <span>تجهیزات و ماشین‌آلات احراز شده در ممیزی حضوری SGS</span>
                  </h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-[#141414]">
                    <div className="flex items-center gap-1.5 p-2 bg-white rounded-lg border border-[#E3E1DD]">
                      <Check className="w-3.5 h-3.5 text-[#52C41A] shrink-0" />
                      <span>۱۲ دستگاه تراش و سنگ‌زنی CNC پنج محوره DMG MORI آلمان</span>
                    </div>
                    <div className="flex items-center gap-1.5 p-2 bg-white rounded-lg border border-[#E3E1DD]">
                      <Check className="w-3.5 h-3.5 text-[#52C41A] shrink-0" />
                      <span>۲ خط کوره سخت‌کاری حرارتی تحت خلأ با کنترل دمای اتوماتیک</span>
                    </div>
                    <div className="flex items-center gap-1.5 p-2 bg-white rounded-lg border border-[#E3E1DD]">
                      <Check className="w-3.5 h-3.5 text-[#52C41A] shrink-0" />
                      <span>دستگاه کوانتومتری متالورژی ARL جهت آنالیز ترکیب شیمیایی فولاد</span>
                    </div>
                    <div className="flex items-center gap-1.5 p-2 bg-white rounded-lg border border-[#E3E1DD]">
                      <Check className="w-3.5 h-3.5 text-[#52C41A] shrink-0" />
                      <span>آزمایشگاه تست لرزش و سختی‌سنجی راکول (HRC) با استاندارد DIN</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: ANTI-FRAUD & BROKER DETECTION SHIELD */}
            {profileTab === 'anti_fraud' && (
              <div className="space-y-4 text-xs">
                {/* Result Hero Banner */}
                <div className="p-4 rounded-xl bg-[#52C41A]/10 border border-[#52C41A]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#52C41A] text-white flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-[#141414]">
                        نتیجه پالایش هوشمند: تولیدکننده مستقیم واقعی (Direct OEM Manufacturer)
                      </div>
                      <div className="text-[11px] text-[#7E7D7A]">
                        فاقد نشانه‌های شرکت‌های کاغذی، دلالان بدون انبار یا حساب‌های واسط بانکی
                      </div>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#52C41A] text-white font-bold text-xs shrink-0">
                    ضریب ایمنی: ۹۵٪
                  </span>
                </div>

                {/* Anti-Fraud Checklist */}
                <div className="p-4 rounded-xl bg-[#FAF9F7] border border-[#E3E1DD] space-y-2.5">
                  <h5 className="font-bold text-sm text-[#141414] mb-2">
                    چک‌لیست ۱۰ ماده‌ای راستی‌آزمایی و مقابله با تقلب تجاری
                  </h5>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-[#E3E1DD]">
                      <span className="font-medium">۱. تطبیق نام دارنده حساب بانکی با نام ثبتی رسمی شرکت</span>
                      <span className="text-[#52C41A] font-bold flex items-center gap-1">
                        <Check className="w-4 h-4" />
                        تطبیق ۱۰۰٪
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-[#E3E1DD]">
                      <span className="font-medium">۲. سابقه ثبت دامنه اینترنتی در مقایسه با تاریخ ادعایی تأسیس</span>
                      <span className="text-[#52C41A] font-bold flex items-center gap-1">
                        <Check className="w-4 h-4" />
                        ثبت دامنه از ۲۰۱۴ (منطبق)
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-[#E3E1DD]">
                      <span className="font-medium">۳. اصالت تصاویر کاتالوگ (عدم سرقت عکس در جست‌وجوی معکوس وب)</span>
                      <span className="text-[#52C41A] font-bold flex items-center gap-1">
                        <Check className="w-4 h-4" />
                        تصاویر اختصاصی کارخانه
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-[#E3E1DD]">
                      <span className="font-medium">۴. سوابق اظهارنامه صادراتی و کوتاژهای خروج کانتینر</span>
                      <span className="text-[#52C41A] font-bold flex items-center gap-1">
                        <Check className="w-4 h-4" />
                        ۳۴۰ فقره بارنامه معتبر
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-[#E3E1DD]">
                      <span className="font-medium">۵. بررسی پروانه بهره‌برداری وزارت صنایع و مالیات مستقیم</span>
                      <span className="text-[#52C41A] font-bold flex items-center gap-1">
                        <Check className="w-4 h-4" />
                        مجوز فعال تا ۲۰۲۸
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Solid Orange Feature Panel on Left */}
      <OrangeFeaturePanel
        title="ارزیابی ممیزی و کشف"
        badge="بانک جامع"
        subtitle="بررسی شاخص‌های اعتباری تأمین‌کنندگان بین‌المللی"
        footerActions={
          <button
            onClick={() => onNavigate('trust-score')}
            className="w-full bg-[#181818] text-white hover:bg-black py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
          >
            <span>مشاهده ۸ لایه اعتبارسنجی</span>
            <Shield className="w-4 h-4 text-[#FDF498]" />
          </button>
        }
      >
        <div className="bg-white/10 rounded-xl p-3.5 border border-white/15 space-y-2">
          <div className="font-bold text-sm text-white flex items-center gap-1.5">
            <Award className="w-4 h-4 text-[#FDF498]" />
            تأمین‌کننده با بالاترین امتیاز:
          </div>
          <div className="text-white text-xs">
            <div className="font-bold">Zhejiang Apex Precision (چین)</div>
            <div className="text-[11px] text-white/80">
              امتیاز اعتماد ۸۹ · ظرفیت ماهانه ۲.۵M قطعه · سابقه ۱۲ سال صادرات
            </div>
          </div>
        </div>

        <div className="bg-white/10 rounded-xl p-3.5 border border-white/15 space-y-2">
          <div className="font-bold text-sm text-white flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-[#FDF498]" />
            بیشترین صرفه‌جویی ثبت‌شده:
          </div>
          <div className="text-white text-xs">
            <div className="font-bold">VinaPrecision JSC (ویتنام)</div>
            <div className="text-[11px] text-white/80">
              کاهش ۸.۷ درصدی در بهای تمام‌شده تحویل بندرعباس
            </div>
          </div>
        </div>

        <div className="bg-black/15 rounded-xl p-3 border border-white/10 text-[11px] leading-relaxed text-white/90">
          <span className="font-bold text-[#FDF498] block mb-1">ضمانت اعتبارسنجی SourceIQ:</span>
          تمام ۱۰ تأمین‌کننده این فهرست دارای پروانه معتبر صادراتی، گزارش تطبیق حساب بانکی و عدم
          سابقه سوءپیشینه در فهرست سیاه بین‌المللی می‌باشند.
        </div>
      </OrangeFeaturePanel>
    </div>
  );
};
