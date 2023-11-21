import { useContext, useEffect, useState } from "react";
import { BaseAssetContext } from "../context-manager";

export const useAthPrice = (forAll?: boolean) => {
  const { unformattedHistoricalData, timeSelected } =
    useContext(BaseAssetContext);
  const [priceLow, setPriceLow] = useState<number | null>(null);
  const [priceHigh, setPriceHigh] = useState<number | null>(null);

  useEffect(() => {
    if (unformattedHistoricalData) {
      setPriceLow(
        Math.min(
          ...(
            unformattedHistoricalData?.price?.[forAll ? "ALL" : timeSelected] ||
            []
          ).map((entry) => entry[1])
        )
      );
      setPriceHigh(
        Math.max(
          ...(
            unformattedHistoricalData?.price?.[forAll ? "ALL" : timeSelected] ||
            []
          ).map((entry) => entry[1])
        )
      );
    }
  }, [timeSelected, unformattedHistoricalData]);

  return { priceLow, priceHigh };
};
