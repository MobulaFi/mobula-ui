import { blockchainsContent } from "mobula-lite/lib/chains/constants";
import { BlockchainName } from "mobula-lite/lib/model";
import { Chain } from "wagmi";

// TODO: resolve ts issue

export const bnbChain: Chain = {
  id: 56,
  name: "BNB Smart Chain (BEP20)",
  network: "bnb",
  nativeCurrency: {
    decimals: 18,
    name: "BNB",
    symbol: "BNB",
  },
  rpcUrls: {
    default: {
      http: ["https://bsc-dataseed.binance.org" as any],
    },
    public: {
      http: ["https://bsc-dataseed.binance.org" as any],
    },
  },
  blockExplorers: {
    default: { name: "BSCScan", url: "https://bscscan.com" },
  },
  testnet: false,
};

export const smartBCH: Chain = {
  id: 10000,
  name: "SmartBCH",
  network: "smartBCH",
  nativeCurrency: {
    decimals: 18,
    name: "Bitcoin Cash",
    symbol: "BCH",
  },
  rpcUrls: {
    default: {
      http: ["https://smartbch.greyh.at" as any],
    },
    public: {
      http: ["https://smartbch.greyh.at" as any],
    },
  },
  blockExplorers: {
    default: { name: "SmartScan", url: "https://www.smartscan.cash" },
  },
  testnet: false,
};

export const cronos: Chain = {
  id: 25,
  name: "Cronos",
  network: "Cronos",
  nativeCurrency: {
    decimals: 18,
    name: "Cronos",
    symbol: "CRO",
  },
  rpcUrls: {
    default: {
      http: ["https://evm.cronos.org" as any],
    },
    public: {
      http: ["https://evm.cronos.org" as any],
    },
  },
  blockExplorers: {
    default: { name: "Cronoscan", url: "https://cronoscan.com" },
  },
  testnet: false,
};

export const avalanche: Chain = {
  id: 43114,
  name: "Avalanche C-Chain",
  network: "avalanche",
  nativeCurrency: {
    decimals: 18,
    name: "AVAX",
    symbol: "AVAX",
  },
  rpcUrls: {
    default: {
      http: ["https://api.avax.network/ext/bc/C/rpc" as any],
    },
    public: {
      http: ["https://api.avax.network/ext/bc/C/rpc" as any],
    },
  },
  blockExplorers: {
    default: { name: "Snowtrace", url: "https://snowtrace.io" },
  },
  testnet: false,
};

export const fantom: Chain = {
  id: 250,
  name: "Fantom Opera",
  network: "fantom",
  nativeCurrency: {
    decimals: 18,
    name: "FTM",
    symbol: "FTM",
  },
  rpcUrls: {
    default: {
      http: ["https://rpcapi.fantom.network" as any],
    },
    public: {
      http: ["https://rpcapi.fantom.network" as any],
    },
  },
  blockExplorers: {
    default: { name: "FantomScan", url: "https://ftmscan.com" },
  },
  testnet: false,
};

export const aurora: Chain = {
  id: 1313161554,
  name: "Aurora",
  network: "aurora",
  nativeCurrency: {
    decimals: 18,
    name: "AURORA",
    symbol: "AURORA",
  },
  rpcUrls: {
    default: {
      http: ["https://mainnet.aurora.dev" as any],
    },
    public: {
      http: ["https://mainnet.aurora.dev" as any],
    },
  },
  blockExplorers: {
    default: { name: "AuroraScan", url: "https://explorer.mainnet.aurora.dev" },
  },
  testnet: false,
};

export const dfkSubnet: Chain = {
  id: 53935,
  name: "DFK Subnet",
  network: "dfkSubnet",
  nativeCurrency: {
    decimals: 18,
    name: "DeFi Kingdoms",
    symbol: "JEWEL",
  },
  rpcUrls: {
    default: {
      http: ["https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc" as any],
    },
    public: {
      http: ["https://subnets.avax.network/defi-kingdoms/dfk-chain/rpc" as any],
    },
  },
  blockExplorers: {
    default: {
      name: "DFK Subnet",
      url: "https://subnets.avax.network/defi-kingdoms",
    },
  },
  testnet: false,
};

export const celo: Chain = {
  id: 42220,
  name: "Celo",
  network: "celo",
  nativeCurrency: {
    decimals: 18,
    name: "Celo",
    symbol: "CELO",
  },
  rpcUrls: {
    default: {
      http: ["https://forno.celo.org" as any],
    },
    public: {
      http: ["https://forno.celo.org" as any],
    },
  },
  blockExplorers: {
    default: { name: "CeloScan", url: "https://explorer.celo.org/mainnet" },
  },
  testnet: false,
};

export const gnosis: Chain = {
  id: 100,
  name: "Gnosis",
  network: "gnosis",
  nativeCurrency: {
    decimals: 18,
    name: "XDAI",
    symbol: "XDAI",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.gnosischain.com" as any],
    },
    public: {
      http: ["https://rpc.gnosischain.com" as any],
    },
  },
  blockExplorers: {
    default: { name: "GnosisScan", url: "https://gnosisscan.io" },
  },
  testnet: false,
};

export const klaytn: Chain = {
  id: 8217,
  name: "Klaytn",
  network: "klaytn",
  nativeCurrency: {
    decimals: 18,
    name: "KLAY",
    symbol: "KLAY",
  },
  rpcUrls: {
    default: {
      http: ["https://klaytn.blockpi.network/v1/rpc/public" as any],
    },
    public: {
      http: ["https://klaytn.blockpi.network/v1/rpc/public" as any],
    },
  },
  blockExplorers: {
    default: { name: "KlaytnScan", url: "https://scope.klaytn.com" },
  },
  testnet: false,
};

export const heco: Chain = {
  id: 128,
  name: "Heco",
  network: "heco",
  nativeCurrency: {
    decimals: 18,
    name: "HT",
    symbol: "HT",
  },
  rpcUrls: {
    default: {
      http: ["https://http-mainnet.hecochain.com" as any],
    },
    public: {
      http: ["https://http-mainnet.hecochain.com" as any],
    },
  },
  blockExplorers: {
    default: { name: "HecoScan", url: "https://hecoinfo.com" },
  },
  testnet: false,
};

export const harmony: Chain = {
  id: 1666600000,
  name: "Harmony",
  network: "harmony",
  nativeCurrency: {
    decimals: 18,
    name: "One",
    symbol: "ONE",
  },
  rpcUrls: {
    default: {
      http: ["https://api.harmony.one" as any],
    },
    public: {
      http: ["https://api.harmony.one" as any],
    },
  },
  blockExplorers: {
    default: { name: "HarmonyScan", url: "https://explorer.harmony.one" },
  },
  testnet: false,
};

export const boba: Chain = {
  id: 288,
  name: "Boba",
  network: "boba",
  nativeCurrency: {
    decimals: 18,
    name: "Ethereum",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["https://mainnet.boba.network" as any],
    },
    public: {
      http: ["https://mainnet.boba.network" as any],
    },
  },
  blockExplorers: {
    default: { name: "BobaScan", url: "https://bobascan.com" },
  },
  testnet: false,
};

export const okex: Chain = {
  id: 66,
  name: "OKExChain",
  network: "okex",
  nativeCurrency: {
    decimals: 18,
    name: "OKT",
    symbol: "OKT",
  },
  rpcUrls: {
    default: {
      http: ["https://exchainrpc.okex.org" as any],
    },
    public: {
      http: ["https://exchainrpc.okex.org" as any],
    },
  },
  blockExplorers: {
    default: { name: "OKExScan", url: "https://www.oklink.com/okc" },
  },
  testnet: false,
};

export const moonriver: Chain = {
  id: 1285,
  name: "Moonriver",
  network: "moonriver",
  nativeCurrency: {
    decimals: 18,
    name: "Moonriver",
    symbol: "MOVR",
  },
  rpcUrls: {
    default: {
      http: ["https://moonriver.api.onfinality.io/public" as any],
    },
    public: {
      http: ["https://moonriver.api.onfinality.io/public" as any],
    },
  },
  blockExplorers: {
    default: { name: "MoonriverScan", url: "https://moonriver.moonscan.io" },
  },
  testnet: false,
};

export const bittorrentchain: Chain = {
  id: 199,
  name: "BitTorrent Chain",
  network: "bittorrentchain",
  nativeCurrency: {
    decimals: 18,
    name: "BitTorrent Token",
    symbol: "BTT",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.bittorrentchain.io" as any],
    },
    public: {
      http: ["https://rpc.bittorrentchain.io" as any],
    },
  },
  blockExplorers: {
    default: { name: "BitTorrentScan", url: "https://bttcscan.com" },
  },
  testnet: false,
};

export const oasis: Chain = {
  id: 42262,
  name: "Oasis",
  network: "oasis",
  nativeCurrency: {
    decimals: 18,
    name: "Oasis",
    symbol: "ROSE",
  },
  rpcUrls: {
    default: {
      http: ["https://emerald.oasis.dev" as any],
    },
    public: {
      http: ["https://emerald.oasis.dev" as any],
    },
  },
  blockExplorers: {
    default: { name: "OasisScan", url: "https://explorer.emerald.oasis.dev" },
  },
  testnet: false,
};

export const velas: Chain = {
  id: 106,
  name: "Velas",
  network: "velas",
  nativeCurrency: {
    decimals: 18,
    name: "Velas",
    symbol: "VLX",
  },
  rpcUrls: {
    default: {
      http: ["https://evmexplorer.velas.com/rpc" as any],
    },
    public: {
      http: ["https://evmexplorer.velas.com/rpc" as any],
    },
  },
  blockExplorers: {
    default: { name: "VelasScan", url: "https://evmexplorer.velas.com" },
  },
  testnet: false,
};

export const polygon: Chain = {
  id: 137,
  name: "Polygon",
  network: "polygon",
  nativeCurrency: {
    decimals: 18,
    name: "Polygon",
    symbol: "MATIC",
  },
  rpcUrls: {
    default: {
      http: ["https://polygon-rpc.com" as any],
    },
    public: {
      http: ["https://polygon-rpc.com" as any],
    },
  },
  blockExplorers: {
    default: { name: "PolygonScan", url: "https://polygonscan.com" },
  },
  testnet: false,
};

export const ethereum: Chain = {
  id: 1,
  name: "Ethereum",
  network: "ethereum",
  nativeCurrency: {
    decimals: 18,
    name: "Ethereum",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: [
        "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161" as any,
      ],
    },
    public: {
      http: [
        "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161" as any,
      ],
    },
  },
  blockExplorers: {
    default: { name: "Etherscan", url: "https://etherscan.io" },
  },
  testnet: false,
};

export const arbitrum: Chain = {
  id: 42161,
  name: "Arbitrum",
  network: "arbitrum",
  nativeCurrency: {
    decimals: 18,
    name: "Arbitrum",
    symbol: "ARB",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.ankr.com/arbitrum" as any],
    },
    public: {
      http: ["https://rpc.ankr.com/arbitrum" as any],
    },
  },
  blockExplorers: {
    default: { name: "ArbitrumScan", url: "https://arbiscan.io" },
  },
  testnet: false,
};

export const optimism: Chain = {
  id: 10,
  name: "Optimism",
  network: "optimism",
  nativeCurrency: {
    decimals: 18,
    name: "Optimism",
    symbol: "OP",
  },
  rpcUrls: {
    default: {
      http: ["https://mainnet.optimism.io" as any],
    },
    public: {
      http: ["https://mainnet.optimism.io" as any],
    },
  },
  blockExplorers: {
    default: { name: "OptimismScan", url: "https://optimistic.etherscan.io" },
  },
  testnet: false,
};

export const shibarium: Chain = {
  id: 109,
  name: "Shibarium",
  network: "shibarium",
  nativeCurrency: {
    decimals: 18,
    name: "Bone",
    symbol: "BONE",
  },
  rpcUrls: {
    default: {
      http: ["https://www.shibrpc.com" as any],
    },
    public: {
      http: ["https://www.shibrpc.com" as any],
    },
  },
  blockExplorers: {
    default: { name: "ShibariumScan", url: "https://www.shibariumscan.io" },
  },
  testnet: false,
};

export const base: Chain = {
  id: 8453,
  name: "Base",
  network: "base",
  nativeCurrency: {
    decimals: 18,
    name: "Ethereum",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["https://mainnet.base.org	" as any],
    },
    public: {
      http: ["https://mainnet.base.org	" as any],
    },
  },
  blockExplorers: {
    default: { name: "BaseScan", url: "https://www.basescan.org" },
  },
  testnet: false,
};

export const idToWagmiChain: Record<number, Chain> = {
  1: ethereum,
  10: optimism,
  25: cronos,
  66: okex,
  100: gnosis,
  106: velas,
  128: heco,
  137: polygon,
  250: fantom,
  288: boba,
  42161: arbitrum,
  42220: celo,
  42262: oasis,
  43114: avalanche,
  53935: dfkSubnet,
  8217: klaytn,
  10000: smartBCH,
  1313161554: aurora,
  1666600000: harmony,
  199: bittorrentchain,
  1285: moonriver,
  56: bnbChain,
  109: shibarium,
  8453: base,
};

const customExplorers: Partial<Record<BlockchainName, Record<string, string>>> =
  {
    Alephium: {
      tx: "transactions",
      address: "addresses",
    },
  };

export const explorerTransformer = (
  chainName: BlockchainName,
  value: string,
  type: "tx" | "address"
) => {
  const blockchain = blockchainsContent[chainName];
  if (!blockchain) return "";

  return `${blockchain.explorer}/${
    customExplorers[chainName]?.[type] || type
  }/${value}`;
};
