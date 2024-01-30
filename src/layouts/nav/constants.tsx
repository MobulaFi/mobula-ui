import { AiOutlineLineChart, AiOutlineSwap } from "react-icons/ai";
import { BiCandles, BiCodeAlt, BiGitBranch } from "react-icons/bi";
import { IoHomeOutline } from "react-icons/io5";
import { MdAddChart } from "react-icons/md";
import { PiPlug } from "react-icons/pi";
import { TfiBarChart } from "react-icons/tfi";

export const navigation = [
  {
    name: "Home",
    url: "/home",
    icon: (
      <IoHomeOutline className="text-light-font-100 dark:text-dark-font-100 text-2xl nav" />
    ),
    description: "Discover the newest tokens on the market.",
  },
  {
    name: "Portfolio",
    url: "/portfolio",
    icon: (
      <AiOutlineLineChart className="text-light-font-100 dark:text-dark-font-100 text-2xl nav" />
    ),
    description: "Secure, best rates, minimal fees.",
  },
  {
    name: "Swap",
    url: "/swap",
    icon: (
      <AiOutlineSwap className="text-light-font-100 dark:text-dark-font-100 text-2xl nav" />
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
  {
    name: "Add crypto-asset",
    url: "/list",
    icon: (
      <MdAddChart className="text-light-font-100 dark:text-dark-font-100 text-2xl nav" />
    ),
    description: "List your coin on Mobula.",
  },
  // {
  //   name: "Contribute",
  //   url: "/contribute",
  //   icon: (
  //     <HiOutlineUsers className="text-light-font-100 dark:text-dark-font-100 text-2xl nav" />
  //   ),
  //   description: "Contribute to Mobula DAO.",
  // },
  {
    name: "Mobula API",
    url: "https://developer.mobula.fi",
    icon: (
      <BiCodeAlt className="text-light-font-100 dark:text-dark-font-100 text-2xl nav" />
    ),
    description: "Institutional-grade crypto & web3 data API.",
  },

  // {
  //   name: "Help Desk",
  //   url: "/forum/help",
  //   icon: (
  //     <FiHelpCircle className="text-light-font-100 dark:text-dark-font-100 text-2xl" />
  //   ),
  //   description: "User support and guidance center.",
  // },
  // {
  //   name: "Announcement",
  //   url: "/forum/ecosystem",
  //   icon: (
  //     <HiOutlineNewspaper className="text-light-font-100 dark:text-dark-font-100 text-2xl" />
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
      <BiGitBranch className="text-light-font-100 dark:text-dark-font-100 text-2xl" />
    ),
    description: "Mobula listing protocol portal.",
  },
];

export const navigationGlobal = {
  name: "Global",
  extend: [
    {
      name: "Recently added",
      url: "/new",
      icon: (
        <PiPlug className="text-light-font-100 dark:text-dark-font-100 text-lg nav" />
      ),
      description: "Discover the newest tokens on the market.",
    },
    {
      name: "Gainers & Losers",
      url: "/movers",
      icon: (
        <BiCandles className="text-light-font-100 dark:text-dark-font-100 text-lg nav" />
      ),
      description: "Spot today's top performers and decliners.",
    },
    {
      name: "Trendings",
      url: "/trendings",
      icon: (
        <TfiBarChart className="text-light-font-100 dark:text-dark-font-100 text-base nav" />
      ),
      description: "Track tokens gaining traction accross the space.",
    },
  ],
};
