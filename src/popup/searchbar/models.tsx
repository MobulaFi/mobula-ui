// import {IconType} from "react-icons/lib";

import { ReactNode } from "react";

export interface ISearchBarContext {
  token: string;
  setToken: React.Dispatch<React.SetStateAction<string>>;
  results: Token[];
  setResults: React.Dispatch<React.SetStateAction<Token[]>>;
  active: number;
  setActive: React.Dispatch<React.SetStateAction<number>>;
  articles: ArticlesType[];
  setArticles: React.Dispatch<React.SetStateAction<ArticlesType[]>>;
  isFocus: boolean;
  setIsFocus: React.Dispatch<React.SetStateAction<boolean>>;
  users: Partial<User>[];
  setUsers: React.Dispatch<React.SetStateAction<Partial<User>[]>>;
  userWithAddress: Partial<User>;
  setUserWithAddress: React.Dispatch<React.SetStateAction<Partial<User>>>;
  pages: Page[];
  setPages: React.Dispatch<React.SetStateAction<Page[]>>;
  ens: { name: string; address: string | null };
  setEns: React.Dispatch<
    React.SetStateAction<{ name: string; address: string | null }>
  >;
  pairs: NonListedAssetProps[];
  setPairs: React.Dispatch<React.SetStateAction<NonListedAssetProps[]>>;
}

export interface PercentageType {
  isPercentage?: boolean;
  value: string | number | ReactNode;
  noImage?: boolean;
}

export interface TrendsType {
  name: string;
  price_change_24h: number;
  logo: string;
  id: number;
  trending_score: number;
}

export interface Token {
  logo: string;
  name: string;
  symbol: string;
  rank: number;
  id?: number;
  address?: string;
  price_change_24h: number;
  price: number;
  market_cap?: number;
  isTemplate?: boolean;
  pairs?: PairsSearchProps[];
  token0?: {
    name: string;
    symbol: string;
    logo: string;
    address: string;
  };
}

export interface ArticlesType {
  likes: number;
  title: string;
  url: string;
  type: string;
  validate?: boolean;
}

export interface MobulaUser {
  name: string;
  logo: string;
  address: string;
}

export interface User {
  address: string;
  username: string;
  profile_pic: string;
  name?: string;
  logo?: string;
}

export interface Page {
  name: string;
  url: string;
  requests: string[];
}

export interface NewWalletProps extends User {
  type: string;
  label: string;
}

export interface NonListedAssetProps {
  blockchains: string[];
  contracts: string[];
  name: string;
  pairs: PairsSearchProps[];
  price: number;
  symbol: string;
  type: string;
  token0?: {
    name: string;
    symbol: string;
    logo: string;
  };
  token1?: {
    name: string;
    symbol: string;
    logo: string;
  };
  address?: string;
  liquidity?: string;
}

export interface PairsSearchProps {
  address: string;
  blockchain: string;
  createdAt: number;
  factory: string;
  reserve0: string;
  reserve1: string;
  token0: {
    address: string;
    symbol: string;
    logo: string;
  } | null;
  token1: {
    address: string;
    symbol: string;
    logo: string;
  } | null;
  type: string;
  totalVolume: number;
  volume24h: number;
  liquidity: number;
  baseToken: string;
  quoteToken: string;
}
