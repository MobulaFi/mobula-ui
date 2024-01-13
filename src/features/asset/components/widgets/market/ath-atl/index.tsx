import {
  formatAmount,
  getClosest,
  getDate,
  getFormattedAmount,
} from "@utils/formaters";
import { LargeFont, SmallFont } from "components/fonts";
import { useContext, useMemo } from "react";
import { TbTriangleFilled, TbTriangleInvertedFilled } from "react-icons/tb";
import { timestamp } from "../../../../constant";
import { BaseAssetContext } from "../../../../context-manager";
import { useAthPrice } from "../../../../hooks/use-athPrice";
import { useMarketMetrics } from "../../../../hooks/use-marketMetrics";
import { FlexBorderBox } from "../../../../style";

export const AllTime = () => {
  const { priceLow, priceHigh } = useAthPrice(true);
  const { baseAsset, historyData } = useContext(BaseAssetContext);
  const { marketMetrics } = useMarketMetrics(baseAsset);

  const priceChange = useMemo(() => {
    if (historyData?.price_history) {
      return (
        (marketMetrics.price /
          getClosest(
            historyData.price_history.concat(
              baseAsset.price_history?.price || []
            ),
            Math.max(Date.now() - timestamp.ALL, 0)
          ) -
          1) *
        100
      );
    }
    return baseAsset?.price_change_24h;
  }, [baseAsset, historyData]);
  const isUp = priceChange > 0;

  const getPercentageForAllTime = (value: number) => {
    const percentage = (((baseAsset?.price || 0) - value) / value) * 100;
    return percentage.toFixed(2);
  };

  const percentageATHup =
    Number(getPercentageForAllTime(baseAsset?.ath?.[1])) > 0 || false;
  const percentageATLup =
    Number(getPercentageForAllTime(baseAsset?.atl?.[1])) > 0 || false;

  return (
    <div
      className={`${FlexBorderBox} bg-light-bg-secondary dark:bg-dark-bg-secondary p-5 lg:p-[15px] rounded-2xl lg:rounded-0`}
    >
      <LargeFont extraCss="mb-5 lg:mb-[7.5px]">All Time</LargeFont>
      <div className="flex rounded-md h-[7px] bg-light-bg-hover dark:bg-dark-bg-hover w-full">
        <div
          className={`flex rounded-md h-full ${
            isUp ? "bg-green dark:bg-green" : "bg-red dark:bg-red"
          }`}
          style={{
            width:
              priceLow && priceHigh
                ? `${
                    ((baseAsset.price - priceLow) / (priceHigh - priceLow)) *
                    100
                  }%`
                : "0%",
          }}
        />
      </div>
      <div className="flex items-center justify-between mt-[7.5px]">
        <SmallFont extraCss="text-[13px] font-medium">
          ${formatAmount(priceLow)}
        </SmallFont>
        <SmallFont extraCss="text-[13px] font-medium">
          ${getFormattedAmount(priceHigh)}
        </SmallFont>
      </div>
      <div className="flex items-center justify-between mt-5">
        <div className="flex flex-col">
          <SmallFont extraCss="font-bold mb-[3px]">Low</SmallFont>
          <p className="text-xs text-light-font-60 dark:text-dark-font-60 font-medium">
            {getDate(baseAsset?.atl?.[0])}
          </p>
        </div>
        <div className="flex flex-col items-end">
          <SmallFont extraCss="mb-[3px] text-[13px] font-medium">
            ${formatAmount(baseAsset?.atl?.[1])}
          </SmallFont>
          <div className="flex items-center">
            {percentageATLup ? (
              <TbTriangleFilled className="text-[10px] mr-[5px] text-green dark:text-green" />
            ) : (
              <TbTriangleInvertedFilled className="text-[10px] mr-[5px] text-red dark:text-red" />
            )}
            <p
              className={`text-[13px] md:text-xs font-medium ${
                percentageATLup
                  ? "text-green dark:text-green"
                  : "text-red dark:text-red"
              }`}
            >
              {getPercentageForAllTime(baseAsset?.atl?.[1])}%
            </p>{" "}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between mt-2.5">
        <div className="flex flex-col">
          <SmallFont extraCss="font-bold mb-[3px]">High</SmallFont>
          <p className="text-light-font-60 dark:text-dark-font-60 text-xs font-medium">
            {getDate(baseAsset?.ath?.[0])}
          </p>
        </div>
        <div className="flex flex-col items-end">
          <SmallFont fextraCss="font-bold mb-[3px] text-[13px]">
            ${getFormattedAmount(baseAsset?.ath?.[1])}
          </SmallFont>
          <div className="flex items-center">
            {percentageATHup ? (
              <TbTriangleFilled className="text-[10px] mr-[5px] text-green dark:text-green" />
            ) : (
              <TbTriangleInvertedFilled className="text-[10px] mr-[5px] text-red dark:text-red" />
            )}
            <p
              className={`text-[13px] md:text-xs font-medium ${
                percentageATHup
                  ? "text-green dark:text-green"
                  : "text-red dark:text-red"
              }`}
            >
              {getPercentageForAllTime(baseAsset?.ath?.[1])}%
            </p>{" "}
          </div>
        </div>
      </div>
    </div>
  );
};
