import { BiCandles } from "react-icons/bi";
import { FiHelpCircle } from "react-icons/fi";
import { HiOutlineNewspaper } from "react-icons/hi";
import { MdOutlineRocketLaunch } from "react-icons/md";
import { TbCoins } from "react-icons/tb";
import { VscArrowSwap } from "react-icons/vsc";

import React from "react";
import {
  ContributeIcon,
  DocsIcon,
  GovernanceIcon,
  ListIcon,
  MoversIcon,
  ProtocolIcon,
  RecentlyAddedIcon,
  TrendingIcon,
} from "./components/icons";

export const navigation = [
  {
    name: "Cryptocurrencies",
    extends: [
      {
        name: "Recently added",
        url: "/new",
        icon: (
          <RecentlyAddedIcon className="text-light-font-100 dark:text-dark-font-100 text-[21px]" />
        ),
        description: "Discover the newest tokens on the market.",
      },
      {
        name: "Gainers & Losers",
        url: "/movers",
        icon: (
          <MoversIcon className="text-light-font-100 dark:text-dark-font-100 text-[21px]" />
        ),
        description: "Spot today's top performers and decliners.",
      },
      {
        name: "Trendings",
        url: "/trendings",
        icon: (
          <TrendingIcon className="text-light-font-100 dark:text-dark-font-100 text-[21px]" />
        ),
        description: "Track tokens gaining traction accross the space.",
      },
    ],
  },
  {
    name: "Tools",
    extends: [
      {
        name: "Swap",
        url: "/swap",
        icon: (
          <VscArrowSwap className="text-light-font-100 dark:text-dark-font-100 text-[21px]" />
        ),
        description: "Secure, best rates, minimal fees.",
      },
      {
        name: "SwapDesk",
        url: "/trade",
        icon: (
          <BiCandles className="text-light-font-100 dark:text-dark-font-100 text-[21px]" />
        ),
        description: "Real-time trading charts, and analytics.",
      },
      {
        name: "Launchpad Ranking",
        url: "/launchpad-ranking",
        icon: (
          <MdOutlineRocketLaunch className="text-light-font-100 dark:text-dark-font-100 text-[21px]" />
        ),
        description: "Ranked list of leading launchpads.",
      },
    ],
  },

  {
    name: "Ecosystem",
    extends: [
      {
        name: "Add crypto-asset",
        url: "/list",
        icon: (
          <ListIcon className="text-light-font-100 dark:text-dark-font-100 text-[21px]" />
        ),
        description: "List your coin on Mobula.",
      },
      {
        name: "Contribute",
        url: "/contribute",
        icon: (
          <ContributeIcon className="text-light-font-100 dark:text-dark-font-100 text-[21px]" />
        ),
        description: "Contribute to Mobula DAO.",
      },

      {
        name: "Mobula API",
        url: "https://developer.mobula.fi",
        icon: (
          <DocsIcon className="text-light-font-100 dark:text-dark-font-100 text-[21px]" />
        ),
        description: "Institutional-grade crypto & web3 data API.",
      },

      {
        name: "Help Desk",
        url: "/forum/help",
        icon: (
          <FiHelpCircle className="text-light-font-100 dark:text-dark-font-100 text-[21px]" />
        ),
        description: "User support and guidance center.",
      },
      {
        name: "Announcement",
        url: "/forum/ecosystem",
        icon: (
          <HiOutlineNewspaper className="text-light-font-100 dark:text-dark-font-100 text-[21px]" />
        ),
        description: "Stay updated with the latest news.",
      },

      {
        name: "Learn & Earn",
        url: "/learn",
        icon: (
          <TbCoins className="text-light-font-100 dark:text-dark-font-100 text-[21px]" />
        ),
        description: "Elevate your crypto knowledge, reap rewards.",
      },
      {
        name: "Governance",
        url: "/dao/governance/overview",
        description: "Mobula DAO governance portal.",
        icon: (
          <GovernanceIcon className="text-light-font-100 dark:text-dark-font-100 text-[21px]" />
        ),
      },
      {
        name: "Protocol",
        url: "/dao/protocol/overview",
        icon: (
          <ProtocolIcon className="text-light-font-100 dark:text-dark-font-100 text-[21px]" />
        ),
        description: "Mobula listing protocol portal.",
      },
    ],
  },
];
