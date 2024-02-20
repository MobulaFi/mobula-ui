import { User } from "mobula-utils/lib/user/model";
import { Asset, TableAsset } from "../assets";

export interface TokenWatchlist {
  id: string;
  name: string;
  price_change_24h: number;
  volume: number;
  symbol: string;
  logo: string;
  market_cap: number;
  price: number;
  liquidity: number;
  rank: number;
  contracts: string[];
  blockchains: string[];
  twitter: string;
  website: string;
  chat: string;
  created_at: string;
}

export interface IWatchlist {
  watchlist_assets?: string[];
  watchlist_created_at?: string | Date;
  watchlist_followers?: number[];
  watchlist_id?: string;
  watchlist_name?: string;
  watchlist_main_watchlist?: boolean;
  watchlist_public?: boolean;
  watchlist_user_id?: number;
  id?: number;
  name?: string;
  assets?: number[];
  created_at?: string | Date;
  user_id?: number;
  main_watchlist?: boolean;
  public?: boolean;
  followers?: number[];
}

export interface IWatchlistContext {
  activeWatchlist: IWatchlist | null;
  setActiveWatchlist: React.Dispatch<React.SetStateAction<IWatchlist | null>>;
  pageSelected: string;
  setPageSelected: React.Dispatch<React.SetStateAction<string>>;
  followedAndDiscoverWatchlist: IWatchlist[];
  setFollowedAndDiscoverWatchlist: React.Dispatch<
    React.SetStateAction<IWatchlist[]>
  >;
  tokenToAddInWatchlist: TableAsset;
  setTokenToAddInWatchlist: React.Dispatch<React.SetStateAction<TableAsset>>;
  watchlists: IWatchlist[];
  setWatchlists: React.Dispatch<React.SetStateAction<IWatchlist[]>>;
  showEdit: boolean;
  setShowEdit: React.Dispatch<React.SetStateAction<boolean>>;
  isMainWatchlist: boolean;
  searchWatchlist: string;
  setSearchWatchlist: React.Dispatch<React.SetStateAction<string>>;
  setIsMainWatchlist: React.Dispatch<React.SetStateAction<boolean>>;
  userOfWatchlist: User | null;
  setUserOfWatchlist: React.Dispatch<React.SetStateAction<User | null>>;
  editName: {
    oldname: string;
    newname: string;
    watchlist: string;
  };
  setEditName: React.Dispatch<
    React.SetStateAction<{
      oldname: string;
      newname: string;
      watchlist: string;
    }>
  >;
  isPageUserWatchlist: boolean;
  setIsPageUserWatchlist: React.Dispatch<React.SetStateAction<boolean>>;
  showShare: boolean;
  setShowShare: React.Dispatch<React.SetStateAction<boolean>>;
  showAddCoins: boolean;
  setShowAddCoins: React.Dispatch<React.SetStateAction<boolean>>;
  showCreateWL: boolean;
  setShowCreateWL: React.Dispatch<React.SetStateAction<boolean>>;
  tokens: Asset[];
  setTokens: React.Dispatch<React.SetStateAction<Asset[]>>;
}
