import { Dispatch, SetStateAction } from "react";
import { Asset, Bar, Trade } from "../../../features/asset/models";
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

export const Datafeed = (
  baseAsset: Asset,
  isPair: boolean,
  setPairTrades?: Dispatch<SetStateAction<Trade[] | null | undefined>>
) => ({
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
    const apiParams = {
      endpoint: "/api/1/market/history/pair",
      params: {
        // blockchain: baseAsset?.blockchains?.[0],
        from: periodParams.from * 1000,
        to: periodParams.to * 1000,
        amount: periodParams.countBack,
        usd: true,
        period: resolution,
      },
    };

    if (isPair) {
      apiParams.params["address"] = baseAsset?.address;
    } else {
      apiParams.params["asset"] = baseAsset.contracts[0];
    }

    const response = await GET(apiParams.endpoint, apiParams.params, false, {
      headers: { Authorization: "eb66b1f3-c24b-4f43-9892-dbc5f37d5a6d" },
    });
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
    const params = {
      interval: 5,
    };

    if (isPair) params["address"] = baseAsset?.address;
    else {
      (params["asset"] = baseAsset.contracts[0]),
        (params["blockchain"] = baseAsset.blockchains[0]);
    }

    socket.addEventListener("open", () => {
      socket.send(
        JSON.stringify({
          type: "pair",
          authorization: process.env.NEXT_PUBLIC_PRICE_KEY,
          payload: params,
        })
      );
    });

    socket.addEventListener("message", (event) => {
      const { data } = JSON.parse(event.data);
      const { priceUSD: price, date: timestamp } = data;
      console.log("YO LES DATAS", data);

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
