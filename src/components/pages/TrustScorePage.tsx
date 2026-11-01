import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  FileCheck,
  FileText,
  Building,
  UserCheck,
  Calendar,
  X,
  Eye,
  Download,
  AlertCircle,
} from 'lucide-react';
import { OrangeFeaturePanel } from '../common/OrangeFeaturePanel';
import { MOCK_VERIFICATION_LAYERS } from '../../data/mockData';
import { toPersianDigits, formatPersianPercent } from '../../utils/persian';
import { useToast } from '../common/Toast';
import { PageId } from '../../types';

interface TrustScorePageProps {
  onNavigate: (page: PageId) => void;
}

export const TrustScorePage: React.FC<TrustScorePageProps> = ({ onNavigate }) => {
  const { showToast } = useToast();
  const [inspectionModalOpen, setInspectionModalOpen] = useState(false);
  const [selectedDocPreview, setSelectedDocPreview] = useState<string | null>(null);

  // Form for requesting inspection
  const [inspectorOrg, setInspectorOrg] = useState('SGS Group');
  const [inspectionType, setInspectionType] = useState('ممیزی کامل خطوط تولید و بررسی کیفی بار اول');
  const [scheduledDate, setScheduledDate] = useState('۱۴۰۴/۰۹/۱۵');

  const overallScore = 83;

  const documents = [
    {
      id: 'doc-1',
      title: 'گواهی ثبت شرکت و اساسنامه رسمی (Business License)',
      code: 'LIC-2024-VN-9481',
      verifiedDate: '۱۴۰۴/۰۵/۱۰',
      status: 'تأیید مراجع دولتی',
    },
    {
      id: 'doc-2',
      title: 'گزارش ممیزی حضوری کارخانه (Factory Audit Report)',
      code: 'AUD-SGS-90248',
      verifiedDate: '۱۴۰۴/۰۶/۱۸',
      status: 'ممیز مستقل SGS',
    },
    {
      id: 'doc-3',
      title: 'سوابق کوتاژ و بارنامه‌های گمرکی (Customs Export Declaration)',
      code: 'BL-EXP-2025-412',
      verifiedDate: '۱۴۰۴/۰۷/۰۲',
      status: 'تأییدیه گمرک هایفونگ',
    },
    {
      id: 'doc-4',
      title: 'نامه احراز هویت دارنده حساب بانکی (Bank Account Ownership)',
      code: 'BNK-CONF-8819',
      verifiedDate: '۱۴۰۴/۰۷/۲۵',
      status: 'تطبیق کامل نام ثبتی',
    },
  ];

  const handleConfirmInspection = (e: React.FormEvent) => {
    e.preventDefault();
    setInspectionModalOpen(false);
    showToast(
      'درخواست بازرسی حضوری ثبت شد',
      `سفارش ممیزی کارخانه توسط شرکت ${inspectorOrg} با کد رهگیری INS-9842 ایجاد گردید.`,
      'success'
    );
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      {/* Main Content Area (Right Side ~70%) */}
      <div className="flex-1 w-full space-y-6">
        {/* Hero Radial Gauge 83/100 */}
        <div className="swiss-card p-6 sm:p-8">
          <div className="flex flex-col md:flex-row items-center gap-8 justify-between">
            {/* Radial Gauge SVG */}
            <div className="relative w-44 h-44 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                {/* Background Track */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className="text-[#E3E1DD]"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="none"
                />
                {/* Foreground Arc */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className="text-[#EE6123]"
                  strokeWidth="8"
                  strokeDasharray={`${overallScore * 2.51}, 251.2`}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-4xl font-black text-[#141414] tabular-nums tracking-tighter">
                  {toPersianDigits(overallScore)}
                </span>
                <span className="text-xs font-semibold text-[#7E7D7A]">از ۱۰۰ امتیاز</span>
              </div>
            </div>

            {/* Plain-Language Explanation */}
            <div className="space-y-3 text-right">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#52C41A]/10 text-[#52C41A] text-xs font-bold">
                <CheckCircle2 className="w-4 h-4" />
                سطح اعتبار: درجه A (توصیه‌شده برای عقد قرارداد تجاری)
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#141414] leading-tight">
                تأمین‌کننده با احراز هویت چندلایه و ریسک تجاری حداقلی
              </h2>
              <p className="text-xs sm:text-sm text-[#7E7D7A] leading-relaxed">
                این امتیاز نشان‌دهنده تطبیق ۱۰۰ درصدی هویت ثبتی، کارخانه فعال با خطوط اتوماتیک،
                سابقه خروج موفق محموله‌های کانتینری و حساب بانکی بدون مغایرت است. تنها در بخش پایش
                رسانه‌ای نیازمند پایش ادواری دوره‌ای اعلام شده است.
              </p>

              {/* Mandatory AI Safety Rule Callout */}
              <div className="p-3.5 rounded-xl bg-[#FAF9F7] border border-[#E3E1DD] text-xs text-[#141414] flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-[#EE6123] shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  <strong className="text-[#181818]">اصل ممیزی دوگانه SourceIQ:</strong> هوش
                  مصنوعی هرگز به تنهایی تأییدکننده معامله نیست. تمامی استعلام‌ها و امتیازها با
                  اسناد رسمی ثبت شرکت و ممیزی میدانی کارشناسان بازرگانی تطبیق داده می‌شوند.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 8 Verification Layers Grid */}
        <div className="swiss-card p-6">
          <div className="flex items-center justify-between pb-4 hairline-b mb-4">
            <div>
              <h3 className="text-base font-bold text-[#141414]">۸ لایه تخصصی اعتبارسنجی تأمین‌کننده</h3>
              <p className="text-xs text-[#7E7D7A] mt-0.5">
                تحلیل جامع مبتنی بر اسناد رسمی، ممیزی میدانی و سوابق بین‌المللی
              </p>
            </div>
            <span className="text-xs text-[#7E7D7A]">
              وزن کل: {toPersianDigits(100)}٪
            </span>
          </div>

          <div className="space-y-4">
            {MOCK_VERIFICATION_LAYERS.map((layer, index) => {
              const isVerified = layer.status === 'verified';
              const isWarning = layer.status === 'warning';

              return (
                <div
                  key={layer.id}
                  className="p-4 rounded-xl bg-[#FAF9F7] hover:bg-[#F5F4F0] transition-colors border border-[#E3E1DD] space-y-2.5 text-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#181818] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                        {toPersianDigits(index + 1)}
                      </span>
                      <span className="font-bold text-sm text-[#141414]">{layer.title}</span>
                      <span className="text-[11px] text-[#7E7D7A]">
                        (وزن: {toPersianDigits(layer.weight)}٪)
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          isVerified
                            ? 'bg-[#52C41A]/10 text-[#52C41A]'
                            : isWarning
                            ? 'bg-[#FA8C16]/10 text-[#FA8C16]'
                            : 'bg-[#BFBDB8]/20 text-[#7E7D7A]'
                        }`}
                      >
                        {layer.statusLabel}
                      </span>
                      <span className="font-extrabold text-[#141414] tabular-nums text-sm">
                        {toPersianDigits(layer.score)} / ۱۰۰
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar (RTL) */}
                  <div className="w-full bg-[#E3E1DD] h-2 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${layer.score}%` }}
                      className={`h-full rounded-full transition-all duration-500 ${
                        isVerified ? 'bg-[#52C41A]' : isWarning ? 'bg-[#FA8C16]' : 'bg-[#BFBDB8]'
                      }`}
                    />
                  </div>

                  {/* Evidence & Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-[#7E7D7A] pt-1">
                    <div>
                      <strong className="text-[#141414]">مستندات احراز: </strong>
                      {layer.evidence}
                    </div>
                    <div>
                      <strong className="text-[#141414]">نتیجه ممیزی: </strong>
                      {layer.auditDetails}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Solid Orange Feature Panel on Left: Documents & Request Inspection */}
      <OrangeFeaturePanel
        title="اسناد ممیزی و نظارت"
        badge="تأییدیه رسمی"
        subtitle="مدارک اعتباری و امکان اعزام بازرس شخص ثالث به محل کارخانه"
        footerActions={
          <button
            onClick={() => setInspectionModalOpen(true)}
            className="w-full bg-[#181818] text-white hover:bg-black py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
          >
            <UserCheck className="w-4 h-4 text-[#FDF498]" />
            درخواست بازرسی حضوری کارخانه (On-Site Audit)
          </button>
        }
      >
        <div className="space-y-2.5">
          <div className="text-xs font-bold text-white mb-1">پرونده اسناد ممیزی‌شده:</div>
          {documents.map((doc) => (
            <div
              key={doc.id}
              onClick={() => setSelectedDocPreview(doc.title)}
              className="bg-white/10 hover:bg-white/20 p-3 rounded-xl border border-white/15 cursor-pointer transition-colors space-y-1"
            >
              <div className="flex items-start justify-between gap-1">
                <span className="font-bold text-white text-xs leading-snug">{doc.title}</span>
                <Eye className="w-3.5 h-3.5 text-[#FDF498] shrink-0 mt-0.5" />
              </div>
              <div className="flex items-center justify-between text-[10px] text-white/80">
                <span className="font-mono" dir="ltr">{doc.code}</span>
                <span>{doc.status}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-black/15 rounded-xl p-3 border border-white/10 text-[11px] leading-relaxed text-white/90">
          <span className="font-bold text-[#FDF498] block mb-1">شرکت‌های بازرسی همکار:</span>
          اعزام بازرسان دارای مجوز از شرکت‌های SGS سوئیس، TÜV آلمان و Bureau Veritas فرانسه در
          تمام شهرهای صنعتی چین، ویتنام و ترکیه در کمتر از ۴۸ ساعت کاری.
        </div>
      </OrangeFeaturePanel>

      {/* On-site Inspection Request Modal */}
      {inspectionModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="swiss-card max-w-lg w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 hairline-b">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#EE6123]/10 text-[#EE6123] flex items-center justify-center">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#141414]">
                    درخواست بازرسی و ممیزی میدانی کارخانه
                  </h3>
                  <p className="text-xs text-[#7E7D7A]">اعزام کارشناس مستقل فنی به محل تولید</p>
                </div>
              </div>
              <button
                onClick={() => setInspectionModalOpen(false)}
                className="text-[#7E7D7A] hover:text-[#141414]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmInspection} className="space-y-3.5 text-xs text-right">
              <div>
                <label className="block font-semibold text-[#141414] mb-1">
                  شرکت بازرسی بین‌المللی منتخب
                </label>
                <select
                  value={inspectorOrg}
                  onChange={(e) => setInspectorOrg(e.target.value)}
                  className="w-full bg-[#F5F4F0] text-xs text-[#141414] rounded-lg p-2.5 border border-transparent focus:border-[#EE6123] focus:bg-white focus:outline-none"
                >
                  <option value="SGS Group">SGS Group (سوئیس - شعب آسیا)</option>
                  <option value="TÜV Rheinland">TÜV Rheinland (آلمان)</option>
                  <option value="Bureau Veritas">Bureau Veritas (فرانسه)</option>
                  <option value="Intertek">Intertek Global Inspection</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#141414] mb-1">
                  دامنه و نوع بازرسی
                </label>
                <input
                  type="text"
                  value={inspectionType}
                  onChange={(e) => setInspectionType(e.target.value)}
                  className="w-full bg-[#F5F4F0] text-xs text-[#141414] rounded-lg p-2.5 border border-transparent focus:border-[#EE6123] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#141414] mb-1">
                  تاریخ پیشنهادی بازرسی
                </label>
                <input
                  type="text"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full bg-[#F5F4F0] text-xs text-[#141414] rounded-lg p-2.5 border border-transparent focus:border-[#EE6123] focus:bg-white focus:outline-none"
                />
              </div>

              <div className="p-3 bg-[#FAF9F7] rounded-lg text-[11px] text-[#7E7D7A]">
                پس از اعزام، گزارش مصور ۲۵ صفحه‌ای شامل ویدیوی خطوط، تطبیق مواد اولیه و کالیبراسیون
                دستگاه‌ها در پنل خریدار قرار می‌گیرد.
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#181818] text-white hover:bg-black py-2.5 rounded-xl text-xs font-bold transition-colors"
                >
                  ثبت سفارش بازرسی
                </button>
                <button
                  type="button"
                  onClick={() => setInspectionModalOpen(false)}
                  className="px-4 py-2.5 bg-[#F5F4F0] text-[#141414] hover:bg-[#EAE8E4] rounded-xl text-xs font-medium transition-colors"
                >
                  انصراف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Document View Preview Modal */}
      {selectedDocPreview && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="swiss-card max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 hairline-b">
              <h3 className="font-bold text-sm text-[#141414]">مشاهده سند ممیزی</h3>
              <button
                onClick={() => setSelectedDocPreview(null)}
                className="text-[#7E7D7A] hover:text-[#141414]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 bg-[#F5F4F0] rounded-xl space-y-2 text-xs">
              <div className="font-bold text-[#141414]">{selectedDocPreview}</div>
              <p className="text-[11px] text-[#7E7D7A] leading-relaxed">
                این سند به صورت رسمی توسط مراجع ذی‌صلاح تایید شده و کد هش دیجیتالی آن در زنجیره
                تأمین SourceIQ ثبت گردیده است.
              </p>
            </div>
            <button
              onClick={() => {
                showToast('دانلود سند انجام شد', 'نسخه الکترونیکی سند با موفقیت ذخیره شد.', 'success');
                setSelectedDocPreview(null);
              }}
              className="w-full bg-[#181818] text-white py-2 rounded-xl text-xs font-bold hover:bg-black transition-colors"
            >
              دریافت نسخه تأییدشده (PDF)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
