import { BlockchainName } from "mobula-lite/lib/model";

interface FormattedHolding {
  asset: {
    name: string;
    symbol: string;
    id: number;
    logo: string;
    contracts: string[];
    blockchains: BlockchainName[];
  };
  realized_pnl: number;
  unrealized_pnl: number;
  allocation: number;
  price: number;
  price_bought: number;
  estimated_balance: number;
  token_balance: number;
}

export interface WalletAnalysisPortfolioResponse {
  total_wallet_balance: number;
  wallet: string | number;
  wallets: string[];
  total_realized_pnl: number;
  total_unrealized_pnl: number;
  assets: FormattedHolding[];
}

export interface WalletAnalysisErrorResponse {
  status: "error";
  error: true;
  reason: "smart-contract";
}
