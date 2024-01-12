export interface IListingContext {
  isListed: boolean;
  setIsListed: React.Dispatch<React.SetStateAction<boolean>>;
  wallet: string;
  setWallet: React.Dispatch<React.SetStateAction<string>>;
  isLaunched: boolean;
  setIsLaunched: React.Dispatch<React.SetStateAction<boolean>>;
  actualPage: number;
  setActualPage: React.Dispatch<React.SetStateAction<number>>;
}

export interface ListingState {
  name: string;
  symbol: string;
  type: string;
  image: {
    loading: boolean;
    uploaded_logo: boolean;
    logo: string;
  };
  description: string;
  categories: string[];
  completed: boolean;
  links: {
    website: string;
    twitter: string;
    telegram: string;
    discord: string;
    github: string;
  };
  contracts: {
    address: string;
    blockchain: string;
    blockchain_id: string;
  }[];
  excludedFromCirculationAddresses: {
    address: string;
    blockchain: string;
    blockchain_id: string;
  }[];
  tokenomics: {
    launch: {
      date: string;
      lag: number;
      exchange: string;
      vsToken: string;
    };
    vestingSchedule: any[];
    fees: {
      name: string;
      percentage: string;
      details: string;
      side: string;
    }[];
    sales: {
      name: string;
      date: number;
      valuation: number;
      price: number;
      amount: number;
      platform: string;
    }[];
  };
  init: boolean;
}
