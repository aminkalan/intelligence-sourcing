import React, { useState } from 'react';
import {
  UploadCloud,
  FileText,
  Sparkles,
  CheckCircle2,
  Layers,
  ArrowLeft,
  RefreshCw,
  Plus,
  X,
  Globe2,
  TrendingUp,
  BarChart3,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { OrangeFeaturePanel } from '../common/OrangeFeaturePanel';
import { toPersianDigits, formatPersianPercent } from '../../utils/persian';
import { useToast } from '../common/Toast';
import { PageId } from '../../types';
import { MOCK_COMTRADE_FLOWS } from '../../data/mockData';

interface ProductDefinitionPageProps {
  onNavigate: (page: PageId, extra?: any) => void;
}

export const ProductDefinitionPage: React.FC<ProductDefinitionPageProps> = ({ onNavigate }) => {
  const { showToast } = useToast();

  // 5-step stepper: (تعریف، تطبیق، مقایسه، استعلام، پایش)
  const steps = [
    { id: 1, name: 'تعریف کالا و مشخصات', active: true, pageId: 'product-definition' as PageId },
    { id: 2, name: 'تطبیق تأمین‌کنندگان', active: false, pageId: 'suppliers' as PageId },
    { id: 3, name: 'مقایسه بهای تمام‌شده', active: false, pageId: 'comparison' as PageId },
    { id: 4, name: 'استعلام قیمت (RFQ)', active: false, pageId: 'rfq' as PageId },
    { id: 5, name: 'پایش مستمر بازار', active: false, pageId: 'market-watch' as PageId },
  ];

  // Form State
  const [productName, setProductName] = useState('بلبرینگ صنعتی شیار عمیق دور بالا');
  const [hsCode, setHsCode] = useState('8483.40.00');
  const [brand, setBrand] = useState('OEM / برند اختصاصی وارداتی');
  const [material, setMaterial] = useState('فولاد بلبرینگ کروم GCr15 / رولر با سختی HRC 62-65');
  const [dimensions, setDimensions] = useState('قطر داخلی 25mm × قطر خارجی 52mm × ضخامت 15mm');
  const [packaging, setPackaging] = useState('پوشش روغنی ضدزنگ، وکیوم نایلونی، کارتن ۵۰ عددی روی پالت چوبی ISPM 15');
  const [grade, setGrade] = useState('کلاس دقت P5 (معادل ABEC-5) با لقی استاندارد C3');
  const [moq, setMoq] = useState('5000');
  const [annualVolume, setAnnualVolume] = useState('60000');
  const [requiredLeadTime, setRequiredLeadTime] = useState('25');
  const [targetBudget, setTargetBudget] = useState('3.20');
  const [paymentTerms, setPaymentTerms] = useState('۲۰٪ پیش‌پرداخت، ۸۰٪ پس از بازرسی SGS قبل از بارگیری');
  const [destination, setDestination] = useState('بندر عباس (اسکله شهید رجایی)');

  // Selected Standards Chips
  const [selectedStandards, setSelectedStandards] = useState<string[]>([
    'ISO 9001:2015',
    'IATF 16949',
    'CE Mark',
    'RoHS Compliant',
  ]);
  const availableStandards = [
    'ISO 9001:2015',
    'IATF 16949',
    'CE Mark',
    'RoHS Compliant',
    'TÜV Rheinland',
    'DIN 625',
    'SGS Metallurgy',
    'UL Listed',
  ];

  // Selected Countries Chips
  const [selectedCountries, setSelectedCountries] = useState<string[]>([
    'چین 🇨🇳',
    'ویتنام 🇻🇳',
    'ترکیه 🇹🇷',
    'هند 🇮🇳',
  ]);
  const availableCountries = [
    'چین 🇨🇳',
    'ویتنام 🇻🇳',
    'ترکیه 🇹🇷',
    'هند 🇮🇳',
    'مالزی 🇲🇾',
    'تایلند 🇹🇭',
  ];

  const [isExtracting, setIsExtracting] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const toggleStandard = (std: string) => {
    setSelectedStandards((prev) =>
      prev.includes(std) ? prev.filter((s) => s !== std) : [...prev, std]
    );
  };

  const toggleCountry = (country: string) => {
    setSelectedCountries((prev) =>
      prev.includes(country) ? prev.filter((c) => c !== country) : [...prev, country]
    );
  };

  const handleSimulateExtraction = () => {
    setIsExtracting(true);
    setTimeout(() => {
      setIsExtracting(false);
      setUploadedFileName('Spec_HighSpeed_Bearing_6205_2RS_v3.pdf');
      setProductName('بلبرینگ شیار عمیق صنعتی ۶۲۰۵-2RS با دور بالا');
      setHsCode('8483.40.00');
      setGrade('P5 / ABEC-5 دور بالا تا ۱۸,۰۰۰ دور در دقیقه');
      setMaterial('حلقه فولادی GCr15 با ساچمه‌های سیلیکون نیترید سرامیک Si3N4');
      setTargetBudget('3.10');
      showToast(
        'استخراج هوشمند کاتالوگ انجام شد',
        'مشخصات فنی، متریال، ابعاد و کد تعرفه گمرکی از فایل PDF استخراج گردید.',
        'success'
      );
    }, 900);
  };

  const handleFindSuppliers = () => {
    showToast(
      'فیلتر تأمین‌کنندگان اعمال شد',
      'انتقال به بانک اطلاعاتی با ۱۷ تأمین‌کننده سازگار با مشخصات واردشده.',
      'info'
    );
    onNavigate('suppliers');
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      {/* Main Content Area (Right Side ~70%) */}
      <div className="flex-1 w-full space-y-6">
        {/* 5-Step Stepper (تعریف، تطبیق، مقایسه، استعلام، پایش) */}
        <div className="swiss-card p-4 sm:p-5">
          <div className="flex items-center justify-between text-xs overflow-x-auto pb-2">
            {steps.map((step, idx) => (
              <div key={step.id} className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => onNavigate(step.pageId)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
                    step.active
                      ? 'bg-[#181818] text-white font-bold'
                      : 'text-[#7E7D7A] hover:text-[#141414] hover:bg-[#F5F4F0]'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      step.active ? 'bg-[#EE6123] text-white' : 'bg-[#E3E1DD] text-[#7E7D7A]'
                    }`}
                  >
                    {toPersianDigits(step.id)}
                  </span>
                  <span>{step.name}</span>
                </button>
                {idx < steps.length - 1 && (
                  <span className="text-[#C9C7C2] px-1 hidden sm:inline">←</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Drag & Drop Zone for Catalog / Spec PDF with 'AI extraction' tag */}
        <div className="swiss-card p-5 border-dashed border-2 border-[#C9C7C2] hover:border-[#EE6123] transition-all bg-[#FAF9F7]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#EE6123]/10 text-[#EE6123] flex items-center justify-center shrink-0">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-[#141414]">بارگذاری کاتالوگ یا نقشه فنی (PDF/CAD)</h3>
                  <span className="px-2 py-0.5 rounded bg-[#EE6123] text-white text-[10px] font-bold flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#FDF498]" />
                    استخراج خودکار هوش مصنوعی
                  </span>
                </div>
                <p className="text-xs text-[#7E7D7A] mt-0.5">
                  فایل مشخصات فنی سازنده را رها کنید تا فیلدها، تلرانس‌ها و استانداردهای کالا خودکار تکمیل شوند.
                </p>
                {uploadedFileName && (
                  <div className="mt-1.5 inline-flex items-center gap-1.5 text-xs text-[#52C41A] font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    فایل فعال: {uploadedFileName}
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleSimulateExtraction}
              disabled={isExtracting}
              className="shrink-0 bg-[#181818] text-white hover:bg-black px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
            >
              {isExtracting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#FDF498]" />
                  درحال استخراج مشخصات...
                </>
              ) : (
                <>
                  <FileText className="w-3.5 h-3.5 text-[#FDF498]" />
                  استخراج نمونه مشخصات فنی بلبرینگ
                </>
              )}
            </button>
          </div>
        </div>

        {/* Two-Column Specification Form */}
        <div className="swiss-card p-6">
          <div className="flex items-center justify-between pb-4 hairline-b mb-6">
            <div>
              <h3 className="text-base font-bold text-[#141414]">مشخصات جامع کالای وارداتی</h3>
              <p className="text-xs text-[#7E7D7A] mt-0.5">
                داده‌های استاندارد جهت استعلام قیمت بدون ابهام از سازندگان خارجی
              </p>
            </div>
            <button
              onClick={() => {
                showToast('پیش‌نویس ذخیره شد', 'اطلاعات در حافظه موقت ذخیره شد.', 'info');
              }}
              className="px-3 py-1.5 rounded-lg bg-[#F5F4F0] text-xs font-semibold text-[#181818] hover:bg-[#EBEAE5] transition-colors"
            >
              ذخیره پیش‌نویس
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-right">
            {/* Field 1: Product Name */}
            <div>
              <label className="block text-xs font-semibold text-[#141414] mb-1.5">
                نام کالا و شرح تجاری
              </label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full bg-[#F5F4F0] text-xs text-[#141414] rounded-lg p-2.5 border border-transparent focus:border-[#EE6123] focus:bg-white focus:outline-none transition-all"
              />
            </div>

            {/* Field 2: HS Code */}
            <div>
              <label className="block text-xs font-semibold text-[#141414] mb-1.5">
                کد تعرفه گمرکی (HS Code)
              </label>
              <input
                type="text"
                value={hsCode}
                onChange={(e) => setHsCode(e.target.value)}
                dir="ltr"
                className="w-full bg-[#F5F4F0] text-xs text-[#141414] font-mono rounded-lg p-2.5 border border-transparent focus:border-[#EE6123] focus:bg-white focus:outline-none transition-all text-left"
              />
            </div>

            {/* Field 3: Brand */}
            <div>
              <label className="block text-xs font-semibold text-[#141414] mb-1.5">
                برند / نام تجاری مطلوب
              </label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full bg-[#F5F4F0] text-xs text-[#141414] rounded-lg p-2.5 border border-transparent focus:border-[#EE6123] focus:bg-white focus:outline-none transition-all"
              />
            </div>

            {/* Field 4: Grade */}
            <div>
              <label className="block text-xs font-semibold text-[#141414] mb-1.5">
                گرید کیفی و کلاس دقت
              </label>
              <input
                type="text"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full bg-[#F5F4F0] text-xs text-[#141414] rounded-lg p-2.5 border border-transparent focus:border-[#EE6123] focus:bg-white focus:outline-none transition-all"
              />
            </div>

            {/* Field 5: Material, Dimensions, Weight */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-[#141414] mb-1.5">
                جنس آلیاژ، ابعاد دقیق و مشخصات فیزیکی
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="جنس و عملیات حرارتی"
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  className="w-full bg-[#F5F4F0] text-xs text-[#141414] rounded-lg p-2.5 border border-transparent focus:border-[#EE6123] focus:bg-white focus:outline-none transition-all"
                />
                <input
                  type="text"
                  placeholder="ابعاد، قطر و ضخامت"
                  value={dimensions}
                  onChange={(e) => setDimensions(e.target.value)}
                  className="w-full bg-[#F5F4F0] text-xs text-[#141414] rounded-lg p-2.5 border border-transparent focus:border-[#EE6123] focus:bg-white focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Field 6: Standards / Certifications Chips */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-[#141414] mb-1.5">
                استانداردها و سرتیفیکیت‌های اجباری کارخانه
              </label>
              <div className="flex flex-wrap gap-2">
                {availableStandards.map((std) => {
                  const isSelected = selectedStandards.includes(std);
                  return (
                    <button
                      key={std}
                      type="button"
                      onClick={() => toggleStandard(std)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        isSelected
                          ? 'bg-[#181818] text-white shadow-xs'
                          : 'bg-[#F5F4F0] text-[#7E7D7A] hover:text-[#141414]'
                      }`}
                    >
                      {std}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Field 7: Packaging */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-[#141414] mb-1.5">
                الزامات بسته‌بندی صادراتی و مقاومت در برابر رطوبت دریا
              </label>
              <input
                type="text"
                value={packaging}
                onChange={(e) => setPackaging(e.target.value)}
                className="w-full bg-[#F5F4F0] text-xs text-[#141414] rounded-lg p-2.5 border border-transparent focus:border-[#EE6123] focus:bg-white focus:outline-none transition-all"
              />
            </div>

            {/* Field 8: MOQ & Annual Volume */}
            <div>
              <label className="block text-xs font-semibold text-[#141414] mb-1.5">
                حداقل سفارش مجاز (MOQ)
              </label>
              <input
                type="text"
                value={toPersianDigits(moq)}
                onChange={(e) => setMoq(e.target.value)}
                className="w-full bg-[#F5F4F0] text-xs text-[#141414] rounded-lg p-2.5 border border-transparent focus:border-[#EE6123] focus:bg-white focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#141414] mb-1.5">
                حجم سفارش سالانه (عدد)
              </label>
              <input
                type="text"
                value={toPersianDigits(annualVolume)}
                onChange={(e) => setAnnualVolume(e.target.value)}
                className="w-full bg-[#F5F4F0] text-xs text-[#141414] rounded-lg p-2.5 border border-transparent focus:border-[#EE6123] focus:bg-white focus:outline-none transition-all"
              />
            </div>

            {/* Field 9: Accepted Origin Countries Chips */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-[#141414] mb-1.5">
                کشورهای مبدأ قابل قبول جهت استعلام
              </label>
              <div className="flex flex-wrap gap-2">
                {availableCountries.map((c) => {
                  const isSelected = selectedCountries.includes(c);
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => toggleCountry(c)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        isSelected
                          ? 'bg-[#181818] text-white shadow-xs'
                          : 'bg-[#F5F4F0] text-[#7E7D7A] hover:text-[#141414]'
                      }`}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Field 10: Lead time & Target Budget */}
            <div>
              <label className="block text-xs font-semibold text-[#141414] mb-1.5">
                حداکثر زمان تحویل کارخانه (روز)
              </label>
              <input
                type="text"
                value={toPersianDigits(requiredLeadTime)}
                onChange={(e) => setRequiredLeadTime(e.target.value)}
                className="w-full bg-[#F5F4F0] text-xs text-[#141414] rounded-lg p-2.5 border border-transparent focus:border-[#EE6123] focus:bg-white focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#141414] mb-1.5">
                بودجه هدف خرید (USD / Unit)
              </label>
              <input
                type="text"
                value={toPersianDigits(targetBudget)}
                onChange={(e) => setTargetBudget(e.target.value)}
                dir="ltr"
                className="w-full bg-[#F5F4F0] text-xs text-[#141414] rounded-lg p-2.5 border border-transparent focus:border-[#EE6123] focus:bg-white focus:outline-none transition-all text-left"
              />
            </div>

            {/* Field 11: Payment Terms & Destination */}
            <div>
              <label className="block text-xs font-semibold text-[#141414] mb-1.5">
                شرایط پرداخت پیشنهادی خریدار
              </label>
              <input
                type="text"
                value={paymentTerms}
                onChange={(e) => setPaymentTerms(e.target.value)}
                className="w-full bg-[#F5F4F0] text-xs text-[#141414] rounded-lg p-2.5 border border-transparent focus:border-[#EE6123] focus:bg-white focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#141414] mb-1.5">
                مقصد نهایی تحویل بار در ایران
              </label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full bg-[#F5F4F0] text-xs text-[#141414] rounded-lg p-2.5 border border-transparent focus:border-[#EE6123] focus:bg-white focus:outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* UN Comtrade Trade Flow Analysis & Benchmark Hub */}
        <div className="swiss-card p-6 space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 hairline-b">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#181818] text-[#FDF498] flex items-center justify-center shrink-0">
                <Globe2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-[#141414]">
                    پایگاه داده تجارت بین‌الملل UN Comtrade
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FDF498] text-[#141414]">
                    داده‌های رسمی سالانه
                  </span>
                </div>
                <p className="text-xs text-[#7E7D7A] mt-0.5">
                  تحلیل جریان صادرات جهانی، قیمت بنچمارک و سهم بازارهای آلترناتیو برای این کد تعرفه
                </p>
              </div>
            </div>

            {/* Quick HS Code Switcher */}
            <div className="flex items-center gap-1.5 bg-[#F5F4F0] p-1 rounded-xl text-xs">
              {MOCK_COMTRADE_FLOWS.map((flow) => (
                <button
                  key={flow.hsCode}
                  type="button"
                  onClick={() => {
                    setHsCode(flow.hsCode);
                    if (flow.hsCode === '8501.52.00') {
                      setProductName('الکتروموتور آسنکرون سه فاز صنعتی راندمان بالا');
                      setTargetBudget('145.00');
                    } else {
                      setProductName('بلبرینگ صنعتی شیار عمیق دور بالا');
                      setTargetBudget('3.20');
                    }
                    showToast(
                      'کد تعرفه به‌روزرسانی شد',
                      `جریان تجارت جهانی برای تعرفه ${flow.hsCode} بارگذاری گردید.`,
                      'info'
                    );
                  }}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    hsCode === flow.hsCode
                      ? 'bg-[#181818] text-white shadow-xs'
                      : 'text-[#7E7D7A] hover:text-[#141414]'
                  }`}
                >
                  <span>کد {flow.hsCode}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Current Selected Flow Details */}
          {(() => {
            const flow =
              MOCK_COMTRADE_FLOWS.find((f) => f.hsCode === hsCode) || MOCK_COMTRADE_FLOWS[0];

            return (
              <div className="space-y-4">
                {/* 3 Metric Tiles */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-[#FAF9F7] p-3.5 rounded-xl border border-[#E3E1DD]">
                    <div className="text-[11px] text-[#7E7D7A]">حجم صادرات سالانه جهانی</div>
                    <div className="text-xl font-bold text-[#141414] mt-1 tabular-nums">
                      ${toPersianDigits(flow.globalExportVolumeBillionUsd.toFixed(1))} میلیارد
                    </div>
                    <div className="text-[10px] text-[#52C41A] font-semibold mt-0.5 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      <span>رشد تقاضای جهانی</span>
                    </div>
                  </div>

                  <div className="bg-[#FAF9F7] p-3.5 rounded-xl border border-[#E3E1DD]">
                    <div className="text-[11px] text-[#7E7D7A]">سهم بازار واردات ایران</div>
                    <div className="text-xl font-bold text-[#141414] mt-1 tabular-nums">
                      {formatPersianPercent(flow.iranImportSharePercent, 2)}
                    </div>
                    <div className="text-[10px] text-[#7E7D7A] mt-0.5">
                      ارزش تخمینی واردات: ~${toPersianDigits(Math.round(flow.globalExportVolumeBillionUsd * flow.iranImportSharePercent * 10))} میلیون
                    </div>
                  </div>

                  <div className="bg-[#FAF9F7] p-3.5 rounded-xl border border-[#E3E1DD]">
                    <div className="text-[11px] text-[#7E7D7A]">تنوع بازارهای هدف پیشنهادی</div>
                    <div className="text-xs font-bold text-[#EE6123] mt-1 leading-snug">
                      {flow.recommendedTargetCountries.join(' • ')}
                    </div>
                  </div>
                </div>

                {/* Country Benchmark Table */}
                <div className="border border-[#E3E1DD] rounded-xl overflow-hidden">
                  <div className="bg-[#F5F4F0] px-4 py-2.5 text-xs font-bold text-[#141414] flex justify-between items-center">
                    <span>تحلیل کشورهای عمده صادرکننده و قیمت بنچمارک (FOB Benchmark)</span>
                    <span className="text-[11px] font-normal text-[#7E7D7A]">
                      منبع: پایگاه داده آماری سازمان ملل متحد
                    </span>
                  </div>

                  <div className="divide-y divide-[#E3E1DD]">
                    {flow.topExportingCountries.map((c) => (
                      <div
                        key={c.code}
                        className="px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:bg-[#FAF9F7] transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-[180px]">
                          <span className="text-2xl">{c.flag}</span>
                          <div>
                            <div className="font-bold text-[#141414] flex items-center gap-1.5">
                              <span>{c.country}</span>
                              <span className="text-[10px] text-[#7E7D7A] font-mono">({c.code})</span>
                              {c.code === 'VN' && (
                                <span className="bg-[#FDF498] text-[#141414] text-[9px] px-1.5 py-0.5 rounded font-bold">
                                  بهترین فرصت رقابتی
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-[#7E7D7A]">
                              اینکوترم متداول: {c.primaryIncoterm}
                            </div>
                          </div>
                        </div>

                        {/* Share bar */}
                        <div className="flex-1 max-w-xs">
                          <div className="flex justify-between text-[11px] text-[#7E7D7A] mb-1">
                            <span>سهم صادرات جهانی:</span>
                            <span className="font-bold text-[#141414] tabular-nums">
                              {formatPersianPercent(c.sharePercent, 1)}
                            </span>
                          </div>
                          <div className="w-full bg-[#E3E1DD] rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                c.code === 'VN' ? 'bg-[#EE6123]' : 'bg-[#181818]'
                              }`}
                              style={{ width: `${Math.min(100, c.sharePercent * 2.5)}%` }}
                            />
                          </div>
                        </div>

                        {/* Benchmark FOB price & Growth */}
                        <div className="flex items-center gap-6 sm:text-left">
                          <div>
                            <div className="text-[10px] text-[#7E7D7A]">میانگین قیمت FOB بنچمارک</div>
                            <div className="text-sm font-bold text-[#141414] tabular-nums">
                              ${toPersianDigits(c.avgExportUnitPriceUsd.toFixed(2))}
                            </div>
                          </div>

                          <div className="min-w-[70px]">
                            <div className="text-[10px] text-[#7E7D7A]">رشد سالانه (YoY)</div>
                            <div
                              className={`text-xs font-bold tabular-nums ${
                                c.growthRateYoY >= 0 ? 'text-[#52C41A]' : 'text-[#E5484D]'
                              }`}
                            >
                              {c.growthRateYoY >= 0 ? '+' : ''}
                              {formatPersianPercent(c.growthRateYoY, 1)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Solid Orange Feature Panel on Left: AI Match Preview */}
      <OrangeFeaturePanel
        title="پیش‌نمایش تطبیق هوشمند"
        badge="تطبیق بلادرنگ"
        subtitle="بررسی پایگاه داده سازندگان با معیارهای واردشده"
        footerActions={
          <button
            onClick={handleFindSuppliers}
            className="w-full bg-[#181818] text-white hover:bg-black py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
          >
            <span>یافتن تأمین‌کنندگان منطبق</span>
            <ArrowLeft className="w-4 h-4 text-[#FDF498]" />
          </button>
        }
      >
        {/* Match Count Big Hero */}
        <div className="bg-white/10 rounded-xl p-4 text-center border border-white/15">
          <div className="text-white/80 text-xs">تأمین‌کنندگان منطبق بر مشخصات</div>
          <div className="text-4xl font-black text-white mt-1 tabular-nums">
            {toPersianDigits(17)}
          </div>
          <div className="text-[11px] text-[#FDF498] mt-1 font-semibold">
            با امتیاز اعتماد بالای ۷۵ از ۱۰۰
          </div>
        </div>

        {/* Breakdown by Country */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-white flex items-center justify-between">
            <span>توزیع جغرافیایی کارخانجات:</span>
            <span className="text-[11px] text-white/70">۴ کشور</span>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs bg-white/10 p-2 rounded-lg">
              <span className="flex items-center gap-1.5">
                <span>🇨🇳</span>
                <span>چین (هنگ‌ژو، نانگبو)</span>
              </span>
              <span className="font-bold tabular-nums">{toPersianDigits('۸ سازنده')}</span>
            </div>

            <div className="flex items-center justify-between text-xs bg-white/15 p-2 rounded-lg border border-white/20">
              <span className="flex items-center gap-1.5">
                <span>🇻🇳</span>
                <span className="font-bold text-[#FDF498]">ویتنام (هانوی، هایفونگ)</span>
              </span>
              <span className="font-bold text-[#FDF498] tabular-nums">
                {toPersianDigits('۴ سازنده (-۸.۷٪ قیمت)')}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs bg-white/10 p-2 rounded-lg">
              <span className="flex items-center gap-1.5">
                <span>🇹🇷</span>
                <span>ترکیه (بورسا، استانبول)</span>
              </span>
              <span className="font-bold tabular-nums">{toPersianDigits('۳ سازنده')}</span>
            </div>

            <div className="flex items-center justify-between text-xs bg-white/10 p-2 rounded-lg">
              <span className="flex items-center gap-1.5">
                <span>🇮🇳</span>
                <span>هند (راجکوت، پونا)</span>
              </span>
              <span className="font-bold tabular-nums">{toPersianDigits('۲ سازنده')}</span>
            </div>
          </div>
        </div>

        {/* AI Insight Box */}
        <div className="bg-black/15 rounded-xl p-3 border border-white/10 text-[11px] leading-relaxed text-white/90">
          <span className="font-bold text-[#FDF498] block mb-1">توصیه خرید هوشمند:</span>
          با توجه به بودجه هدف ${toPersianDigits(targetBudget)}، کارخانجات ویتنام و هند بیشترین
          پوشش سودآوری و کمترین ریسک تحریمی را دارا هستند.
        </div>
      </OrangeFeaturePanel>
    </div>
  );
};
