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
    description: "Portfolio Data",
    image: "/landing/curated-datasets/walletdata.svg",
    contents: [
      {
        title: "Livestreamed",
        icon: (
          <CgDatabase className="text-2xl dark:text-dark-font-100  text-dark-font-100" />
        ),
        description:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic sed rerum dicta non voluptatum ipsa sequi,",
      },
      {
        title: "WSS Feed Friendly",
        icon: (
          <IoMdWifi className="text-2xl dark:text-dark-font-100  text-dark-font-100" />
        ),
        description:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic sed rerum dicta non voluptatum ipsa sequi,",
      },
      {
        title: "Ultra-low latency",
        icon: (
          <BsCpuFill className="text-2xl dark:text-dark-font-100 text-dark-font-100" />
        ),
        description:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic sed rerum dicta non voluptatum ipsa sequi,",
      },
    ],
    id: 1,
  },
  {
    title: "Octopus",
    description: "Market Data",
    image: "/landing/curated-datasets/octopus.svg",
    contents: [
      {
        title: "Livestreamed",
        icon: (
          <CgDatabase className="text-2xl dark:text-dark-font-100  text-dark-font-100" />
        ),
        description:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic sed rerum dicta non voluptatum ipsa sequi,",
      },
      {
        title: "WSS Feed Friendly",
        icon: (
          <IoMdWifi className="text-2xl dark:text-dark-font-100  text-dark-font-100" />
        ),
        description:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic sed rerum dicta non voluptatum ipsa sequi,",
      },
      {
        title: "Ultra-low latency",
        icon: (
          <BsCpuFill className="text-2xl dark:text-dark-font-100 text-dark-font-100" />
        ),
        description:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic sed rerum dicta non voluptatum ipsa sequi,",
      },
    ],
    id: 2,
  },
  {
    title: "Meta Core",
    description: "Social Data",
    image: "/landing/curated-datasets/metacore.svg",
    contents: [
      {
        title: "Livestreamed",
        icon: (
          <CgDatabase className="text-2xl dark:text-dark-font-100  text-dark-font-100" />
        ),
        description:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic sed rerum dicta non voluptatum ipsa sequi,",
      },
      {
        title: "WSS Feed Friendly",
        icon: (
          <IoMdWifi className="text-2xl dark:text-dark-font-100  text-dark-font-100" />
        ),
        description:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic sed rerum dicta non voluptatum ipsa sequi,",
      },
      {
        title: "Ultra-low latency",
        icon: (
          <BsCpuFill className="text-2xl dark:text-dark-font-100 text-dark-font-100" />
        ),
        description:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic sed rerum dicta non voluptatum ipsa sequi,",
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
        "Migrate from Covalent to Mobula API for a more cost-efficient, reliable & complete pricing solution",
      title: "Coingecko",
      image: "/landing/legacy/cg.png",
      percentage: 83,
      values: [
        { name: "Average Spending Cut", value: 83 },
        { name: "Assets Covered", value: -234 },
        { name: "Add something", value: 83 },
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
        "Migrate from Covalent to Mobula API for a more cost-efficient, reliable & complete pricing solution",
      title: "Coingecko",
      image: "/landing/legacy/cmc.png",
      percentage: 83,
      values: [
        { name: "Average Spending Cut", value: 83 },
        { name: "Assets Covered", value: -234 },
        { name: "Add something", value: 83 },
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
        "Migrate from Covalent to Mobula API for a more cost-efficient, reliable & complete pricing solution",
      title: "Coingecko",
      image: "/landing/legacy/covalent.png",
      percentage: 83,
      values: [
        { name: "Average Spending Cut", value: 83 },
        { name: "Assets Covered", value: -234 },
        { name: "Add something", value: 83 },
      ],
    },
    id: 3,
  },
  {
    title: "TheGraph",
    description: "From",
    image: "/landing/legacy/grt.png",
    content: {
      description:
        "Migrate from Covalent to Mobula API for a more cost-efficient, reliable & complete pricing solution",
      title: "Coingecko",
      image: "/landing/legacy/grt.png",
      percentage: 83,
      values: [
        { name: "Average Spending Cut", value: 83 },
        { name: "Assets Covered", value: -234 },
        { name: "Add something", value: 83 },
      ],
    },
    id: 4,
  },
  {
    title: "BitQuery",
    description: "From",
    image: "/landing/legacy/bitquery.png",
    contents: {
      title: "Coingecko",
      image: "/landing/legacy/bitquery.png",
      percentage: 83,
      values: [
        { name: "Average Spending Cut", value: 83 },
        { name: "Assets Covered", value: -234 },
        { name: "Add something", value: 83 },
      ],
    },
    id: 5,
  },
];

export const tryItOutContent = [
  {
    image: "/landing/try-it-out/wallet-data.png",
    title: "Wallet Data",
    description:
      "A good design is not only aesthetically pleasing, but also functional. It should be able to",
  },
  {
    image: "/landing/try-it-out/octopus.png",
    title: "Octopus",
    description:
      "A good design is not only aesthetically pleasing, but also functional. It should be able to",
  },
  {
    image: "/landing/try-it-out/meta-core.png",
    title: "Meta Core",
    description:
      "A good design is not only aesthetically pleasing, but also functional. It should be able to",
  },
];
