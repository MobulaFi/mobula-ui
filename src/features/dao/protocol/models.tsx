import { BlockchainName } from "mobula-lite/lib/model";
import { User } from "mobula-utils/lib/user/model";
import React, { RefObject } from "react";

export interface IOverviewContext {
  bufferRecentlyAdded: any;
  bufferDaoMembers: any;
  bufferValidated: any;
  bufferRejected: any;
  setTokensOwed: React.Dispatch<React.SetStateAction<number>>;
  tokensOwed: number;
  goodDecisions: number;
  setGoodDecisions: React.Dispatch<React.SetStateAction<number>>;
  badDecisions: number;
  setBadDecisions: React.Dispatch<React.SetStateAction<number>>;
  countdown: number;
  setCountdown: React.Dispatch<React.SetStateAction<number>>;
  claimed: number;
  setClaimed: React.Dispatch<React.SetStateAction<number>>;
  userRank: number;
  setUserRank: React.Dispatch<React.SetStateAction<number>>;
}

export interface SocialSort {
  logo: string;
  url: string | undefined;
  alt: string;
}

export interface ISortContext {
  tokenDivs: TokenDivs[];
  setTokenDivs: React.Dispatch<React.SetStateAction<TokenDivs[]>>;
  setDisplayedToken: React.Dispatch<React.SetStateAction<string>>;
  displayedToken: string;
  votes: number[];
  setVotes: React.Dispatch<React.SetStateAction<number[]>>;
  isFirstSort: boolean;
  isPendingPool: boolean;
  setDisplayedPool: React.Dispatch<React.SetStateAction<string>>;
  displayedPool: string;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface TokenToBuyWith {
  blockchains: string[];
  contracts: string[];
  decimals: number[];
  logo: string;
  name: string;
  symbol: string;
}

export interface RowData {
  audit: string;
  chains: string[];
  chat: string;
  contracts: string[];
  description: string;
  kyc: string;
  logo: string;
  name: string;
  symbol: string;
  twitter: string;
  website: string;
}
export interface TokenDivs {
  name: string;
  symbol: string;
  alreadyVoted: bigint;
  categories: string[];
  edits: string[];
  coeff: number | bigint;
  oldToken: TokenDivs;
  voteId: number;
  logo?: string;
  completed: boolean;
  contracts: {
    address: string;
    blockchain: BlockchainName;
    blockchain_id: number;
  }[];
  description: string;
  excludedFromCirculationAddresses: {
    address: string;
    blockchain: BlockchainName;
    blockchain_id: number;
  }[];
  id: number;
  image: {
    loading: boolean;
    logo: string;
    uploaded_logo: boolean;
  };
  isListing: boolean;
  lastUpdate: number;
  links: {
    audits: string[];
    discord: string;
    github: string;
    kycs: string[];
    telegram: string;
    twitter: string;
    website: string;
  };
  team: {
    name: string;
    role: string;
    twitter: string;
    telegram: string;
    linkedin: string;
  }[];
  tokenomics: {
    distribution: {
      name: string;
      amount: number;
      percentage?: number;
      addresses?: {
        address: string;
        blockchain: BlockchainName | string;
        blockchain_id: number;
      }[];
    }[];
    fees: {
      name: string;
      percentage: number;
      details: string;
      side: string;
    }[];
    launch: {
      date: string;
      lag: number;
      exchange: string;
      vsToken: string;
    };
    sales: {
      name: string;
      date: string;
      valuation: number;
      price: number;
      amount: number;
      platform: string;
    }[];
    vestingSchedule: {
      allocation_details: {
        [key: string]: number;
      };
      asset_id: number;
      created_at: number;
      tokens_to_unlock: number;
      unlock_date: number;
    }[];
  };
  type: string;
  totalSupplyContracts: {
    address: string;
    blockchain: BlockchainName;
    blockchain_id: number;
  }[];
  votes: number;
}

export interface VoteToken {
  id: number;
  alreadyVoted?: boolean;
  name: string;
  logo: string;
  description: string;
  contracts?: string[];
  contractAddresses?: string[];
  chains?: string[];
  twitter?: string;
  discord?: string;
  chat?: string;
  website?: string;
  audit?: string;
  kyc?: string;
}
// aiGeneratedDescription
// :
// ""
// alreadyVoted
// :
// 0n
// categories
// :
// ['NFT Marketplace']
// coeff
// :
// 1
// completed
// :
// false
// contracts
// :
// [{…}]
// description
// :
// "The first fully privatized on-chain Auction House introducing new ways to generate liquidity for onchain assets | Backed by Kucoin and Republic Capital\n"
// excludedFromCirculationAddresses
// :
// [{…}]
// id
// :
// 0
// image
// :
// {loading: false, uploaded_logo: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAA…5CJj79poBG7ABG7AB+z/sf3wos8pHNobCAAAAAElFTkSuQmCC', logo: 'https://mobula.mypinata.cloud/ipfs/QmR4k1deRQ9GWbh…4Kc6yMwL4kG-UCFSmo0FL2pcIRAdN-V8XYVaL7udtsC7R3_Nm'}
// isListing
// :
// false
// lastUpdate
// :
// NaN
// links
// :
// {website: 'https://www.bidshop.io/', twitter: 'https://twitter.com/BIDSHOP_io', telegram: 'https://t.me/BIDSHOP_io', discord: 'https://discord.com/invite/BIDSHOP', github: '', …}
// name
// :
// "BIDSHOP"
// symbol
// :
// "BIDS"
// team
// :
// [{…}]
// tokenomics
// :
// {distribution: Array(0), launch: {…}, sales: Array(0), vestingSchedule: Array(3), fees: Array(6)}
// totalSupplyContracts
// :
// [{…}]
// type
// :
// "token"
export interface FakeToken {
  name: string;
  description: string;
  logo: string;
  twitter: string;
  discord: string;
  chat: string;
  website: string;
  audit: string;
  kyc: string;
  contracts: string[];
  contractAddresses: string[];
  alreadyVoted: boolean;
  id: number;
}

export interface Vote {
  validate: boolean;
  score: number;
  name: string;
}

export interface Dao {
  address: string;
  bad_decisions: number;
  created_at: Date | string;
  discord_id: number | null;
  good_decisions: number;
  id: number;
  username: string;
  users: User;
}

export interface IHistoryContext {
  daoMembers: Dao[];
  statistics: { amount: number; name: string }[];
}

export interface TokenListed {
  activeCoinType: string[];
  alreadyVoted: boolean;
  audit: string;
  chains: string[];
  chat: string;
  contractAddresses: string[];
  contracts: string[];
  description: string;
  excludedFromCirculation: string[];
  id: number | { _hex: string; _isBigNumber: boolean };
  kyc: string | undefined;
  lastUpdate: number | { _hex: string; _isBigNumber: boolean };
  logo: string;
  name: string;
  own_blockchain: boolean;
  symbol: string;
  totalSupply: string[];
  twitter: string;
  website: string;
}

export interface HistoryListing {
  final_decision: boolean;
  created_at: string | Date;
  description: string;
  id: number;
  token_id: number;
  kyc: string;
  logo: string;

  timestamp: number;

  trust_score: number;
  utility_score: number;
  social_score: number;

  validated: boolean;

  votes: {
    is_first_sort: boolean;
    market_score: number;
    member: string;
    social_score: number;
    token: number;
    trust_score: number;
    utility_score: number;
    validated: boolean;
  }[];

  token_data: {
    name: string;
    symbol: string;
    logo: string;
  };
}
export interface EditingTemplate {
  oldImage: string;
  newImage: string;
  oldValue: any;
  newValue: any;
  type: string;
}
export interface IVoteContext {
  utilityScore: number;
  setUtilityScore: React.Dispatch<React.SetStateAction<number>>;
  socialScore: number;
  setSocialScore: React.Dispatch<React.SetStateAction<number>>;
  trustScore: number;
  setTrustScore: React.Dispatch<React.SetStateAction<number>>;
  complete: RefObject<boolean>;
  [key: string]: any;
}
export interface IShowReasonContext {
  showReject: boolean;
  setShowReject: React.Dispatch<React.SetStateAction<boolean>>;
  showUtility: boolean;
  setShowUtility: React.Dispatch<React.SetStateAction<boolean>>;
  showSocial: boolean;
  setShowSocial: React.Dispatch<React.SetStateAction<boolean>>;
  showTrust: boolean;
  setShowTrust: React.Dispatch<React.SetStateAction<boolean>>;
  [key: string]: any;
}

export interface IReasonVoteContext {
  reasonUtility: number;
  setReasonUtility: React.Dispatch<React.SetStateAction<number>>;
  reasonSocial: number;
  setReasonSocial: React.Dispatch<React.SetStateAction<number>>;
  reasonTrust: number;
  setReasonTrust: React.Dispatch<React.SetStateAction<number>>;
  reasonReject: number;
  setReasonReject: React.Dispatch<React.SetStateAction<number>>;
}

export interface Member {
  id: number;
  address: string;
  username: string;
  good_decisions: number;
  bad_decisions: number;
  discord_id: number | null;
  created_at: Date | string;
  users: User;
}
