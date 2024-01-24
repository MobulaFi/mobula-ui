export interface EditState {
  name: string;
  symbol: string;
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
    audits: string[];
    kycs: string[];
  };
  team: string[];
  contracts: [
    {
      address: string;
      blockchain: string;
      blockchain_id: number;
    }
  ];
}
