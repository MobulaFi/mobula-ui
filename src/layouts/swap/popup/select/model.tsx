import { BlockchainName } from "mobula-lite/lib/model";

export interface Results {
  price_change_24h: number;
  name: string;
  switch?: boolean;
}

export interface SearchTokenProps {
  address?: string;
  blockchain: string | BlockchainName;
  logo?: string;
  name?: string;
  price?: number;
  price_change_24h?: number;
  symbol: string;
  rank?: number;
  id?: number;
  contracts: string[];
  blockchains: string[];
  market_cap?: number;
  balance?: number;
  switch?: boolean;
  coin?: boolean;
  evmChainId?: number;
  image?: string;
}
