import {ManageOption} from "./models";

export const manageOptions: ManageOption[] = [
  // {
  //   title: "Active Networks",
  //   name: "active_networks",
  // },
  {
    title: "Wallets",
    name: "wallets",
  },
  {
    title: "Portfolio Chart",
    name: "portfolio_chart",
    type: "boolean",
  },
  {
    title: "Performers",
    name: "performers",
    type: "boolean",
  },
  {
    title: "Holdings",
    name: "holdings",
    type: "boolean",
  },
  {
    title: "Daily PnL",
    name: "daily_pnl",
    type: "boolean",
  },
  {
    title: "Cumulative PnL",
    name: "cumulative_pnl",
    type: "boolean",
  },
  {
    title: "Total Profit",
    name: "total_profit",
    type: "boolean",
  },
  {
    title: "Privacy Mode",
    name: "privacy_mode",
    type: "boolean",
  },
  {
    title: "Realized Profit",
    name: "realized_profit",
    type: "boolean",
  },
  {
    title: "Unrealized Profit",
    name: "unrealized_profit",
    type: "boolean",
  },
  {
    title: "Total Invested",
    name: "total_invested",
    type: "boolean",
  },
];

export const manageAssetOptions = [
  {
    title: "Token Holdings",
    name: "token_details",
  },
  {
    title: "Holdings",
    name: "holdings",
  },
  {
    title: "Transactions",
    name: "transactions",
  },
  {
    title: "Buy / Sell / TokenChart",
    name: "buy_sell_chart",
  },
];

export const colorsWallets = [
  "blue",
  "black",
  "red",
  "green",
  "yellow",
  "purple",
  "pink",
  "orange",
];

export const timeframeOptions = ["24H", "7D", "30D", "1Y"];

export const colors = [
  "#165DFF",
  "#3491FA",
  "#0FC6C2",
  "#722ED1",
  "#D91AD9",
  "#F7BA1E",
  "#403724",
  "#5C7DF9",
  "#02A486",
  "#16C784",
  "#DC272E",
];
