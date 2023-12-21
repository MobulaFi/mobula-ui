import { Dispatch, SetStateAction } from "react";
import { Asset } from "../assets";
import { ILaunchpad } from "../launchpads";
import { MarketMetrics, Trade, TradeFilter } from "../trades";
import { PublicTransaction } from "../transactions";
import { ComparedEntity, IPortfolio, UserHoldingsAsset } from "./portfolio";

export interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
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

export interface Metrics {
  title: string;
  value: number;
  info?: string;
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
  marketMetrics: MarketMetrics | null;
  setMarketMetrics: Dispatch<SetStateAction<MarketMetrics | null>>;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setIsMarketMetricsLoading: Dispatch<SetStateAction<boolean>>;
  isMarketMetricsLoading: boolean;
  setShouldInstantLoad: Dispatch<SetStateAction<boolean>>;
  shouldInstantLoad: boolean;
  setUserActiveChart: (value: string) => void;
  setUserTimeSelected: (value: TimeSelected) => void;
  setUserTradeAmountFilter: (value: TradeFilter) => void;
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
}
