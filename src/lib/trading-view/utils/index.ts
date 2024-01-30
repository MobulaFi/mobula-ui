import { Asset, Bar } from "../../../features/asset/models";
import { GET } from "../../../utils/fetch";
import { getNextBarTime } from "./stream";

export const supportedResolutions = [
  "1",
  "5",
  "15",
  "60",
  "120",
  "240",
  "24H",
  "7D",
  "30D",
];

const lastBarsCache = new Map();
const sockets = new Map();

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
    const response = await GET(
      "/api/1/market/history/pair",
      {
        asset: baseAsset.contracts[0],
        blockchain: baseAsset.blockchains[0],
        from: periodParams.from * 1000,
        to: periodParams.to * 1000,
        amount: periodParams.countBack,
        usd: true,
        period: resolution,
      },
      false,
      {
        headers: { Authorization: "eb66b1f3-c24b-4f43-9892-dbc5f37d5a6d" },
      }
    );
    const data = await response.json();

    onResult(data.data, {
      noData: data.data.length !== periodParams.countBack,
    });

    if (periodParams.firstDataRequest) {
      lastBarsCache.set(baseAsset.name, data.data[data.data.length - 1]);
    }
  },
  searchSymbols: () => {},
  subscribeBars: (
    symbolInfo,
    resolution,
    onRealtimeCallback,
    subscriberUID,
    onResetCacheNeededCallback
  ) => {
    console.log("Subscribinnnng");
    const socket = new WebSocket(
      process.env.NEXT_PUBLIC_PRICE_WSS_ENDPOINT as string
    );

    socket.addEventListener("open", () => {
      socket.send(
        JSON.stringify({
          type: "pair",
          authorization: process.env.NEXT_PUBLIC_PRICE_KEY,
          payload: {
            asset: baseAsset.contracts[0],
            blockchain: baseAsset.blockchains[0],
            interval: 5,
          },
        })
      );
    });

    socket.addEventListener("message", (event) => {
      const { data } = JSON.parse(event.data);
      const { priceUSD: price, date: timestamp } = data;

      const lastDailyBar = lastBarsCache.get(baseAsset.name);
      const nextDailyBarTime = getNextBarTime(resolution, lastDailyBar.time);
      let bar: Bar;

      if (timestamp >= nextDailyBarTime) {
        bar = {
          time: nextDailyBarTime,
          open: lastDailyBar.close,
          high: price,
          low: price,
          close: price,
        };
      } else {
        bar = {
          ...lastDailyBar,
          high: Math.max(lastDailyBar.high, price),
          low: Math.min(lastDailyBar.low, price),
          close: price,
        };
      }

      onRealtimeCallback(bar);
    });

    console.log("Subscribe", baseAsset.name + "-" + subscriberUID);
    sockets.set(baseAsset.name + "-" + subscriberUID, socket);
  },
  unsubscribeBars: (subscriberUID) => {
    console.log("Unsubscribe", baseAsset.name + "-" + subscriberUID);
    sockets.get(baseAsset.name + "-" + subscriberUID).close();
  },
  getMarks: () => ({}),
  getTimeScaleMarks: () => ({}),
  getServerTime: () => ({}),
});
