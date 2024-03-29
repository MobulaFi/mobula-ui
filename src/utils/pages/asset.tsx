import { blockchainsContent } from "mobula-lite/lib/chains/constants";
import { ChartType } from "../../features/asset/models";
import {
  FormattedHistoricalData,
  TimeSelected,
  UnformattedHistoricalData,
} from "../../interfaces/pages/asset";
// eslint-disable-next-line import/no-cycle
// import {timestamps} from "./constant";
// import {
//   FormattedHistoricalData,
//   TimeSelected,
//   UnformattedHistoricalData,
// } from "./models";

export const supabaseAssetQuery =
  "id,price,ath,price_history,volume_history,circulating_supply,market_cap_history,total_supply,decimals,atl,volume,ath_volume,liquidity,logo,ath_liquidity,rank,market_cap,market_cap_diluted,name,symbol,description,twitter,chat,discord,contracts,blockchains,market_score,trust_score,social_score,website,kyc,audit,utility_score,circulating_supply,trade_history(*),price_change_24h,assets_social(*)";

export const types: ChartType[] = ["price", "liquidity"];

export const timestamps: TimeSelected[] = [
  "24H",
  "7D",
  "30D",
  "3M",
  "1Y",
  "ALL",
];

export const timestamp: Record<TimeSelected, number> = {
  "24H": 86400000,
  "7D": 604800000,
  "30D": 2592000000,
  "3M": 7776000000,
  "1Y": 31536000000,
  ALL: Infinity,
};

export const tagsColors = ["red", "blue", "rebeccapurple", "green", "yellow"];

export const colors = [
  "#474D57",
  "#A87EF7",
  "#54DADE",
  "#5CA7F7",
  "#8CDD3C",
  "#05C076",
  "#F8D12F",
  "#FC6F75",
  "#165DFF",
  "#D91AD9",
  "#F7BA1E",
  "#722ED1",
  "#0ECB81",
  "#EE5858",
  "#B4CFFF",
  "#2F3658",
];

export const nonMatchingColors = [
  "#FF5733", // Flashy Orange
  "#33FF57", // Flashy Green
  "#3357FF", // Flashy Blue
  "#33D1FF", // Flashy Sky Blue
  "#AD33FF", // Flashy Purple
  "#FF3366", // Flashy Red
  "#33FFA1", // Flashy Mint
  "#33D4FF", // Flashy Azure
  "#FC33FF", // Flashy Magenta
  "#FF9933", // Complémentaire Orange
  "#99FF33", // Complémentaire Vert
  "#9933FF", // Complémentaire Violet
  "#33FFFF", // Complémentaire Cyan
  "#FF33CC", // Complémentaire Rose
];

export const openInNewTab = (url) => {
  const win = window.open(url, "_blank");
  win.focus();
};

// export const getRenderFromTabs = activeTab => {
//   if (activeTab === "Essentials") {
//     return (
//       <Flex direction="column" maxW="320px" w="100%">
//         <TokenMetrics />
//         <HoldingRoi chartId="holdings-chart" />
//         <CoreActor />
//       </Flex>
//     );
//   }
//   return null;
// };

export const getColorAndLogoFromName = (name: string) => {
  const infos = {
    Ethereum: {
      logo: "/logo/ethereum.png",
      color: "#517CE7",
    },
    Polygon: {
      logo: "/logo/polygon.png",
      color: "#7E46DC",
    },
    BNB: {
      logo: "/logo/bnb.png",
      color: "#F0B90B",
    },
    "BNB Smart Chain (BEP20)": {
      logo: "/logo/bcw.png",
      color: "#F0B90B",
    },
    Cronos: {
      logo: "/logo/cronos.png",
      color: "#163C61",
    },
    USD: {
      logo: "/logo/usdt.webp",
      color: "#26A17B",
    },
    Fantom: {
      logo: "/logo/fantom.png",
      color: "#13AFE5",
    },
    Avalanche: {
      logo: "/logo/avalanche.png",
      color: "#E04041",
    },
    "Avalanche C-Chain": {
      logo: "/logo/avalanche.png",
      color: "#E04041",
    },
    Others: {
      logo: "/icon/unknown.png",
      color: "rgba(255, 255, 255, 0.5)",
    },
  };

  if (!infos[name] && blockchainsContent[name]) {
    infos[name] = {
      logo: blockchainsContent[name].logo,
      color: `${blockchainsContent[name].color}`,
    };
  }
  return infos[name];
};

export const formatHistoricalData = (
  data: UnformattedHistoricalData
): FormattedHistoricalData => {
  const formattedHistoricalData = {} as FormattedHistoricalData;
  Object.keys(data).forEach((type) => {
    formattedHistoricalData[type] = {} as Record<
      TimeSelected,
      { y: number; t: number }[]
    >;
    timestamps.forEach((timestamp) => {
      formattedHistoricalData[type][timestamp] = data[type]?.[timestamp]?.map(
        (item) => ({
          t: item[0],
          y: item[1],
        })
      );
    });
  });

  return formattedHistoricalData;
};

export const timeframes = {
  "24h": 24 * 60 * 60 * 1000,
  "3D": 3 * 24 * 60 * 60 * 1000,
  "7D": 7 * 24 * 60 * 60 * 1000,
  "1M": 30 * 24 * 60 * 60 * 1000,
  "3M": 3 * 30 * 24 * 60 * 60 * 1000,
  "6M": 6 * 30 * 24 * 60 * 60 * 1000,
  "1Y": 365 * 24 * 60 * 60 * 1000,
  "2Y": 2 * 365 * 24 * 60 * 60 * 1000,
  "3Y": 3 * 365 * 24 * 60 * 60 * 1000,
  "4Y": 4 * 365 * 24 * 60 * 60 * 1000,
  "5Y": 5 * 365 * 24 * 60 * 60 * 1000,
  "6Y": 6 * 365 * 24 * 60 * 60 * 1000,
  "7Y": 7 * 365 * 24 * 60 * 60 * 1000,
  "8Y": 8 * 365 * 24 * 60 * 60 * 1000,
  "9Y": 9 * 365 * 24 * 60 * 60 * 1000,
  "10Y": 10 * 365 * 24 * 60 * 60 * 1000,
};

export const getDateFromTimeStamp = (timestamp) => {
  switch (timestamp) {
    case "24h":
      return "Today";
    case "3D":
      return "3 days ago";
    case "7D":
      return "7 days ago";
    case "1M":
      return "1 month ago";
    case "3M":
      return "3 months ago";
    case "6M":
      return "6 months ago";
    case "1Y":
      return "1 year ago";
    case "2Y":
      return "2 years ago";
    case "3Y":
      return "3 years ago";
    case "4Y":
      return "4 years ago";
    case "5Y":
      return "5 years ago";
    case "6Y":
      return "6 years ago";
    case "7Y":
      return "7 years ago";
    case "8Y":
      return "8 years ago";
    case "9Y":
      return "9 years ago";
    case "10Y":
      return "10 years ago";
    default:
      return "Today";
  }
};

export const formatISODate = (date: string) => {
  const d = new Date(date);
  const month = d.getMonth() + 1 < 10 ? `0${d.getMonth() + 1}` : d.getMonth();
  const day = d.getDate() < 10 ? `0${d.getDate()}` : d.getDate();
  return `${d.getFullYear()}/${month}/${day}`;
};

export const getInitalCountdown = (launchDate?: number) => {
  if (!launchDate) return null;

  if (launchDate < Date.now())
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };

  const diff = launchDate - Date.now();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return {
    days,
    hours,
    minutes,
    seconds,
  };
};

export const formatFilters = (filters) => {
  let filterStr = "";
  filters.forEach((filter) => {
    if (filter.value?.[0] !== "trade_history.blockchain") {
      if (filter.value[1] === 0 || filter.value[1] === 1000000000000) return;
      filterStr += `(${filter.action}:${filter.value.join(",")})`;
    }
  });
  return filterStr;
};

export const unformatFilters = (cookieStr) => {
  if (!cookieStr) return [];
  const newFilters = [];
  const filterArr = cookieStr.split(")");
  filterArr.forEach((filter) => {
    if (filter) {
      const action = filter.split(":")[0].replace("(", "");
      const value = filter.split(":")[1].split(",");
      if (value[0] !== "trade_history.blockchain")
        newFilters.push({ action, value });
    }
  });
  return newFilters;
};
