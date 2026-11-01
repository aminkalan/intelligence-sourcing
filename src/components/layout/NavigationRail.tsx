import React from 'react';
import {
  LayoutDashboard,
  PackagePlus,
  Building2,
  ShieldCheck,
  Scale,
  FileSpreadsheet,
  Globe2,
  LineChart,
  Bell,
  Settings,
} from 'lucide-react';
import { PageId } from '../../types';
import { toPersianDigits } from '../../utils/persian';

interface NavigationRailProps {
  activePage: PageId;
  onSelectPage: (page: PageId) => void;
  unreadAlertsCount: number;
  onOpenNotifications: () => void;
  onOpenSettings: () => void;
}

interface NavItem {
  id: PageId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'overview', label: 'نمای کلی خریدار', icon: LayoutDashboard },
  { id: 'product-definition', label: 'تعریف کالا و مشخصات', icon: PackagePlus },
  { id: 'suppliers', label: 'بانک تأمین‌کنندگان', icon: Building2 },
  { id: 'trust-score', label: 'امتیاز اعتماد و اعتبارسنجی', icon: ShieldCheck },
  { id: 'comparison', label: 'مقایسه بهای تمام‌شده', icon: Scale },
  { id: 'rfq', label: 'استعلام قیمت (RFQ)', icon: FileSpreadsheet },
  { id: 'alternative-markets', label: 'بازارهای جایگزین', icon: Globe2 },
  { id: 'market-watch', label: 'پایش بازار و هشدارها', icon: LineChart },
];

export const NavigationRail: React.FC<NavigationRailProps> = ({
  activePage,
  onSelectPage,
  unreadAlertsCount,
  onOpenNotifications,
  onOpenSettings,
}) => {
  return (
    <aside
      className="w-[72px] shrink-0 bg-[#FFFFFF] hairline-l flex flex-col items-center justify-between py-4 z-40 select-none shadow-[2px_0_12px_rgba(0,0,0,0.03)]"
      style={{ minHeight: '100vh' }}
      aria-label="نوار ناوبری اصلی"
    >
      {/* Top zone: Yellow Square Logo Tile + Nav Items */}
      <div className="flex flex-col items-center w-full gap-5">
        {/* Canary Yellow Square Logo Tile */}
        <button
          onClick={() => onSelectPage('overview')}
          className="w-12 h-12 rounded-xl bg-[#FDF498] text-[#181818] flex items-center justify-center font-black text-lg tracking-tighter shadow-sm hover:scale-105 active:scale-95 transition-all group relative"
          title="SourceIQ - صفحه اصلی"
          aria-label="SourceIQ لوگو"
        >
          <span>SQ</span>
          <div className="absolute right-[80px] px-2.5 py-1 bg-[#181818] text-white text-xs rounded-md shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
            SourceIQ · سامانه واردات
          </div>
        </button>

        {/* 8 Primary Nav Icons */}
        <nav className="flex flex-col items-center w-full gap-2 px-2.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <div key={item.id} className="relative group w-full flex justify-center">
                <button
                  onClick={() => onSelectPage(item.id)}
                  aria-label={item.label}
                  className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-150 relative ${
                    isActive
                      ? 'bg-[#FDF498] text-[#181818] font-bold shadow-sm ring-1 ring-[#181818]/10'
                      : 'text-[#7E7D7A] hover:bg-[#F5F4F0] hover:text-[#181818]'
                  }`}
                >
                  <Icon className="w-5 h-5 stroke-[1.6]" />
                  {isActive && (
                    <span className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#EE6123] rounded-r-full" />
                  )}
                </button>

                {/* Persian Tooltip */}
                <div className="absolute right-[76px] top-1/2 -translate-y-1/2 px-2.5 py-1.5 bg-[#181818] text-white text-xs font-medium rounded-lg shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-150 whitespace-nowrap z-50 flex items-center gap-1.5">
                  <span>{item.label}</span>
                </div>
              </div>
            );
          })}
        </nav>
      </div>

      {/* Bottom zone: Notifications Bell + Settings */}
      <div className="flex flex-col items-center w-full gap-2 px-2.5 pt-4 hairline-t">
        {/* Bell with Orange Badge */}
        <div className="relative group w-full flex justify-center">
          <button
            onClick={onOpenNotifications}
            aria-label="اعلان‌ها و هشدارهای زنجیره تأمین"
            className="w-11 h-11 rounded-xl flex items-center justify-center text-[#7E7D7A] hover:bg-[#F5F4F0] hover:text-[#181818] transition-colors relative"
          >
            <Bell className="w-5 h-5 stroke-[1.6]" />
            {unreadAlertsCount > 0 && (
              <span className="absolute top-2 right-2 min-w-4 h-4 px-1 rounded-full bg-[#EE6123] text-white text-[10px] font-bold flex items-center justify-center leading-none">
                {toPersianDigits(unreadAlertsCount)}
              </span>
            )}
          </button>
          <div className="absolute right-[76px] top-1/2 -translate-y-1/2 px-2.5 py-1 bg-[#181818] text-white text-xs rounded-lg shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
            هشدارها و اطلاعیه‌ها ({toPersianDigits(unreadAlertsCount)})
          </div>
        </div>

        {/* Settings button */}
        <div className="relative group w-full flex justify-center">
          <button
            onClick={onOpenSettings}
            aria-label="تنظیمات سامانه"
            className="w-11 h-11 rounded-xl flex items-center justify-center text-[#7E7D7A] hover:bg-[#F5F4F0] hover:text-[#181818] transition-colors"
          >
            <Settings className="w-5 h-5 stroke-[1.6]" />
          </button>
          <div className="absolute right-[76px] top-1/2 -translate-y-1/2 px-2.5 py-1 bg-[#181818] text-white text-xs rounded-lg shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap z-50">
            تنظیمات و سفارشی‌سازی
          </div>
        </div>
      </div>
    </aside>
  );
};
