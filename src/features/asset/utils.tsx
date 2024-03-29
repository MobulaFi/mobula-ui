// eslint-disable-next-line import/no-cycle
import { blockchainsContent } from "mobula-lite/lib/chains/constants";
import { timestamps } from "./constant";
import {
  FormattedHistoricalData,
  TimeSelected,
  UnformattedHistoricalData,
} from "./models";

export const openInNewTab = (url: string) => {
  const win = window.open(url, "_blank");
  if (win) win.focus();
};

export const getRenderFromTabs = (activeTab) => {
  if (activeTab === "Essentials") {
    return (
      <div className="flex flex-col max-w-[320px] w-full">
        {/* <TokenMetrics />
        <HoldingRoi chartId="holdings-chart" />
        <CoreActor /> */}
      </div>
    );
  }
  return null;
};

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
      logo: "/empty/unknown.png",
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

export const calculateDaysRemaining = (releaseSchedule) => {
  const currentDate = new Date().getTime();

  if (typeof releaseSchedule === "number") {
    const remainingTime = releaseSchedule - currentDate;
    const daysRemaining = Math.ceil(remainingTime / (1000 * 60 * 60 * 24));
    return daysRemaining;
  }

  const daysRemainingArray = releaseSchedule?.map(
    (event: { unlock_date; tokens_to_unlock }) => {
      const remainingTime = event.unlock_date - currentDate;
      const daysRemaining = Math.ceil(remainingTime / (1000 * 60 * 60 * 24));
      return [daysRemaining, event.tokens_to_unlock];
    }
  );

  return daysRemainingArray?.[(daysRemainingArray?.length || 1) - 1];
};
