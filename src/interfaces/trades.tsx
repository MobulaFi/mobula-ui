import { TradeHistory } from "../features/asset/models";

export interface Trade {
  hash: string;
  value_usd: number;
  token_amount: number;
  type: "sell" | "buy";
  blockchain: string;
  date: number;
  token_price: number;
  timestamp?: number;
  amount?: string;
  unique_discriminator?: string;
  id?: number;
  amount_usd?: number;
}

export interface Metrics {
  title: string;
  value: number;
  info?: string;
}

export interface TradeFilter {
  blockchains: [];
  value: number[];
  type: string;
  token_amount: number[];
  liquidity_pool: [];
}

export interface MarketMetrics {
  price: number;
  priceChange: boolean | null;
  liquidity: number;
  volume: number;
  volumeChange: boolean | null;
  market_cap: number;
  trade_history: TradeHistory[] | null;
}

export interface MarketMetricsNullable {
  price: number | null;
  priceChange: boolean | null;
  liquidity: number | null;
  volume: number | null;
  volumeChange: boolean | null;
  market_cap: number | null;
  trade_history: Trade[];
}
