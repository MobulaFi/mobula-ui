import { ContentType } from "./models";

export const getBuilderContents = () => {
  const contents: ContentType[] = [
    {
      title: "MOBULA BOT",
      subtitle: "Grow your community. Passively.",
      description:
        "Scale your crypto community: Mobula bot allows you to reward directly on-chain members of your group for their involvement (referral systems, activity leaderboars). And... much more.",
      url: "/bot",
      button_name: "Discover the Mobula Bot",
      image: "/landings/builder/1.png",
    },
    {
      title: "MOBULA WIDGETS",
      subtitle: "Get crypto data in any app.",
      description:
        "Integrate Mobula widgets: get a fully customizable multi-chain DEX, price feeds for any crypto token, and more, within 2 lines of code.",
      url: "/widget",
      button_name: "Discover the Widgets",
      image: "/landings/builder/2.png",
    },
    {
      title: "MOBULA PLUS",
      subtitle: "Get exposure among crypto lovers",
      description:
        "Make your project shine brighter: get promotion slots on the Earn page, on the Airdrop page, and more - in a fully transparent way.",
      url: "/plus",
      button_name: "Discover Mobula Plus ",
      image: "/landings/builder/3.png",
    },
  ];
  return contents;
};

export const getContributeContents = () => {
  const contents: ContentType[] = [
    {
      title: "MOBULA DISCORD",
      subtitle: "Get involved. Share and learn.",
      description:
        "Swap with Mobula community: thousands of crypto enthusiasts and builders sharing knowledge and insights about Mobula and the overall crypto market.",
      url: "https://discord.com/invite/2a8hqNzkzN",
      button_name: "Join the Mobula Discord",
      image: "/landings/contribute/discord.png",
    },
    {
      title: "GOVERNANCE DAO",
      subtitle: "Impact the future of Mobula.",
      description:
        "Decide what’s next for Mobula: submit proposals, or vote for existing ones, about Treasury management, Protocol tweaks - anything can be challenged and improved.",
      url: "/discover/governance",
      button_name: "Discover the Governance",
      image: "/landings/contribute/governance.png",
    },
    {
      title: "PROTOCOL DAO",
      subtitle: "Preserve & improve crypto data.",
      description:
        "Decide what’s listed on Mobula: Analyze the projects requesting for a listing, vote for or against the validation of their listing, attribute them a score from 0 to 5. ",
      url: "/discover/protocol",
      button_name: "Discover the Protocol ",
      image: "/landings/contribute/protocol.png",
    },
  ];
  return contents;
};

export const getPlusContents = () => {
  const contents: ContentType[] = [
    {
      title: "SIMPLE VISIBILITY ",
      subtitle: "Visibility to +150k crypto users.",
      description:
        "Get your project promoted through Mobula Missions, push notifications, backlinks from Mobula Bot, social media posts and more.",
      url: "https://t.me/DAVEBULA",
      // TODO: URL to the bot && image
      button_name: "Discover the different option",
      image: "/landings/mobulaplus/1.png",
    },
    {
      title: "CUSTOM CAMPAINS",
      subtitle: "Make the lasting impression.",
      description:
        "Mobula design custom campains to deliver value to our users while making the best impression for your project. Gamified quests to onboard users to your project, and more.",
      url: "https://t.me/DAVEBULA",
      // TODO: URL to the bot && image
      button_name: "Get in touch with us",
      image: "/landings/mobulaplus/2.png",
    },
    {
      title: "ON-CHAIN INCENTIVES",
      subtitle: "Make some blockchain noise.",
      description:
        "Increase buy incentives from your token on Mobula, reward your token through the Mobula Bot, airdrop it to MOBL most committed stakers, and more.",
      // TODO: URL to the bot && image
      url: "https://t.me/DAVEBULA",
      button_name: "Let’s start",
      image: "/landings/mobulaplus/3.png",
    },
  ];
  return contents;
};

export const getMarketDataAPIContents = () => {
  const contents: ContentType[] = [
    {
      title: "+30,000 ASSETS SUPPORTED",
      subtitle: "The largest crypto collection.",
      description:
        "Get access to the largest crypto collection ever created. +30,000 crypto-assets updated live, from all the ecosystems. ",
      url: "https://developer.mobula.fi/reference/market-api",
      // TODO: URL to the bot && image
      button_name: "Learn to query them",
      image: "/landings/market/1.png",
    },
    {
      title: "ON-CHAIN ONLY",
      subtitle: "No CEX parties. No trust issues.",
      description:
        "Mobula only uses market data from on-chain sources, verified by the community. This means no market manipulation, no volume washing, no trust issues.",
      url: "https://developer.mobula.fi/reference/market-api",
      // TODO: URL to the bot && image
      button_name: "Get more information",
      image: "/landings/market/2.png",
    },
    {
      title: "MULTI-CHAIN & MULTI-PROTOCOL",
      subtitle: "Aggregating all chains & protocols.",
      description:
        "Get a complete view on an asset: trades on Ethereum & BNB Chain, Uniswap V3, but also Uniswap V2 or PancakeSwap.",
      // TODO: URL to the bot && image
      url: "https://developer.mobula.fi/reference/market-api",
      button_name: "Discover the docs",
      image: "/landings/market/3.png",
    },
  ];
  return contents;
};

export const getMetaDexContents = () => {
  const contents: ContentType[] = [
    {
      title: "+15 AGGREGATORS, AGGREGATED",
      subtitle: "The largest meta-aggregator",
      description:
        "Get the best price from 15 different aggregators, including 1inch, matcha, paraswap, cowswap...",
      url: "https://developer.mobula.fi/reference/meta-dex-aggregator",
      // TODO: URL to the bot && image
      button_name: "Learn to query routes",
      image: "/landings/metadex/1.png",
    },
    {
      title: "+1,300,000 ASSETS ",
      subtitle: "Any asset, deepest liquidity.",
      description:
        "Aggregating thousands of liquidity sources, matching with the one that fits you the best.",
      url: "https://developer.mobula.fi/reference/meta-dex-aggregator",
      // TODO: URL to the bot && image
      button_name: "Get more information",
      image: "/landings/metadex/2.png",
    },
    {
      title: "+25 BLOCKCHAINS",
      subtitle: "Largest blockchain coverage.",
      description:
        "Supporting most of the DeFi chains for efficient trading. Ethereum, BNB Chain, Avalanche, and more.",
      // TODO: URL to the bot && image
      url: "https://developer.mobula.fi/reference/meta-dex-aggregator",
      button_name: "Discover the docs",
      image: "/landings/metadex/3.png",
    },
  ];
  return contents;
};

export const getApisContent = () => {
  const contents: ContentType[] = [
    {
      title: "360 COVERAGE. INSTANT UPDATES.",
      subtitle: "Market Data API",
      description:
        "Get price, volume, market cap, liquidity, trades and +10 other metrics for 1.3M assets - including historical timeframes.",
      url: "/market-api",
      // TODO: URL to the bot && image
      button_name: "Discover Market Data API",
      image: "/landings/apis/1.png",
    },
    {
      title: "30,000 ASSETS LOGOS, WEBSITES.",
      subtitle: "Meta-Data API",
      description:
        "Find the details of the transactions of each crypto held by a wallet. Get full all-time visibility of any wallet's positions and transactions.",
      url: "/metadata-api",
      // TODO: URL to the bot && image
      button_name: "Discover Meta Data API",
      image: "/landings/apis/2.png",
    },
    {
      title: "PORTFOLIO, TRANSACTIONS, BALANCES.",
      subtitle: "Wallet Explorer API",
      description:
        "Multi-chain & historical view of any metric related to wallets: portfolios, ROI, transactions, balances, etc.",
      // TODO: URL to the bot && image
      url: "/explorer-api",
      button_name: "Discover Wallet Explorer API",
      image: "/landings/apis/3.png",
    },
    {
      title: "BEST PRICE. BEST COVERAGE",
      subtitle: "Meta DEX Aggregator API",
      description:
        "Any crypto exchange routes based on +17 DEX Aggregators fetched. +25 supported blockchains to return the best quote for your transaction.",
      // TODO: URL to the bot && image
      url: "/metadex-aggregator",
      button_name: "Discover Meta-DEX Aggregator  APIs",
      image: "/landings/apis/4.png",
    },
  ];
  return contents;
};

export const getWalletExplorerAPIContents = () => {
  const contents: ContentType[] = [
    {
      title: "ALL TIME HISTORY",
      subtitle: "Any wallet, at any moment.",
      description:
        "Access the historical balance of any wallet in real time. Track the complete balance of all EVM-compatible assets.",
      url: "https://developer.mobula.fi/reference/wallet-explorer-api",
      // TODO: URL to the bot && image
      button_name: "Learn to query balance",
      image: "/landings/explorer/1.png",
    },
    {
      title: "HISTORICAL TRANSACTIONS",
      subtitle: "All crypto transactions.",
      description:
        "Find the details of the transactions of each crypto held by a wallet. Get full all-time visibility of any wallet's positions and transactions.",
      url: "https://developer.mobula.fi/reference/wallet-explorer-api",
      // TODO: URL to the bot && image
      button_name: "Get more information",
      image: "/landings/explorer/2.png",
    },
    {
      title: "+10 SUPPORTED CHAIN",
      subtitle: "All EVM-compatible chains.",
      description:
        "Visualize the entire contents of a wallet across more +10 blockchain networks (EVM compatible) with complete data.",
      // TODO: URL to the bot && image
      url: "https://developer.mobula.fi/reference/wallet-explorer-api",
      button_name: "Discover the docs",
      image: "/landings/explorer/3.png",
    },
  ];
  return contents;
};

export const getMetaDataAPIContents = () => {
  const contents: ContentType[] = [
    {
      title: "+30,000 ASSETS SUPPORTED",
      subtitle: "The largest crypto collection.",
      description:
        "Get access to the largest crypto collection ever created. +30,000 crypto-assets updated live, from all the ecosystems. ",
      url: "https://developer.mobula.fi/reference/metadata-api",
      // TODO: URL to the bot && image
      button_name: "Learn to query them",
      image: "/landings/metadata/1.png",
    },
    {
      title: "SMART-CONTRACT ACCESS",
      subtitle: "Access data directly on-chain.",
      description:
        "Mobula static API is hosted on-chain, which means it can be queried from a smart-contract or any dApp, with no centralization issues.",
      url: "https://developer.mobula.fi/reference/metadata-api",
      // TODO: URL to the bot && image
      button_name: "Get more information",
      image: "/landings/metadata/2.png",
    },
    {
      title: "TRUSTLESS & DECENTRALIZED",
      subtitle: "Verified by the DAO, forever.",
      description:
        "Mobula Static data is verified by Mobula DAO, and hosted on the IPFS, which means no down time, and you’re always sure you’re getting what you asked for.",
      // TODO: URL to the bot && image
      url: "https://developer.mobula.fi/reference/metadata-api",
      button_name: "Discover the docs",
      image: "/landings/metadata/3.png",
    },
  ];
  return contents;
};

export const getContentsTable = () => {
  const contentsTable = [
    [
      "check",
      "check",
      "Safe",
      "check",
      "Free",
      "check",
      "check",
      "check",
      "check",
      "check",
    ],
    [
      "check",
      "check",
      "Poor UX",
      "error",
      "error",
      "error",
      "error",
      "error",
      "error",
      "error",
    ],
    [
      "error",
      "error",
      "error",
      "check",
      "$250",
      "error",
      "error",
      "error",
      "error",
      "error",
    ],
  ];
  return contentsTable;
};

export const getBotContents = () => {
  const contents: ContentType[] = [
    {
      title: "ON-CHAIN INCENTIVES",
      subtitle: " Incentivize your community.",
      description:
        "Your first members will be encouraged to invite new members to earn on-chain rewards. Members will be pushed to engage with an auto-reward engagement leaderboard system. Send personalized notifications to your members based on their activity in the group, or external announcement.",
      url: "https://t.me/MobulaBot",
      // TODO: URL to the bot && image
      button_name: "Configure Incentives",
      image: "/landings/mobulabot/1.png",
    },
    {
      title: "MULTI-CHAIN PRICE FEEDS",
      subtitle: "Read the crypto market.",
      description:
        "Give your community the ability to get multi-chain data on the cryptocurrencies of their choice. Your group members will be able to analyze price, volume, liquidity or rank charts of a majority of the crypto-currencies on the market, without leaving your group.",
      url: "https://t.me/MobulaBot",
      // TODO: URL to the bot && image
      button_name: "Create your data feed",
      image: "/landings/mobulabot/2.png",
    },
    {
      title: "BUY NOTIFICATIONS",
      subtitle: "Generate the FOMO.",
      description:
        "Nothing gets a community more excited than buying pressure and green candles. The Mobula Bot allows the entire community to participate in the excitement and watch the buying execute in real time.",
      // TODO: URL to the bot && image
      url: "https://t.me/LamborghiniBuyBot",
      button_name: "Configure Buying Presure",
      image: "/landings/mobulabot/3.png",
    },
    {
      title: "AUTOMATED MODERATION",
      subtitle: "Turn your group in auto-pilot.",
      description:
        " Whether it's anti-bot systems, group portals or automated help messages, don't bother doing everything manually. The Mobula bot allows you to manage 100% of the moderation of your group.",
      // TODO: URL to the bot && image
      url: "https://t.me/MobulaBot",
      button_name: "Setup the auto-pilot",
      image: "/landings/mobulabot/4.png",
    },
  ];
  return contents;
};
