/* eslint-disable import/no-cycle */
import { BlockchainName } from "mobula-lite/lib/model";
import { Dispatch, SetStateAction } from "react";
import { ILaunchpad } from "../../interfaces/launchpads";
import { PublicTransaction } from "../../interfaces/transactions";
import {
  ComparedEntity,
  IPortfolio,
  UserHoldingsAsset,
} from "../user/portfolio/models";

export interface IBasetAssetContext {
  baseAsset: Asset;
  setBaseAsset: Dispatch<SetStateAction<Asset>>;
  activeTab: string;
  setPairs: Dispatch<SetStateAction<IPairs[] | null>>;
  pairs: IPairs[] | null;
  setActiveTab: Dispatch<SetStateAction<string>>;
  historyData: HistoryData | null;
  setHistoryData: Dispatch<SetStateAction<HistoryData | null>>;
  activeChart: string;
  setActiveChart: Dispatch<SetStateAction<string>>;
  formattedHistoricalData: FormattedHistoricalData | null;
  setFormattedHistoricalData: Dispatch<
    SetStateAction<FormattedHistoricalData | null>
  >;
  unformattedHistoricalData: UnformattedHistoricalData | null;
  setUnformattedHistoricalData: Dispatch<
    React.SetStateAction<UnformattedHistoricalData | null>
  >;
  timeSelected: TimeSelected;
  setTimeSelected: Dispatch<SetStateAction<TimeSelected>>;
  showTargetPrice: boolean;
  setShowTargetPrice: Dispatch<SetStateAction<boolean>>;
  loadHistoryData: (type: ChartType, time: TimeSelected) => Promise<void>;
  shouldLoadHistory: (type: ChartType, timeSelected: TimeSelected) => boolean;
  chartType: ChartType;
  setChartType: Dispatch<SetStateAction<ChartType>>;
  wallet: UserHoldingsAsset[] | null;
  portfolios: IPortfolio[] | null;
  setSelectedTradeFilters: Dispatch<SetStateAction<TradeFilters>>;
  selectedTradeFilters: TradeFilters;
  showTradeBlockchain: boolean;
  setShowTradeBlockchain: Dispatch<SetStateAction<boolean>>;
  showTradeLiquidityPool: boolean;
  setShowTradeLiquidityPool: Dispatch<SetStateAction<boolean>>;
  showTradeTokenAmount: boolean;
  setShowTradeTokenAmount: Dispatch<SetStateAction<boolean>>;
  showTradeType: boolean;
  setShowTradeType: Dispatch<SetStateAction<boolean>>;
  showTradeValue: boolean;
  setShowTradeValue: Dispatch<SetStateAction<boolean>>;
  showSwap: number;
  setShowSwap: Dispatch<SetStateAction<number>>;
  activeMetric: string;
  setActiveMetric: Dispatch<SetStateAction<string>>;
  showMobileMetric: boolean;
  setShowMobileMetric: Dispatch<SetStateAction<boolean>>;
  setShowPopupSocialMobile: Dispatch<SetStateAction<boolean>>;
  showPopupSocialMobile: boolean;
  showSeeAllTags: boolean;
  setShowSeeAllTags: Dispatch<SetStateAction<boolean>>;
  setShowTradeFilters: Dispatch<SetStateAction<boolean>>;
  showTradeFilters: boolean;
  filters: IFilter[];
  setFilters: Dispatch<SetStateAction<IFilter[]>>;
  marketMetrics: MarketMetrics;
  setMarketMetrics: Dispatch<SetStateAction<MarketMetrics>>;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setIsMarketMetricsLoading: Dispatch<SetStateAction<boolean>>;
  isMarketMetricsLoading: boolean;
  setShouldInstantLoad: Dispatch<SetStateAction<boolean>>;
  shouldInstantLoad: boolean;
  tradeHistory: Trade[];
  setTradeHistory: Dispatch<SetStateAction<Trade[]>>;
  setTokenVsMarket: Dispatch<SetStateAction<ICategory[] | null>>;
  tokenVsMarket: ICategory[] | null;
  setHideTx: Dispatch<SetStateAction<boolean>>;
  hideTx: boolean;
  transactions: PublicTransaction[] | null;
  setTransactions: Dispatch<SetStateAction<PublicTransaction[] | null>>;
  comparedEntities: ComparedEntity[];
  setComparedEntities: Dispatch<SetStateAction<ComparedEntity[] | null>>;
  launchpads: ILaunchpad[] | undefined;
  setLaunchpads: Dispatch<SetStateAction<ILaunchpad[] | undefined>>;
  timeRemaining: TimeRemaining;
  setTimeRemaining: Dispatch<SetStateAction<TimeRemaining>>;
  assetPairs: MultiPairDataProps;
  setAssetPairs: Dispatch<SetStateAction<MultiPairDataProps>>;
  isAssetPage: boolean;
  globalPairs: Trade[];
  setGlobalPairs: Dispatch<SetStateAction<Trade[]>>;
  fadeIn: string[];
  setFadeIn: Dispatch<SetStateAction<string[]>>;
  switchedToNative: boolean;
  setSwitchedToNative: Dispatch<SetStateAction<boolean>>;
  orderBy: "asc" | "desc";
  setOrderBy: Dispatch<SetStateAction<"asc" | "desc">>;
  changeToDate: boolean;
  setChangeToDate: Dispatch<SetStateAction<boolean>>;
}

export interface TimeRemaining {
  days: number | string;
  hours: number | string;
  minutes: number | string;
  seconds: number | string;
}
export interface ICategory {
  id: number;
  market_cap: number;
  market_cap_change_24h: number;
  market_cap_change_7d: number;
  market_cap_change_1m: number;
  market_cap_history: [number, number][];
  name: string;
  volume: number;
  volume_history: [number, number][];
  symbol?: string;
}

export interface IPairs {
  address: string;
  blockchain: string;
  price: number;
  liquidity: number;
  exchange: string;
  protocol: string;
  token0: ITokenPair;
  token1: ITokenPair;
}

export interface ITokenPair {
  address: string;
  decimals: number;
  id: number;
  logo: string;
  name: string;
  price: number;
  symbol: string;
  type: string;
}

export interface TradeFilters {
  blockchains: string[] | null;
  value: number[] | null;
  type: string | null;
  token_amount: number[] | null;
  liquidity_pool: string[];
}

export interface IFilter {
  action: string;
  value: any[];
}

export interface Social {
  title: string;
  logo: string;
  subtitle: string;
  username?: string;
  members?: number;
  online?: number;
  engagement?: number | null;
  url?: string;
}

export interface Trending {
  id: number;
  name: string;
  view_change_24h: number;
  logo: string;
  price_change_24h: number;
  price: number;
}

export type Asset = {
  [x: string]: any;
  baseAsset: any;
  rank: number;
  id: number;
  price: number;
  price_change_24h: number;
  volume: number;
  volume_change_24h: number;
  circulating_supply: number;
  total_supply: number;
  price_history: { price: [number, number][] } | null;
  market_cap: number;
  market_cap_history: { market_cap: [number, number][] } | null;
  market_cap_diluted: number;
  liquidity: number;
  liquidity_history: { liquidity: [number, number][] } | null;
  utility_score: number;
  market_score: number;
  trust_score: number;
  social_score: number;
  decimals: number;
  blockchains: BlockchainName[];
  contracts: string[];
  trade_history: TradeHistory[] | null;
  created_at: string;
  symbol: string;
  name: string;
  logo: string;
  description?: string;
  website?: string;
  twitter?: string;
  chat?: string;
  discord?: string;
  audit: string;
  kyc: string;
  atl?: [number, number];
  ath?: [number, number];
  assets_raw_pairs?: RawPairs;
  assets_social?: Socials;
  coin: boolean;
  circulating_supply_addresses: string[];
  total_supply_contracts: string[];
  blockchain: BlockchainName;
  address: string;
};

export interface CategoriesProps {
  categories: { [key: string]: [number, number, [string, number]][] };
}

export interface RawPairs {
  pairs_data?: Record<string, number>;
  pairs_per_chain?: Record<BlockchainName, number>;
}

export interface Socials {
  twitter_members: number;
  telegram_members: number;
  telegram_online_members: number;
  discord_members: number;
  discord_online_members: number;
  discord_name: string;
  github: string;
  github_stars: number;
  github_forks: number;
  github_closed_issues: number;
  github_total_issues: number;
  github_merged_pull_requests: number;
  github_contributors: number;
}

export interface Trade {
  hash: string;
  value_usd: number;
  token_amount: number;
  type: "sell" | "buy";
  blockchain: BlockchainName;
  date: number;
  timestamp: number;
  amount?: string;
  unique_discriminator?: string;
  id?: number;
  amount_usd?: number;
  token_amount_usd: number;
  token_price: number;
  token_price_vs: number;
  token_amount_vs: number;
}

export interface Metrics {
  title: string;
  value: number | string | null;
  info?: string;
  dollar?: boolean;
}

export interface Bar {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  type?: string;
}

export interface HistoryData {
  price_history?: [number, number][];
  liquidity_history?: [number, number][];
  volume_history?: [number, number][];
}

export type UnformattedHistoricalData = Partial<
  Record<ChartType, Record<TimeSelected, [number, number][] | undefined>>
>;

export type FormattedHistoricalData = Record<
  ChartType,
  Record<TimeSelected, { y: number; t: number }[]>
>;

export type TimeSelected = "24H" | "7D" | "30D" | "3M" | "1Y" | "ALL";

export type ChartType = "price" | "liquidity" | "volume" | "market_cap";

export interface IShowMoreContext {
  showMore: boolean;
  setShowMore: Dispatch<SetStateAction<boolean>>;
  showContract: boolean;
  setShowContract: Dispatch<SetStateAction<boolean>>;
  showSocial: boolean;
  setShowSocial: Dispatch<SetStateAction<boolean>>;
}

export interface IActiveName {
  liquidity_pool: string;
  blockchain: string;
  type: string;
  token_amount: string;
  value: string;
}

export interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export interface PrevPathProps {
  name: string;
  url: string | null;
}

export interface UserTrades {
  amount: number;
  amount_usd: number;
  asset: Pick<Asset, "id" | "name" | "symbol" | "logo" | "contract">;
  blockchain: string;
  from: string;
  to: string;
  hash: string;
  method_id: string;
  timestamp: number;
  type: string;
}

export interface Investors {
  country: {
    flag: string;
    name: string;
  };
  description: string;
  image: string;
  lead: boolean;
  name: string;
  rating: number;
  saleIds: number[];
  tier: string;
  type: string;
  links: {
    link: string;
    type: string;
  }[];
}

export interface TradeHistory {
  block: number;
  blockchain: string;
  hash: string;
  date: number;
  id: number;
  pair: string;
  token_amount: number;
  token_id: number;
  token_price: number;
  type: string;
  unique_discriminator: number;
  value_usd: number;
}

export interface MarketMetrics {
  liquidity: number;
  volume: number;
  market_cap: number;
  price: number;
  priceChange: boolean | null;
  volumeChange: boolean | null;
  trade_history: TradeHistory[] | null;
}

export interface MultiPairDataProps {
  pairs: MultiPairProps[];
  count: number;
}

export interface MultiPairProps {
  address: string;
  blockchain: string;
  exchange: string;
  factory: string;
  liquidity: number;
  price: number;
  protocol: string;
  token0: TokenPairProps;
  token1: TokenPairProps;
  volume: number;
  volume24h?: number;
}

export interface TokenPairProps {
  address: string;
  decimals: number;
  id: number;
  logo: string;
  name: string;
  price: number;
  priceToken: number;
  symbol: string;
  priceTokenString: string;
  approximateReserveUSD?: number;
}
