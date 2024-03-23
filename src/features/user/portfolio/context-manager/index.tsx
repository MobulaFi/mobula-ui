"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Asset } from "../../../../interfaces/assets";
import { HoldingNFT } from "../../../../interfaces/holdings";
import { PublicTransaction } from "../components/category/activity/model";
import {
  ActiveStep,
  ComparedEntity,
  IPortfolio,
  IPortfolioV2,
  ManageAsset,
  PortfolioDeleteTokens,
  Transaction,
} from "../models";

interface PortfolioV2Props {
  children: React.ReactNode;
  cookies?: null | IPortfolio;
  isMobile?: boolean;
  isPortfolioExplorer?: boolean;
  isWalletExplorer?: string | false;
}

export const PortfolioV2Context = React.createContext({} as IPortfolioV2);

export const PortfolioV2Provider = ({
  children,
  cookies = null,
  isMobile = false,
  isPortfolioExplorer: isPortfolioExplorerBuffer = false,
  isWalletExplorer: isWalletExplorerBuffer = false,
}: PortfolioV2Props) => {
  const activePortfolioBuffer = cookies || {};

  /** POPUPS */
  const [showManage, setShowManage] = useState(false);
  const [showAssetManage, setShowAssetManage] = useState(false);
  const [showAddAsset, setShowAddAsset] = useState(false);
  const [showNetwork, setShowNetwork] = useState(false);
  const [showDeleteNft, setShowDeleteNft] = useState(null);
  const [showSelect, setShowSelect] = useState(false);
  const [showDeleteSelector, setShowDeleteSelector] = useState(false);
  const [showWallet, setShowWallet] = useState(false);
  const [showAddTransaction, setShowAddTransaction] = useState(null);
  const [showHiddenNfts, setShowHiddenNfts] = useState(false);
  const [showEditTransaction, setShowEditTransaction] =
    useState<null | Transaction>(null);
  const [showCreatePortfolio, setShowCreatePortfolio] = useState(false);
  const [showHiddenTokensPopup, setShowHiddenTokensPopup] = useState(false);
  const [showPortfolioSelector, setShowPortfolioSelector] = useState(false);
  const [prevPath, setPrevPath] = useState<string>("");

  const [activeStep, setActiveStep] = useState({} as ActiveStep);

  /** DATA DISPLAY */
  const [nftsDeleted, setNftsDeleted] = useState([]);
  const [nftToDelete, setNftToDelete] = useState([]);
  const [activeNetworks, setActiveNetworks] = useState([
    "Avalanche C-Chain",
    "Polygon",
    "Cronos",
    "DFK Subnet",
    "Ethereum",
    "Fantom",
    "SmartBCH",
    "Celo",
    "XDAI",
    "Klaytn",
    "Aurora",
    "Harmony",
    "HECO",
    "BNB Smart Chain (BEP20)",
    "Boba",
    "OKEX",
    "Moonriver",
    "Canto",
    "BitTorrent Chain",
    "Oasis",
    "Velas",
    "Arbitrum",
    "Optimistic",
    "Kucoin",
  ]);
  const [timeframe, setTimeframe] = useState("24H");
  const [activeCategory, setActiveCategory] = useState(
    isMobile ? "General" : "Cryptos"
  );

  const [hiddenTokens, setHiddenTokens] = useState<
    Record<number, PortfolioDeleteTokens>
  >({});

  // NFT STATE
  const [nfts, setNfts] = useState<HoldingNFT[]>();
  const [isNftLoading, setIsNftLoading] = useState(true);
  const [activeCollection, setActiveCollection] = useState([]);

  /** UI STATE */
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  // Is Refreshing means the spinner is still loading while we already got the first data.
  const [isRefreshing, setIsRefreshing] = useState(true);

  /** PORTFOLIO STATE */
  const [isWalletExplorer, setIsWalletExplorer] = useState<string | false>(
    isWalletExplorerBuffer
  );
  const [isPortfolioExplorer, setIsPortfolioExplorer] = useState<boolean>(
    isPortfolioExplorerBuffer
  );
  const [isAssetPage, setIsAssetPage] = useState(false);
  // User Portfolio is the list of all the portfolios the user has
  const [userPortfolio, setUserPortfolio] = useState<IPortfolio[]>([]);
  const [activePortfolio, setActivePortfolio] = useState<IPortfolio>(
    activePortfolioBuffer as IPortfolio
  );
  // on the "add asset" popup, if a token is "predefined"
  const [tokenTsx, setTokenTsx] = useState<Asset>({} as Asset);
  const [comparedEntities, setComparedEntities] = useState<ComparedEntity[]>(
    []
  );

  /** PORTFOLIO DATA */
  const [wallet, setWallet] = useState();
  const [transactions, setTransactions] = useState<PublicTransaction[]>([]);
  const [asset, setAsset] = useState(null);

  /** UI MANAGERS */
  const [editAssetManager, setEditAssetManager] = useState<ManageAsset>({
    token_details: true,
    holdings: true,
    transactions: true,
    buy_sell_chart: true,
  });
  const [manager, setManager] = useState({
    active_networks: [],
    wallets: [],
    portfolio_chart: true,
    performers: true,
    privacy_mode: false,
    holdings: true,
    daily_pnl: true,
    cumulative_pnl: true,
    total_profit: true,
    realized_profit: true,
    unrealized_profit: true,
    total_invested: true,
    show_interaction: true,
  });
  const [portfolioSettings, setPortfolioSettings] = useState({
    name: "",
    public: false,
    wallets: [],
    removed_transactions: [],
  });

  const value = useMemo(
    () => ({
      /** POPUP STATES */
      showManage,
      setShowManage,
      showNetwork,
      setShowNetwork,
      showAddAsset,
      setShowAddAsset,
      showWallet,
      setShowWallet,
      showAddTransaction,
      setShowAddTransaction,
      showAssetManage,
      setShowAssetManage,
      showCreatePortfolio,
      setShowCreatePortfolio,
      showPortfolioSelector,
      setShowPortfolioSelector,
      showSelect,
      setShowSelect,
      showEditTransaction,
      setShowEditTransaction,
      showDeleteNft,
      setShowDeleteNft,
      showDeleteSelector,
      setShowDeleteSelector,
      activeStep,
      setActiveStep,
      showHiddenTokensPopup,
      setShowHiddenTokensPopup,
      showHiddenNfts,
      setShowHiddenNfts,
      setPrevPath,
      prevPath,

      /** DATA DISPLAY STATES */
      activeNetworks,
      setActiveNetworks,
      timeframe,
      setTimeframe,
      activeCategory,
      setActiveCategory,
      hiddenTokens,
      setHiddenTokens,
      nftsDeleted,
      setNftsDeleted,
      nftToDelete,
      setNftToDelete,

      /** UI STATE */
      isLoading,
      setIsLoading,
      isRefreshing,
      setIsRefreshing,
      isWalletExplorer,
      setIsWalletExplorer,
      isPortfolioExplorer,
      setIsPortfolioExplorer,
      isAssetPage,
      setIsAssetPage,
      editAssetManager,
      setEditAssetManager,
      error,
      setError,

      /** PORTFOLIO STATES */
      userPortfolio,
      setUserPortfolio,
      activePortfolio,
      setActivePortfolio,
      tokenTsx,
      setTokenTsx,
      comparedEntities,
      setComparedEntities,

      /** PORTFOLIO DATA */
      wallet,
      setWallet,
      transactions,
      setTransactions,
      asset,
      setAsset,

      /** UI MANAGERS */
      manager,
      setManager,

      /** SWIPE MOBILE */
      isMobile,
      nfts,
      setNfts,
      isNftLoading,
      setIsNftLoading,
      activeCollection,
      setActiveCollection,

      portfolioSettings,
      setPortfolioSettings,
    }),
    [
      /** POPUP STATES */
      showManage,
      setShowManage,
      showNetwork,
      setShowNetwork,
      showAddAsset,
      setShowAddAsset,
      showWallet,
      setShowWallet,
      showAddTransaction,
      setShowAddTransaction,
      showAssetManage,
      setShowAssetManage,
      showCreatePortfolio,
      setShowCreatePortfolio,
      showPortfolioSelector,
      setShowPortfolioSelector,
      showSelect,
      setShowSelect,
      showEditTransaction,
      setShowEditTransaction,
      showDeleteNft,
      setShowDeleteNft,
      showDeleteSelector,
      setShowDeleteSelector,
      activeStep,
      setActiveStep,
      showHiddenNfts,
      prevPath,

      /** DATA DISPLAY STATES */
      activeNetworks,
      setActiveNetworks,
      timeframe,
      setTimeframe,
      activeCategory,
      setActiveCategory,
      hiddenTokens,
      setHiddenTokens,
      nftsDeleted,
      setNftsDeleted,
      nftToDelete,
      setNftToDelete,

      /** UI STATE */
      isLoading,
      setIsLoading,
      isRefreshing,
      setIsRefreshing,
      isWalletExplorer,
      setIsWalletExplorer,
      isPortfolioExplorer,
      setIsPortfolioExplorer,
      isAssetPage,
      setIsAssetPage,
      editAssetManager,
      setEditAssetManager,
      error,
      setError,

      /** PORTFOLIO STATES */
      userPortfolio,
      setUserPortfolio,
      activePortfolio,
      setActivePortfolio,
      tokenTsx,
      setTokenTsx,
      comparedEntities,
      setComparedEntities,
      showHiddenTokensPopup,
      setShowHiddenTokensPopup,

      /** PORTFOLIO DATA */
      wallet,
      setWallet,
      transactions,
      setTransactions,
      asset,
      setAsset,

      /** UI MANAGERS */
      manager,
      setManager,

      /** SWIPE MOBILE */
      isMobile,
      nfts,
      setNfts,
      isNftLoading,
      setIsNftLoading,
      activeCollection,
      setActiveCollection,

      portfolioSettings,
      setPortfolioSettings,
    ]
  );

  useEffect(() => {
    if (isWalletExplorerBuffer !== isWalletExplorer)
      setIsWalletExplorer(isWalletExplorerBuffer);
  }, [isWalletExplorerBuffer]);

  useEffect(() => {
    if (isPortfolioExplorerBuffer !== isPortfolioExplorer)
      setIsPortfolioExplorer(isPortfolioExplorerBuffer);
  }, [isPortfolioExplorerBuffer]);

  return (
    <PortfolioV2Context.Provider value={value}>
      {children}
    </PortfolioV2Context.Provider>
  );
};
