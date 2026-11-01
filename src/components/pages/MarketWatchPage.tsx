import React, { useState, useMemo } from 'react';
import {
  LineChart,
  Bell,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  PackageCheck,
  CheckCircle2,
  Mail,
  Smartphone,
  Send,
  X,
  FileCheck2,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { OrangeFeaturePanel } from '../common/OrangeFeaturePanel';
import { MOCK_MARKET_ALERTS, MOCK_MONITORED_PRODUCTS } from '../../data/mockData';
import { MarketAlert, PageId } from '../../types';
import { toPersianDigits, formatPersianCurrency, formatPersianPercent } from '../../utils/persian';
import { useToast } from '../common/Toast';

interface MarketWatchPageProps {
  onNavigate: (page: PageId, extra?: any) => void;
}

export const MarketWatchPage: React.FC<MarketWatchPageProps> = ({ onNavigate }) => {
  const { showToast } = useToast();

  const [alerts, setAlerts] = useState<MarketAlert[]>([...MOCK_MARKET_ALERTS]);
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');
  const [sampleModalSupplier, setSampleModalSupplier] = useState<string | null>(null);

  // Notification channel toggles
  const [channels, setChannels] = useState({
    dashboard: true,
    email: true,
    sms: true,
    push: false,
  });

  const [thresholdSavingPct, setThresholdSavingPct] = useState(5);

  const filterOptions = [
    { id: 'all', label: 'همه هشدارها' },
    { id: 'alternative-market', label: 'بازار جایگزین' },
    { id: 'new-supplier', label: 'تأمین‌کننده جدید' },
    { id: 'price', label: 'قیمت مواد اولیه' },
    { id: 'freight', label: 'کرایه حمل' },
    { id: 'lead-time', label: 'زمان تحویل' },
    { id: 'fx', label: 'نوسان ارزی' },
    { id: 'tariff', label: 'تعرفه و مقررات' },
  ];

  const filteredAlerts = useMemo(() => {
    if (selectedTypeFilter === 'all') return alerts;
    return alerts.filter((a) => a.type === selectedTypeFilter);
  }, [alerts, selectedTypeFilter]);

  const handleToggleChannel = (channel: keyof typeof channels) => {
    setChannels((prev) => {
      const next = { ...prev, [channel]: !prev[channel] };
      showToast('تنظیمات اعلان بروز شد', `کانال ${channel} تغییر وضعیت یافت.`, 'info');
      return next;
    });
  };

  const handleReviewSupplier = (supplierId?: string) => {
    showToast('انتقال به پروفایل تأمین‌کننده', 'بررسی سوابق کارخانه در هانوی ویتنام.', 'info');
    onNavigate('suppliers', { selectedSupplierId: supplierId || 'sup-2' });
  };

  const handleRequestSample = (supplierName: string) => {
    setSampleModalSupplier(supplierName);
  };

  const handleConfirmSampleOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setSampleModalSupplier(null);
    showToast(
      'سفارش نمونه فنی ثبت شد',
      `درخواست ارسال پک ۵ عددی از ${sampleModalSupplier} با کد رهگیری SMP-2026-91 ارسال گردید.`,
      'success'
    );
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      {/* Main Content Area (Right Side ~70%) */}
      <div className="flex-1 w-full space-y-6">
        {/* Monitored Products Strip */}
        <div className="swiss-card p-6">
          <div className="flex items-center justify-between pb-3 hairline-b mb-4">
            <div>
              <h3 className="text-base font-bold text-[#141414]">کالاهای تحت پایش فعال هوشمند</h3>
              <p className="text-xs text-[#7E7D7A] mt-0.5">
                رصد خودکار قیمت، تأمین‌کنندگان جایگزین و نوسانات شاخص‌های جهانی
              </p>
            </div>
            <button
              onClick={() => onNavigate('product-definition')}
              className="px-3 py-1.5 rounded-lg bg-[#181818] text-white hover:bg-black text-xs font-semibold transition-colors"
            >
              افزودن کالای جدید
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {MOCK_MONITORED_PRODUCTS.map((prod) => {
              const isDecreasing = prod.priceChangePct < 0;
              return (
                <div
                  key={prod.id}
                  className="p-4 rounded-xl bg-[#FAF9F7] border border-[#E3E1DD] hover:border-[#EE6123]/30 transition-all space-y-2 text-xs"
                >
                  <div className="flex items-start justify-between gap-1">
                    <span className="font-bold text-[#141414] leading-snug truncate">
                      {prod.name}
                    </span>
                    <span className="text-[10px] font-mono text-[#7E7D7A] shrink-0" dir="ltr">
                      {prod.hsCode}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between pt-1">
                    <span className="text-lg font-black text-[#141414] tabular-nums">
                      ${toPersianDigits(prod.currentAvgPrice.toFixed(2))}
                    </span>
                    <span
                      className={`inline-flex items-center text-xs font-bold ${
                        isDecreasing ? 'text-[#52C41A]' : 'text-[#E5484D]'
                      }`}
                    >
                      {isDecreasing ? (
                        <TrendingDown className="w-3.5 h-3.5 mr-0.5" />
                      ) : (
                        <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
                      )}
                      {formatPersianPercent(prod.priceChangePct, 1)}
                    </span>
                  </div>

                  {/* Tiny Sparkline */}
                  <div className="flex items-end gap-1 h-8 pt-1">
                    {prod.priceHistory.map((val, i) => (
                      <div
                        key={i}
                        style={{
                          height: `${Math.round(((val - prod.currentAvgPrice * 0.8) / (prod.currentAvgPrice * 0.4)) * 24)}px`,
                        }}
                        className={`flex-1 rounded-t-xs ${
                          isDecreasing ? 'bg-[#52C41A]' : 'bg-[#FA8C16]'
                        }`}
                      />
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-[#7E7D7A] pt-1 hairline-t">
                    <span>{toPersianDigits(prod.activeSuppliers)} تأمین‌کننده فعال</span>
                    <span>ریسک: {prod.riskLevel}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Alert Feed Section */}
        <div className="swiss-card p-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 hairline-b">
            <div>
              <h3 className="text-base font-bold text-[#141414]">فید هشدارهای بلادرنگ بازار</h3>
              <p className="text-xs text-[#7E7D7A] mt-0.5">
                تغییرات قیمت مواد اولیه، کرایه‌های لاینر، فرصت‌های تأمین و نرخ‌های ارز
              </p>
            </div>
            <span className="text-xs text-[#7E7D7A]">
              تعداد هشدارها: {toPersianDigits(filteredAlerts.length)}
            </span>
          </div>

          {/* Type Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 text-xs">
            {filterOptions.map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedTypeFilter(f.id)}
                className={`px-3 py-1 rounded-lg transition-colors whitespace-nowrap ${
                  selectedTypeFilter === f.id
                    ? 'bg-[#181818] text-white font-bold shadow-xs'
                    : 'bg-[#F5F4F0] text-[#7E7D7A] hover:text-[#141414]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Alert Cards Feed */}
          <div className="space-y-3">
            {filteredAlerts.map((alert) => {
              const isHigh = alert.severity === 'high';
              const isHighlightAlert = alert.id === 'alt-1';

              return (
                <div
                  key={alert.id}
                  className={`p-4 rounded-xl border transition-all text-xs space-y-2.5 ${
                    isHighlightAlert
                      ? 'bg-[#FFF9F5] border-[#EE6123] shadow-sm'
                      : isHigh
                      ? 'bg-[#FFF9F5] border-[#FA8C16]/50'
                      : 'bg-[#FAF9F7] border-[#E3E1DD]'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          isHighlightAlert
                            ? 'bg-[#EE6123] text-white'
                            : 'bg-[#F5F4F0] text-[#181818]'
                        }`}
                      >
                        {alert.typeLabel}
                      </span>
                      <h4 className="font-bold text-sm text-[#141414]">{alert.title}</h4>
                    </div>

                    <span className="text-[11px] text-[#7E7D7A]">{alert.date}</span>
                  </div>

                  <p className="text-xs text-[#141414] leading-relaxed">{alert.description}</p>

                  {/* Actions Bar for the Alert (Especially the 8.7% Vietnam alert) */}
                  {alert.actionRequired && (
                    <div className="pt-2 hairline-t flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => handleReviewSupplier(alert.relatedSupplierId)}
                        className="bg-[#181818] text-white hover:bg-black px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
                      >
                        <span>بررسی تأمین‌کننده</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#FDF498]" />
                      </button>

                      <button
                        onClick={() =>
                          handleRequestSample(alert.supplierName || 'VinaPrecision Mechanical')
                        }
                        className="bg-[#F5F4F0] hover:bg-[#EBEAE5] text-[#141414] px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
                      >
                        <PackageCheck className="w-3.5 h-3.5 text-[#EE6123]" />
                        <span>درخواست نمونه</span>
                      </button>

                      {alert.savingPct && (
                        <span className="text-xs font-bold text-[#52C41A] mr-auto tabular-nums">
                          صرفه‌جویی برآوردی: {formatPersianPercent(alert.savingPct, 1)}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Solid Orange Feature Panel on Left: Notification Channel Toggles */}
      <OrangeFeaturePanel
        title="تنظیم کانال‌های اطلاع‌رسانی"
        badge="پایش ۲۴/۷"
        subtitle="تعیین آستانه هشدارها و مسیرهای ارسال فوری به تیم بازرگانی"
        footerActions={
          <button
            onClick={() => {
              showToast('تنظیمات ذخیره شد', 'قوانین پایش و آستانه هشدارهای ارزی ذخیره گردید.', 'success');
            }}
            className="w-full bg-[#181818] text-white hover:bg-black py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
          >
            <span>ذخیره تنظیمات کانال‌ها</span>
            <CheckCircle2 className="w-4 h-4 text-[#FDF498]" />
          </button>
        }
      >
        <div className="space-y-3">
          <div className="text-xs font-bold text-white mb-1">کانال‌های فعال دریافت پیام:</div>

          {/* Toggle 1: Dashboard */}
          <div
            onClick={() => handleToggleChannel('dashboard')}
            className="bg-white/10 hover:bg-white/15 p-3 rounded-xl border border-white/15 cursor-pointer flex items-center justify-between transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Bell className="w-4 h-4 text-[#FDF498]" />
              <div>
                <div className="font-bold text-xs text-white">داشبورد پلتفرم</div>
                <div className="text-[10px] text-white/80">نمایش پاپ‌آپ و نشانگر قرمز نوار ناوبری</div>
              </div>
            </div>
            <div
              className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
                channels.dashboard ? 'bg-[#FDF498]' : 'bg-white/30'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-[#181818] transition-transform ${
                  channels.dashboard ? '-translate-x-4' : 'translate-x-0'
                }`}
              />
            </div>
          </div>

          {/* Toggle 2: Email */}
          <div
            onClick={() => handleToggleChannel('email')}
            className="bg-white/10 hover:bg-white/15 p-3 rounded-xl border border-white/15 cursor-pointer flex items-center justify-between transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-[#FDF498]" />
              <div>
                <div className="font-bold text-xs text-white">ایمیل مدیر خرید</div>
                <div className="text-[10px] text-white/80">ارسال گزارش روزانه و خلاصه تغییرات نرخ</div>
              </div>
            </div>
            <div
              className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
                channels.email ? 'bg-[#FDF498]' : 'bg-white/30'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-[#181818] transition-transform ${
                  channels.email ? '-translate-x-4' : 'translate-x-0'
                }`}
              />
            </div>
          </div>

          {/* Toggle 3: SMS */}
          <div
            onClick={() => handleToggleChannel('sms')}
            className="bg-white/10 hover:bg-white/15 p-3 rounded-xl border border-white/15 cursor-pointer flex items-center justify-between transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Smartphone className="w-4 h-4 text-[#FDF498]" />
              <div>
                <div className="font-bold text-xs text-white">پیامک فوری (SMS)</div>
                <div className="text-[10px] text-white/80">فقط برای صرفه‌جویی بالاتر از ۵٪ یا ریسک بالا</div>
              </div>
            </div>
            <div
              className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
                channels.sms ? 'bg-[#FDF498]' : 'bg-white/30'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-[#181818] transition-transform ${
                  channels.sms ? '-translate-x-4' : 'translate-x-0'
                }`}
              />
            </div>
          </div>

          {/* Toggle 4: Push */}
          <div
            onClick={() => handleToggleChannel('push')}
            className="bg-white/10 hover:bg-white/15 p-3 rounded-xl border border-white/15 cursor-pointer flex items-center justify-between transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Send className="w-4 h-4 text-[#FDF498]" />
              <div>
                <div className="font-bold text-xs text-white">اعلان مرورگر و موبایل (Push)</div>
                <div className="text-[10px] text-white/80">اطلاع‌رسانی بلادرنگ سررسید استعلام‌ها</div>
              </div>
            </div>
            <div
              className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
                channels.push ? 'bg-[#FDF498]' : 'bg-white/30'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-[#181818] transition-transform ${
                  channels.push ? '-translate-x-4' : 'translate-x-0'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Threshold Slider */}
        <div className="bg-black/15 rounded-xl p-3 border border-white/10 space-y-2 text-xs">
          <div className="flex justify-between items-center text-white">
            <span className="font-bold">حداقل آستانه صرفه‌جویی جهت هشدار پیامکی:</span>
            <span className="font-black text-[#FDF498] tabular-nums">
              {toPersianDigits(thresholdSavingPct)}٪
            </span>
          </div>
          <input
            type="range"
            min="3"
            max="15"
            value={thresholdSavingPct}
            onChange={(e) => setThresholdSavingPct(Number(e.target.value))}
            className="w-full accent-white cursor-pointer"
          />
        </div>
      </OrangeFeaturePanel>

      {/* Sample Request Modal */}
      {sampleModalSupplier && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="swiss-card max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 hairline-b">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#EE6123]/10 text-[#EE6123] flex items-center justify-center">
                  <PackageCheck className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-base text-[#141414]">درخواست ارسال نمونه کالا</h3>
              </div>
              <button
                onClick={() => setSampleModalSupplier(null)}
                className="text-[#7E7D7A] hover:text-[#141414]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmSampleOrder} className="space-y-3.5 text-xs text-right">
              <div>
                <label className="block font-semibold text-[#141414] mb-1">
                  تأمین‌کننده طرف درخواست
                </label>
                <input
                  type="text"
                  disabled
                  value={sampleModalSupplier}
                  className="w-full bg-[#F5F4F0] text-xs text-[#141414] font-bold rounded-lg p-2.5 opacity-90"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#141414] mb-1">
                  تعداد و نوع نمونه فنی
                </label>
                <input
                  type="text"
                  defaultValue="پک ۵ تایی بلبرینگ ۶۲۰۵-2RS با برگه تست آزمایشگاهی"
                  className="w-full bg-[#F5F4F0] text-xs text-[#141414] rounded-lg p-2.5 border border-transparent focus:border-[#EE6123] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#141414] mb-1">
                  آدرس تحویل در ایران (گمرک فرودگاه امام / شرکت)
                </label>
                <input
                  type="text"
                  defaultValue="تهران، کیلومتر ۱۲ جاده مخصوص، انبار مرکزی بازرگانی سپهر"
                  className="w-full bg-[#F5F4F0] text-xs text-[#141414] rounded-lg p-2.5 border border-transparent focus:border-[#EE6123] focus:bg-white focus:outline-none"
                />
              </div>

              <div className="p-3 bg-[#FAF9F7] rounded-lg text-[11px] text-[#7E7D7A]">
                هزینه نمونه توسط تأمین‌کننده متقبل شده و هزینه حمل هوایی اکسپرس (DHL) در فاکتور
                نهایی کسر خواهد شد.
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#181818] text-white hover:bg-black py-2.5 rounded-xl text-xs font-bold transition-colors"
                >
                  ارسال رسمی درخواست نمونه
                </button>
                <button
                  type="button"
                  onClick={() => setSampleModalSupplier(null)}
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
