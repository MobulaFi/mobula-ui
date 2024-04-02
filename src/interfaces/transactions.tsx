import { BlockchainName } from "mobula-lite/lib/model";
import { Asset } from "./assets";
import { HoldingsResponse } from "./holdings";
import { Coin } from "./swap";

export interface TransactionResponse {
  data: {
    transactions: PublicTransaction[];
  };
}

export interface TransactionAsset {
  id: number;
  symbol: string;
  name: string;
  logo: string;
}

export interface PublicTransaction {
  asset: TransactionAsset;
  date?: string;
  type: "sell" | "buy" | "transfer" | "swap";
  method_id: string;
  hash: string;
  timestamp: number;
  amount: number;
  amount_usd: number;

  to: string;
  from: string;

  tx_cost: string;
  tx_cost_usd: number;
  blockchain: BlockchainName;

  id: number;

  is_added: boolean;
  is_out: boolean | null;

  in?: TransactionAsset & { amount: number; amount_usd: number };
  out?: TransactionAsset & { amount: number; amount_usd: number };
}

export type Scenaris = "Buying" | "Selling";

export interface TypeButtonType {
  setType?: any;
  isActive: boolean;
  title?: string;
  [key: string]: any;
}

export interface TokenOutType {
  address: string;
  blockchain: string;
  blockchains: string[];
  contracts: string[];
  decimals: number;
  logo: string;
  market_cap: number;
  name: string;
  price: number;
  price_change_24h: number;
  rank: number;
  symbol: string;
}

export interface IStepsContext {
  activeStep: string;
  setActiveStep: React.Dispatch<React.SetStateAction<string>>;
  type: "Buy" | "Sell";
  setType: React.Dispatch<React.SetStateAction<"Buy" | "Sell">>;
  holdingsData: HoldingsResponse | null;
  currentScenario: Scenaris;
  setCurrentScenario: React.Dispatch<React.SetStateAction<Scenaris>>;
}

export interface WalkthroughBuffer {
  typeBuffer?: "Buy" | "Sell";
  currentScenarioBuffer?: Scenaris;
  activeStepBuffer?: string;
  tokenInBuffer?: Asset | Coin | null;
  tokenOutBuffer?: Asset | Coin | null;
  tokenGeneralBuffer?: Asset | Coin | null;
}
