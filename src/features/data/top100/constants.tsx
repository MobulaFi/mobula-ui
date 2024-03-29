import { blockchainsContent } from "mobula-lite/lib/chains/constants";
import { BiCandles } from "react-icons/bi";
import { BsWallet2 } from "react-icons/bs";
import { VscArrowSwap } from "react-icons/vsc";
import { useUrl } from "../../../hooks/url";
import { FiltersRange } from "./components/popup/views/ui/filters-range";
import {
  ChangeIcon,
  ChartIcon,
  MarketCapIcon,
  PriceIcon,
  VolumeIcon,
} from "./components/popup/views/ui/icons";
import { IViewStep } from "./models";

const maxValue = 100_000_000_000_000_000;
export const defaultCategories = [
  "Technology & Science",
  "Velas Ecosystem",
  "TRY Stablecoin",
  "Fixed Interest",
  "Farming-as-a-Service (FaaS)",
  "Shibarium Ecosystem",
  "BNB Chain Ecosystem",
  "Internet Computer Ecosystem",
  "Seigniorage",
  "Metagovernance",
  "Yearn Vault Tokens",
  "Bridge Governance Tokens",
  "Governance",
  "BRC-20",
  "Gaming (GameFi)",
  "MultiversX Ecosystem",
  "Wallets",
  "Environment",
  "Fan Token",
  "Animal Racing",
  "Linea Ecosystem",
  "friend.tech",
  "KardiaChain Ecosystem",
  "Collectibles",
  "Analytics",
  "Telegram Bots",
  "Yield Farming",
  "NFT",
  "Discord Bots",
  "Wormhole Assets",
  "Klaytn Ecosystem",
  "Artificial Intelligence (AI)",
  "EUR Stablecoin",
  "Yield Aggregator",
  "Exchange-based Tokens",
  "Zero Knowledge (ZK)",
  "LP Tokens",
  "Gambling",
  "Cryptocurrency",
  "Eth 2.0 Staking",
  "cToken",
  "Index",
  "Olympus Pro",
  "Play To Earn",
  "LSDFi",
  "Leveraged Token",
  "Base Ecosystem",
  "Big Data",
  "Options",
  "Decentralized Exchange (DEX)",
  "Asset-backed Tokens",
  "DeFi Index",
  "Charity",
  "PulseChain Ecosystem",
  "Entertainment",
  "Insurance",
  "EthereumPoW Ecosystem",
  "Avalanche Ecosystem",
  "XDC Ecosystem",
  "Finance / Banking",
  "NFT Marketplace",
  "Infrastructure",
  "Compound Tokens",
  "Celo Ecosystem",
  "Fantom Ecosystem",
  "Automated Market Maker (AMM)",
  "Software",
  "Harmony Ecosystem",
  "Perpetuals",
  "Arbitrum Nova Ecosystem",
  "Cardano Ecosystem",
  "Oracle",
  "Real Estate",
  "Canto Ecosystem",
  "Layer 2 (L2)",
  "Cosmos Ecosystem",
  "Aptos Ecosystem",
  "ZkSync Ecosystem",
  "Rebase Tokens",
  "Energy",
  "Derivatives",
  "Lending/Borrowing",
  "Sui Ecosystem",
  "Synthetic Issuer",
  "Identity",
  "Manufacturing",
  "Fractionalized NFT",
  "Ethereum Ecosystem",
  "Edgeware Ecosystem",
  "Stablecoins",
  "Interoperability",
  "Tezos Ecosystem",
  "Step Network Ecosystem",
  "Media",
  "Arbitrum Ecosystem",
  "Protocol",
  "Masternodes",
  "Decentralized Finance (DeFi)",
  "HECO Chain Ecosystem",
  "Education",
  "SGD Stablcoin",
  "Gnosis Chain Ecosystem",
  "Tourism",
  "Healthcare",
  "ETF",
  "Virtual Reality",
  "IDR Stablecoin",
  "Solana Ecosystem",
  "Metis Ecosystem",
  "USD Stablecoin",
  "Business Platform",
  "Layer 1 (L1)",
  "Moonbeam Ecosystem",
  "Launchpad",
  "Asset Manager",
  "Communication",
  "Synths",
  "Smart Contract Platform",
  "Number",
  "Legal",
  "Tokenized BTC",
  "Zilliqa Ecosystem",
  "Metaverse",
  "TokenSets",
  "Reddit Points",
  "Tokenized Gold",
  "Liquid Staking Tokens",
  "Algorand Ecosystem",
  "Polkadot Ecosystem",
  "Privacy Coins",
  "SocialFi",
  "Move To Earn",
  "Centralized Exchange (CEX)",
  "Axie Infinity",
  "Internet of Things (IOT)",
  "OEC Ecosystem",
  "Storage",
  "Terra Ecosystem",
  "All",
  "Kommunitas Launchpad",
  "Polygon Ecosystem",
  "DaoMaker Ecosystem",
  "Ohm Fork",
  "IoTeX Ecosystem",
  "Prediction Markets",
  "Marketing",
  "Business Services",
  "Gotchiverse",
  "Binance Launchpool",
  "Structured Products",
  "MEV Protection",
  "Retail",
  "Moonriver Ecosystem",
  "Guild and Scholarship",
  "Liquid Staking Governance Tokens",
  "Sports",
  "Meme",
  "Optimism Ecosystem",
  "Cronos Ecosystem",
  "Real World Assets (RWA)",
  "Aave Tokens",
  "Impossible Launchpad",
  "Music",
  "Yearn Ecosystem",
  "Augmented Reality",
  "Near Protocol Ecosystem",
  "Wrapped-Tokens",
];

export const getButtonTitle = () => {
  const buttonsTitle = [
    {
      title: "Top 100",
    },
    {
      title: "My assets",
      requiresLogin: true,
    },
    {
      title: "Ethereum",
      symbol: "ETH",
      logo: "/logo/ethereum.png",
    },
    {
      title: "BNB Smart Chain (BEP20)",
      symbol: "BNB",
      logo: "/logo/bcw.png",
    },
    {
      title: "Avalanche C-Chain",
      symbol: "AVAX",
      logo: "/logo/avalanche.png",
    },
    {
      title: "Polygon",
      symbol: "MATIC",
      logo: "/logo/polygon.png",
    },
    {
      title: "Cronos",
      symbol: "CRO",
      logo: "/logo/cronos.png",
    },
    {
      title: "Arbitrum",
      logo: "/logo/arbitrum.png",
      symbol: "ARB",
    },
  ];

  return buttonsTitle;
};

export const useHeaderThreeBoxContent = () => {
  const { portfolioUrl } = useUrl();
  const recommandations = [
    // {
    //   title: "Learn & Earn",
    //   subtitle: "Start earning now",
    //   url: "/earn",
    //   id: "home-3section-coin",
    //   logo: "/mobula/mobulaCoin.svg",
    // },
    {
      title: "Swap",
      subtitle: "Purchase crypto easily",
      url: "/swap",
      id: "home-3section-buysell",
      icon: VscArrowSwap,
    },
    {
      title: "Trade",
      subtitle: "Best price & live chart",
      url: "/trade",
      id: "home-3section-trade",
      icon: BiCandles,
    },
    {
      title: "Portfolio",
      subtitle: "Track your wallets",
      url: portfolioUrl,
      icon: BsWallet2,
      id: "home-3section-portfolio",
    },
  ];
  return recommandations;
};

export const colors = [
  "#FF8C00",
  "#E82553",
  "#4007CB",
  "#FFFFFF",
  "#C764F5",
  "#F0B90B",
  "#3CC8C8",
  "#83BD67",
  "#9E1F63",
  "#5C7DF9",
  "#FC4E12",
  "#FFE0AB",
  "#1EA5FC",
  "#8962F8",
  "#578887",
  "#D8C9AF",
];

export const displays = [
  {
    title: "Price",
    name: "price",
    icon: <PriceIcon />,
    filters: ["Price USD", "Price ETH", "Price BTC"],
  },
  {
    title: "Market Cap",
    name: "market_cap",
    icon: <MarketCapIcon />,
    filters: [
      "Market Cap",
      "Full. Dil. Valuation",
      "Circ. Supply",
      "Liquidity",
    ],
  },
  {
    title: "% Change",
    name: "change",
    icon: <ChangeIcon />,
    filters: ["1h %", "24h %", "7d %", "1m %", "3m %", "6m %", "1y %"],
  },
  {
    title: "Volume",
    name: "volume",
    icon: <VolumeIcon />,
    filters: ["24h Volume"],
    // , "7d Volume", "1m Volume"
  },

  {
    title: "Charts",
    name: "chart",
    icon: <ChartIcon />,
    filters: [
      "24h Chart",
      // "7d Chart",
      // "1m Chart",
      // "3m Chart",
      // "6m Chart",
      // "1y Chart",
    ],
  },
];

export const filters = [
  {
    title: "Blockchains",
    name: "blockchains",
    icon: <PriceIcon />,
  },
  {
    title: "Price ",
    name: "price",
    icon: <ChangeIcon />,
  },
  {
    title: "Price Change",
    name: "price_change",
    icon: <ChangeIcon />,
  },
  {
    title: "Market Cap",
    name: "market_cap",
    icon: <MarketCapIcon />,
  },
  {
    title: "Volume",
    name: "volume",
    icon: <VolumeIcon />,
  },
  {
    title: "Liquidity",
    name: "liquidity",
    icon: <VolumeIcon />,
  },
  {
    title: "Categories",
    name: "categories",
    icon: <VolumeIcon />,
  },
];

export const getComponentFromFilter = (type: string, state, setState) => {
  if (type === "Market Cap")
    return <FiltersRange state={state} setState={setState} />;
  return null;
};

export const defaultTop100 = {
  color: "grey",
  name: "All",
  is_favorite: false,
  is_top_100: true,
  display: [
    { type: "price", value: "Price USD" },
    { type: "change", value: "24h %" },
    { type: "market_cap", value: "Market Cap" },
    { type: "volume", value: "24h Volume" },
    { type: "chart", value: "24h Chart" },
  ],
  filters: {
    blockchains: Object.keys(blockchainsContent),
    rank: { from: 0, to: maxValue },
    price: { from: 0, to: maxValue },
    price_change: { from: 0, to: maxValue },
    market_cap: { from: 0, to: maxValue },
    volume: { from: 0, to: maxValue },
    liquidity: { from: 0, to: maxValue },
    categories: [...defaultCategories],
  },
};

export const defaultFilter = [
  {
    action: "or",
    value: [
      'volume.gte.100000,off_chain_volume.gte.100000,contracts.eq."{}",liquidity_market_cap_ratio.gte.0.01,coin.eq.true',
    ],
  },
];

export const formatName = (str: string) => {
  if (!str) return "";
  const arr = str.split("");
  arr[0] = arr[0].toUpperCase();
  const result: string[] = [];
  for (let i = 0; i < arr.length; i += 1) {
    if (arr[i - 1] === "_") result.push(arr[i].toUpperCase());
    else if (arr[i] === "_") result.push(" ");
    else result.push(arr[i]);
  }
  return result.join("");
};

export const getDiscoverInfos = (isDark: boolean) => {
  const infos = [
    {
      title: "Discover & Learn",
      subtitle: "Learn & Earn",
      description:
        "Learn about the latest trends in the crypto market and discover the best projects.",
      url: "/learn",
      image: isDark
        ? "/asset/discover-learn.png"
        : "/asset/discover-learn-light.png",
    },
    {
      title: "Discover the earn page",
      subtitle: "Earn",
      description:
        "Earn crypto while learning about crypto. Discover the best projects and earn crypto rewards.",
      url: "/earn",
      image: isDark
        ? "/asset/discover-earn.png"
        : "/asset/discover-earn-light.png",
    },
    {
      title: "Referral Program",
      subtitle: "Referral",
      description:
        "Earn crypto while learning about crypto. Discover the best projects and earn crypto rewards.",
      image: isDark
        ? "/asset/discover-referral.png"
        : "/asset/discover-referral-light.png",
    },
  ];
  return infos;
};

export const steps: IViewStep[] = [
  {
    nbr: 1,
    title: "Change displays",
    subtitle:
      "You can select which data you want to see in the table. You can also change the order of the columns by dragging and dropping them.",
    top: "50px",
    right: "57%",
    transform: ["translateX(50%)", "translateX(30%)"],
    arrowPosition: "top",
    arrowTop: ["-25px", "-30px"],
    arrowLeft: ["75px", "75px"],
  },
  {
    nbr: 2,
    title: "Change filters",
    subtitle: "You can select the filters that you want to apply to your table",
    top: "50px",
    right: "50%",
    transform: ["translateX(50%)", "translateX(60%)"],
    arrowPosition: "top",
    arrowTop: ["-25px", "-30px"],
    arrowLeft: ["190px", "205px"],
  },
];

export const formatDataForFilters = (activeView, state) => {
  let activeViewStr = "";
  const newStr = [];
  const { blockchains } = activeView.filters;
  const defaultBlockchains = Object.keys(blockchainsContent);
  const { categories } = activeView.filters;

  activeViewStr += activeView?.id ? `(${activeView?.id})` : "";
  activeViewStr += `(${activeView?.color})`;
  activeViewStr += `(${activeView?.name})`;
  activeViewStr += `(${activeView?.is_favorite})`;

  Object.keys(activeView?.display).forEach((key) => {
    newStr.push(`${activeView?.display[key]?.value}`);
  });
  activeViewStr += `(display:${JSON.stringify(newStr)})`;

  Object.keys(activeView?.filters).forEach((key) => {
    if (key !== "blockchains" && key !== "categories") {
      const diffThanMin = activeView?.filters[key]?.from !== 0;
      const diffThanMax = activeView?.filters[key]?.to !== maxValue;
      if (diffThanMin || diffThanMax) {
        activeViewStr += `(${key}:${
          diffThanMin ? activeView?.filters[key]?.from : "_"
        }|${diffThanMax ? activeView?.filters[key]?.to : "_"})`;
      }
    }
    if (
      key === "blockchains" &&
      defaultBlockchains.length !== blockchains.length
    ) {
      const diffChains = [];
      const activeViewBlockchainsLength = blockchains.length;
      const blockchainsContentLength = defaultBlockchains.length;
      const diffLength = blockchainsContentLength - activeViewBlockchainsLength;

      if (activeViewBlockchainsLength > diffLength) {
        defaultBlockchains.forEach((chain) => {
          blockchains.forEach(() => {
            if (
              !blockchains.includes(chain) &&
              !diffChains.includes(defaultBlockchains.indexOf(chain))
            )
              diffChains.push(defaultBlockchains.indexOf(chain));
          });
        });
        activeViewStr += `(blockchains0:${JSON.stringify(diffChains)})`;
      } else {
        blockchains.forEach((blockchain) => {
          diffChains.push(defaultBlockchains.indexOf(blockchain));
        });
        activeViewStr += `(blockchains1:${JSON.stringify(diffChains)})`;
      }
    }
    if (
      key === "categories" &&
      activeView.filters.categories.length !== defaultCategories?.length
    ) {
      const activeViewCategorieLength = categories.length;
      const defaultCategorieLength = defaultCategories.length;
      const diffLength = defaultCategorieLength - activeViewCategorieLength;
      const diffCategories = [];

      if (activeViewCategorieLength > diffLength) {
        defaultCategories.forEach((categorie) => {
          categories.forEach(() => {
            if (
              !categories.includes(categorie) &&
              !diffCategories.includes(categorie)
            ) {
              diffCategories.push(defaultCategories.indexOf(categorie));
            }
          });
        });
        activeViewStr += `(categories0:${JSON.stringify(diffCategories)})`;
      } else {
        const newCategories = state?.filters?.categories?.map((categorie) =>
          defaultCategories.indexOf(categorie)
        );
        activeViewStr += `(categories1:${JSON.stringify(newCategories)})`;
      }
    }
  });
  return activeViewStr;
};
