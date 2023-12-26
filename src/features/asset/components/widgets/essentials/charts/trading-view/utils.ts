import { GET } from "../../../../../../../utils/fetch";
import { Asset } from "../../../../../models";

export const supportedResolutions = [
  "1",
  "5",
  "15",
  "30",
  "60",
  "120",
  "240",
  "24H",
  "7D",
  "30D",
];

export const Datafeed = (baseAsset: Asset) => ({
  onReady: (callback: Function) => {
    callback({ supported_resolutions: supportedResolutions });
  },
  resolveSymbol: (symbolName: string, onResolve: Function) => {
    const params = {
      name: symbolName,
      description: "",
      type: "crypto",
      session: "24x7",
      ticker: symbolName,
      minmov: 1,
      pricescale: Math.min(
        10 ** String(Math.round(10000 / baseAsset.price)).length,
        10000000000000000
      ),
      has_intraday: true,
      intraday_multipliers: ["1", "15", "30", "60"],
      supported_resolution: supportedResolutions,
      volume_precision: 8,
      data_status: "streaming",
    };
    onResolve(params);
  },
  getBars: async (
    symbolInfo,
    resolution: string,
    periodParams,
    onResult: Function
  ) => {
    const response = await GET("/api/1/market/history/pair", {
      asset: baseAsset.contracts[0],
      blockchain: baseAsset.blockchains[0],
      from: periodParams.from * 1000,
      to: periodParams.to * 1000,
      amount: periodParams.countBack,
    });
    const data = await response.json();
    onResult(data.data);
  },
  searchSymbols: () => {},
  subscribeBars: (_, __, update) => {
    // TO DO: subscribe to the price feed
  },
  unsubscribeBars: () => ({}),
  getMarks: () => ({}),
  getTimeScaleMarks: () => ({}),
  getServerTime: () => ({}),
});
