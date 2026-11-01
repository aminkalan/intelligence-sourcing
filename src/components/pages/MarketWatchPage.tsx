import React, { useState, useMemo } from 'react';
import {
  Bell,
  TrendingDown,
  TrendingUp,
  PackageCheck,
  CheckCircle2,
  Mail,
  Smartphone,
  Send,
  X,
  ArrowRight,
  RefreshCw,
  Zap,
  Ship,
  Coins,
  Anchor,
  ShieldAlert,
  Clock,
  Layers,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Sliders,
  DollarSign,
  AlertTriangle,
} from 'lucide-react';
import { OrangeFeaturePanel } from '../common/OrangeFeaturePanel';
import { MOCK_MARKET_ALERTS, MOCK_MONITORED_PRODUCTS } from '../../data/mockData';
import { MarketAlert, PageId, MarketShockType } from '../../types';
import { toPersianDigits, formatPersianCurrency, formatPersianPercent } from '../../utils/persian';
import { useToast } from '../common/Toast';
import { useMarketData } from '../../hooks/useMarketData';

interface MarketWatchPageProps {
  onNavigate: (page: PageId, extra?: any) => void;
}

export const MarketWatchPage: React.FC<MarketWatchPageProps> = ({ onNavigate }) => {
  const { showToast } = useToast();

  const {
    currencies,
    freightRoutes,
    rawMaterials,
    portStatuses,
    riskCorridors,
    lastUpdated,
    activeShock,
    isAutoSyncActive,
    refreshNow,
    triggerShock,
    toggleAutoSync,
    convertUsdToToman,
  } = useMarketData();

  // Active Terminal Tab
  const [activeTab, setActiveTab] = useState<'forex' | 'freight' | 'commodities' | 'ports' | 'risks'>('forex');

  // Quick Currency Converter state
  const [calcUsdAmount, setCalcUsdAmount] = useState<number>(10000);

  const [alerts] = useState<MarketAlert[]>([...MOCK_MARKET_ALERTS]);
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
  const [isRefreshing, setIsRefreshing] = useState(false);

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

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    refreshNow();
    setTimeout(() => {
      setIsRefreshing(false);
      showToast(
        'داده‌های بازار همگام شدند',
        'آخرین نرخ‌های سامانه نیما، شاخص کرایه دروری (Drewry) و بورس فلزات شانگهای بروزرسانی گردید.',
        'success'
      );
    }, 400);
  };

  const handleApplyShock = (shock: MarketShockType) => {
    triggerShock(shock);
    if (shock === 'freight_spike') {
      showToast(
        'شوک کرایه حمل اعمال شد (+۳۲٪)',
        'نرخ‌های کرایه کانتینری و حق بیمه مازاد جنگی برای ارزیابی حساسیت بهای تمام‌شده افزایش یافت.',
        'info'
      );
    } else if (shock === 'fx_spike') {
      showToast(
        'شوک جهش ارزی اعمال شد (+۱۲٪)',
        'نرخ‌های تسعیر دلار و حوالجات نیما و آزاد جهت تست تاب‌آوری قراردادها به‌روز شد.',
        'info'
      );
    } else if (shock === 'port_congestion') {
      showToast(
        'شوک ترافیک بنادر فعال شد',
        'زمان معطلی تخلیه در بندر شهید رجایی به ۸.۹ روز افزایش یافت.',
        'info'
      );
    } else {
      showToast('بازنشانی به حالت پایه', 'داده‌های بازار به مقادیر عادی و استاندارد بازگشتند.', 'info');
    }
  };

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

  const handleApplyToCostMatrix = () => {
    showToast(
      'انتقال به مقایسه بهای تمام‌شده',
      'نرخ‌های بهروز حمل و ارز مستقیماً در فرمول Landed Cost اعمال می‌شوند.',
      'success'
    );
    onNavigate('comparison');
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      {/* Main Content Area (Right Side ~70%) */}
      <div className="flex-1 w-full space-y-6">

        {/* 1. Live Market Terminal Banner & Live Controller */}
        <div className="swiss-card p-5 space-y-4 border-2 border-[#181818]/10 bg-gradient-to-r from-white via-[#FAF9F7] to-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 hairline-b">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#181818] text-[#FDF498] flex items-center justify-center shrink-0 shadow-sm">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-black text-[#141414]">
                    پایانه زنده شاخص‌های بازار بین‌المللی و ریسک
                  </h2>
                  <span className="flex h-2.5 w-2.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#52C41A] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#52C41A]"></span>
                  </span>
                </div>
                <p className="text-xs text-[#7E7D7A] mt-0.5">
                  ارتباط بلادرنگ با سامانه‌های تسعیر نیما، شاخص جهانی کرایه دروری (Drewry WCI) و بورس فلزات شانگهای و لندن
                </p>
              </div>
            </div>

            {/* Sync Controls */}
            <div className="flex items-center gap-2 self-start md:self-auto">
              <div className="text-[11px] text-[#7E7D7A] hidden sm:block">
                آخرین استعلام: <span className="font-mono text-[#141414] font-semibold">{lastUpdated.toLocaleTimeString('fa-IR')}</span>
              </div>
              <button
                onClick={handleManualRefresh}
                disabled={isRefreshing}
                className="px-3 py-1.5 rounded-lg bg-[#181818] text-white hover:bg-black text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-[#FDF498] ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>به‌روزرسانی داده‌ها</span>
              </button>
              <button
                onClick={toggleAutoSync}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors border ${
                  isAutoSyncActive
                    ? 'bg-[#52C41A]/10 text-[#52C41A] border-[#52C41A]/30'
                    : 'bg-[#F5F4F0] text-[#7E7D7A] border-[#E3E1DD]'
                }`}
                title="تغییر وضعیت همگام‌سازی خودکار"
              >
                {isAutoSyncActive ? 'پایش خودکار: فعال' : 'پایش خودکار: توقف'}
              </button>
            </div>
          </div>

          {/* Market Stress-Test / Shock Simulator Toolbar */}
          <div className="p-3 bg-[#F5F4F0] rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-[#141414] font-bold">
              <Zap className="w-4 h-4 text-[#EE6123]" />
              <span>شبیه‌ساز شوک‌های زنجیره تأمین (Stress Testing):</span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => handleApplyShock('none')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                  activeShock === 'none'
                    ? 'bg-[#181818] text-white font-bold'
                    : 'bg-white text-[#7E7D7A] hover:text-[#141414]'
                }`}
              >
                حالت پایه و استاندارد
              </button>
              <button
                onClick={() => handleApplyShock('freight_spike')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                  activeShock === 'freight_spike'
                    ? 'bg-[#EE6123] text-white font-bold shadow-xs'
                    : 'bg-white text-[#EE6123] hover:bg-[#EE6123]/10 border border-[#EE6123]/30'
                }`}
              >
                شوک جهش حمل دریایی (+۳۲٪)
              </button>
              <button
                onClick={() => handleApplyShock('fx_spike')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                  activeShock === 'fx_spike'
                    ? 'bg-[#FA8C16] text-white font-bold shadow-xs'
                    : 'bg-white text-[#FA8C16] hover:bg-[#FA8C16]/10 border border-[#FA8C16]/30'
                }`}
              >
                شوک نوسان نرخ تسعیر ارز (+۱۲٪)
              </button>
              <button
                onClick={() => handleApplyShock('port_congestion')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all ${
                  activeShock === 'port_congestion'
                    ? 'bg-[#E5484D] text-white font-bold shadow-xs'
                    : 'bg-white text-[#E5484D] hover:bg-[#E5484D]/10 border border-[#E5484D]/30'
                }`}
              >
                شوک ازدحام بنادر و گمرک
              </button>
            </div>
          </div>

          {/* Terminal Tabs: Forex, Freight, Commodities, Ports, Risks */}
          <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-1 border-b border-[#E3E1DD] text-xs">
            <button
              onClick={() => setActiveTab('forex')}
              className={`pb-2 px-3 font-bold transition-all flex items-center gap-1.5 relative ${
                activeTab === 'forex'
                  ? 'text-[#141414] border-b-2 border-[#EE6123]'
                  : 'text-[#7E7D7A] hover:text-[#141414]'
              }`}
            >
              <Coins className="w-3.5 h-3.5 text-[#EE6123]" />
              <span>نرخ‌های رسمی و تسعیر ارز ({toPersianDigits(currencies.length)})</span>
            </button>
            <button
              onClick={() => setActiveTab('freight')}
              className={`pb-2 px-3 font-bold transition-all flex items-center gap-1.5 relative ${
                activeTab === 'freight'
                  ? 'text-[#141414] border-b-2 border-[#EE6123]'
                  : 'text-[#7E7D7A] hover:text-[#141414]'
              }`}
            >
              <Ship className="w-3.5 h-3.5 text-[#EE6123]" />
              <span>شاخص‌های کرایه حمل و ترانزیت ({toPersianDigits(freightRoutes.length)})</span>
            </button>
            <button
              onClick={() => setActiveTab('commodities')}
              className={`pb-2 px-3 font-bold transition-all flex items-center gap-1.5 relative ${
                activeTab === 'commodities'
                  ? 'text-[#141414] border-b-2 border-[#EE6123]'
                  : 'text-[#7E7D7A] hover:text-[#141414]'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-[#EE6123]" />
              <span>قیمت جهانی مواد اولیه (LME / SMM)</span>
            </button>
            <button
              onClick={() => setActiveTab('ports')}
              className={`pb-2 px-3 font-bold transition-all flex items-center gap-1.5 relative ${
                activeTab === 'ports'
                  ? 'text-[#141414] border-b-2 border-[#EE6123]'
                  : 'text-[#7E7D7A] hover:text-[#141414]'
              }`}
            >
              <Anchor className="w-3.5 h-3.5 text-[#EE6123]" />
              <span>زمان توقف و صف بنادر</span>
            </button>
            <button
              onClick={() => setActiveTab('risks')}
              className={`pb-2 px-3 font-bold transition-all flex items-center gap-1.5 relative ${
                activeTab === 'risks'
                  ? 'text-[#141414] border-b-2 border-[#EE6123]'
                  : 'text-[#7E7D7A] hover:text-[#141414]'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-[#EE6123]" />
              <span>شاخص‌های ریسک آبراهی و تسویه</span>
            </button>
          </div>

          {/* TAB 1: FOREX & CURRENCY RATES */}
          {activeTab === 'forex' && (
            <div className="space-y-4 pt-1 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5">
                {currencies.map((c) => {
                  const isUp = c.change24hPct >= 0;
                  return (
                    <div
                      key={c.id}
                      className="p-3.5 rounded-xl bg-white border border-[#E3E1DD] hover:border-[#EE6123]/40 transition-all space-y-2 text-xs shadow-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-[#141414]" dir="ltr">
                          {c.code}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-[#F5F4F0] text-[#7E7D7A] font-medium">
                          {c.category}
                        </span>
                      </div>

                      <div className="text-[11px] text-[#7E7D7A] truncate" title={c.nameFa}>
                        {c.nameFa}
                      </div>

                      <div className="flex items-baseline justify-between pt-1">
                        <div className="text-lg font-black text-[#141414] tabular-nums font-mono">
                          {toPersianDigits(c.rateToman.toLocaleString())}{' '}
                          <span className="text-[11px] font-normal text-[#7E7D7A]">تومان</span>
                        </div>
                        <span
                          className={`inline-flex items-center text-xs font-bold ${
                            isUp ? 'text-[#E5484D]' : 'text-[#52C41A]'
                          }`}
                        >
                          {isUp ? (
                            <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                          ) : (
                            <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
                          )}
                          {formatPersianPercent(c.change24hPct, 2)}
                        </span>
                      </div>

                      {/* Mini sparkline */}
                      <div className="flex items-end gap-1 h-6 pt-1">
                        {c.sparkline.map((val, idx) => (
                          <div
                            key={idx}
                            style={{
                              height: `${Math.max(4, Math.round(((val - c.low24h * 0.99) / (c.high24h * 1.01 - c.low24h * 0.99)) * 20))}px`,
                            }}
                            className={`flex-1 rounded-t-xs ${
                              isUp ? 'bg-[#FA8C16]' : 'bg-[#52C41A]'
                            }`}
                          />
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-[#7E7D7A] pt-1 hairline-t">
                        <span>پایین: {toPersianDigits(c.low24h.toLocaleString())}</span>
                        <span>بالا: {toPersianDigits(c.high24h.toLocaleString())}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Fast Currency Calculator */}
              <div className="p-4 rounded-xl bg-[#FAF9F7] border border-[#E3E1DD] flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <div className="font-bold text-[#141414] shrink-0">
                    محاسبه فوری برابری ارزش حواله:
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      value={calcUsdAmount}
                      onChange={(e) => setCalcUsdAmount(Math.max(0, Number(e.target.value)))}
                      className="w-32 bg-white text-[#141414] font-mono font-bold px-3 py-1.5 rounded-lg border border-[#E3E1DD] text-left"
                      dir="ltr"
                    />
                    <span className="absolute left-2 top-1.5 text-xs text-[#7E7D7A] font-bold">$</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
                  <div>
                    <span className="text-[#7E7D7A]">تسعیر سامانه نیما: </span>
                    <span className="font-bold text-[#141414]">
                      {toPersianDigits(convertUsdToToman(calcUsdAmount, 'nima').toLocaleString())} تومان
                    </span>
                  </div>
                  <div className="hidden sm:block text-[#E3E1DD]">|</div>
                  <div>
                    <span className="text-[#7E7D7A]">تسعیر مرکز مبادله (تالار ۲): </span>
                    <span className="font-bold text-[#141414]">
                      {toPersianDigits(convertUsdToToman(calcUsdAmount, 'talar2').toLocaleString())} تومان
                    </span>
                  </div>
                  <div className="hidden sm:block text-[#E3E1DD]">|</div>
                  <div>
                    <span className="text-[#7E7D7A]">تسعیر بازار آزاد تجاری: </span>
                    <span className="font-bold text-[#EE6123]">
                      {toPersianDigits(convertUsdToToman(calcUsdAmount, 'free').toLocaleString())} تومان
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: FREIGHT & SHIPPING INDICES */}
          {activeTab === 'freight' && (
            <div className="space-y-3 pt-1 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {freightRoutes.map((route) => {
                  const isUp = route.changeWeeklyPct >= 0;
                  return (
                    <div
                      key={route.id}
                      className="p-4 rounded-xl bg-white border border-[#E3E1DD] hover:border-[#EE6123]/40 transition-all text-xs space-y-3 shadow-xs"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-[#FAF9F7] text-[#141414] font-bold text-[10px] border border-[#E3E1DD]">
                              {route.transportType}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                route.statusLabel === 'روان و فعال'
                                  ? 'bg-[#52C41A]/10 text-[#52C41A]'
                                  : route.statusLabel === 'افزایش تقاضا'
                                  ? 'bg-[#FA8C16]/10 text-[#FA8C16]'
                                  : 'bg-[#E5484D]/10 text-[#E5484D]'
                              }`}
                            >
                              {route.statusLabel}
                            </span>
                          </div>
                          <h4 className="font-bold text-sm text-[#141414] mt-1.5">
                            {route.routeNameFa}
                          </h4>
                          <p className="text-[11px] font-mono text-[#7E7D7A] mt-0.5" dir="ltr">
                            {route.origin} → {route.destination}
                          </p>
                        </div>

                        <div className="text-left shrink-0">
                          <div className="text-lg font-black text-[#141414] tabular-nums font-mono" dir="ltr">
                            ${toPersianDigits(route.rateUsd.toLocaleString())}
                          </div>
                          <span
                            className={`inline-flex items-center text-xs font-bold ${
                              isUp ? 'text-[#E5484D]' : 'text-[#52C41A]'
                            }`}
                          >
                            {isUp ? (
                              <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
                            ) : (
                              <TrendingDown className="w-3.5 h-3.5 mr-0.5" />
                            )}
                            {formatPersianPercent(route.changeWeeklyPct, 1)} هفتگی
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 p-2.5 rounded-lg bg-[#FAF9F7] text-[11px] text-center">
                        <div>
                          <div className="text-[#7E7D7A]">مدت ترانزیت دریایی</div>
                          <div className="font-bold text-[#141414] mt-0.5">
                            {toPersianDigits(route.transitDays)} روز
                          </div>
                        </div>
                        <div>
                          <div className="text-[#7E7D7A]">معطلی صف بارگیری</div>
                          <div className="font-bold text-[#141414] mt-0.5">
                            {toPersianDigits(route.congestionDays)} روز
                          </div>
                        </div>
                        <div>
                          <div className="text-[#7E7D7A]">حق بیمه مازاد ریسک</div>
                          <div className="font-bold text-[#EE6123] mt-0.5 font-mono">
                            ${toPersianDigits(route.surchargeUsd)}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Red Sea / Route Safety Notice */}
              <div className="p-3 bg-[#FFF9F5] border border-[#EE6123]/30 rounded-xl flex items-center justify-between text-xs text-[#141414]">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-[#EE6123] shrink-0" />
                  <span>
                    <strong>تحلیل مسیرهای لاینر:</strong> مسیرهای کانتینری مستقیم شرق آسیا به بندرعباس بدون نیاز به عبور از تنگه باب‌المندب برقرار بوده و مشمول تأخیر دور زدن آفریقا نمی‌شوند.
                  </span>
                </div>
                <button
                  onClick={handleApplyToCostMatrix}
                  className="px-3 py-1 bg-[#181818] text-white hover:bg-black rounded-lg text-xs font-bold shrink-0 transition-colors"
                >
                  محاسبه بهای تمام‌شده با این نرخ‌ها
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: COMMODITIES & RAW MATERIALS */}
          {activeTab === 'commodities' && (
            <div className="space-y-3 pt-1 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {rawMaterials.map((rm) => {
                  const isUp = rm.changePct >= 0;
                  return (
                    <div
                      key={rm.id}
                      className="p-4 rounded-xl bg-white border border-[#E3E1DD] hover:border-[#EE6123]/40 transition-all text-xs space-y-2.5 shadow-xs"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded bg-[#181818] text-[#FDF498] font-mono text-[10px] font-bold">
                              {rm.market}
                            </span>
                            <span className="font-mono text-[11px] text-[#7E7D7A]" dir="ltr">
                              {rm.symbol}
                            </span>
                          </div>
                          <h4 className="font-bold text-sm text-[#141414] mt-1.5">
                            {rm.nameFa}
                          </h4>
                        </div>

                        <div className="text-left shrink-0">
                          <div className="text-lg font-black text-[#141414] tabular-nums font-mono" dir="ltr">
                            ${toPersianDigits(rm.priceUsdPerTon.toLocaleString())}
                            <span className="text-xs text-[#7E7D7A] font-normal mr-1">/ {rm.unit}</span>
                          </div>
                          <span
                            className={`inline-flex items-center text-xs font-bold ${
                              isUp ? 'text-[#E5484D]' : 'text-[#52C41A]'
                            }`}
                          >
                            {isUp ? (
                              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                            ) : (
                              <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
                            )}
                            {formatPersianPercent(rm.changePct, 2)}
                          </span>
                        </div>
                      </div>

                      {/* Sparkline */}
                      <div className="flex items-end gap-1.5 h-7 pt-1">
                        {rm.sparkline.map((val, idx) => (
                          <div
                            key={idx}
                            style={{
                              height: `${Math.max(6, Math.round(((val - Math.min(...rm.sparkline) * 0.98) / (Math.max(...rm.sparkline) * 1.02 - Math.min(...rm.sparkline) * 0.98)) * 24))}px`,
                            }}
                            className={`flex-1 rounded-t-xs ${
                              isUp ? 'bg-[#EE6123]' : 'bg-[#52C41A]'
                            }`}
                          />
                        ))}
                      </div>

                      <div className="p-2.5 rounded-lg bg-[#FAF9F7] text-[11px] text-[#7E7D7A] leading-relaxed">
                        <strong className="text-[#141414]">اثر بر سفارشات:</strong> {rm.impactOnComponents}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: PORT CONGESTION & LEAD TIMES */}
          {activeTab === 'ports' && (
            <div className="space-y-3 pt-1 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {portStatuses.map((port) => (
                  <div
                    key={port.id}
                    className="p-4 rounded-xl bg-white border border-[#E3E1DD] hover:border-[#EE6123]/40 transition-all text-xs space-y-2.5 shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{port.flag}</span>
                        <div>
                          <h4 className="font-bold text-xs text-[#141414]">{port.portNameFa}</h4>
                          <span className="text-[10px] font-mono text-[#7E7D7A]">{port.portCode}</span>
                        </div>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          port.statusColor === 'green'
                            ? 'bg-[#52C41A]/10 text-[#52C41A]'
                            : port.statusColor === 'orange'
                            ? 'bg-[#FA8C16]/10 text-[#FA8C16]'
                            : 'bg-[#E5484D]/10 text-[#E5484D]'
                        }`}
                      >
                        {port.congestionStatus}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 p-2 bg-[#FAF9F7] rounded-lg text-center">
                      <div>
                        <div className="text-[10px] text-[#7E7D7A]">میانگین توقف کشتی</div>
                        <div className="font-bold text-sm text-[#141414] mt-0.5">
                          {toPersianDigits(port.avgDwellDays)} روز
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-[#7E7D7A]">راندمان ترخیص</div>
                        <div className="font-bold text-sm text-[#141414] mt-0.5">
                          {toPersianDigits(port.clearanceEfficiencyPct)}٪
                        </div>
                      </div>
                    </div>

                    <p className="text-[11px] text-[#7E7D7A] leading-relaxed">
                      {port.recentNote}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: GEOPOLITICAL & SETTLEMENT RISKS */}
          {activeTab === 'risks' && (
            <div className="space-y-3 pt-1 animate-in fade-in duration-150">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {riskCorridors.map((corridor) => (
                  <div
                    key={corridor.id}
                    className="p-4 rounded-xl bg-white border border-[#E3E1DD] hover:border-[#EE6123]/40 transition-all text-xs space-y-3 shadow-xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-medium text-[#7E7D7A]">
                          {corridor.geographicZone}
                        </span>
                        <h4 className="font-bold text-sm text-[#141414] mt-0.5">
                          {corridor.corridorNameFa}
                        </h4>
                      </div>
                      <div className="text-left shrink-0">
                        <span
                          className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${
                            corridor.riskScore < 30
                              ? 'bg-[#52C41A]/10 text-[#52C41A]'
                              : corridor.riskScore < 60
                              ? 'bg-[#FA8C16]/10 text-[#FA8C16]'
                              : 'bg-[#E5484D]/10 text-[#E5484D]'
                          }`}
                        >
                          شاخص ریسک: {toPersianDigits(corridor.riskScore)}/۱۰۰
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 text-[11px] leading-relaxed">
                      <div className="p-2.5 rounded-lg bg-[#FAF9F7] text-[#141414]">
                        <strong className="text-[#EE6123]">وضعیت امنیتی و کانال مالی: </strong>
                        {corridor.securityStatus}
                      </div>
                      <div className="p-2.5 rounded-lg bg-[#F5F4F0] text-[#141414]">
                        <strong className="text-[#181818]">پیشنهاد راهبردی خرید: </strong>
                        {corridor.recommendedAction}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 2. Monitored Products Strip */}
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

        {/* 3. Alert Feed Section */}
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

                  {/* Actions Bar for the Alert */}
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

      {/* Solid Orange Feature Panel on Left: Control & Notification Setup */}
      <OrangeFeaturePanel
        title="مرکز پایش هوشمند و اعلان‌ها"
        badge="اتصال داده زنده"
        subtitle="مدیریت هشدارهای نوسان ارزی، کرایه حمل و کانال‌های اطلاع‌رسانی"
        footerActions={
          <div className="space-y-2 w-full">
            <button
              onClick={handleApplyToCostMatrix}
              className="w-full bg-[#181818] text-white hover:bg-black py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>اعمال مستقیم بر بهای تمام‌شده</span>
              <ArrowRight className="w-4 h-4 text-[#FDF498]" />
            </button>
            <button
              onClick={() => {
                showToast('تنظیمات ذخیره شد', 'قوانین پایش و آستانه هشدارهای ارزی ذخیره گردید.', 'success');
              }}
              className="w-full bg-white/15 hover:bg-white/20 text-white py-2 px-4 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer border border-white/20"
            >
              <span>ذخیره تنظیمات کانال‌ها</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-[#FDF498]" />
            </button>
          </div>
        }
      >
        <div className="space-y-3.5">
          {/* Active Status Box */}
          <div className="bg-black/20 p-3.5 rounded-xl border border-white/15 space-y-2 text-xs">
            <div className="flex items-center justify-between text-white">
              <span className="font-bold">وضعیت اتصال به فیدهای زنده:</span>
              <span className="text-[#FDF498] font-bold">برقرار (۱۰۰٪)</span>
            </div>
            <div className="text-[11px] text-white/80 space-y-1">
              <div>• نرخ حواله نیما: {toPersianDigits(currencies[0]?.rateToman.toLocaleString())} ت</div>
              <div>• کرایه ۴۰ft شانگهای: ${toPersianDigits(freightRoutes[0]?.rateUsd)}</div>
              <div>• فلز بلبرینگ SMM: ${toPersianDigits(rawMaterials[0]?.priceUsdPerTon)}</div>
            </div>
          </div>

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
                  className="flex-1 bg-[#181818] text-white hover:bg-black py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  ارسال رسمی درخواست نمونه
                </button>
                <button
                  type="button"
                  onClick={() => setSampleModalSupplier(null)}
                  className="px-4 py-2.5 bg-[#F5F4F0] text-[#141414] hover:bg-[#EAE8E4] rounded-xl text-xs font-medium transition-colors cursor-pointer"
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
