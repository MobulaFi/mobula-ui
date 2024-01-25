import React from "react";
import { BsCpuFill } from "react-icons/bs";
import { CgDatabase } from "react-icons/cg";
import { IoMdWifi } from "react-icons/io";

export const gridBoxContent = [
  {
    title: "99% Coverage",
    image: "/landing/icon-coverage.svg",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic sed rerum dicta non voluptatum ipsa sequi,",
  },
  {
    title: "+2,3M Assets",
    image: "/landing/icon-asset.svg",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic sed rerum dicta non voluptatum ipsa sequi,",
  },
  {
    title: "+150 Blockchains",
    image: "/landing/icon-chains.png",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic sed rerum dicta non voluptatum ipsa sequi,",
  },
  {
    title: "50% Cheaper",
    image: "/landing/icon-cheaper.png",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic sed rerum dicta non voluptatum ipsa sequi,",
  },
  {
    title: "API Dashboard",
    image: "/landing/icon-dashboard.svg",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic sed rerum dicta non voluptatum ipsa sequi,",
  },
  {
    title: "Custom Endpoints",
    image: "/landing/icon-endpoint.svg",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic sed rerum dicta non voluptatum ipsa sequi,",
  },
];

export const questions = [
  {
    title: "What is Mobula?",
    description:
      "Mobula is a decentralized data marketplace that allows users to sell their data to companies in exchange for cryptocurrency.",
  },
  {
    title: "How to use Mobula?",
    description:
      "Mobula is a decentralized data marketplace that allows users to sell their data to companies in exchange for cryptocurrency.",
  },
  {
    title: "What is the purpose of $MOBL token?",
    description:
      "Mobula is a decentralized data marketplace that allows users to sell their data to companies in exchange for cryptocurrency.",
  },
  {
    title: "Can Mobula API be integrated into existing software systems?",
    description:
      "Mobula is a decentralized data marketplace that allows users to sell their data to companies in exchange for cryptocurrency.",
  },
];

export const curatedDatasets = [
  {
    title: "Wallet Data",
    subtitle: "Portfolio Data",
    image: "/landing/curated-datasets/walletdata.svg",
    headline: "Multi-chain explorer, enriched with market data.",
    contents: [
      {
        title: "Queryable with SQL & REST",
        icon: (
          <CgDatabase className="text-2xl dark:text-dark-font-100  text-dark-font-100" />
        ),
        description:
          "Run complex SQL queries such as All wallets with USD balance > $1M or All wallets with > 100 transactions in the last 24h, as well as REST queries such as Get the balance of this wallet at this block.",
      },
      {
        title: "Market metrics out-of-the-box",
        icon: (
          <IoMdWifi className="text-2xl dark:text-dark-font-100  text-dark-font-100" />
        ),
        description:
          "Out-of-the-box market data enrichment such as USD pricing for balances, historical balances, transactions, as well as PnL calculations, average bought price, etc.",
      },
      {
        title: "Block data & events",
        icon: (
          <BsCpuFill className="text-2xl dark:text-dark-font-100 text-dark-font-100" />
        ),
        description:
          "Wallet Explorer tracks all blocks & events of all blockchains, including trace, logs, etc. - and parsed materialized views on top of it.",
      },
      {
        title: "+30 Blockchains covered",
        icon: (
          <BsCpuFill className="text-2xl dark:text-dark-font-100 text-dark-font-100" />
        ),
        description:
          "Wallet Explorer tracks all wallets of +30 EVM blockchains, and we are constantly adding new ones - we’re merging all chains data into a single unified API for transactions, balances, etc.",
      },
    ],
    id: 1,
  },
  {
    title: "Octopus",
    subtitle: "Market Data",
    image: "/landing/curated-datasets/octopus.svg",
    headline: "The most advanced pricing engine",
    description:
      "Octopus is the most advanced pricing engine in the industry, offering the largest coverage, the highest accuracy, the lowest latency, and the most cost-efficient pricing.",
    contents: [
      {
        title: "Industry-leading Coverage",
        icon: (
          <CgDatabase className="text-2xl dark:text-dark-font-100  text-dark-font-100" />
        ),
        description:
          "Octopus tracks all assets from Monero to the latest token listed on any DEX, offering both pair rates and aggregated prices.",
      },
      {
        title: "Highly Accurate",
        icon: (
          <IoMdWifi className="text-2xl dark:text-dark-font-100  text-dark-font-100" />
        ),
        description:
          "Octopus engine combines VWAG & LWAG to provide the most accurate prices - even for low-cap altcoins / deadcoins.",
      },
      {
        title: "Built for real-time",
        icon: (
          <BsCpuFill className="text-2xl dark:text-dark-font-100 text-dark-font-100" />
        ),
        description:
          "Octopus engine updates prices every 5s, with no cache (even for free versions!) and covers WSS & database streams.",
      },
      {
        title: "Cost-efficient, pay-as-you-go",
        icon: (
          <BsCpuFill className="text-2xl dark:text-dark-font-100 text-dark-font-100" />
        ),
        description:
          "With the most generous free tier in the industry, many companies saved thousands of dollars by switching to Mobula.",
      },
    ],
    id: 2,
  },
  {
    title: "Metacore",
    subtitle: "Metadata",
    image: "/landing/curated-datasets/metacore.svg",
    headline: "Curated off-chain data",
    description:
      "Metacore curates off-chain data such as logos, website, socials, etc. - as well as multi-chain assets (i.e. the matching Ethereum contract of a Polygon token).",
    contents: [
      {
        title: "Cross-checked",
        icon: (
          <IoMdWifi className="text-2xl dark:text-dark-font-100  text-dark-font-100" />
        ),
        description:
          "Metacore data is cross-checked with multiple sources, matching multiple coin listing services as well as on-chain curation through reputation systems.",
      },
      {
        title: "Updated in real-time",
        icon: (
          <BsCpuFill className="text-2xl dark:text-dark-font-100 text-dark-font-100" />
        ),
        description:
          "Metacore updates the dataset on an hourly basis, looking for changes in logos, websites, socials, etc. and adding new assets.",
      },
      {
        title: "Explorable",
        icon: (
          <BsCpuFill className="text-2xl dark:text-dark-font-100 text-dark-font-100" />
        ),
        description:
          "Metacore can be explored via UI through Mobula’s App & via REST & SQL interfaces - search first letters of a token name, get the matching assets, etc.",
      },
      {
        title: "The largest curated metadata set",
        icon: (
          <CgDatabase className="text-2xl dark:text-dark-font-100  text-dark-font-100" />
        ),
        description:
          "Metacore lists +30,000 tokens, combining & harmonizing CoinGecko, CoinMarketCap, Trust Wallet & DEXTools datasets, as well as Mobula’s own on-chain curation system, with tens of assets added every day. ",
      },
    ],
    id: 3,
  },
];

export const legacyStacks = [
  {
    title: "Coingecko",
    description: "From",
    image: "/landing/legacy/cg.png",
    content: {
      description:
        "Migrate to cover +2.3M tokens (and any new token as soon as they're traded), faster price updates, pair-level data, higher historical granularity, more flexible queries (no need coingecko ID!) and more accurate prices on low-cap assets",
      image: "/landing/legacy/cg.png",
      values: [
        { name: "Average spending cut", value: "-33.3%" },
        { name: "Assets covered", value: "+19,071%" },
        {
          name: "Extra data points",
          value: "12 endpoints & SQL-enabled queries",
        },
      ],
    },

    id: 1,
  },
  {
    title: "CoinMarketCap",
    description: "From",
    image: "/landing/legacy/cmc.png",
    content: {
      description:
        "Migrate to cover +2.3M tokens (and any new token as soon as they're traded), faster price updates, pair-level data, higher historical granularity, more flexible queries (no need coingecko ID!) and more accurate prices on low-cap assets",
      image: "/landing/legacy/cmc.png",
      values: [
        { name: "Average Spending Cut", value: "-45%" },
        { name: "Assets Covered", value: "+12,310%" },
        {
          name: "Extra data points",
          value: "8 endpoints & SQL-enabled queries",
        },
      ],
    },

    id: 2,
  },
  {
    title: "Covalent",
    description: "From",
    image: "/landing/legacy/covalent.png",
    content: {
      description:
        "Migrate from Covalent to Mobula API for market-data enriched wallet data, more chains, complex SQL queries, and single-endpoint multi-chain results. ",
      image: "/landing/legacy/covalent.png",
      values: [
        { name: "Average spending cut", value: "-5%" },
        { name: "Chains covered", value: "+12" },
        { name: "Time to get USD net worth of a wallet", value: "-85.2%" },
      ],
    },
    id: 3,
  },
  {
    title: "The Graph",
    description: "From",
    image: "/landing/legacy/grt.png",
    content: {
      description:
        "Host your indexer in your own codebase - deploy it to our cloud, or let us livestream the data to your database. Consume curated datasets in your subgraphs. ",
      title: "Coingecko",
      image: "/landing/legacy/grt.png",
      percentage: 83,
      values: [
        { name: "Infra uptime", value: "+99.99%" },
        { name: "Eng. hours saved on avg.", value: "250-300 hours" },
        { name: "Curated datasets to consume", value: "+10" },
      ],
    },
    id: 4,
  },
];

export const tryItOutContent = [
  {
    image: "/landing/try-it-out/wallet-data.png",
    title: "Wallet Data",
    description: "Fetch USD net worth of vitalik.eth, on +30 blockchains!",
  },
  {
    image: "/landing/try-it-out/octopus.png",
    title: "Octopus",
    description:
      "Downloading historical prices of ETH on 5min candles, last 5 years!",
  },
  {
    image: "/landing/try-it-out/meta-core.png",
    title: "Metacore",
    description: "Query last 5 assets added to the dataset!",
  },
];
