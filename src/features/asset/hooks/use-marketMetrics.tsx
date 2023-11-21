import { useEffect, useState } from "react";
import { useLiteStreamMarketData } from "../../../utils/stream-chains";
import { Asset } from "../models";

interface MarketChangeProps {
  price: boolean | null;
  volume: boolean | null;
}

export const useMarketMetrics = (token: Asset) => {
  const marketMetrics = useLiteStreamMarketData(token);
  const [marketChanges, setMarketChanges] = useState<MarketChangeProps>({
    volume: null,
    price: null,
  });
  useEffect(() => {
    if (
      marketMetrics &&
      marketMetrics.price &&
      marketMetrics.priceChange !== null
    ) {
      setMarketChanges({
        price: marketMetrics.priceChange,
        volume: marketMetrics.volumeChange,
      });
      setTimeout(() => {
        setMarketChanges({ price: null, volume: null });
      }, 400);
    }
  }, [marketMetrics]);

  return { marketMetrics, marketChanges };
};
