import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { TradeHistory } from "../features/asset/models";
import { Asset } from "../interfaces/assets";
import { MarketMetrics } from "../interfaces/trades";
import { createSupabaseDOClient } from "../lib/supabase";

// const notV2Pairs = [
//   "0xb400af9ff00e7ba1f6aac4eeff475e965f9cba1f",
//   "0x62fdb44203a13ae0c6d456d37d020171170469ed",
//   "0xd03ccfe61e66112472541888485ae67425973b01",
// ];
// interface EventParams {
//   address?: string[];
//   topics?: (string | string[] | null)[] | undefined;
//   blockchain: string;
//   sleep?: number;
// }

export interface MarketMetricsNullable {
  price: number | null;
  priceChange: boolean | null;
  liquidity: number | null;
  volume: number | null;
  volumeChange: boolean | null;
  market_cap: number | null;
  trade_history: TradeHistory[];
}
export interface Query {
  action: string;
  value: unknown[];
  isFirst?: true;
}

export const useLiteStreamMarketData = (
  baseAsset: Asset,
  filters?: Query[] | null
) => {
  const supabase = createSupabaseDOClient();
  const [marketMetrics, setMarketMetrics] = useState<MarketMetrics>({
    price: baseAsset.price,
    priceChange: null,
    liquidity: baseAsset.liquidity,
    volume: baseAsset.volume,
    volumeChange: null,
    market_cap: baseAsset.market_cap,
    trade_history: baseAsset?.trade_history || [],
  });

  useEffect(() => {
    const stream = setInterval(async () => {
      try {
        const { data } = await supabase
          .from("assets")
          .select("trade_history(*),volume,price")
          .limit(10, { foreignTable: "trade_history" })
          .order("date", { foreignTable: "trade_history", ascending: false })
          .match({ id: baseAsset.id })
          .single();

        if (!data) return;
        setMarketMetrics((marketMetrics: any) => {
          const hashes = data.trade_history.map((entry) => entry.hash);
          return {
            ...marketMetrics,
            trade_history: data.trade_history
              .filter(
                (entry, index) =>
                  entry.date > (marketMetrics.trade_history[0]?.date || 0) &&
                  index === hashes.indexOf(entry.hash)
              )
              .concat(marketMetrics.trade_history)
              .slice(0, 100),
            volume: data.volume,
            volumeChange:
              data.volume - marketMetrics.volume > 0
                ? true
                : data.volume - marketMetrics.volume < 0
                ? false
                : undefined,
            price: data.price,
            priceChange:
              data.price - marketMetrics.price > 0
                ? true
                : data.price - marketMetrics.price < 0
                ? false
                : undefined,
            // liquidity: data.liquidity,
            // liquidityChange:
            //   data.liquidity - baseAsset.liquidity > 0
            //     ? true
            //     : data.liquidity - baseAsset.liquidity < 0
            //     ? false
            //     : undefined,
          };
        });
      } catch (error) {
        console.log(error);
      }
    }, 5 * 1000);

    return () => {
      console.log("Rerender, clearing interval");
      clearInterval(stream);
    };
  }, [filters]);

  return marketMetrics;
};

export const useLiteStreamMarketDataModule = (
  baseAsset: Asset,
  marketMetrics: MarketMetrics,
  setMarketMetrics: Dispatch<SetStateAction<MarketMetrics>>,
  filters?: Query[] | null,
  setIsLoading?: Dispatch<SetStateAction<boolean>>,
  shouldInstantLoad?: boolean
) => {
  const threadId = useRef(Math.round(100000000 * Math.random()));
  useEffect(() => {
    if (setIsLoading !== undefined) setIsLoading(true);
    const threadIdCurrent = threadId.current;
    if (baseAsset !== undefined) {
      const changeMarketMetrics = async () => {
        const supabase = createSupabaseDOClient();
        const request = supabase
          .from("assets")
          .select("trade_history(*),volume,price")
          .limit(10, { foreignTable: "trade_history" })
          .order("date", { foreignTable: "trade_history", ascending: false })
          .match({ id: baseAsset.id });

        (filters || [])
          .filter((entry) => entry.action)
          .forEach((filter) => {
            request[filter.action](...filter.value);
          });
        const { data } = await request.single();
        if (marketMetrics?.trade_history?.length > 0) setIsLoading?.(false);
        if (threadIdCurrent !== threadId.current) return;
        if (data && data.trade_history) {
          setMarketMetrics((marketMetrics) => {
            const hashes = data.trade_history.map((entry) => entry.hash);
            setIsLoading?.(false);
            return {
              ...marketMetrics,
              trade_history: data.trade_history
                .filter(
                  (entry, index) =>
                    entry.date >
                      (marketMetrics?.trade_history?.[0]?.date || 0) &&
                    index === hashes.indexOf(entry.hash)
                )
                .concat(marketMetrics.trade_history),
              volume: data.volume,
              volumeChange:
                data.volume - (marketMetrics.volume || 0) > 0
                  ? true
                  : data.volume - (marketMetrics.volume || 0) < 0
                  ? false
                  : null,
              price: data.price,
              priceChange:
                data.price - (marketMetrics.price || 0) > 0
                  ? true
                  : data.price - (marketMetrics.price || 0) < 0
                  ? false
                  : null,
            };
          });
        }
        if (marketMetrics?.trade_history?.length > 0) setIsLoading?.(false);
      };
      if (shouldInstantLoad) changeMarketMetrics();
      const stream = setInterval(async () => {
        changeMarketMetrics();
      }, 5 * 1000);
      if (marketMetrics?.trade_history?.length > 0) setIsLoading?.(false);

      return () => {
        threadId.current = Math.round(100000000 * Math.random());
        clearInterval(stream);
      };
    }
    return () => {};
  }, [baseAsset, filters]);
  return [marketMetrics, setMarketMetrics];
};

export const useLiteStreamMultipleAssets = (
  baseAssets: Asset[],
  setBaseAssets: Dispatch<SetStateAction<Asset[]>>,
  loaded = true
) => {
  const [started, setStarted] = useState(false);
  useEffect(() => {
    if (!started && loaded) {
      setStarted(true);
      const stream = setInterval(async () => {
        const supabase = createSupabaseDOClient();
        const { data } = await supabase
          .from("assets")
          .select("volume,price,market_cap,price_change_24h,id")
          .in(
            "id",
            baseAssets.map((entry) => entry.id)
          );
        if (data) {
          const usableData = {};

          data.forEach((entry) => (usableData[entry.id] = entry));

          setBaseAssets((baseAssets) => {
            for (let i = 0; i < baseAssets.length; i++) {
              if (usableData[baseAssets[i].id]) {
                baseAssets[i] = {
                  ...baseAssets[i],
                  volume: usableData[baseAssets[i].id].volume,
                  volumeChange:
                    usableData[baseAssets[i].id].volume - baseAssets[i].volume >
                    0
                      ? true
                      : usableData[baseAssets[i].id].volume -
                          baseAssets[i].volume <
                        0
                      ? false
                      : undefined,
                  price: usableData[baseAssets[i].id].price,
                  priceChange:
                    usableData[baseAssets[i].id].price - baseAssets[i].price > 0
                      ? true
                      : usableData[baseAssets[i].id].price -
                          baseAssets[i].price <
                        0
                      ? false
                      : undefined,
                  market_cap: usableData[baseAssets[i].id].market_cap,
                  marketCapChange:
                    usableData[baseAssets[i].id].market_cap -
                      baseAssets[i].market_cap >
                    0
                      ? true
                      : usableData[baseAssets[i].id].market_cap -
                          baseAssets[i].market_cap <
                        0
                      ? false
                      : undefined,
                  price_change_24h:
                    usableData[baseAssets[i].id].price_change_24h,
                };
              }
            }
            return [...baseAssets];
          });
        }
      }, 5 * 1000);

      return () => {
        clearInterval(stream);
      };
    }
    return () => {};
  }, [loaded]);

  // return marketMetrics;
};
