import { setCookie } from "cookies-next";
import { Query } from "../features/data/top100/models";
import { TimeSelected } from "../interfaces/pages/asset";

export interface Pref {
  chartType: string;
  timeSelected: TimeSelected;
  liveTradeAmountFitlers: TradeFilter;
  filters: Query[];
}

export function setUserPrefCookie(value: Pref) {
  setCookie("mobula-user-pref", value);
}

export function getUserPrefCookie(cookieString: string) {
  const cookies = cookieString.split(";");
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === "mobula-user-pref") {
      return JSON.parse(decodeURIComponent(value)) as Pref;
    }
  }

  const defaultPref: Pref = {
    chartType: "Linear",
    timeSelected: "24H",
    liveTradeAmountFitlers: {
      blockchains: [],
      value: [0, 1_000_000_000_000],
      type: null,
      token_amount: [0, 1_000_000_000_000],
      liquidity_pool: [],
    },
    filters: [],
  };

  setUserPrefCookie(defaultPref);

  return defaultPref;
}

export interface TradeFilter {
  blockchains: [];
  value: number[];
  type: string;
  token_amount: number[];
  liquidity_pool: [];
}
