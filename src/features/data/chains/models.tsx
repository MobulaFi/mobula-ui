interface ChainsProps {
  liquidity_history: [number, number][];
  tokens_history: [number, number][];
  volume_history: [number, number][];
}

interface PairsProps {
  liquidity: number;
  price: number;
  price_change_5min: number;
  price_change_1h: number;
  price_change_12h: number;
  price_change_24h: number;
  trades: number;
  volume: number;
  token0: PairsTokenProps;
  token1: PairsTokenProps;
}

interface PairsTokenProps {
  name: string;
  symbol: string;
  address: string;
  logo: string;
}
