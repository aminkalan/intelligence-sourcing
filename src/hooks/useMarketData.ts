import { useState, useEffect } from 'react';
import { marketDataService } from '../services/marketDataService';
import { MarketDataState, MarketShockType } from '../types';

export function useMarketData() {
  const [marketState, setMarketState] = useState<MarketDataState>(() =>
    marketDataService.getState()
  );

  useEffect(() => {
    const unsubscribe = marketDataService.subscribe((newState) => {
      setMarketState({ ...newState });
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const refreshNow = () => {
    marketDataService.refreshMarketData(false);
  };

  const triggerShock = (shock: MarketShockType) => {
    marketDataService.triggerMarketShock(shock);
  };

  const toggleAutoSync = () => {
    if (marketState.isAutoSyncActive) {
      marketDataService.stopAutoSync();
    } else {
      marketDataService.startAutoSync();
    }
  };

  return {
    marketState,
    currencies: marketState.currencies,
    freightRoutes: marketState.freightRoutes,
    rawMaterials: marketState.rawMaterials,
    portStatuses: marketState.portStatuses,
    riskCorridors: marketState.riskCorridors,
    lastUpdated: marketState.lastUpdated,
    activeShock: marketState.activeShock,
    isAutoSyncActive: marketState.isAutoSyncActive,
    refreshNow,
    triggerShock,
    toggleAutoSync,
    convertUsdToToman: marketDataService.convertUsdToToman.bind(marketDataService),
    getUsdNimaRate: marketDataService.getUsdNimaRate.bind(marketDataService),
    getShanghaiFreightRate: marketDataService.getShanghaiFreightRate.bind(marketDataService),
    getHaiphongFreightRate: marketDataService.getHaiphongFreightRate.bind(marketDataService),
  };
}
