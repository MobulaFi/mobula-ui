import { BlockchainName } from "mobula-lite/lib/model";

export interface TransactionResponse {
  data:
    | {
        transactions: PublicTransaction[];
      }
    | PublicTransaction[];
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
