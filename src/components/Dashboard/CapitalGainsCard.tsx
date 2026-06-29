import React from 'react';
import { CapitalGains } from '../../types';
import { formatCurrency } from '../../utils/format';

interface Props {
  variant: 'dark' | 'blue';
  title: string;
  gains: CapitalGains | null;
  isLoading: boolean;
  savings?: number;
}

const SkeletonLine: React.FC<{ width?: string }> = ({ width = '100%' }) => (
  <div className="skeleton-line" style={{ width, marginBottom: '10px' }} />
);

interface TooltipProps { label: string; tip: string }
const Tooltip: React.FC<TooltipProps> = ({ label, tip }) => (
  <span className="tooltip-wrap" style={{ gap: 4 }}>
    <span>{label}</span>
    <span style={{ cursor: 'help', color: 'var(--text-muted)', lineHeight: 1 }}>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
      </svg>
    </span>
    <span className="tooltip-tip">{tip}</span>
  </span>
);

export const CapitalGainsCard: React.FC<Props> = ({ variant, title, gains, isLoading, savings }) => {
  const isBlue = variant === 'blue';
  const cls = `gains-card ${variant}`;

  const stcgNet = gains ? gains.stcg.profits - gains.stcg.losses : 0;
  const ltcgNet = gains ? gains.ltcg.profits - gains.ltcg.losses : 0;
  const realised = stcgNet + ltcgNet;

  const valCls = (val: number) =>
    isBlue ? 'gains-value blue-white' : val >= 0 ? 'gains-value profit' : 'gains-value loss';

  const netColor = (val: number): React.CSSProperties =>
    isBlue
      ? { color: val >= 0 ? '#fff' : '#FCA5A5' }
      : { color: val >= 0 ? 'var(--accent-green)' : 'var(--accent-red)' };

  return (
    <div className={cls}>
      <div className="gains-card-header">
        <span className="gains-card-label">{title}</span>
        <span className="gains-card-pill">{isBlue ? 'Simulated' : 'Current'}</span>
      </div>

      {isLoading ? (
        <>
          <SkeletonLine width="55%" />
          <SkeletonLine width="80%" />
          <SkeletonLine width="65%" />
          <SkeletonLine width="90%" />
          <SkeletonLine width="45%" />
        </>
      ) : gains ? (
        <>
          {/* Column headers */}
          <div className="gains-row-head">
            <span className="gains-col-label">Category</span>
            <span className="gains-col-label">Profits</span>
            <span className="gains-col-label">Losses</span>
          </div>

          {/* Short-Term */}
          <div className="gains-section">
            <div className="gains-section-title">
              <Tooltip label="Short-Term" tip="Assets held < 36 months" />
            </div>
            <div className="gains-row">
              <span className="gains-row-label">Capital Gains</span>
              <span className={valCls(gains.stcg.profits)} style={isBlue ? { color: '#86EFAC' } : {}}>
                {formatCurrency(gains.stcg.profits)}
              </span>
              <span className={valCls(-gains.stcg.losses)} style={isBlue ? { color: '#FCA5A5' } : { color: 'var(--accent-red)' }}>
                {formatCurrency(gains.stcg.losses)}
              </span>
            </div>
          </div>

          {/* Long-Term */}
          <div className="gains-section">
            <div className="gains-section-title">
              <Tooltip label="Long-Term" tip="Assets held ≥ 36 months" />
            </div>
            <div className="gains-row">
              <span className="gains-row-label">Capital Gains</span>
              <span className={valCls(gains.ltcg.profits)} style={isBlue ? { color: '#86EFAC' } : {}}>
                {formatCurrency(gains.ltcg.profits)}
              </span>
              <span className={valCls(-gains.ltcg.losses)} style={isBlue ? { color: '#FCA5A5' } : { color: 'var(--accent-red)' }}>
                {formatCurrency(gains.ltcg.losses)}
              </span>
            </div>
          </div>

          <div className="gains-divider" />

          {/* Net values */}
          <div className="gains-net-section">
            <div className="gains-net-row">
              <span className="gains-net-label">Net Short-Term</span>
              <span className="gains-net-value" style={netColor(stcgNet)}>
                {formatCurrency(stcgNet)}
              </span>
            </div>
            <div className="gains-net-row">
              <span className="gains-net-label">Net Long-Term</span>
              <span className="gains-net-value" style={netColor(ltcgNet)}>
                {formatCurrency(ltcgNet)}
              </span>
            </div>

            <div className="gains-divider" style={{ margin: '10px 0 12px' }} />

            <div className="gains-net-row">
              <span className="gains-net-label bold">Realised Capital Gains</span>
              <span className="gains-net-value lg" style={netColor(realised)}>
                {formatCurrency(realised)}
              </span>
            </div>
          </div>

          {savings !== undefined && savings > 0 && (
            <div className="savings-badge">
              <svg className="savings-badge-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              <span className="savings-badge-text">
                You're saving {formatCurrency(savings)} in taxes this year!
              </span>
            </div>
          )}
        </>
      ) : (
        <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>No data available</div>
      )}
    </div>
  );
};
