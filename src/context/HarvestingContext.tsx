import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Holding, CapitalGains } from '../types';
import { fetchHoldings, fetchCapitalGains } from '../services/api';

interface HarvestingState {
  holdings: Holding[];
  baseCapitalGains: CapitalGains | null;
  selectedCoins: Set<string>;
  isLoadingHoldings: boolean;
  isLoadingGains: boolean;
  error: string | null;
  showAll: boolean;
}

interface HarvestingContextType extends HarvestingState {
  toggleCoin: (coinKey: string) => void;
  toggleAll: () => void;
  setShowAll: (val: boolean) => void;
  computedAfterGains: CapitalGains | null;
  savings: number;
}

const HarvestingContext = createContext<HarvestingContextType | null>(null);

const coinKey = (h: Holding) => `${h.coin}_${h.coinName}`;

export const HarvestingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<HarvestingState>({
    holdings: [],
    baseCapitalGains: null,
    selectedCoins: new Set(),
    isLoadingHoldings: true,
    isLoadingGains: true,
    error: null,
    showAll: false,
  });

  useEffect(() => {
    fetchHoldings()
      .then(data => setState(s => ({ ...s, holdings: data, isLoadingHoldings: false })))
      .catch(() => setState(s => ({ ...s, error: 'Failed to load holdings.', isLoadingHoldings: false })));

    fetchCapitalGains()
      .then(data => setState(s => ({ ...s, baseCapitalGains: data.capitalGains, isLoadingGains: false })))
      .catch(() => setState(s => ({ ...s, error: 'Failed to load capital gains.', isLoadingGains: false })));
  }, []);

  const toggleCoin = useCallback((key: string) => {
    setState(s => {
      const next = new Set(s.selectedCoins);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return { ...s, selectedCoins: next };
    });
  }, []);

  const toggleAll = useCallback(() => {
    setState(s => {
      const allKeys = s.holdings.map(coinKey);
      const allSelected = allKeys.every(k => s.selectedCoins.has(k));
      return { ...s, selectedCoins: allSelected ? new Set() : new Set(allKeys) };
    });
  }, []);

  const setShowAll = useCallback((val: boolean) => {
    setState(s => ({ ...s, showAll: val }));
  }, []);

  // Compute after-harvesting capital gains
  const computedAfterGains: CapitalGains | null = (() => {
    if (!state.baseCapitalGains) return null;
    let stcgProfits = state.baseCapitalGains.stcg.profits;
    let stcgLosses = state.baseCapitalGains.stcg.losses;
    let ltcgProfits = state.baseCapitalGains.ltcg.profits;
    let ltcgLosses = state.baseCapitalGains.ltcg.losses;

    for (const h of state.holdings) {
      if (!state.selectedCoins.has(coinKey(h))) continue;
      if (h.stcg.gain > 0) stcgProfits += h.stcg.gain;
      else if (h.stcg.gain < 0) stcgLosses += Math.abs(h.stcg.gain);
      if (h.ltcg.gain > 0) ltcgProfits += h.ltcg.gain;
      else if (h.ltcg.gain < 0) ltcgLosses += Math.abs(h.ltcg.gain);
    }
    return {
      stcg: { profits: stcgProfits, losses: stcgLosses },
      ltcg: { profits: ltcgProfits, losses: ltcgLosses },
    };
  })();

  const netBefore = state.baseCapitalGains
    ? (state.baseCapitalGains.stcg.profits - state.baseCapitalGains.stcg.losses) +
      (state.baseCapitalGains.ltcg.profits - state.baseCapitalGains.ltcg.losses)
    : 0;

  const netAfter = computedAfterGains
    ? (computedAfterGains.stcg.profits - computedAfterGains.stcg.losses) +
      (computedAfterGains.ltcg.profits - computedAfterGains.ltcg.losses)
    : 0;

  const savings = netBefore > netAfter ? netBefore - netAfter : 0;

  return (
    <HarvestingContext.Provider value={{
      ...state, toggleCoin, toggleAll, setShowAll, computedAfterGains, savings
    }}>
      {children}
    </HarvestingContext.Provider>
  );
};

export const useHarvesting = () => {
  const ctx = useContext(HarvestingContext);
  if (!ctx) throw new Error('useHarvesting must be used within HarvestingProvider');
  return ctx;
};

export { coinKey };
