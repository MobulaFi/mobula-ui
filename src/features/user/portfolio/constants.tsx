import { ManageOption } from "./models";

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
    description: "Show the portfolio chart on the portfolio page",
  },
  {
    title: "Performers",
    name: "performers",
    type: "boolean",
    description: "Show the performers on the portfolio page",
  },
  {
    title: "Holdings",
    name: "holdings",
    type: "boolean",
    description: "Show the holdings on the portfolio page",
  },
  {
    title: "Daily PnL",
    name: "daily_pnl",
    type: "boolean",
    description: "Show the daily PnL on the portfolio page",
  },
  {
    title: "Cumulative PnL",
    name: "cumulative_pnl",
    type: "boolean",
    description: "Show the cumulative PnL on the portfolio page",
  },
  {
    title: "Total Profit",
    name: "total_profit",
    type: "boolean",
    description: "Show the total profit on the portfolio page",
  },
  {
    title: "Privacy Mode",
    name: "privacy_mode",
    type: "boolean",
    description: "Show the privacy mode on the portfolio page",
  },
  {
    title: "Realized Profit",
    name: "realized_profit",
    type: "boolean",
    description: "Show the realized profit on the portfolio page",
  },
  {
    title: "Unrealized Profit",
    name: "unrealized_profit",
    type: "boolean",
    description: "Show the unrealized profit on the portfolio page",
  },
  {
    title: "Total Invested",
    name: "total_invested",
    type: "boolean",
    description: "Show the total invested on the portfolio page",
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
  "bg-[#165DFF] dark:bg-[#165DFF]",
  "bg-[#3491FA] dark:bg-[#3491FA]",
  "bg-[#0FC6C2] dark:bg-[#0FC6C2]",
  "bg-[#722ED1] dark:bg-[#722ED1]",
  "bg-[#D91AD9] dark:bg-[#D91AD9]",
  "bg-[#F7BA1E] dark:bg-[#F7BA1E]",
  "bg-[#403724] dark:bg-[#403724]",
  "bg-[#5C7DF9] dark:bg-[#5C7DF9]",
  "bg-[#02A486] dark:bg-[#02A486]",
  "bg-[#16C784] dark:bg-[#16C784]",
  "bg-[#DC272E] dark:bg-[#DC272E]",
];
