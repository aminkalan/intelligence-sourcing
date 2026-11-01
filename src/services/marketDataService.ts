import {
  CurrencyRate,
  FreightRouteIndex,
  RawMaterialIndex,
  PortLogisticsStatus,
  RiskCorridorIndex,
  MarketShockType,
  MarketDataState,
} from '../types';

// Initial realistic baseline data for Iranian commercial importers
const INITIAL_CURRENCIES: CurrencyRate[] = [
  {
    id: 'usd-nima',
    code: 'USD/IRR (نیما)',
    nameFa: 'دلار سامانه نیما (تخصیص بازرگانی)',
    category: 'سامانه نیما',
    rateToman: 54850,
    change24hPct: 0.28,
    high24h: 54920,
    low24h: 54780,
    sparkline: [54500, 54620, 54700, 54680, 54750, 54800, 54850],
    updatedAt: 'همین حالا',
  },
  {
    id: 'usd-talar2',
    code: 'USD/IRR (تالار دوم)',
    nameFa: 'دلار توافقی مرکز مبادله طلا و ارز',
    category: 'مرکز مبادله (تالار دوم)',
    rateToman: 58600,
    change24hPct: 0.42,
    high24h: 58750,
    low24h: 58400,
    sparkline: [57900, 58100, 58300, 58250, 58400, 58500, 58600],
    updatedAt: 'همین حالا',
  },
  {
    id: 'cny-nima',
    code: 'CNY/IRR (یوآن)',
    nameFa: 'یوآن چین سامانه نیما (کونلون بانک)',
    category: 'سامانه نیما',
    rateToman: 7620,
    change24hPct: -0.12,
    high24h: 7640,
    low24h: 7610,
    sparkline: [7650, 7645, 7630, 7635, 7625, 7622, 7620],
    updatedAt: 'همین حالا',
  },
  {
    id: 'aed-nima',
    code: 'AED/IRR (درهم)',
    nameFa: 'درهم امارات (نرخ مرجع حواله تجاری)',
    category: 'سامانه نیما',
    rateToman: 14940,
    change24hPct: 0.22,
    high24h: 14970,
    low24h: 14910,
    sparkline: [14850, 14880, 14900, 14910, 14920, 14930, 14940],
    updatedAt: 'همین حالا',
  },
  {
    id: 'eur-nima',
    code: 'EUR/IRR (یورو)',
    nameFa: 'یورو سامانه نیما',
    category: 'سامانه نیما',
    rateToman: 59350,
    change24hPct: 0.16,
    high24h: 59450,
    low24h: 59200,
    sparkline: [59100, 59150, 59250, 59200, 59300, 59320, 59350],
    updatedAt: 'همین حالا',
  },
  {
    id: 'inr-vostro',
    code: 'INR/IRR (روپیه)',
    nameFa: 'روپیه هند (حساب ویژه ووسترو UCO)',
    category: 'منطقه‌ای',
    rateToman: 642,
    change24hPct: 0.05,
    high24h: 644,
    low24h: 640,
    sparkline: [638, 639, 640, 641, 641, 642, 642],
    updatedAt: 'همین حالا',
  },
  {
    id: 'usd-free',
    code: 'USD/IRR (آزاد)',
    nameFa: 'دلار بازار آزاد تجاری (حواله دبی/سلیمانیه)',
    category: 'بازار آزاد',
    rateToman: 71850,
    change24hPct: 0.65,
    high24h: 72100,
    low24h: 71400,
    sparkline: [70800, 71100, 71300, 71500, 71600, 71750, 71850],
    updatedAt: 'همین حالا',
  },
];

const INITIAL_FREIGHT_ROUTES: FreightRouteIndex[] = [
  {
    id: 'fr-shanghai-bnd-40',
    routeNameFa: 'شانگهای / نینگبو به بندرعباس (شهید رجایی)',
    origin: 'Shanghai / Ningbo, CN',
    destination: 'Bandar Abbas (BND), IR',
    transportType: 'دریایی ۴۰ فوت',
    rateUsd: 2850,
    changeWeeklyPct: 4.8,
    transitDays: 26,
    congestionDays: 2.2,
    surchargeUsd: 180,
    statusLabel: 'افزایش تقاضا',
  },
  {
    id: 'fr-haiphong-bnd-40',
    routeNameFa: 'هایفونگ (ویتنام) به بندرعباس',
    origin: 'Haiphong (HPH), VN',
    destination: 'Bandar Abbas (BND), IR',
    transportType: 'دریایی ۴۰ فوت',
    rateUsd: 2180,
    changeWeeklyPct: -2.4,
    transitDays: 19,
    congestionDays: 1.1,
    surchargeUsd: 120,
    statusLabel: 'روان و فعال',
  },
  {
    id: 'fr-nhava-bnd-20',
    routeNameFa: 'ناوا شیوا / بمبئی به بندرعباس',
    origin: 'Nhava Sheva (NSA), IN',
    destination: 'Bandar Abbas (BND), IR',
    transportType: 'دریایی ۲۰ فوت',
    rateUsd: 1150,
    changeWeeklyPct: 1.2,
    transitDays: 7,
    congestionDays: 1.8,
    surchargeUsd: 90,
    statusLabel: 'روان و فعال',
  },
  {
    id: 'fr-turkey-tehran-truck',
    routeNameFa: 'بورسا / استانبول به گمرک شهریار تهران (تیر زمینی)',
    origin: 'Bursa / Istanbul, TR',
    destination: 'Shahriar Customs, Tehran, IR',
    transportType: 'جاده‌ای ترانزیت (تیر)',
    rateUsd: 3400,
    changeWeeklyPct: -1.5,
    transitDays: 8,
    congestionDays: 3.2,
    surchargeUsd: 0,
    statusLabel: 'تأخیر جاده‌ای',
  },
  {
    id: 'fr-qingdao-bnd-20',
    routeNameFa: 'چینگدائو به بندرعباس (۲۰ فوت سنگین)',
    origin: 'Qingdao (TAO), CN',
    destination: 'Bandar Abbas (BND), IR',
    transportType: 'دریایی ۲۰ فوت',
    rateUsd: 1650,
    changeWeeklyPct: 3.1,
    transitDays: 28,
    congestionDays: 2.5,
    surchargeUsd: 150,
    statusLabel: 'روان و فعال',
  },
];

const INITIAL_RAW_MATERIALS: RawMaterialIndex[] = [
  {
    id: 'rm-bearing-steel',
    nameFa: 'فولاد بلبرینگ آلیاژی GCr15 / 100Cr6',
    symbol: 'GCr15/SAE52100',
    market: 'SMM',
    priceUsdPerTon: 895,
    unit: 'تن متریک',
    changePct: 1.25,
    sparkline: [875, 880, 882, 889, 890, 892, 895],
    impactOnComponents: 'تأثیر ۵۸٪ بر بهای تمام‌شده ساخت بیرینگ‌های صنعتی و خودرویی',
  },
  {
    id: 'rm-copper-lme',
    nameFa: 'مس کاتد خالص درجه یک (LME Grade A)',
    symbol: 'CU-CATH',
    market: 'LME',
    priceUsdPerTon: 9640,
    unit: 'تن متریک',
    changePct: 0.82,
    sparkline: [9520, 9550, 9580, 9600, 9620, 9610, 9640],
    impactOnComponents: 'عامل اصلی نوسان قیمت سیم‌پیچ الکتروموتورها و ترانسفورماتورها',
  },
  {
    id: 'rm-aluminum-primary',
    nameFa: 'آلومینیوم اولیه شمش خلوص ۹۹.۷٪',
    symbol: 'AL-99.7',
    market: 'LME',
    priceUsdPerTon: 2490,
    unit: 'تن متریک',
    changePct: -0.45,
    sparkline: [2510, 2505, 2500, 2495, 2492, 2488, 2490],
    impactOnComponents: 'پوسته موتور و قطعات سبک دایکست مکانیکی',
  },
  {
    id: 'rm-cold-rolled-steel',
    nameFa: 'ورق فولادی نورد سرد باکیفیت (SPCC/CRC)',
    symbol: 'CRC-SPCC',
    market: 'SHFE',
    priceUsdPerTon: 725,
    unit: 'تن متریک',
    changePct: 0.38,
    sparkline: [715, 718, 720, 722, 723, 724, 725],
    impactOnComponents: 'بدنه پمپ‌ها، شاسی صنعتی و فریم‌های ماشین‌آلات دقیق',
  },
];

const INITIAL_PORT_STATUSES: PortLogisticsStatus[] = [
  {
    id: 'port-bnd',
    portNameFa: 'بندر شهید رجایی (بندرعباس)',
    portCode: 'IRBND',
    country: 'ایران',
    flag: '🇮🇷',
    avgDwellDays: 4.8,
    clearanceEfficiencyPct: 88,
    congestionStatus: 'ترافیک متوسط',
    statusColor: 'orange',
    recentNote: 'تخلیه کانتینری ۲۴ ساعته؛ ارزیابی سریع لاین استاندارد گمرک سبز فعال است.',
  },
  {
    id: 'port-shanghai',
    portNameFa: 'بندر بین‌المللی شانگهای / یانگ‌شان',
    portCode: 'CNSHA',
    country: 'چین',
    flag: '🇨🇳',
    avgDwellDays: 2.2,
    clearanceEfficiencyPct: 96,
    congestionStatus: 'عادی و روان',
    statusColor: 'green',
    recentNote: 'تردد روان فیدرها و بارگیری بدون معطلی بارنامه‌های FOB.',
  },
  {
    id: 'port-haiphong',
    portNameFa: 'بندر عمیق هایفونگ (Lach Huyen)',
    portCode: 'VNHPH',
    country: 'ویتنام',
    flag: '🇻🇳',
    avgDwellDays: 1.1,
    clearanceEfficiencyPct: 98,
    congestionStatus: 'عادی و روان',
    statusColor: 'green',
    recentNote: 'کوتاه‌ترین صف خروج در آسیای جنوب‌شرقی؛ اولویت کشتی‌های مستقیم خط خاورمیانه.',
  },
  {
    id: 'port-nhava',
    portNameFa: 'بندر جواهر لعل نهرو (ناوا شیوا)',
    portCode: 'INNSA',
    country: 'هند',
    flag: '🇮🇳',
    avgDwellDays: 2.1,
    clearanceEfficiencyPct: 92,
    congestionStatus: 'عادی و روان',
    statusColor: 'green',
    recentNote: 'مسیر مستقیم به خلیج فارس با کمترین مسافت دریایی (۶ الی ۸ روز دریایی).',
  },
  {
    id: 'port-bazargan',
    portNameFa: 'گمرک مرزی بازرگان - گوربولاغ',
    portCode: 'IRBZR',
    country: 'ایران / ترکیه',
    flag: '🇹🇷',
    avgDwellDays: 3.2,
    clearanceEfficiencyPct: 81,
    congestionStatus: 'تراکم و کندی',
    statusColor: 'orange',
    recentNote: 'صف توقف کامیون‌های ترانزیتی به دلیل ارتقای سیستم‌های اسکن اشعه ایکس مرزی.',
  },
];

const INITIAL_RISK_CORRIDORS: RiskCorridorIndex[] = [
  {
    id: 'risk-hormuz',
    corridorNameFa: 'آبراهه تجاری تنگه هرمز و دریای عمان',
    geographicZone: 'خلیج فارس',
    riskScore: 24,
    riskLevel: 'پایین (سبز)',
    securityStatus: 'تردد ناوگان تجاری کانتینری و فله‌بر کاملاً عادی و بدون اختلال است.',
    financialChannelStatus: 'پوشش بیمه استاندارد P&I با نرخ پایه برقرار است.',
    recommendedAction: 'ادامه ثبت سفارش‌های روتین دریایی با خطوط مستقیم IRISL و وان‌های بین‌المللی.',
  },
  {
    id: 'risk-red-sea',
    corridorNameFa: 'تنگه باب‌المندب و جنوب دریای سرخ',
    geographicZone: 'ورودی دریای سرخ',
    riskScore: 78,
    riskLevel: 'هشدار بالا (نارنجی)',
    securityStatus: 'بحران امنیتی و انحراف لاینرهای اروپایی دور دماغه امید نیک (Cape of Good Hope).',
    financialChannelStatus: 'حق بیمه مازاد جنگی (War Surcharge) معادل $۴۲۰ برای هر TEU کانتینر.',
    recommendedAction: 'تأمین کالا از آسیای شرقی یا مسیرهای زمینی ترکیه برای اجتناب از تأخیر ۱۵ روزه اروپا.',
  },
  {
    id: 'risk-cips-kunlun',
    corridorNameFa: 'کانال بانکی کونلون و تسویه CIPS یوآن چین',
    geographicZone: 'چین - پکن/شانگهای',
    riskScore: 28,
    riskLevel: 'پایین (سبز)',
    securityStatus: 'حوالجات مستقیم ارزی در بستر یوان فرامرزی با زمان تسویه ۴ الی ۶ روز کاری فعال است.',
    financialChannelStatus: 'عدم وابستگی به سوئیفت دلار و بدون ریسک بلوکه‌شدن وجوه.',
    recommendedAction: 'درج شرط پرداخت با یوآن (CNY) در پیش‌فاکتورها به جای دلار برای تسریع ترخیص.',
  },
  {
    id: 'risk-uae-dirham',
    corridorNameFa: 'مجاری تراستی صرافی دبی (حواله درهم امارات)',
    geographicZone: 'امارات متحده عربی',
    riskScore: 36,
    riskLevel: 'متوسط (زرد)',
    securityStatus: 'نظارت‌های تشدید شده AML بانک مرکزی امارات بر حساب‌های واسطه تجاری.',
    financialChannelStatus: 'کارمزد نقل‌وانتقال حواله ارزی در محدوده ۱.۶٪ تا ۱.۹٪ تثبیت شده است.',
    recommendedAction: 'استفاده از شرکت‌های ثبت‌شده اماراتی با تاریخچه مالی بالای ۳ سال.',
  },
];

class MarketDataService {
  private state: MarketDataState;
  private listeners: Set<(state: MarketDataState) => void> = new Set();
  private autoSyncInterval: any = null;

  constructor() {
    this.state = {
      currencies: [...INITIAL_CURRENCIES],
      freightRoutes: [...INITIAL_FREIGHT_ROUTES],
      rawMaterials: [...INITIAL_RAW_MATERIALS],
      portStatuses: [...INITIAL_PORT_STATUSES],
      riskCorridors: [...INITIAL_RISK_CORRIDORS],
      lastUpdated: new Date(),
      activeShock: 'none',
      isAutoSyncActive: true,
    };

    // Start auto sync pulse
    this.startAutoSync();
  }

  public getState(): MarketDataState {
    return this.state;
  }

  public subscribe(listener: (state: MarketDataState) => void): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener(this.state));
  }

  public startAutoSync() {
    if (this.autoSyncInterval) return;
    this.autoSyncInterval = setInterval(() => {
      this.refreshMarketData(true);
    }, 45000); // 45 seconds pulse
    if (typeof this.autoSyncInterval?.unref === 'function') {
      this.autoSyncInterval.unref();
    }
    this.state.isAutoSyncActive = true;
    this.notify();
  }

  public stopAutoSync() {
    if (this.autoSyncInterval) {
      clearInterval(this.autoSyncInterval);
      this.autoSyncInterval = null;
    }
    this.state.isAutoSyncActive = false;
    this.notify();
  }

  public refreshMarketData(silent = false) {
    // Generate organic micro-changes
    const updatedCurrencies = this.state.currencies.map((c) => {
      const delta = (Math.random() - 0.48) * 40; // slight random tick
      const newRate = Math.round(c.rateToman + delta);
      const newSparkline = [...c.sparkline.slice(1), newRate];
      return {
        ...c,
        rateToman: newRate,
        sparkline: newSparkline,
        high24h: Math.max(c.high24h, newRate),
        low24h: Math.min(c.low24h, newRate),
        updatedAt: 'همین حالا',
      };
    });

    const updatedRawMaterials = this.state.rawMaterials.map((rm) => {
      const tick = (Math.random() - 0.49) * 4;
      const newPrice = Math.round((rm.priceUsdPerTon + tick) * 10) / 10;
      return {
        ...rm,
        priceUsdPerTon: newPrice,
        sparkline: [...rm.sparkline.slice(1), newPrice],
      };
    });

    this.state = {
      ...this.state,
      currencies: updatedCurrencies,
      rawMaterials: updatedRawMaterials,
      lastUpdated: new Date(),
    };

    this.notify();
  }

  public triggerMarketShock(shock: MarketShockType) {
    if (shock === 'none') {
      // Reset back to baseline
      this.state = {
        ...this.state,
        currencies: [...INITIAL_CURRENCIES],
        freightRoutes: [...INITIAL_FREIGHT_ROUTES],
        portStatuses: [...INITIAL_PORT_STATUSES],
        activeShock: 'none',
        lastUpdated: new Date(),
      };
    } else if (shock === 'freight_spike') {
      // Simulate +32% ocean freight surge
      const surgedRoutes = INITIAL_FREIGHT_ROUTES.map((r) => {
        if (r.transportType.includes('دریایی')) {
          return {
            ...r,
            rateUsd: Math.round(r.rateUsd * 1.32),
            changeWeeklyPct: 28.5,
            surchargeUsd: r.surchargeUsd + 350,
            statusLabel: 'هشدار هزینه جنگی' as const,
          };
        }
        return r;
      });

      this.state = {
        ...this.state,
        freightRoutes: surgedRoutes,
        activeShock: 'freight_spike',
        lastUpdated: new Date(),
      };
    } else if (shock === 'fx_spike') {
      // Simulate +12% currency fluctuation
      const surgedCurrencies = INITIAL_CURRENCIES.map((c) => ({
        ...c,
        rateToman: Math.round(c.rateToman * 1.12),
        change24hPct: 4.8,
        high24h: Math.round(c.rateToman * 1.125),
        sparkline: [...c.sparkline.slice(1), Math.round(c.rateToman * 1.12)],
      }));

      this.state = {
        ...this.state,
        currencies: surgedCurrencies,
        activeShock: 'fx_spike',
        lastUpdated: new Date(),
      };
    } else if (shock === 'port_congestion') {
      // Simulate major port congestion in Bandar Abbas & Ningbo
      const congestedPorts = INITIAL_PORT_STATUSES.map((p) => {
        if (p.id === 'port-bnd') {
          return {
            ...p,
            avgDwellDays: 8.9,
            clearanceEfficiencyPct: 62,
            congestionStatus: 'تراکم و کندی' as const,
            statusColor: 'red' as const,
            recentNote: 'ازدحام شدید بارانداز و کاهش ناوگان تریلی‌های حمل درون‌شهری.',
          };
        }
        if (p.id === 'port-shanghai') {
          return {
            ...p,
            avgDwellDays: 5.6,
            congestionStatus: 'تراکم و کندی' as const,
            statusColor: 'orange' as const,
            recentNote: 'مه‌گرفتگی شدید دلتای رودخانه یانگ تسه و صف ۲۶ فروندی کشتی‌ها.',
          };
        }
        return p;
      });

      this.state = {
        ...this.state,
        portStatuses: congestedPorts,
        activeShock: 'port_congestion',
        lastUpdated: new Date(),
      };
    }

    this.notify();
  }

  // Helper conversions
  public convertUsdToToman(usdAmount: number, rateType: 'nima' | 'talar2' | 'free' = 'nima'): number {
    const targetId =
      rateType === 'nima' ? 'usd-nima' : rateType === 'talar2' ? 'usd-talar2' : 'usd-free';
    const rateObj = this.state.currencies.find((c) => c.id === targetId);
    const rate = rateObj ? rateObj.rateToman : 54850;
    return Math.round(usdAmount * rate);
  }

  public getUsdNimaRate(): number {
    const rate = this.state.currencies.find((c) => c.id === 'usd-nima');
    return rate ? rate.rateToman : 54850;
  }

  public getShanghaiFreightRate(): number {
    const route = this.state.freightRoutes.find((r) => r.id === 'fr-shanghai-bnd-40');
    return route ? route.rateUsd : 2850;
  }

  public getHaiphongFreightRate(): number {
    const route = this.state.freightRoutes.find((r) => r.id === 'fr-haiphong-bnd-40');
    return route ? route.rateUsd : 2180;
  }
}

// Global Singleton
export const marketDataService = new MarketDataService();
