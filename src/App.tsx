import React, { useState } from 'react';
import { NavigationRail } from './components/layout/NavigationRail';
import { TopBar } from './components/layout/TopBar';
import { OverviewPage } from './components/pages/OverviewPage';
import { ProductDefinitionPage } from './components/pages/ProductDefinitionPage';
import { SuppliersPage } from './components/pages/SuppliersPage';
import { TrustScorePage } from './components/pages/TrustScorePage';
import { ComparisonPage } from './components/pages/ComparisonPage';
import { RfqPage } from './components/pages/RfqPage';
import { AlternativeMarketsPage } from './components/pages/AlternativeMarketsPage';
import { MarketWatchPage } from './components/pages/MarketWatchPage';
import { ToastProvider, useToast } from './components/common/Toast';
import { PageId } from './types';
import { MOCK_MARKET_ALERTS, BUYER_PROFILE } from './data/mockData';
import { toPersianDigits } from './utils/persian';
import { X, Settings as SettingsIcon, Bell, CheckCircle2, Shield } from 'lucide-react';

function AppContent() {
  const { showToast } = useToast();

  const [activePage, setActivePage] = useState<PageId>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [navExtra, setNavExtra] = useState<any>(null);

  // Notifications & Settings Modals
  const [notificationsModalOpen, setNotificationsModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  // Settings state
  const [companyName, setCompanyName] = useState(BUYER_PROFILE.companyName);
  const [defaultIncoterm, setDefaultIncoterm] = useState('CIF بندرعباس');
  const [currencyPref, setCurrencyPref] = useState('USD ($)');

  const unreadAlertsCount = MOCK_MARKET_ALERTS.filter((a) => a.actionRequired).length;

  const handleNavigate = (page: PageId, extra?: any) => {
    setActivePage(page);
    setNavExtra(extra || null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsModalOpen(false);
    showToast('تنظیمات کاربری ذخیره شد', 'اطلاعات شرکت و ارز محاسباتی پیش‌فرض بروزرسانی گردید.', 'success');
  };

  return (
    <div className="min-h-screen bg-topo-pattern text-[#141414] flex flex-row antialiased overflow-x-hidden">
      {/* 1. Slim Vertical Navigation Rail on the RIGHT EDGE (72px) */}
      <NavigationRail
        activePage={activePage}
        onSelectPage={(page) => handleNavigate(page)}
        unreadAlertsCount={unreadAlertsCount}
        onOpenNotifications={() => setNotificationsModalOpen(true)}
        onOpenSettings={() => setSettingsModalOpen(true)}
      />

      {/* 2. Main Workspace Layout */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <TopBar
          activePage={activePage}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onQuickNavigate={(page) => handleNavigate(page)}
        />

        {/* Dynamic Page Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          {activePage === 'overview' && <OverviewPage onNavigate={handleNavigate} />}
          {activePage === 'product-definition' && (
            <ProductDefinitionPage onNavigate={handleNavigate} />
          )}
          {activePage === 'suppliers' && (
            <SuppliersPage
              onNavigate={handleNavigate}
              initialSupplierId={navExtra?.selectedSupplierId}
            />
          )}
          {activePage === 'trust-score' && <TrustScorePage onNavigate={handleNavigate} />}
          {activePage === 'comparison' && <ComparisonPage onNavigate={handleNavigate} />}
          {activePage === 'rfq' && (
            <RfqPage
              onNavigate={handleNavigate}
              selectedRfqId={navExtra?.selectedRfqId}
              preselectedSupplierId={navExtra?.preselectedSupplierId}
            />
          )}
          {activePage === 'alternative-markets' && (
            <AlternativeMarketsPage onNavigate={handleNavigate} />
          )}
          {activePage === 'market-watch' && <MarketWatchPage onNavigate={handleNavigate} />}
        </main>
      </div>

      {/* Notifications Drawer / Modal */}
      {notificationsModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="swiss-card max-w-lg w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 hairline-b">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#EE6123]/10 text-[#EE6123] flex items-center justify-center">
                  <Bell className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-base text-[#141414]">
                  اعلان‌ها و هشدارهای زنجیره تأمین
                </h3>
              </div>
              <button
                onClick={() => setNotificationsModalOpen(false)}
                className="text-[#7E7D7A] hover:text-[#141414]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {MOCK_MARKET_ALERTS.map((alert) => (
                <div
                  key={alert.id}
                  onClick={() => {
                    setNotificationsModalOpen(false);
                    handleNavigate('market-watch');
                  }}
                  className="p-3.5 rounded-xl bg-[#FAF9F7] hover:bg-[#F5F4F0] cursor-pointer transition-colors border border-[#E3E1DD] space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#141414]">{alert.title}</span>
                    <span className="text-[10px] text-[#7E7D7A]">{alert.date}</span>
                  </div>
                  <p className="text-[11px] text-[#7E7D7A] line-clamp-2 leading-relaxed">
                    {alert.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  setNotificationsModalOpen(false);
                  handleNavigate('market-watch');
                }}
                className="w-full bg-[#181818] text-white hover:bg-black py-2 rounded-xl text-xs font-bold transition-colors"
              >
                مشاهده همه هشدارها در صفحه پایش بازار
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {settingsModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="swiss-card max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 hairline-b">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#181818] text-[#FDF498] flex items-center justify-center">
                  <SettingsIcon className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-base text-[#141414]">تنظیمات حساب بازرگانی</h3>
              </div>
              <button
                onClick={() => setSettingsModalOpen(false)}
                className="text-[#7E7D7A] hover:text-[#141414]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-3.5 text-xs text-right">
              <div>
                <label className="block font-semibold text-[#141414] mb-1">نام سازمان بازرگانی</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full bg-[#F5F4F0] text-xs text-[#141414] rounded-lg p-2.5 border border-transparent focus:border-[#EE6123] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#141414] mb-1">
                  شرط اینکوترمز پیش‌فرض استعلام
                </label>
                <input
                  type="text"
                  value={defaultIncoterm}
                  onChange={(e) => setDefaultIncoterm(e.target.value)}
                  className="w-full bg-[#F5F4F0] text-xs text-[#141414] rounded-lg p-2.5 border border-transparent focus:border-[#EE6123] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#141414] mb-1">ارز محاسباتی پایه</label>
                <select
                  value={currencyPref}
                  onChange={(e) => setCurrencyPref(e.target.value)}
                  className="w-full bg-[#F5F4F0] text-xs text-[#141414] rounded-lg p-2.5 border border-transparent focus:border-[#EE6123] focus:bg-white focus:outline-none"
                >
                  <option value="USD ($)">دلار آمریکا (USD $)</option>
                  <option value="EUR (€)">یورو اروپا (EUR €)</option>
                  <option value="AED (د.إ)">درهم امارات (AED د.إ)</option>
                  <option value="CNY (¥)">یوان چین (CNY ¥)</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#181818] text-white hover:bg-black py-2.5 rounded-xl text-xs font-bold transition-colors"
                >
                  ذخیره تنظیمات
                </button>
                <button
                  type="button"
                  onClick={() => setSettingsModalOpen(false)}
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
}

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}
