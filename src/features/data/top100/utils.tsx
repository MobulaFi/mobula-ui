import { SupabaseClient } from "@supabase/supabase-js";
import { blockchainsContent } from "mobula-lite/lib/chains/constants";
import { Asset, Token } from "../../../interfaces/assets";
import { createSupabaseDOClient } from "../../../lib/supabase";
import { getFormattedAmount } from "../../../utils/formaters";
import { defaultCategories, defaultTop100, displays } from "./constants";
import { DefaultSettings, Settings } from "./models";
import { maxValue } from "./reducer";

export const loadChain = (
  chain: string,
  alert: any,
  settings: Settings,
  page: number,
  setChains: React.Dispatch<React.SetStateAction<any>>
) => {
  const defaultSettings: DefaultSettings = {
    "BNB Smart Chain (BEP20)": {
      liquidity: 0,
      volume: 10_000,
      onChainOnly: false,
      default: false,
    },
    Ethereum: {
      liquidity: 1000,
      volume: 50_000,
      onChainOnly: false,
      default: false,
    },
    "Avalanche C-Chain": {
      liquidity: 0,
      volume: 0,
      onChainOnly: false,
      default: false,
    },
    Polygon: { liquidity: 0, volume: 0, onChainOnly: false, default: false },
    Cronos: { liquidity: 0, volume: 0, onChainOnly: false, default: false },
    Arbitrum: { liquidity: 0, volume: 0, onChainOnly: false, default: false },
    Harmony: { liquidity: 0, volume: 0, onChainOnly: false, default: false },
  };

  const supabase = createSupabaseDOClient();
  const bufferSettings = settings.default
    ? defaultSettings[chain as string]
    : settings;

  supabase
    .from("assets")
    .select(
      "blockchains,market_cap,volume,logo,volume,name,symbol,twitter,website,chat,discord,price_change_24h,price_change_7d,price,id,contracts,blockchains,liquidity,rank"
    )
    .contains("blockchains[1]", `{ ${chain} }`)
    .filter("volume", "gte", page < 5 ? bufferSettings.volume : 0)
    .filter("liquidity", "gte", page < 5 ? bufferSettings.liquidity : 0)
    .order("market_cap", { ascending: false })
    .range(0 + (page - 1) * 100, 200 + (page - 1) * 100)
    .then((r: any) => {
      if (r.data) {
        setChains((newChains: any) => {
          const chains = newChains;
          chains[chain] = r.data
            .filter((token: Asset) => token.blockchains?.[0] === chain)
            .slice(0, 100);
          return newChains;
        });
      } else {
        alert.show("Something went wrong");
      }
    });
};

export const updateSearch = async (
  search: string,
  supabase: SupabaseClient,
  setResults: React.Dispatch<React.SetStateAction<Token[]>>
) => {
  if (search) {
    const { data: names } = await supabase
      .from("assets")
      .select("*")
      .or(`name.ilike.${search}%,symbol.ilike.${search}%,name.ilike.${search}`)
      .order("market_cap", { ascending: false })
      .limit(10);

    if (names && names.length > 0) {
      setResults(names);
    }
  }
};

export function deleteCookie(name: string): void {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

export const getTextForMaxValue = (value: number) => {
  if (value === 100_000_000_000_000_000) return "Any";
  return getFormattedAmount(value);
};

export const filterFromType = (
  type: string,
  filter: { from: number; to: number } | string[] | any
) => {
  if (type === "blockchains" || type === "categories") return filter.length;
  return `${getFormattedAmount(filter.from)} to ${getTextForMaxValue(
    filter.to
  )}`;
};

export const unformatActiveView = (
  viewStr: string | undefined,
  type: string,
  othersViewCookie: string | undefined,
  address: string | undefined
) => {
  if (!address || address === "undefined" || !viewStr)
    return { ...defaultTop100, disconnected: true, isFirst: true };
  let isAllView: boolean = false;
  if (othersViewCookie === viewStr) isAllView = true;
  else if (type === "all" && othersViewCookie !== viewStr) isAllView = true;
  else if (type === "others" && othersViewCookie !== viewStr) isAllView = false;
  const str = viewStr;
  const arr = str.split("(").join("").split(")");
  const indexOfDisplay = isAllView ? 3 : 4;
  let unformatDisplay;
  if (arr[indexOfDisplay].split("display:")[1])
    unformatDisplay =
      JSON.parse(arr[indexOfDisplay].split("display:")[1]) || [];
  else unformatDisplay = [];
  const priceDisplay = displays[0].filters;
  const marketCapDisplay = displays[1].filters;
  const changeDisplay = displays[2].filters;
  const volumeDisplay = displays[3].filters;
  const chartDisplay = displays[4].filters;
  const concatDisplayArr = priceDisplay.concat(
    marketCapDisplay,
    changeDisplay,
    volumeDisplay,
    chartDisplay
  );
  const displaysArr: { type: string; value: string }[] = [];
  let filters = {
    ...defaultTop100.filters,
  };
  const filtersArr = [];

  unformatDisplay.forEach((display: string) => {
    concatDisplayArr.forEach((entry) => {
      if (entry === display) {
        if (priceDisplay.includes(entry)) {
          displaysArr.push({ type: "price", value: entry });
        } else if (marketCapDisplay.includes(entry)) {
          displaysArr.push({ type: "market_cap", value: entry });
        } else if (changeDisplay.includes(entry)) {
          displaysArr.push({ type: "change", value: entry });
        } else if (volumeDisplay.includes(entry)) {
          displaysArr.push({ type: "volume", value: entry });
        } else if (chartDisplay.includes(entry)) {
          displaysArr.push({ type: "chart", value: entry });
        }
      }
    });
  });

  arr.forEach((entry, i) => {
    if (i > (isAllView ? 3 : 4)) {
      const key = entry.split(":")[0];
      const value = entry.split(":")[1];
      filtersArr.push(entry.split(":"));

      if (
        key !== "blockchains0" &&
        key !== "blockchains1" &&
        key !== "categories0" &&
        key !== "categories1" &&
        value
      )
        filters = {
          ...filters,
          [key]: {
            from: parseFloat(value.split("|")[0]) || 0,
            to: parseFloat(value.split("|")[1]) || maxValue,
          },
        };
      if (key === "blockchains0") {
        const blockchains = JSON.parse(value)?.map(
          (indexChain: number) => Object.keys(blockchainsContent)[indexChain]
        );
        filters = {
          ...filters,
          blockchains: Object.keys(blockchainsContent).filter(
            (chainName) => !blockchains.includes(chainName)
          ),
        };
      }
      if (key === "blockchains1") {
        const blockchains: string[] = [];
        JSON.parse(value).forEach((indexChain: number) => {
          blockchains.push(Object.keys(blockchainsContent)[indexChain]);
        });
        filters = {
          ...filters,
          blockchains,
        };
      }
      if (key === "categories0") {
        const categories = defaultCategories
          .filter((_, idx) => idx !== parseInt(value, 10))
          .map((category) => category);
        filters = {
          ...filters,
          categories,
        };
      }
      if (key === "categories1") {
        const newCategories: string[] = [];
        const valueInIndex = JSON.parse(value);
        valueInIndex.forEach((index: number) => {
          if (index >= 0) newCategories.push(defaultCategories[index]);
        });
        filters = {
          ...filters,
          categories: newCategories,
        };
      }
    }
  });

  let isFavorite = false;
  if (arr[2] === "true") isFavorite = true;

  if (isAllView) {
    const view = {
      color: arr[0],
      name: arr[1],
      is_favorite: isFavorite,
      display: displaysArr,
      filters,
      isFirst: true,
      disconnected: false,
    };
    return view;
  }
  if (arr[3] === "true") isFavorite = true;
  const view = {
    id: JSON.parse(arr[0]),
    color: arr[1],
    name: arr[2],
    is_favorite: isFavorite,
    display: displaysArr,
    filters,
    isFirst: true,
    is_top_100: false,
    disconnected: false,
  };
  return view;
};

export const timeout = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(new Error("Timeout")), ms);
  });

export const TABLE_ASSETS_QUERY =
  "market_cap,volume,price_change_7d,global_volume,total_supply,max_supply,price_change_1h,price_change_1m,price_change_3m,price_change_6m,price_change_1y,price_change_3y,price_change_ytd,logo,market_cap_diluted,circulating_supply,created_at,off_chain_volume,name,symbol,twitter,website,chat,discord,price_change_24h,price_change_7d,volume,volume_7d,price,id,contracts,tags,blockchains,liquidity,rank";
