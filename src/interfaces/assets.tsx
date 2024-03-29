import { BlockchainName } from "mobula-lite/lib/model";
import { TradeHistory } from "../features/asset/models";
import { Trade } from "./trades";

export interface OrderBy {
  type: string;
  ascending: boolean;
  first?: true;
}

export interface ITableContext {
  orderBy: OrderBy | undefined;
  setOrderBy: React.Dispatch<React.SetStateAction<OrderBy>>;
  lastColumn: string;
  bg: any;
  hideDEXVolume: boolean;
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
  contracts: string[] | any;
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

export interface RawPairs {
  pairs_data?: Record<string, number>;
  pairs_per_chain?: Record<BlockchainName, number>;
}

export interface FakeToken {
  logo: string;
  market_cap: string;
  symbol: string;
  name: string;
  twitter: string;
  website: string;
  price: string;
  discord: string;
  balance: string;
}

export interface Token {
  price_history: any;
  blockchains: string[];
  chat: string;
  contracts: string[];
  created_at: string;
  discord: string;
  id: number;
  liquidity: number;
  logo: string;
  market_cap: number | string;
  name: string;
  pairs: string | any;
  price: number | string;
  price_change_24h: number;
  price_change_7d: number;
  rank: number;
  symbol: string;
  twitter: string;
  volume: number;
  website: string;
  description: string;
}

export interface UserTrade {
  value_usd: number;
  token_amount: number;
  type: "sell" | "buy";
  date: number;
  token_price: number;
  timestamp: number;
  amount: string;
  unique_discriminator: string;
  id: number;
  hash: string;
  amount_usd: number;
  blockchain: string;
}

export interface IPairFromDB {
  address: string;
  token0: IToken;
  token1: IToken;
  pairData: IPair;
}

export interface IPair {
  volumeToken0: bigint;
  volumeToken1: bigint;
  volumeUSDToken0: number;
  volumeUSDToken1: number;
  reserve0: bigint;
  reserve1: bigint;
}
export interface IToken {
  address: string;
  decimals: number;
  type: "weth" | "eth" | "stable" | "other";
  priceUSD: number;
}

export interface UpdateAssetProps {
  ath: number;
  atl: number;
  is_listed: boolean;
  liquidity: number;
  market_cap: number;
  market_cap_diluted: number;
  off_chain_volume: number;
  price: number;
  price_change_24h: number;
  price_change_7d: number;
  price_change_1h: number;
  price_change_1m: number;
  price_change_1y: number;
  volume: number;
  volume_7d: number;
  volume_change_24h: number;
}
