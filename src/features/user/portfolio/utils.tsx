import { ActiveStep, UserHoldings, UserHoldingsAsset } from "./models";

export const copyText = (
  text: string,
  setIsCopied: React.Dispatch<React.SetStateAction<string>>
) => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(text);
      setTimeout(() => {
        setIsCopied("");
      }, 300);
    });
  }
};

export const convertInMillis = (hours, minutes) => {
  const hoursInMillis = hours * 60 * 60 * 1000;
  const minutesInMillis = minutes * 60 * 1000;
  const totalMillis = hoursInMillis + minutesInMillis;
  if (!Number.isNaN(totalMillis)) return totalMillis;
  return 0;
};

export const getAmountLoseOrWin = (percentage: number, amount: number) => {
  const change = amount * (percentage / 100);
  return Math.round(change * 10) / 10;
};

export const getPositionOfSwitcherButton = (typeSelected: string) => {
  if (typeSelected === "Buy") return "4px";
  if (typeSelected === "Sell") return "33.33%";
  if (typeSelected === "Assets") return "4px";
  if (typeSelected === "Blockchains") return "50%";
  if (typeSelected === "Chart") return "4px";
  if (typeSelected === "Widgets") return "calc(50% - 4px)";
  if (typeSelected === "Cryptos") return "4px";
  if (typeSelected === "NFTs") return "25%";
  if (typeSelected === "Activity") return "50%";
  if (typeSelected === "Staking") return "calc(75% - 4px)";
  return "calc(66.66% - 4px)";
};

export const getDate = (timestamp: number) => {
  const date = new Date(timestamp);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(2);

  return `${month}/${day}/${year}`;
};

export const getHours = (timestamp: number) => {
  const date = new Date(timestamp);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};

export const getFormattedPNL = (
  wallet: UserHoldingsAsset | UserHoldings,
  timeframe: string
): [number, number][] => {
  try {
    if (wallet) {
      let walletPnl;
      if ("global_pnl" in wallet) walletPnl = wallet.global_pnl;
      else walletPnl = wallet.pnl_history;

      const newArr = walletPnl[timeframe.toLowerCase()]?.map(
        (entry, i, arr) => [
          arr.length - 1 === i
            ? arr[i - 1][0]
            : entry[0] - (arr[1][0] - arr[0][0]) + 1,
          entry[1].realized + entry[1].unrealized,
        ]
      );
      return newArr;
    }
    return [];
  } catch (e) {
    return [];
  }
};

export const steps: ActiveStep[] = [
  {
    nbr: 1,
    title: "Add wallet",
    subtitle:
      "You can track multiple wallets in real time in a single portfolio",
    top: "140px",
    right: "20%",
    transform: "translateX(10%)",
    arrowPosition: "none",
  },
  {
    nbr: 2,
    title: "Add cryptos",
    subtitle:
      "You can also add your crypto assets manually, even if you don't hold them in a wallet.",
    top: "140px",
    right: "10%",
    transform: "translateX(10%)",
    arrowPosition: "none",
  },
  {
    nbr: 3,
    title: "Settings",
    subtitle: "You can customize the interface as you wish.",
    top: "140px",
    right: "70%",
    transform: "translateX(20%)",
    arrowPosition: "none",
  },
  {
    nbr: 4,
    title: "Activity",
    subtitle:
      "You can visualize all your historical transactions accross wallets & manual assets.",
    top: "425px",
    right: "40%",
    transform: "translateX(10%)",
    arrowPosition: "none",
  },
  {
    nbr: 5,
    title: "Manage Portfolios",
    subtitle: "You can create multiple portfolios, and switch between them.",
    top: "140px",
    right: "70%",
    transform: "translateX(20%)",
    arrowPosition: "none",
  },
];

export const loadWalletPortfolio = async (address: string) => {
  const socket = new WebSocket(process.env.NEXT_PUBLIC_PORTFOLIO_WSS_ENDPOINT);
  socket.addEventListener("open", () => {
    socket.send(`{"explorer": {"wallet": "${address}"}, "force": true}`);
  });

  let failed = true;
  return new Promise((r) => {
    let portfolio: UserHoldings;
    socket.addEventListener("message", (event) => {
      try {
        const result = JSON.parse(event.data);
        if (result !== null) {
          if (result.status === "error") failed = true;
          else {
            portfolio = result.analysis;
            failed = false;
          }
        }
      } catch (e) {
        if (event.data === "Goodbye.") {
          if (failed) r(null);
          else r(portfolio);
        }
      }
    });
  });
};
