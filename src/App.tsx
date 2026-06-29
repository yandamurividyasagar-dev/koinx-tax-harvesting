import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { HarvestingProvider } from './context/HarvestingContext';
import { LoginPage } from './components/Auth/LoginPage';
import { SignupPage } from './components/Auth/SignupPage';
import { Dashboard } from './components/Dashboard/Dashboard';
import './index.css';

const AppInner: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [view, setView] = useState<'login' | 'signup'>('login');

  if (!isAuthenticated) {
    return view === 'login'
      ? <LoginPage onSwitch={() => setView('signup')} />
      : <SignupPage onSwitch={() => setView('login')} />;
  }

  return (
    <HarvestingProvider>
      <Dashboard />
    </HarvestingProvider>
  );
};

const App: React.FC = () => (
  <AuthProvider>
    <AppInner />
  </AuthProvider>
);

export default App;
