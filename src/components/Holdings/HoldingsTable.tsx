import React, { useState, useMemo } from 'react';
import { useHarvesting, coinKey } from '../../context/HarvestingContext';
import { formatCurrency, formatNumber } from '../../utils/format';
import { Holding } from '../../types';

const INITIAL_SHOW = 8;

type SortKey = 'gain' | 'stcg' | 'ltcg' | 'price' | 'holdings';
type SortDir = 'asc' | 'desc';

const GainCell: React.FC<{ gain: number; balance: number }> = ({ gain, balance }) => {
  const cls = gain > 0 ? 'up' : gain < 0 ? 'down' : 'zero';
  const prefix = gain > 0 ? '+' : '';
  const tagCls = gain > 0 ? 'gain-tag up' : gain < 0 ? 'gain-tag down' : '';
  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
        <div className={`gain-cell-value ${cls}`}>{prefix}{formatCurrency(gain)}</div>
        {gain !== 0 && (
          <span className={tagCls}>
            {gain > 0 ? '▲' : '▼'}
          </span>
        )}
      </div>
      <div className="gain-cell-balance">{formatNumber(balance, 4)} units</div>
    </div>
  );
};

const AssetLogo: React.FC<{ holding: Holding }> = ({ holding }) => {
  const [err, setErr] = useState(false);
  if (err || !holding.logo || holding.logo.includes('DefaultCoin')) {
    return (
      <div className="asset-logo-fallback">
        {holding.coin.replace('$', '').slice(0, 2).toUpperCase()}
      </div>
    );
  }
  return (
    <img
      className="asset-logo"
      src={holding.logo}
      alt={holding.coin}
      onError={() => setErr(true)}
    />
  );
};

interface SortHeaderProps {
  label: string;
  sortKey: SortKey;
  currentSort: SortKey;
  direction: SortDir;
  onSort: (key: SortKey) => void;
  tooltip?: string;
}
const SortHeader: React.FC<SortHeaderProps> = ({ label, sortKey, currentSort, direction, onSort, tooltip }) => {
  const isActive = currentSort === sortKey;
  return (
    <th className={`sortable${isActive ? ' sort-active' : ''}`} onClick={() => onSort(sortKey)} title={tooltip}>
      <div className="th-inner">
        {label}
        <svg className="sort-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          {isActive && direction === 'desc'
            ? <path d="M12 5v14M5 12l7 7 7-7"/>
            : isActive && direction === 'asc'
            ? <path d="M12 19V5M5 12l7-7 7 7"/>
            : <path d="M8 9l4-4 4 4M16 15l-4 4-4-4"/>
          }
        </svg>
      </div>
    </th>
  );
};

export const HoldingsTable: React.FC = () => {
  const {
    holdings, selectedCoins, toggleCoin, toggleAll,
    isLoadingHoldings, error, showAll, setShowAll
  } = useHarvesting();

  const [sortKey, setSortKey] = useState<SortKey>('gain');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const sortedHoldings = useMemo(() => {
    const arr = [...holdings];
    const sign = sortDir === 'desc' ? -1 : 1;
    return arr.sort((a, b) => {
      switch (sortKey) {
        case 'gain':    return sign * ((a.stcg.gain + a.ltcg.gain) - (b.stcg.gain + b.ltcg.gain));
        case 'stcg':   return sign * (a.stcg.gain - b.stcg.gain);
        case 'ltcg':   return sign * (a.ltcg.gain - b.ltcg.gain);
        case 'price':  return sign * (a.currentPrice - b.currentPrice);
        case 'holdings': return sign * (a.totalHolding * a.currentPrice - b.totalHolding * b.currentPrice);
        default: return 0;
      }
    });
  }, [holdings, sortKey, sortDir]);

  const displayed = showAll ? sortedHoldings : sortedHoldings.slice(0, INITIAL_SHOW);
  const allKeys = holdings.map(coinKey);
  const allSelected = allKeys.length > 0 && allKeys.every(k => selectedCoins.has(k));
  const someSelected = allKeys.some(k => selectedCoins.has(k)) && !allSelected;

  // Net impact row calculation
  const netImpact = useMemo(() => {
    let stcg = 0, ltcg = 0;
    for (const h of holdings) {
      if (!selectedCoins.has(coinKey(h))) continue;
      stcg += h.stcg.gain;
      ltcg += h.ltcg.gain;
    }
    return { stcg, ltcg, total: stcg + ltcg };
  }, [holdings, selectedCoins]);

  const setCheckboxRef = (el: HTMLInputElement | null) => {
    if (el) el.indeterminate = someSelected;
  };

  if (error) {
    return (
      <div className="holdings-card">
        <div className="error-state">
          <svg className="error-icon" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <div className="error-title">Failed to load holdings</div>
          <div className="error-sub">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="holdings-card">
      <div className="holdings-header">
        <div className="holdings-header-left">
          <div className="holdings-title">Your Holdings</div>
          <div className="holdings-count">
            {isLoadingHoldings ? 'Loading portfolio…' : `${holdings.length} assets · sorted by total gain`}
          </div>
        </div>
        <div className="holdings-header-right">
          {selectedCoins.size > 0 && (
            <div className="holdings-selected-badge">
              <span className="holdings-selected-dot" />
              {selectedCoins.size} selected for harvesting
            </div>
          )}
        </div>
      </div>

      {isLoadingHoldings ? (
        <div className="spinner-wrap">
          <div className="spinner" />
          <div className="spinner-text">Loading your portfolio…</div>
        </div>
      ) : (
        <>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th style={{ width: '44px' }}>
                    <div className="cb-wrap">
                      <input
                        ref={setCheckboxRef}
                        type="checkbox"
                        className="cb"
                        checked={allSelected}
                        onChange={toggleAll}
                        title="Select / deselect all"
                      />
                    </div>
                  </th>
                  <th>Asset</th>
                  <SortHeader label="Holdings / Avg Buy" sortKey="holdings" currentSort={sortKey} direction={sortDir} onSort={handleSort} tooltip="Sort by portfolio value" />
                  <SortHeader label="Current Price" sortKey="price" currentSort={sortKey} direction={sortDir} onSort={handleSort} />
                  <SortHeader label="Short-Term Gain" sortKey="stcg" currentSort={sortKey} direction={sortDir} onSort={handleSort} tooltip="Unrealised STCG" />
                  <SortHeader label="Long-Term Gain" sortKey="ltcg" currentSort={sortKey} direction={sortDir} onSort={handleSort} tooltip="Unrealised LTCG" />
                  <th>Amount to Sell</th>
                </tr>
              </thead>
              <tbody>
                {displayed.length === 0 ? (
                  <tr className="empty-row">
                    <td colSpan={7}>No holdings found</td>
                  </tr>
                ) : (
                  <>
                    {displayed.map((h) => {
                      const key = coinKey(h);
                      const selected = selectedCoins.has(key);
                      return (
                        <tr
                          key={key}
                          className={selected ? 'selected fade-in' : ''}
                          onClick={() => toggleCoin(key)}
                          style={{ cursor: 'pointer' }}
                        >
                          <td onClick={e => e.stopPropagation()}>
                            <div className="cb-wrap">
                              <input
                                type="checkbox"
                                className="cb"
                                checked={selected}
                                onChange={() => toggleCoin(key)}
                              />
                            </div>
                          </td>
                          <td>
                            <div className="asset-cell">
                              <AssetLogo holding={h} />
                              <div>
                                <div className="asset-symbol">{h.coin}</div>
                                <div className="asset-name" title={h.coinName}>{h.coinName}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div style={{ fontWeight: 600, fontSize: '13px' }}>{formatNumber(h.totalHolding, 6)}</div>
                            <div className="holdings-sub">Avg: {formatCurrency(h.averageBuyPrice)}</div>
                          </td>
                          <td>
                            <div className="price-main">{formatCurrency(h.currentPrice)}</div>
                          </td>
                          <td>
                            <GainCell gain={h.stcg.gain} balance={h.stcg.balance} />
                          </td>
                          <td>
                            {h.ltcg.gain !== 0 || h.ltcg.balance !== 0
                              ? <GainCell gain={h.ltcg.gain} balance={h.ltcg.balance} />
                              : <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>—</span>
                            }
                          </td>
                          <td>
                            {selected
                              ? <div className="amount-cell">{formatNumber(h.totalHolding, 6)}</div>
                              : <div className="amount-cell empty">Select to populate</div>
                            }
                          </td>
                        </tr>
                      );
                    })}

                    {/* Net impact summary row */}
                    {selectedCoins.size > 0 && (
                      <tr className={`impact-row${netImpact.total < 0 ? ' negative' : ''}`}>
                        <td colSpan={4} style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-secondary)' }}>
                          <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                            Net Harvesting Impact ({selectedCoins.size} assets)
                          </div>
                        </td>
                        <td>
                          <div className={`gain-cell-value ${netImpact.stcg >= 0 ? 'up' : 'down'}`}>
                            {netImpact.stcg >= 0 ? '+' : ''}{formatCurrency(netImpact.stcg)}
                          </div>
                          <div className="gain-cell-balance">STCG impact</div>
                        </td>
                        <td>
                          <div className={`gain-cell-value ${netImpact.ltcg >= 0 ? 'up' : 'down'}`}>
                            {netImpact.ltcg >= 0 ? '+' : ''}{formatCurrency(netImpact.ltcg)}
                          </div>
                          <div className="gain-cell-balance">LTCG impact</div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 700, fontSize: '14px', fontFamily: 'var(--font-display)', color: netImpact.total >= 0 ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                            {netImpact.total >= 0 ? '+' : ''}{formatCurrency(netImpact.total)}
                          </div>
                          <div className="gain-cell-balance">Total gain impact</div>
                        </td>
                      </tr>
                    )}
                  </>
                )}
              </tbody>
            </table>
          </div>

          {holdings.length > INITIAL_SHOW && (
            <div className="view-all-row">
              <button className="btn-view-all" onClick={() => setShowAll(!showAll)}>
                {showAll
                  ? `Show fewer assets`
                  : `View all ${holdings.length} assets`
                }
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
