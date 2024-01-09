import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { Asset, TableAsset } from "../assets";
import { Coin } from "../swap";
import { IPortfolio } from "./portfolio";

export interface Metrics {
  total_assets: number;
  total_ethereum_assets: number;
  total_bnb_assets: number;
  total_polygon_assets: number;
  total_avalanche_assets: number;
  fear_and_greed_value_classification: string;
  fear_and_greed_value: number;
}
export interface QueryResults {
  tokens: TableAsset[];
  actualView: View;
  marketCapTotal: {
    market_cap_history: [number, number][];
    btc_dominance_history: [number, number][];
    market_cap_change_24h: number;
  };
  metrics?: {
    fear_and_greed_value: number;
    fear_and_greed_value_classification: string;
  };
  actualPortfolio: IPortfolio | null;
  count: number;
  btcPrice: { name: string; price: number };
  ethPrice: { name: string; price: number };
  allView: View;
  filteredValues: any;
  isTablet: boolean;
  isMobile: boolean;
}

export type StaticHomeQueries = [
  PromiseLike<PostgrestSingleResponse<Metrics>>,
  Promise<any>,
  PromiseLike<PostgrestSingleResponse<Asset>>,
  PromiseLike<PostgrestSingleResponse<Asset>>
];

export interface RecomandationType {
  title: string;
  subtitle: string;
  icon?: unknown;
  url: string;
  id: string;
  isNew?: boolean;
  logo?: string;
}

export interface GainersType {
  logo: string;
  name: string;
  id: number;
  change: number;
}

export interface Settings {
  liquidity: number;
  liquidity_market_cap_ratio: number;
  volume: number;
  onChainOnly: boolean;
  default: boolean;
  marketScore: number;
  trustScore: number;
  utilityScore: number;
  socialScore: number;
}

export interface ISettingMetric {
  metrics: string[];
  setMetrics: React.Dispatch<React.SetStateAction<string[]>>;
  type: string;
  setType: React.Dispatch<React.SetStateAction<string>>;
  sortBy: string;
  setSortBy: React.Dispatch<React.SetStateAction<string>>;
  showBuyDrawer: Coin | Asset | null;
  setShowBuyDrawer: React.Dispatch<React.SetStateAction<Coin | Asset | null>>;
}

export interface TableButton {
  logo?: string;
  title: string;
  symbol?: string;
}

export interface Query {
  action: string;
  value: unknown[];
  isFirst?: true;
}

export interface ITop100 {
  activeView: View;
  setActiveView: React.Dispatch<React.SetStateAction<View>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  totalMarketCap: [number, number][];
  setTotalMarketCap: React.Dispatch<React.SetStateAction<[number, number][]>>;
  marketCapChange: number;
  setMarketCapChange: React.Dispatch<React.SetStateAction<number>>;
  btcDominance: [number, number][];
  setBtcDominance: React.Dispatch<React.SetStateAction<[number, number][]>>;
  setIsPortfolioLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isPortfolioLoading: boolean;
  setPortfolio: React.Dispatch<React.SetStateAction<Asset[]>>;
  portfolio: Asset[];
  activePortfolio: IPortfolio | null;
  setActivePortfolio: React.Dispatch<React.SetStateAction<IPortfolio | null>>;
  mainCurrenciesPrices: { eth: number; btc: number };
  setMainCurrenciesPrices: React.Dispatch<
    React.SetStateAction<{ eth: number; btc: number }>
  >;
  activeDisplay: string;
  setActiveDisplay: React.Dispatch<React.SetStateAction<string>>;
  setActiveStep: React.Dispatch<React.SetStateAction<IViewStep>>;
  activeStep: IViewStep;
  news: INewsGeneral;
  setNews: React.Dispatch<React.SetStateAction<INewsGeneral>>;
  showCategories: boolean;
  setShowCategories: React.Dispatch<React.SetStateAction<boolean>>;
  isMobile: boolean;
  isTablet: boolean;
}

export interface INewsGeneral {
  created_at: string;
  id: number;
  news_count: number | null;
  summary: string;
  assetsData: {
    [key: string]: {
      price_change_24h: number;
      name: string;
    };
  };
}

export interface INews {
  created_at: string;
  id: number;
  domain: string;
  kind: string;
  published_at: string;
  slug: string;
  source: {
    path: string | null;
    title: string;
    domain: string;
    region: string;
  };
  title: string;
  url: string;
  votes: {
    lol: number;
    toxic: number;
    comments: number;
    positive: number;
    negative: number;
    saved: number;
    liked: number;
    disliked: number;
    important: number;
  };
}

export interface IViewStep {
  nbr: number;
  title: string;
  subtitle: string;
  arrowPosition: string;
  right: string[];
  top: string[];
  transform: string[];
  arrowTop?: string[];
  arrowLeft?: string[];
}

export interface View {
  color: string;
  id?: number;
  name: string;
  is_favorite?: boolean;
  display?: { type: string; value: string }[];
  isFirst?: boolean;
  filters: ViewsFilter;
  is_top_100?: boolean;
  disconnected?: boolean;
}

export interface ViewsFilter {
  blockchains?: string[];
  rank?: { from: number; to: number };
  price?: { from: number; to: number };
  price_change?: { from: number; to: number };
  market_cap?: { from: number; to: number };
  volume?: { from: number; to: number };
  tokens?: Asset[];
  liquidity?: { from: number; to: number };
  categories?: string[];
}

export interface IWallet {
  addresses: string[];
  estimated_balance: number;
  estimated_history: [number, number][];
  final: boolean;
  id: number;
  global_pnl: {
    "1y": [number, { realized: number; unrealized: number }];
    "30d": [number, { realized: number; unrealized: number }];
    "7d": [number, { realized: number; unrealized: number }];
    "24h": [number, { realized: number; unrealized: number }];
  };
  portfolio: Asset[];
  relative_global_pnl: {
    "1y": { realized: number; unrealized: number };
    "30d": { realized: number; unrealized: number };
    "7d": { realized: number; unrealized: number };
    "24h": { realized: number; unrealized: number };
  };
  staking_position: { [key: string]: unknown };
  total_realized: number;
  total_unrealized: number;
}

export interface IWSWallet {
  estimated_balance_history: [number, number][];
  id: number;
  addresses: string[];
}
