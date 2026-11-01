import React from 'react';
import { Search, Building, Sparkles } from 'lucide-react';
import { PageId } from '../../types';
import { BUYER_PROFILE, DEMO_NOTICE } from '../../data/mockData';

interface TopBarProps {
  activePage: PageId;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onQuickNavigate: (page: PageId) => void;
}

const PAGE_TITLES: Record<PageId, { title: string; subtitle: string }> = {
  overview: {
    title: 'نمای کلی خریدار',
    subtitle: 'داشبورد جامع شاخص‌های کلیدی خرید، پایش بهای تمام‌شده و وضعیت تأمین‌کنندگان',
  },
  'product-definition': {
    title: 'تعریف کالا و نیازمندی واردات',
    subtitle: 'ثبت استانداردهای فنی، بازارهای مجاز و استخراج هوشمند فایل اسپک',
  },
  suppliers: {
    title: 'بانک تأمین‌کنندگان بین‌المللی',
    subtitle: 'فهرست کارخانجات و تجار ارزیابی‌شده در چین، ویتنام، ترکیه و هند',
  },
  'trust-score': {
    title: 'امتیاز اعتماد و اعتبارسنجی',
    subtitle: 'ممیزی چندلایه حقوقی، مالی، ظرفیت تولید و سوابق خروج کالا با نظارت انسانی',
  },
  comparison: {
    title: 'مقایسه استاندارد بهای تمام‌شده (Landed Cost)',
    subtitle: 'محاسبه دقیق اقلام کرایه، بیمه، حقوق گمرکی و رتبه‌بندی وزنی زنده',
  },
  rfq: {
    title: 'مدیریت استعلام قیمت (RFQ)',
    subtitle: 'صدور، پیگیری و نرمال‌سازی پیشنهادات فنی-مالی تأمین‌کنندگان',
  },
  'alternative-markets': {
    title: 'تحلیل بازارهای جایگزین و تنوع‌بخشی',
    subtitle: 'نقشه ترانزیت، مقایسه صرفه‌جویی نسبت به چین و نمایه ریسک کشورها',
  },
  'market-watch': {
    title: 'پایش هوشمند بازار و هشدارها',
    subtitle: 'رصد خودکار نوسانات ارزی، قیمت جهانی مواد خام، تعرفه‌ها و فرصت‌های جدید',
  },
};

export const TopBar: React.FC<TopBarProps> = ({
  activePage,
  searchQuery,
  onSearchChange,
  onQuickNavigate,
}) => {
  const meta = PAGE_TITLES[activePage] || PAGE_TITLES.overview;

  return (
    <header className="h-[76px] bg-[#FFFFFF] hairline-b px-6 flex items-center justify-between gap-6 shrink-0 z-30 select-none">
      {/* Right Zone: Page Title and subtle subtitle */}
      <div className="flex flex-col justify-center text-right shrink-0">
        <div className="flex items-center gap-3">
          <h1 className="text-xl lg:text-2xl font-black text-[#141414] tracking-tight">
            {meta.title}
          </h1>
          <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#F5F4F0] text-[11px] font-medium text-[#7E7D7A]">
            <Sparkles className="w-3 h-3 text-[#EE6123]" />
            نسخه آزمایشی
          </span>
        </div>
        <p className="text-xs text-[#7E7D7A] hidden md:block mt-0.5 truncate max-w-lg">
          {meta.subtitle}
        </p>
      </div>

      {/* Center Zone: Search field 'جست‌وجوی کالا یا کد HS...' */}
      <div className="flex-1 max-w-sm mx-2">
        <div className="relative flex items-center">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="جست‌وجوی کالا، کد HS، نام تأمین‌کننده یا کشور..."
            className="w-full bg-[#F5F4F0] text-[#141414] placeholder-[#7E7D7A] text-xs sm:text-sm rounded-xl py-2 pl-9 pr-9 focus:outline-none focus:ring-2 focus:ring-[#EE6123]/25 focus:bg-white transition-all hairline-b border border-transparent focus:border-[#EE6123]"
          />
          <Search className="w-4 h-4 text-[#7E7D7A] absolute right-3 pointer-events-none" />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute left-3 text-xs text-[#7E7D7A] hover:text-[#141414] px-1"
            >
              پاک کردن
            </button>
          )}
        </div>
      </div>

      {/* Live Market Pulse Strip */}
      <div
        onClick={() => onQuickNavigate('market-watch')}
        className="hidden xl:flex items-center gap-2.5 bg-[#FAF9F7] hover:bg-[#F5F4F0] px-3 py-1.5 rounded-xl border border-[#E3E1DD] cursor-pointer transition-colors text-xs"
        title="مشاهده تابلوی زنده شاخص‌های بازار و ریسک"
      >
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#52C41A] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#52C41A]"></span>
        </span>
        <div className="flex items-center gap-2 font-mono text-[11px]">
          <span className="text-[#141414] font-bold">
            دلار نیما: <span className="text-[#EE6123]">۵۴,۸۵۰</span> ت
          </span>
          <span className="text-[#BFBDB8]">|</span>
          <span className="text-[#141414] font-bold">
            حمل ۴۰ft چین: <span className="text-[#181818]">$۲,۸۵۰</span>
          </span>
        </div>
        <span className="text-[10px] font-bold text-[#52C41A] bg-[#52C41A]/10 px-1.5 py-0.5 rounded">
          زنده
        </span>
      </div>

      {/* Left Zone: Company Profile & User Avatar */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="hidden lg:flex flex-col items-end text-left text-xs">
          <span className="font-bold text-[#141414]">{BUYER_PROFILE.companyName}</span>
          <span className="text-[11px] text-[#7E7D7A]">سید رضا حسینی · تدارکات بین‌الملل</span>
        </div>
        <div
          className="w-10 h-10 rounded-xl bg-[#181818] text-white flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-[#FDF498] cursor-pointer hover:opacity-90 transition-opacity"
          title={DEMO_NOTICE}
        >
          <Building className="w-4 h-4 text-[#FDF498]" />
        </div>
      </div>
    </header>
  );
};
