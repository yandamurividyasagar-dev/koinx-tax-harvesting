import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { validateEmail, validatePassword } from '../../utils/format';

interface Props { onSwitch: () => void; }

export const LoginPage: React.FC<Props> = ({ onSwitch }) => {
  const { login, loginWithGoogle, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});

  const validate = () => {
    const e: typeof errors = {};
    if (!email) e.email = 'Email is required.';
    else if (!validateEmail(email)) e.email = 'Enter a valid email address.';
    if (!password) e.password = 'Password is required.';
    return e;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    const result = await login(email, password);
    if (!result.success) setErrors({ form: result.error });
  };

  return (
    <div className="auth-root">
      <div className="auth-panel">
        <div className="auth-panel-logo">
          <div className="auth-panel-logo-icon">K</div>
          <span className="auth-panel-logo-text">KoinX</span>
        </div>
        <h2 className="auth-panel-headline">
          Reduce your <span>crypto taxes</span><br />the smart way
        </h2>
        <p className="auth-panel-sub">
          Tax loss harvesting helps you offset gains with losses to minimise your tax liability — legally.
        </p>
        <div className="auth-stats">
          <div className="auth-stat">
            <div className="auth-stat-value">₹70K+</div>
            <div className="auth-stat-label">Avg. tax saved</div>
          </div>
          <div className="auth-stat">
            <div className="auth-stat-value">25+</div>
            <div className="auth-stat-label">Supported coins</div>
          </div>
          <div className="auth-stat">
            <div className="auth-stat-value">Real-time</div>
            <div className="auth-stat-label">Gain tracking</div>
          </div>
          <div className="auth-stat">
            <div className="auth-stat-value">100%</div>
            <div className="auth-stat-label">Legally compliant</div>
          </div>
        </div>
      </div>

      <div className="auth-form-box">
        <div className="auth-form-inner">
          <div className="auth-badge">
            <span className="auth-badge-dot" />
            Secure &amp; Encrypted
          </div>
          <h1 className="auth-form-title">Welcome back</h1>
          <p className="auth-form-sub">Sign in to your KoinX account</p>

          <button className="btn-google" onClick={() => loginWithGoogle()} disabled={isLoading} type="button">
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.35-8.16 2.35-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            Continue with Google
          </button>

          <div className="auth-divider">
            <div className="auth-divider-line" />
            <span className="auth-divider-text">or sign in with email</span>
            <div className="auth-divider-line" />
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {errors.form && (
              <div style={{ background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:'8px', padding:'12px 14px', marginBottom:'16px', fontSize:'13px', color:'#EF4444' }}>
                {errors.form}
              </div>
            )}
            <div className="form-group">
              <label className="form-label">Email address</label>
              <div className="form-input-wrap">
                <svg className="form-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <input
                  className={`form-input${errors.email ? ' error' : ''}`}
                  type="email" placeholder="you@example.com"
                  value={email} onChange={e => { setEmail(e.target.value); setErrors(p=>({...p,email:undefined})); }}
                  autoComplete="email"
                />
              </div>
              {errors.email && <div className="form-error">{errors.email}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="form-input-wrap">
                <svg className="form-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <input
                  className={`form-input${errors.password ? ' error' : ''}`}
                  type={showPwd ? 'text' : 'password'} placeholder="••••••••"
                  value={password} onChange={e => { setPassword(e.target.value); setErrors(p=>({...p,password:undefined})); }}
                  autoComplete="current-password"
                />
                <button type="button" className="form-input-toggle" onClick={() => setShowPwd(p=>!p)} tabIndex={-1}>
                  {showPwd
                    ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
              {errors.password && <div className="form-error">{errors.password}</div>}
            </div>

            <button className="btn-primary" type="submit" disabled={isLoading}>
              {isLoading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <div className="auth-switch">
            Don't have an account?{' '}
            <span className="auth-switch-link" onClick={onSwitch}>Create one</span>
          </div>
        </div>
      </div>
    </div>
  );
};
