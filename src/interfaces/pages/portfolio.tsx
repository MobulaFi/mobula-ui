import { BlockchainName, Token } from "mobula-lite/lib/model";
import { Dispatch, SetStateAction } from "react";
import { Asset } from "../assets";
import { HoldingNFT } from "../holdings";
import { PublicTransaction } from "../transactions";
import { TimeSelected } from "./asset";

export interface IPortfolioV2 {
  /** Popup States */
  showManage: boolean;
  setShowManage: Dispatch<SetStateAction<boolean>>;
  showAddAsset: boolean;
  setShowAddAsset: Dispatch<SetStateAction<boolean>>;
  showNetwork: boolean;
  setShowNetwork: Dispatch<SetStateAction<boolean>>;
  showWallet: boolean;
  setShowWallet: Dispatch<SetStateAction<boolean>>;
  showAddTransaction: boolean;
  setShowAddTransaction: Dispatch<SetStateAction<boolean>>;
  showAssetManage: boolean;
  setShowAssetManage: Dispatch<SetStateAction<boolean>>;
  showCreatePortfolio: boolean;
  setShowCreatePortfolio: Dispatch<SetStateAction<boolean>>;
  showPortfolioSelector: boolean;
  setShowPortfolioSelector: Dispatch<SetStateAction<boolean>>;
  showHiddenTokens: boolean;
  setShowHiddenTokens: Dispatch<SetStateAction<boolean>>;
  showSelect: boolean;
  setShowSelect: Dispatch<SetStateAction<boolean>>;
  showEditTransaction: Transaction | null;
  setShowEditTransaction: Dispatch<SetStateAction<Transaction | null>>;
  showDeleteNft: null | HoldingNFT;
  setShowDeleteNft: Dispatch<SetStateAction<null | HoldingNFT>>;
  showDeleteSelector: boolean;
  setShowDeleteSelector: Dispatch<SetStateAction<boolean>>;
  activeStep: ActiveStep;
  setActiveStep: Dispatch<SetStateAction<ActiveStep>>;

  /** UI State */
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  isRefreshing: boolean;
  setIsRefreshing: Dispatch<SetStateAction<boolean>>;
  isWalletExplorer: false | string;
  setIsWalletExplorer: Dispatch<SetStateAction<false | string>>;
  isPortfolioExplorer: boolean;
  setIsPortfolioExplorer: Dispatch<SetStateAction<boolean>>;
  isAssetPage: boolean;
  setIsAssetPage: Dispatch<SetStateAction<boolean>>;
  error: string | null;
  setError: Dispatch<SetStateAction<string | null>>;

  /** Active Settings */
  activeNetworks: string[];
  setActiveNetworks: Dispatch<SetStateAction<string[]>>;
  activeCategory: string;
  setActiveCategory: Dispatch<SetStateAction<string>>;
  activePortfolio: IPortfolio;
  setActivePortfolio: Dispatch<SetStateAction<IPortfolio>>;

  /** Data Handling */
  wallet: UserHoldings | null;
  setWallet: React.Dispatch<React.SetStateAction<UserHoldings | null>>;
  asset: UserHoldingsAsset;
  setAsset: Dispatch<SetStateAction<UserHoldingsAsset>>;
  userPortfolio: IPortfolio[];
  setUserPortfolio: Dispatch<SetStateAction<IPortfolio[]>>;
  transactions: PublicTransaction[];
  setTransactions: Dispatch<SetStateAction<PublicTransaction[]>>;
  nftsDeleted: string[]; // Assumed to be an array of strings
  setNftsDeleted: Dispatch<SetStateAction<string[]>>;
  nftToDelete: string[];
  setNftToDelete: Dispatch<SetStateAction<string[]>>;
  hiddenTokens: (string | number)[];
  setHiddenTokens: Dispatch<SetStateAction<(string | number)[]>>;
  tokenTsx: Partial<Asset>;
  setTokenTsx: Dispatch<SetStateAction<Partial<Asset>>>;
  comparedEntities: ComparedEntity[];
  setComparedEntities: Dispatch<SetStateAction<ComparedEntity[]>>;

  /** Portfolio Managers */
  manager: IManager;
  setManager: Dispatch<SetStateAction<IManager>>;
  editAssetManager: ManageAsset;
  setEditAssetManager: Dispatch<SetStateAction<ManageAsset>>;

  /** Other Settings */
  timeframe: string;
  setTimeframe: Dispatch<SetStateAction<string>>;

  /** SWIPE MOBILE */
  isMobile: boolean;

  // NFT
  nfts: HoldingNFT[];
  setNfts: Dispatch<SetStateAction<HoldingNFT[]>>;
  setIsNftLoading: Dispatch<SetStateAction<boolean>>;
  isNftLoading: boolean;
  activeCollection: string[];
  setActiveCollection: Dispatch<SetStateAction<string[]>>;

  portfolioSettings: NewPortfolioSettings;
  setPortfolioSettings: Dispatch<SetStateAction<NewPortfolioSettings>>;
}

export interface IManager {
  active_networks: string[];
  wallets: string[];
  portfolio_chart: boolean;
  performers: boolean;
  privacy_mode: boolean;
  holdings: boolean;
  daily_pnl: boolean;
  cumulative_pnl: boolean;
  total_profit: boolean;
  realized_profit: boolean;
  unrealized_profit: boolean;
  total_invested: boolean;
  show_interaction: boolean;
}

export interface ManageOption {
  title: string;
  name: string;
  type?: string;
}

export interface ManageAsset {
  token_details: true;
  holdings: true;
  transactions: true;
  buy_sell_chart: true;
}

export interface Transaction {
  is_transfer: boolean;
  to: string;
  from: string;
  id: number;
  amount: string;
  timestamp: number;
  fee: number;
  type: 0 | 1 | 2;
  wallet: string;
  rm?: 0 | 1;
  asset_id: number;
  hash: string;
  value_usd: number;
  is_added: boolean;
  is_removed: boolean;
  tx_cost: number;
  blockchain: BlockchainName;
}

export interface UserHoldings {
  global_pnl: Record<
    TimeSelected,
    [number, { realized: number; unrealized: number }][]
  >;
  relative_global_pnl: Record<
    TimeSelected,
    [number, { realized: number; unrealized: number }][]
  >;
  total_realized: number;
  total_unrealized: number;

  estimated_history?: [number, number][];
  estimated_balance: number;
  estimated_balance_change?: boolean;
  portfolio?: UserHoldingsAsset[];

  id?: number;
  // Used for useEffects, front-end only
  uniqueIdentifier: string | number;
  addresses: string[];
  final: boolean;
}

export interface UserHoldingsAsset {
  realized_usd: number;
  realized_roi?: number;
  unrealized_usd: number;
  unrealized_roi?: number;
  pnl_history: Record<
    TimeSelected,
    [number, { realized: number; unrealized: number }][]
  >;
  relative_pnl_history: Record<
    TimeSelected,
    [number, { realized: number; unrealized: number }][]
  >;

  total_invested: number;
  max_buy_price: number;
  min_buy_price: number;
  price_bought: number;

  allocation: number;
  estimated_balance: number;
  estimated_balance_change?: boolean;
  token_balance: number;
  cross_chain_balances: Record<BlockchainName, number>;

  logo: string;
  id: number;
  // Used for useEffects, front-end only
  uniqueIdentifier: string;
  name: string;
  symbol: string;
  price: number;
  change_24h: number;
  image: string;
  contracts: string[];
  blockchains: BlockchainName[];
}

export interface PopupToken {
  name: string;
  image: string;
  symbol: string;
  id: number;
  logo?: string;
}

export interface BuySettings {
  quantity: string;
  token: Partial<Token | PopupToken> | null;
  price?: number;
  date: Date;
  fee: string;
  note: string;
  total_spent?: number;
  state: string;
  transfer?: string;
}

export interface IPortfolio {
  base_wallet: string;
  id: number;
  last_cached: number;
  name: string;
  public: boolean;
  removed_assets: string[];
  removed_transactions: number[];
  reprocess: boolean;
  user: number;
  wallets: string[];
  hidden_assets: number[];
  portfolio: ReducedAssetsHoldings[];
}

export interface ReducedAssetsHoldings {
  balance: number;
  asset_id: number;
  balance_usd: number;
  name?: string;
}

export interface ActiveStep {
  nbr: number;
  title: string;
  subtitle: string;
  top: string[];
  right: string[];
  transform: string[];
  arrowRight?: string[];
  arrowLeft?: string[];
  arrowTop?: string[];
  arrowPosition: "top" | "bottom" | "none";
}

export interface ComparedEntity {
  type: "asset" | "portfolio";
  data: [number, number][];
  content: string;
  label: string;
}

export interface NewPortfolioSettings {
  name: string;
  public: boolean;
  wallets: string[];
}
