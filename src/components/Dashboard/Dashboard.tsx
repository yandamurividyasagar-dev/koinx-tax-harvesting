import React from 'react';
import { Navbar } from '../Layout/Navbar';
import { CapitalGainsCard } from './CapitalGainsCard';
import { HoldingsTable } from '../Holdings/HoldingsTable';
import { useHarvesting } from '../../context/HarvestingContext';
import { formatCurrency } from '../../utils/format';

export const Dashboard: React.FC = () => {
  const {
    baseCapitalGains,
    computedAfterGains,
    isLoadingGains,
    savings,
    error,
  } = useHarvesting();

  // Summary strip values
  const preNet = baseCapitalGains
    ? (baseCapitalGains.stcg.profits - baseCapitalGains.stcg.losses) +
      (baseCapitalGains.ltcg.profits - baseCapitalGains.ltcg.losses)
    : null;
  const afterNet = computedAfterGains
    ? (computedAfterGains.stcg.profits - computedAfterGains.stcg.losses) +
      (computedAfterGains.ltcg.profits - computedAfterGains.ltcg.losses)
    : null;

  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content">
        {/* Page header */}
        <div className="page-header">
          <div className="page-header-left">
            <h1 className="page-title">Tax Loss Harvesting</h1>
            <p className="page-sub">
              <span className="page-live-dot" />
              Real-time simulation &nbsp;·&nbsp; FY 2024–25
            </p>
          </div>
        </div>

        {/* Summary strip */}
        {!isLoadingGains && preNet !== null && (
          <div className="summary-strip">
            <div className="summary-item">
              <span className="summary-item-label">Current Realised Gain</span>
              <span className={`summary-item-value ${preNet >= 0 ? 'green' : 'red'}`}>{formatCurrency(preNet)}</span>
            </div>
            <div className="summary-item">
              <span className="summary-item-label">After Harvesting</span>
              <span className={`summary-item-value ${(afterNet ?? 0) >= 0 ? 'green' : 'red'}`}>{formatCurrency(afterNet ?? preNet)}</span>
            </div>
            <div className="summary-item">
              <span className="summary-item-label">Potential Tax Savings</span>
              <span className={`summary-item-value ${savings > 0 ? 'green' : ''}`}>{savings > 0 ? formatCurrency(savings) : '—'}</span>
            </div>
            <div className="summary-item">
              <span className="summary-item-label">STCG Profits</span>
              <span className="summary-item-value green">{formatCurrency(baseCapitalGains?.stcg.profits ?? 0)}</span>
            </div>
          </div>
        )}

        {/* Info banner */}
        <div className="info-banner">
          <svg className="info-banner-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
          <div className="info-banner-text">
            <strong>How tax loss harvesting works:</strong> Select holdings below to simulate selling and immediately rebuying them.
            This books unrealised losses, offsetting your capital gains and reducing your tax liability.
            The "After Harvesting" card updates in real-time as you make selections.
          </div>
        </div>

        {error && !isLoadingGains && (
          <div style={{ background:'rgba(244,63,94,0.07)', border:'1px solid rgba(244,63,94,0.2)', borderRadius:'12px', padding:'14px 18px', marginBottom:'20px', color:'#F43F5E', fontSize:'13px' }}>
            {error}
          </div>
        )}

        {/* Cards */}
        <div className="gains-grid">
          <CapitalGainsCard
            variant="dark"
            title="Pre Harvesting"
            gains={baseCapitalGains}
            isLoading={isLoadingGains}
          />
          <CapitalGainsCard
            variant="blue"
            title="After Harvesting"
            gains={computedAfterGains}
            isLoading={isLoadingGains}
            savings={savings}
          />
        </div>

        <HoldingsTable />
      </main>
    </div>
  );
};
