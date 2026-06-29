import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { validateEmail, validatePassword } from '../../utils/format';

interface Props { onSwitch: () => void; }

export const SignupPage: React.FC<Props> = ({ onSwitch }) => {
  const { signup, loginWithGoogle, isLoading } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [errors, setErrors] = useState<Record<string,string>>({});

  const validate = () => {
    const e: Record<string,string> = {};
    if (!name.trim() || name.trim().length < 2) e.name = 'Name must be at least 2 characters.';
    if (!email) e.email = 'Email is required.';
    else if (!validateEmail(email)) e.email = 'Enter a valid email address.';
    const pwdErr = validatePassword(password);
    if (pwdErr) e.password = pwdErr;
    if (password !== confirmPwd) e.confirmPwd = 'Passwords do not match.';
    return e;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    const result = await signup(name, email, password);
    if (!result.success) setErrors({ form: result.error || 'Signup failed.' });
  };

  const strength = (() => {
    let s = 0;
    if (password.length >= 8) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s;
  })();
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strength];
  const strengthColor = ['', '#EF4444', '#F59E0B', '#3B82F6', '#10B981'][strength];

  return (
    <div className="auth-root">
      <div className="auth-panel">
        <div className="auth-panel-logo">
          <div className="auth-panel-logo-icon">K</div>
          <span className="auth-panel-logo-text">KoinX</span>
        </div>
        <h2 className="auth-panel-headline">
          Join <span>10,000+</span> crypto investors<br />saving on taxes
        </h2>
        <p className="auth-panel-sub">
          Start harvesting losses today. Free to use, no credit card needed.
        </p>
        <div className="auth-stats">
          <div className="auth-stat"><div className="auth-stat-value">Free</div><div className="auth-stat-label">Forever plan</div></div>
          <div className="auth-stat"><div className="auth-stat-value">AES-256</div><div className="auth-stat-label">Encryption</div></div>
          <div className="auth-stat"><div className="auth-stat-value">GDPR</div><div className="auth-stat-label">Compliant</div></div>
          <div className="auth-stat"><div className="auth-stat-value">24/7</div><div className="auth-stat-label">Support</div></div>
        </div>
      </div>

      <div className="auth-form-box">
        <div className="auth-form-inner">
          <div className="auth-badge"><span className="auth-badge-dot" />No credit card required</div>
          <h1 className="auth-form-title">Create your account</h1>
          <p className="auth-form-sub">Start saving on crypto taxes in minutes</p>

          <button className="btn-google" onClick={() => loginWithGoogle()} disabled={isLoading} type="button">
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.35-8.16 2.35-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            Sign up with Google
          </button>

          <div className="auth-divider">
            <div className="auth-divider-line" />
            <span className="auth-divider-text">or create with email</span>
            <div className="auth-divider-line" />
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {errors.form && (
              <div style={{background:'rgba(239,68,68,0.08)',border:'1px solid rgba(239,68,68,0.3)',borderRadius:'8px',padding:'12px 14px',marginBottom:'16px',fontSize:'13px',color:'#EF4444'}}>
                {errors.form}
              </div>
            )}
            <div className="form-group">
              <label className="form-label">Full name</label>
              <div className="form-input-wrap">
                <svg className="form-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <input className={`form-input${errors.name?'  error':''}`} type="text" placeholder="Arjun Sharma" value={name} onChange={e=>{setName(e.target.value);setErrors(p=>({...p,name:undefined!}));}} autoComplete="name" />
              </div>
              {errors.name && <div className="form-error">{errors.name}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Email address</label>
              <div className="form-input-wrap">
                <svg className="form-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <input className={`form-input${errors.email?' error':''}`} type="email" placeholder="you@example.com" value={email} onChange={e=>{setEmail(e.target.value);setErrors(p=>({...p,email:undefined!}));}} autoComplete="email" />
              </div>
              {errors.email && <div className="form-error">{errors.email}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="form-input-wrap">
                <svg className="form-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <input className={`form-input${errors.password?' error':''}`} type={showPwd?'text':'password'} placeholder="Min 8 chars, 1 uppercase, 1 number" value={password} onChange={e=>{setPassword(e.target.value);setErrors(p=>({...p,password:undefined!}));}} autoComplete="new-password" />
                <button type="button" className="form-input-toggle" onClick={()=>setShowPwd(p=>!p)} tabIndex={-1}>
                  {showPwd
                    ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
              {password && (
                <div style={{marginTop:'8px'}}>
                  <div style={{display:'flex',gap:'4px',marginBottom:'4px'}}>
                    {[1,2,3,4].map(i=>(
                      <div key={i} style={{flex:1,height:'3px',borderRadius:'2px',background:i<=strength?strengthColor:'var(--border)',transition:'background 0.3s'}} />
                    ))}
                  </div>
                  {strengthLabel && <div style={{fontSize:'11px',color:strengthColor}}>{strengthLabel}</div>}
                </div>
              )}
              {errors.password && <div className="form-error">{errors.password}</div>}
            </div>

            <div className="form-group">
              <label className="form-label">Confirm password</label>
              <div className="form-input-wrap">
                <svg className="form-input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                <input className={`form-input${errors.confirmPwd?' error':''}`} type={showPwd?'text':'password'} placeholder="Repeat your password" value={confirmPwd} onChange={e=>{setConfirmPwd(e.target.value);setErrors(p=>({...p,confirmPwd:undefined!}));}} autoComplete="new-password" />
              </div>
              {errors.confirmPwd && <div className="form-error">{errors.confirmPwd}</div>}
            </div>

            <button className="btn-primary" type="submit" disabled={isLoading}>
              {isLoading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <div className="auth-switch">
            Already have an account?{' '}
            <span className="auth-switch-link" onClick={onSwitch}>Sign in</span>
          </div>
        </div>
      </div>
    </div>
  );
};
