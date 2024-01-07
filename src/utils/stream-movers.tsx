import { useEffect, useState } from "react";
import { Asset } from "../interfaces/assets";
import { createSupabaseDOClient } from "../lib/supabase";

interface IMarketMetrics {
  price: number;
  priceChange: boolean | null;
  liquidity: number;
  volume: number;
  volumeChange: boolean | null;
  market_cap: number;
  price_change_24h: number;
}

export const useLiteStreamMarketDataMovers = (baseAsset: Asset) => {
  const supabase = createSupabaseDOClient();
  const [marketMetrics, setMarketMetrics] = useState<IMarketMetrics>({
    price: baseAsset.price,
    priceChange: null,
    liquidity: baseAsset.liquidity,
    volume: baseAsset.global_volume,
    volumeChange: null,
    market_cap: baseAsset.market_cap,
    price_change_24h: baseAsset.price_change_24h,
  });

  useEffect(() => {
    const stream = setInterval(async () => {
      try {
        const { data } = await supabase
          .from("assets")
          .select("id, name, price_change_24h, global_volume, price, rank")
          .eq("id", baseAsset.id)
          .single();

        if (!data) return;
        setMarketMetrics((marketMetrics: any) => {
          return {
            ...marketMetrics,
            volume: data.global_volume,
            volumeChange:
              data.global_volume - marketMetrics.global_volume > 0
                ? true
                : data.global_volume - marketMetrics.global_volume < 0
                ? false
                : undefined,
            price: data.price,
            priceChange:
              data.price - marketMetrics.price > 0
                ? true
                : data.price - marketMetrics.price < 0
                ? false
                : undefined,
            price_change_24h: data.price_change_24h,
          };
        });
      } catch (error) {
        // console.log(error);
      }
    }, 5 * 1000);

    return () => {
      clearInterval(stream);
    };
  }, []);

  return marketMetrics;
};
