export interface GainData {
  balance: number;
  gain: number;
}

export interface Holding {
  coin: string;
  coinName: string;
  logo: string;
  currentPrice: number;
  totalHolding: number;
  averageBuyPrice: number;
  stcg: GainData;
  ltcg: GainData;
}

export interface CapitalGainSection {
  profits: number;
  losses: number;
}

export interface CapitalGains {
  stcg: CapitalGainSection;
  ltcg: CapitalGainSection;
}

export interface CapitalGainsResponse {
  capitalGains: CapitalGains;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
