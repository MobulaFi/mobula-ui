import { BlockchainName } from "mobula-lite/lib/model";
import { Trade } from "../../interfaces/trades";

export interface OrderBy {
  type: string;
  ascending: boolean;
  first?: true;
}

export interface ITableContext {
  orderBy: OrderBy | undefined;
  setOrderBy: React.Dispatch<React.SetStateAction<OrderBy>>;
  lastColumn?: string;
  bg?: string;
  hideDEXVolume?: boolean;
}

export type TableAsset = {
  rank: number;
  id: number;
  price: number | string;
  volume: number;
  price_history: { price: [number, number][] } | null;
  market_cap: number | string;
  market_cap_history: { market_cap: [number, number][] } | null;
  liquidity: number;
  liquidity_history: { liquidity: [number, number][] } | null;
  utility_score: number;
  market_score: number;
  trust_score: number;
  social_score: number;
  blockchains?: BlockchainName[];
  contracts?: string[];
  trade_history: Trade[];
  created_at: string;
  symbol: string;
  logo: string;
  [index: string]: any | null;
};
export interface IEntryContext {
  isHover: boolean;
  url: string;
}
