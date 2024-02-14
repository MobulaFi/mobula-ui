export interface ChainsProps {
  liquidity_history: [number, number][];
  tokens_history: [number, number][];
  volume_history: [number, number][];
  tokens_change_total: number;
  volume_change_total: number;
  liquidity_change_total: number;
  tokens_change_24h: number;
  volume_change_24h: number;
  liquidity_change_24h: number;
}
export interface PairsTokenProps {
  address: string;
  symbol: string;
  name: string;
  logo: string;
  id: number;
}

export interface PairsProps {
  last_trade: Date;
  pair: {
    address: string;
    baseToken: string;
    blockchain: string;
    createdAt: string;
    exchange: string;
    factory: string;
    liquidity: number;
    quoteToken: string;
    token0: PairsTokenProps;
    token1: PairsTokenProps;
    type: string;
    volume24h: number;
  };
  price: number;
  price_change_1h: number;
  price_change_4h: number;
  price_change_5min: number;
  price_change_24h: number;
}

export interface OldPairsProps {
  [key: string]: number;
}
