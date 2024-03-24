import { TfiBarChart } from "react-icons/tfi";
import { VscArrowSwap } from "react-icons/vsc";

import { BiCandles, BiCodeAlt, BiGitBranch } from "react-icons/bi";
import { MdAddChart } from "react-icons/md";
import { PiPlug } from "react-icons/pi";

export const navigation = [
  {
    name: "Cryptocurrencies",
    extends: [
      {
        name: "Recently added",
        url: "/new",
        icon: (
          <PiPlug className="text-light-font-100 dark:text-dark-font-100 text-[21px] md:text-sm" />
        ),
        description: "Discover the newest tokens on the market.",
      },
      {
        name: "Gainers & Losers",
        url: "/movers",
        icon: (
          <BiCandles className="text-light-font-100 dark:text-dark-font-100 text-[21px] md:text-sm" />
        ),
        description: "Spot today's top performers and decliners.",
      },
      {
        name: "Trendings",
        url: "/trendings",
        icon: (
          <TfiBarChart className="text-light-font-100 dark:text-dark-font-100 text-[21px] md:text-sm" />
        ),
        description: "Track tokens gaining traction accross the space.",
      },
    ],
  },
  {
    name: "Swap",
    url: "/swap",
    extends: [
      {
        name: "Swap",
        url: "/swap",
        icon: (
          <VscArrowSwap className="text-light-font-100 dark:text-dark-font-100 text-[21px] md:text-sm" />
        ),
        description: "Secure, best rates, minimal fees.",
      },
      // {
      //   name: "SwapDesk",
      //   url: "/trade",
      //   icon: (
      //     <BiCandles className="text-light-font-100 dark:text-dark-font-100 text-[21px]" />
      //   ),
      //   description: "Real-time trading charts, and analytics.",
      // },
      // {
      //   name: "Launchpad Ranking",
      //   url: "/launchpad-ranking",
      //   icon: (
      //     <MdOutlineRocketLaunch className="text-light-font-100 dark:text-dark-font-100 text-[21px]" />
      //   ),
      //   description: "Ranked list of leading launchpads.",
      // },
    ],
  },

  {
    name: "Ecosystem",
    extends: [
      {
        name: "Add crypto-asset",
        url: "/list",
        icon: (
          <MdAddChart className="text-light-font-100 dark:text-dark-font-100 text-[21px] md:text-sm" />
        ),
        description: "List your coin on Mobula.",
      },
      // {
      //   name: "Contribute",
      //   url: "/contribute",
      //   icon: (
      //     <HiOutlineUsers className="text-light-font-100 dark:text-dark-font-100 text-[21px] md:text-sm" />
      //   ),
      //   description: "Contribute to Mobula DAO.",
      // },
      {
        name: "Mobula API",
        url: "https://developer.mobula.fi",
        icon: (
          <BiCodeAlt className="text-light-font-100 dark:text-dark-font-100 text-[21px] md:text-sm" />
        ),
        description: "Institutional-grade crypto & onchain data API.",
      },

      // {
      //   name: "Help Desk",
      //   url: "/forum/help",
      //   icon: (
      //     <FiHelpCircle className="text-light-font-100 dark:text-dark-font-100 text-[21px] md:text-sm" />
      //   ),
      //   description: "User support and guidance center.",
      // },
      // {
      //   name: "Announcement",
      //   url: "/forum/ecosystem",
      //   icon: (
      //     <HiOutlineNewspaper className="text-light-font-100 dark:text-dark-font-100 text-[21px] md:text-sm" />
      //   ),
      //   description: "Stay updated with the latest news.",
      // },

      // {
      //   name: "Learn & Earn",
      //   url: "/learn",
      //   icon: (
      //     <TbCoins className="text-light-font-100 dark:text-dark-font-100 text-[21px]" />
      //   ),
      //   description: "Elevate your crypto knowledge, reap rewards.",
      // },
      // {
      //   name: "Governance",
      //   url: "/dao/governance/overview",
      //   description: "Mobula DAO governance portal.",
      //   icon: (
      //     <GovernanceIcon className="text-light-font-100 dark:text-dark-font-100 text-[21px]" />
      //   ),
      // },
      {
        name: "Protocol",
        url: "/dao/protocol/overview",
        icon: (
          <BiGitBranch className="text-light-font-100 dark:text-dark-font-100 text-[21px] md:text-sm" />
        ),
        description: "Mobula listing protocol portal.",
      },
    ],
  },
];
