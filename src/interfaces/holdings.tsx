import { BlockchainName } from "mobula-lite/lib/model";

export interface MultichainAsset {
  name: string;
  symbol: string;
  contracts: string[];
  blockchains: BlockchainName[];
  logo?: string;
  rank?: number;
  balance: number;
  website?: string;
  twitter?: string;
  market_cap?: number;
  price?: number;
  price_change_24h?: number;
  blockchain?: BlockchainName;
  address?: string;
  id?: number;
}

export interface SolochainAsset {
  name: string;
  symbol: string;
  address: string;
  blockchain: BlockchainName;
  logo?: string;
  rank?: number;
  balance: number;
  website?: string;
  twitter?: string;
  market_cap?: number;
  price?: number;
  price_change_24h?: number;
  id?: number;
}

export interface HoldingsResponse {
  holdings: {
    multichain: MultichainAsset[];
    solochain: SolochainAsset[];
  };
}

export interface HoldingsNftResponse {
  data: HoldingNFT[];
  error: string;
}

export interface HoldingNFT {
  amount: string;
  block_number: string;
  block_number_minted: string;
  contract_type: string;
  image: string;
  last_metadata_sync: string;
  last_token_uri_sync: string;
  metadata: string | null;
  minter_address: string | null;
  name: string;
  owner_of: string;
  symbol: string;
  token_address: string;
  token_hash: string;
  token_id: string;
  token_uri: string;
}
