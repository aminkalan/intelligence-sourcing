import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Send,
  Clock,
  CheckCircle2,
  AlertCircle,
  Eye,
  BellRing,
  Scale,
  X,
  Calendar,
  Building,
  Check,
} from 'lucide-react';
import { OrangeFeaturePanel } from '../common/OrangeFeaturePanel';
import { MOCK_RFQS, MOCK_SUPPLIERS } from '../../data/mockData';
import { RfqItem, PageId } from '../../types';
import { toPersianDigits, formatPersianCurrency, formatPersianPercent } from '../../utils/persian';
import { useToast } from '../common/Toast';

interface RfqPageProps {
  onNavigate: (page: PageId, extra?: any) => void;
  selectedRfqId?: string;
  preselectedSupplierId?: string;
}

export const RfqPage: React.FC<RfqPageProps> = ({
  onNavigate,
  selectedRfqId,
  preselectedSupplierId,
}) => {
  const { showToast } = useToast();

  const [rfqs, setRfqs] = useState<RfqItem[]>([...MOCK_RFQS]);
  const [activeRfqId, setActiveRfqId] = useState<string>(selectedRfqId || rfqs[0].id);
  const [newRfqModalOpen, setNewRfqModalOpen] = useState(Boolean(preselectedSupplierId));

  // Form state for New RFQ modal
  const [newTitle, setNewTitle] = useState('استعلام تأمین ۱۰,۰۰۰ عدد بلبرینگ صنعتی دور بالا');
  const [newProduct, setNewProduct] = useState('بلبرینگ ۶۲۰۵-2RS با گرید P5');
  const [newHsCode, setNewHsCode] = useState('8483.40.00');
  const [newQuantity, setNewQuantity] = useState('10000');
  const [newUnit, setNewUnit] = useState('عدد');
  const [newTimeline, setNewTimeline] = useState('۳۰ روز کاری پس از واریز بیعانه');
  const [newDeliveryPlace, setNewDeliveryPlace] = useState('CIF بندرعباس (اسکله رجایی)');
  const [newPayment, setNewPayment] = useState('۲۰٪ پیش‌پرداخت، ۸۰٪ سند بارنامه و تأییدیه SGS');
  const [newPackaging, setNewPackaging] = useState('بسته‌بندی VCI روی پالت چوبی حرارتی');
  const [newSampleRequired, setNewSampleRequired] = useState(true);
  const [newInspectionRequired, setNewInspectionRequired] = useState(true);
  const [newDeadlineDays, setNewDeadlineDays] = useState('7');
  const [selectedSupplierIds, setSelectedSupplierIds] = useState<string[]>(() => {
    if (preselectedSupplierId) return [preselectedSupplierId, 'sup-1', 'sup-3'];
    return ['sup-1', 'sup-2', 'sup-3', 'sup-4'];
  });

  const activeRfq = rfqs.find((r) => r.id === activeRfqId) || rfqs[0];

  const handleCreateRfq = (e: React.FormEvent) => {
    e.preventDefault();
    const created: RfqItem = {
      id: `rfq-${Date.now().toString().slice(-4)}`,
      rfqNumber: `RFQ-2026-${Math.floor(Math.random() * 900 + 100)}`,
      title: newTitle,
      productName: newProduct,
      hsCode: newHsCode,
      quantity: Number(newQuantity) || 5000,
      unit: newUnit,
      createdDate: '۱۴۰۴/۰۸/۱۶',
      deadlineDate: '۱۴۰۴/۰۸/۲۳',
      deadlineRemainingDays: Number(newDeadlineDays) || 7,
      status: 'در حال استعلام',
      invitedCount: selectedSupplierIds.length,
      respondedCount: 0,
      invitedSuppliers: selectedSupplierIds.map((id) => {
        const sup = MOCK_SUPPLIERS.find((s) => s.id === id);
        return {
          supplierId: id,
          supplierName: sup?.tradeName || 'کارخانه منتخب',
          country: sup?.country || 'بین‌الملل',
          flag: sup?.flag || '🌐',
          status: 'در انتظار پاسخ',
        };
      }),
    };

    setRfqs([created, ...rfqs]);
    setActiveRfqId(created.id);
    setNewRfqModalOpen(false);
    showToast(
      'استعلام جدید صادر و ارسال شد',
      `استعلام ${created.rfqNumber} به ${toPersianDigits(selectedSupplierIds.length)} تأمین‌کننده ارسال گردید.`,
      'success'
    );
  };

  const handleSendReminder = () => {
    showToast(
      'یادآوری ارسال شد',
      'پیامک و ایمیل یادآوری موعد مقرر به ۲ تأمین‌کننده معلق ارسال گردید.',
      'info'
    );
  };

  const toggleSupplierSelection = (id: string) => {
    setSelectedSupplierIds((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  // Response rate for ring
  const responded = activeRfq.respondedCount;
  const invited = activeRfq.invitedCount;
  const progressPct = invited > 0 ? Math.round((responded / invited) * 100) : 0;

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      {/* Main Content Area (Right Side ~70%) */}
      <div className="flex-1 w-full space-y-6">
        {/* Top Header: RFQ Switcher & New RFQ Button */}
        <div className="swiss-card p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1">
            {rfqs.map((rfq) => (
              <button
                key={rfq.id}
                onClick={() => setActiveRfqId(rfq.id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  activeRfq.id === rfq.id
                    ? 'bg-[#181818] text-white shadow-xs'
                    : 'bg-[#F5F4F0] text-[#7E7D7A] hover:text-[#141414]'
                }`}
              >
                <span>{rfq.rfqNumber}</span>
                <span className="text-[10px] opacity-70">({rfq.status})</span>
              </button>
            ))}
          </div>

          <button
            onClick={() => setNewRfqModalOpen(true)}
            className="shrink-0 bg-[#EE6123] text-white hover:bg-[#D95318] px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            استعلام قیمت جدید (New RFQ)
          </button>
        </div>

        {/* Active RFQ Overview Card */}
        <div className="swiss-card p-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4 hairline-b">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#F5F4F0] text-[#181818] font-bold">
                  {activeRfq.rfqNumber}
                </span>
                <h3 className="text-base font-black text-[#141414]">{activeRfq.title}</h3>
              </div>
              <p className="text-xs text-[#7E7D7A] mt-1">
                کالای پایه: {activeRfq.productName} · کد HS: {activeRfq.hsCode} · تیراژ استعلام:{' '}
                {toPersianDigits(activeRfq.quantity.toLocaleString())} {activeRfq.unit}
              </p>
            </div>

            <span className="px-3 py-1 rounded-full bg-[#52C41A]/10 text-[#52C41A] text-xs font-bold shrink-0">
              {activeRfq.status}
            </span>
          </div>

          {/* Invited Suppliers Status List */}
          <div>
            <h4 className="text-xs font-bold text-[#141414] mb-3">
              وضعیت پاسخ تأمین‌کنندگان دعوت‌شده ({toPersianDigits(activeRfq.invitedCount)} کارخانه)
            </h4>

            <div className="space-y-2">
              {activeRfq.invitedSuppliers.map((inv) => {
                const isResponded = inv.status === 'پاسخ داده شد';
                const isViewed = inv.status === 'مشاهده شد';
                const isPending = inv.status === 'در انتظار پاسخ';

                return (
                  <div
                    key={inv.supplierId}
                    className="p-3.5 rounded-xl bg-[#FAF9F7] hover:bg-[#F5F4F0] transition-colors border border-[#E3E1DD] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{inv.flag}</span>
                      <div>
                        <div className="font-bold text-[#141414]">{inv.supplierName}</div>
                        <div className="text-[11px] text-[#7E7D7A]">{inv.country}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {isResponded && (
                        <div className="text-left text-xs">
                          <span className="text-[#7E7D7A] text-[10px] block">پیشنهاد قیمت واحد:</span>
                          <span className="font-bold text-[#181818] tabular-nums">
                            ${toPersianDigits(inv.unitQuote?.toFixed(2))}
                          </span>
                        </div>
                      )}

                      {inv.leadTimeDays && (
                        <div className="text-left text-xs hidden sm:block">
                          <span className="text-[#7E7D7A] text-[10px] block">زمان ساخت:</span>
                          <span className="font-bold text-[#181818] tabular-nums">
                            {toPersianDigits(inv.leadTimeDays)} روز
                          </span>
                        </div>
                      )}

                      <span
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                          isResponded
                            ? 'bg-[#52C41A]/10 text-[#52C41A]'
                            : isViewed
                            ? 'bg-[#FA8C16]/10 text-[#FA8C16]'
                            : 'bg-[#BFBDB8]/20 text-[#7E7D7A]'
                        }`}
                      >
                        {inv.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Normalized RFQ Response Table */}
        <div className="swiss-card p-6">
          <div className="flex items-center justify-between pb-3 hairline-b mb-3">
            <div>
              <h4 className="text-sm font-bold text-[#141414]">
                جدول نرمال‌سازی پیشنهادات فنی-مالی دریافت‌شده
              </h4>
              <p className="text-xs text-[#7E7D7A] mt-0.5">
                تطبیق قیمت فوب، زمان تحویل و اعتبار سنجی پیش‌فاکتور
              </p>
            </div>
            <button
              onClick={() => onNavigate('comparison')}
              className="text-xs font-semibold text-[#EE6123] hover:underline flex items-center gap-1"
            >
              <Scale className="w-3.5 h-3.5" />
              انتقال به مقایسه جامع
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-right">
              <thead>
                <tr className="text-[#7E7D7A] hairline-b pb-2">
                  <th className="py-2.5 font-medium">نام تأمین‌کننده</th>
                  <th className="py-2.5 font-medium">قیمت واحد استعلامی</th>
                  <th className="py-2.5 font-medium">زمان ساخت (روز)</th>
                  <th className="py-2.5 font-medium">تاریخ ثبت پروفرما</th>
                  <th className="py-2.5 font-medium text-left">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3E1DD]">
                {activeRfq.invitedSuppliers
                  .filter((s) => s.unitQuote)
                  .map((quote) => (
                    <tr key={quote.supplierId} className="hover:bg-[#FAF9F7]">
                      <td className="py-3 font-bold text-[#141414] flex items-center gap-2">
                        <span>{quote.flag}</span>
                        <span>{quote.supplierName}</span>
                      </td>
                      <td className="py-3 font-bold text-[#181818] tabular-nums">
                        ${toPersianDigits(quote.unitQuote?.toFixed(2))}
                      </td>
                      <td className="py-3 text-[#141414] tabular-nums">
                        {toPersianDigits(quote.leadTimeDays)} روز
                      </td>
                      <td className="py-3 text-[#7E7D7A]">{quote.quoteDate || '۱۴۰۴/۰۸/۱۲'}</td>
                      <td className="py-3 text-left">
                        <button
                          onClick={() => onNavigate('comparison')}
                          className="px-2.5 py-1 text-[11px] rounded bg-[#181818] text-white hover:bg-black transition-colors"
                        >
                          محاسبه Landed Cost
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Solid Orange Feature Panel on Left: Progress Ring, Countdown & Actions */}
      <OrangeFeaturePanel
        title="وضعیت تجمیع استعلام"
        badge="شمارش معکوس"
        subtitle="پایش آنلاین مشارکت تأمین‌کنندگان در پاسخ‌دهی"
        footerActions={
          <div className="space-y-2">
            <button
              onClick={() => onNavigate('comparison')}
              className="w-full bg-[#181818] text-white hover:bg-black py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Scale className="w-4 h-4 text-[#FDF498]" />
              مقایسه جامع و انتخاب برنده
            </button>
            <button
              onClick={handleSendReminder}
              className="w-full bg-white/20 hover:bg-white/30 text-white py-2 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <BellRing className="w-3.5 h-3.5" />
              ارسال یادآوری به تأمین‌کنندگان معلق
            </button>
          </div>
        }
      >
        {/* Progress Ring: '۶ از ۸ پاسخ' */}
        <div className="bg-white/10 rounded-xl p-4 flex flex-col items-center justify-center border border-white/15">
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-white/20"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-[#FDF498]"
                strokeDasharray={`${progressPct}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-xl font-black text-white tabular-nums">
                {toPersianDigits(responded)} از {toPersianDigits(invited)}
              </span>
              <span className="text-[10px] text-white/80 font-medium">پاسخ رسمی</span>
            </div>
          </div>

          <div className="mt-3 text-xs text-white/90 font-medium">
            نرخ مشارکت: {formatPersianPercent(progressPct, 0)}
          </div>
        </div>

        {/* Live Countdown */}
        <div className="bg-black/15 rounded-xl p-3 border border-white/10 space-y-1 text-center">
          <div className="text-[11px] text-white/80">مهلت باقی‌مانده تا بسته‌شدن مناقصه:</div>
          <div className="text-base font-extrabold text-[#FDF498] tabular-nums">
            {toPersianDigits('۲ روز و ۱۴ ساعت و ۳۰ دقیقه')}
          </div>
          <div className="text-[10px] text-white/70">سررسید: {activeRfq.deadlineDate}</div>
        </div>

        {/* Smart Quote Tip */}
        <div className="bg-white/10 rounded-xl p-3 text-[11px] leading-relaxed text-white/90 border border-white/15">
          <span className="font-bold text-[#FDF498] block mb-0.5">تحلیل اولیه مظنه‌ها:</span>
          کمترین قیمت پیشنهادی تاکنون متعلق به شرکت VinaPrecision ویتنام با نرخ ۲.۹۵ دلار بر واحد
          است.
        </div>
      </OrangeFeaturePanel>

      {/* New RFQ Modal Form */}
      {newRfqModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="swiss-card max-w-2xl w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 hairline-b">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#EE6123]/10 text-[#EE6123] flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-base text-[#141414]">
                  صدور استعلام قیمت بین‌المللی جدید (New RFQ)
                </h3>
              </div>
              <button
                onClick={() => setNewRfqModalOpen(false)}
                className="text-[#7E7D7A] hover:text-[#141414]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRfq} className="space-y-4 text-xs text-right">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-[#141414] mb-1">
                    عنوان استعلام
                  </label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    required
                    className="w-full bg-[#F5F4F0] text-xs text-[#141414] rounded-lg p-2.5 border border-transparent focus:border-[#EE6123] focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#141414] mb-1">شرح کالا</label>
                  <input
                    type="text"
                    value={newProduct}
                    onChange={(e) => setNewProduct(e.target.value)}
                    required
                    className="w-full bg-[#F5F4F0] text-xs text-[#141414] rounded-lg p-2.5 border border-transparent focus:border-[#EE6123] focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#141414] mb-1">کد HS</label>
                  <input
                    type="text"
                    value={newHsCode}
                    onChange={(e) => setNewHsCode(e.target.value)}
                    dir="ltr"
                    className="w-full bg-[#F5F4F0] text-xs text-[#141414] font-mono rounded-lg p-2.5 border border-transparent focus:border-[#EE6123] focus:bg-white focus:outline-none text-left"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#141414] mb-1">
                    تیراژ مورد تقاضا
                  </label>
                  <input
                    type="text"
                    value={toPersianDigits(newQuantity)}
                    onChange={(e) => setNewQuantity(e.target.value)}
                    required
                    className="w-full bg-[#F5F4F0] text-xs text-[#141414] rounded-lg p-2.5 border border-transparent focus:border-[#EE6123] focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#141414] mb-1">
                    محل تحویل (Incoterm)
                  </label>
                  <input
                    type="text"
                    value={newDeliveryPlace}
                    onChange={(e) => setNewDeliveryPlace(e.target.value)}
                    className="w-full bg-[#F5F4F0] text-xs text-[#141414] rounded-lg p-2.5 border border-transparent focus:border-[#EE6123] focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#141414] mb-1">
                    شرایط پرداخت
                  </label>
                  <input
                    type="text"
                    value={newPayment}
                    onChange={(e) => setNewPayment(e.target.value)}
                    className="w-full bg-[#F5F4F0] text-xs text-[#141414] rounded-lg p-2.5 border border-transparent focus:border-[#EE6123] focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[#141414] mb-1">
                    مهلت ارسال پاسخ (روز)
                  </label>
                  <input
                    type="number"
                    value={newDeadlineDays}
                    onChange={(e) => setNewDeadlineDays(e.target.value)}
                    className="w-full bg-[#F5F4F0] text-xs text-[#141414] rounded-lg p-2.5 border border-transparent focus:border-[#EE6123] focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Checkboxes: Sample & Inspection */}
              <div className="flex flex-wrap gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-[#141414]">
                  <input
                    type="checkbox"
                    checked={newSampleRequired}
                    onChange={(e) => setNewSampleRequired(e.target.checked)}
                    className="accent-[#EE6123] w-4 h-4"
                  />
                  <span>ارسال نمونه پیش از بارگیری الزامی است</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-medium text-[#141414]">
                  <input
                    type="checkbox"
                    checked={newInspectionRequired}
                    onChange={(e) => setNewInspectionRequired(e.target.checked)}
                    className="accent-[#EE6123] w-4 h-4"
                  />
                  <span>بازرسی حین ساخت و پیش از بارگیری (PSI) توسط SGS الزامی است</span>
                </label>
              </div>

              {/* Supplier Selection Chips */}
              <div>
                <label className="block font-semibold text-[#141414] mb-1.5">
                  انتخاب تأمین‌کنندگان جهت دریافت استعلام:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto p-1 bg-[#FAF9F7] rounded-lg border border-[#E3E1DD]">
                  {MOCK_SUPPLIERS.map((s) => {
                    const isSelected = selectedSupplierIds.includes(s.id);
                    return (
                      <div
                        key={s.id}
                        onClick={() => toggleSupplierSelection(s.id)}
                        className={`p-2 rounded-md cursor-pointer flex items-center justify-between text-xs transition-colors ${
                          isSelected
                            ? 'bg-[#181818] text-white font-bold'
                            : 'bg-white hover:bg-[#F5F4F0] text-[#141414]'
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          <span>{s.flag}</span>
                          <span>{s.tradeName}</span>
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#FDF498]" />}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex gap-2 pt-3 hairline-t">
                <button
                  type="submit"
                  className="flex-1 bg-[#181818] text-white hover:bg-black py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5 text-[#FDF498]" />
                  صدور و ارسال استعلام
                </button>
                <button
                  type="button"
                  onClick={() => setNewRfqModalOpen(false)}
                  className="px-4 py-2.5 bg-[#F5F4F0] text-[#141414] hover:bg-[#EAE8E4] rounded-xl text-xs font-medium transition-colors"
                >
                  انصراف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
