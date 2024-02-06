import { User } from "mobula-utils/lib/user/model";
import { Token } from "./models";

export const allPages = [
  {
    requests: ["top100", "top 100", "main", "home"],
    name: "Home Page",
    url: "/home",
  },
  {
    requests: ["portfolio", "wallet", "my portfolio"],
    name: "Portfolio Page",
    url: "/portfolio",
  },
  {
    requests: ["watchlist", "my watchlist"],
    name: "Watchlist Page",
    url: "/watchlist",
  },
  {
    requests: [
      "recently added",
      "new",
      "new assets",
      "new listing",
      "recently listed",
    ],
    name: "Recently added Page",
    url: "/new",
  },
  {
    requests: [
      "movers",
      "gainers",
      "losers",
      "gainers losers",
      "crypto gainers",
      "crypto losers",
    ],
    name: "Gainers & Losers Page",
    url: "/movers",
  },
  {
    requests: ["trendings", "trend", "top"],
    name: "Trending Page",
    url: "/trendings",
  },
  {
    requests: ["buy", "sell", "swap", "buy & sell", "buy sell"],
    name: "Swap Page",
    url: "/swap",
  },
  {
    requests: ["contribute", "join", "join dao", "dao", "dao contribute"],
    name: "Contribute Page",
    url: "/contribute",
  },
  {
    requests: ["docs", "mobula", "mobula docs", "about", "roadmap"],
    name: "Mobula Docs Page",
    url: "https://docs.mobula.fi/",
  },
  {
    requests: ["protocol", "dao protocol", "listing", "vote"],
    name: "DAO Protocol Page",
    url: "/dao/protocol/overview",
  },
  {
    requests: ["listing", "list", "add", "add asset", "new", "form"],
    name: "Listing Page",
    url: "/list",
  },
  {
    requests: [
      "mobula api",
      "api",
      "developper",
      "dev",
      "tools",
      "mobula tools",
    ],
    name: "Mobula API Page",
    url: "https://developer.mobula.fi/reference/getting-started",
  },
  {
    requests: [
      "mobula bot",
      "bot",
      "developper",
      "dev",
      "tools",
      "mobula tools",
    ],
    name: "Mobula Bot Page",
    url: "/bot",
  },
  {
    requests: [
      "mobula builder",
      "builder",
      "build",
      "developper",
      "dev",
      "tools",
      "mobula tools",
    ],
    name: "Mobula Builder Page",
    url: "/builder",
  },
  {
    requests: [
      "mobula builder",
      "builder",
      "build",
      "developper",
      "dev",
      "tools",
      "mobula tools",
    ],
    name: "Mobula Builder Page",
    url: "/builder",
  },
];

export const defaultUsers: Partial<User>[] = [
  {
    username: "ParaFi Capital",
    address: "0xE7dBE6aa7Edcc38CB5007B87153d236AD879309B",
    profile_pic:
      "https://images.crunchbase.com/image/upload/c_lpad,h_256,w_256,f_auto,q_auto:eco,dpr_1/w6bpzisljtowlathh51t",
  },
];

export const defaultResults: Token[] = [
  {
    logo: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png?1547033579",
    market_cap: 552240252824,
    name: "Bitcoin",
    price: 28317.144946812423,
    price_change_24h: 4.152757,
    rank: 1,
    symbol: "BTC",
    isTemplate: true,
    id: 1,
  },
  {
    logo: "https://assets.coingecko.com/coins/images/279/large/ethereum.png?1595348880",
    market_cap: 206536450427,
    name: "Ethereum",
    price: 1717.7001406829168,
    price_change_24h: 1.5378242,
    rank: 2,
    symbol: "ETH",
    isTemplate: true,
    id: 2,
  },
  {
    logo: "https://assets.coingecko.com/coins/images/325/large/Tether-logo.png?1598003707",
    market_cap: 83355463901,
    name: "Tether",
    price: 1.0011820732513341,
    price_change_24h: 0.074292116,
    rank: 3,
    symbol: "USDT",
    isTemplate: true,
    id: 3,
  },
  {
    logo: "https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png?1644979850",
    market_cap: 33533424969,
    name: "BNB",
    price: 217.95310079728722,
    price_change_24h: 0.32779709,
    rank: 4,
    symbol: "BNB",
    isTemplate: true,
    id: 4,
  },
  {
    logo: "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png?1605778731",
    market_cap: 27755465452,
    name: "XRP",
    price: 0.5206196697458081,
    price_change_24h: 0.28789002,
    rank: 5,
    symbol: "XRP",
    isTemplate: true,
    id: 5,
  },
];
