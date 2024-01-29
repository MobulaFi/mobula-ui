/* eslint-disable import/no-cycle */
import React, { useContext, useState } from "react";
import { MediumFont, SmallFont } from "../../../../../../components/fonts";
import { cn } from "../../../../../../lib/shadcn/lib/utils";
import { getFormattedAmount } from "../../../../../../utils/formaters";
import { BaseAssetContext } from "../../../../context-manager";
import { FlexBorderBox } from "../../../../style";

interface PairTxnsProps {
  extraCss?: string;
}

type timeframeType = "24h" | "12h" | "4h" | "1h" | "5min";

export const PairTxns = ({ extraCss }: PairTxnsProps) => {
  const { baseAsset } = useContext(BaseAssetContext);
  const [timeframe, setTimeframe] = useState<timeframeType>("24h");

  const getPercentage = (buys: string, sells: string) => {
    const buy = baseAsset?.[buys];
    const sell = baseAsset?.[sells];
    const total = buy + sell;
    const buyPercentage = (buy / total) * 100 || 50;
    const sellPercentage = (sell / total) * 100 || 50;
    return { buyPercentage, sellPercentage };
  };

  const timestamps = ["24h", "12h", "4h", "1h", "5min"];
  return (
    <div
      className={cn(
        `${FlexBorderBox} flex p-5 lg:p-[15px] rounded-2xl lg:rounded-0`,
        extraCss
      )}
    >
      <div className="flex items-center justify-between">
        <MediumFont extraCss="text-lg lg:text-base font-medium mb-0 md:mb-[7.5px] mr-4">
          Trades
        </MediumFont>
        <div
          className="flex items-center w-full relative bg-light-bg-terciary dark:bg-dark-bg-terciary border
       border-light-border-primary dark:border-dark-border-primary rounded-md h-[35px] p-0.5"
        >
          <div className="flex items-center relative justify-between w-full h-full">
            <div
              className="absolute bg-light-bg-hover dark:bg-dark-bg-hover rounded-md transition-all duration-200 ease-linear h-full"
              style={{
                width: `${100 / timestamps?.length}%`,
                left: `${
                  (100 / timestamps?.length) * timestamps.indexOf(timeframe)
                }%`,
              }}
            />
            {timestamps.map((timestamp) => (
              <button
                className={`${
                  timestamp === timeframe
                    ? "text-light-font-100 dark:text-dark-font-100"
                    : "text-light-font-40 dark:text-dark-font-40"
                } transition-all duration-200 ease-linear z-[1] h-full`}
                style={{ width: `${100 / timestamps?.length}%` }}
                onClick={() => setTimeframe(timestamp)}
              >
                {timestamp}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div
        className={`flex w-full justify-between items-center border-b border-light-border-primary dark:border-dark-border-primary py-2.5 px-0 md:px-[2.5%] mt-1.5`}
      >
        <div className="flex items-center">
          <SmallFont
            extraCss={`text-light-font-60 dark:text-dark-font-60 font-medium text-sm lg:text-[13px]`}
          >
            Txns:
          </SmallFont>
        </div>
        <div className={`flex items-center`}>
          <p className="text-[13px] text-light-font-100 dark:text-dark-font-100 font-medium">
            {getFormattedAmount(baseAsset?.[`trades_${timeframe}`])}
          </p>
        </div>
      </div>
      <div
        className={`flex w-full justify-between items-center py-2.5 px-0 md:px-[2.5%]`}
      >
        <div className="flex items-center">
          <SmallFont
            extraCss={`text-light-font-60 dark:text-dark-font-60 font-medium text-sm lg:text-[13px]`}
          >
            Volume:
          </SmallFont>
        </div>
        <div className={`flex items-center`}>
          <p className="text-[13px] text-light-font-100 dark:text-dark-font-100 font-medium">
            ${getFormattedAmount(baseAsset?.[`volume_${timeframe}`])}
          </p>
        </div>
      </div>
      <div className="flex flex-col w-full mt-1.5">
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col w-full">
            <SmallFont extraCss="text-light-font-60 dark:text-dark-font-60">
              Buys
            </SmallFont>
            <SmallFont>
              {getFormattedAmount(baseAsset?.[`buys_${timeframe}`])}
            </SmallFont>
          </div>
          <div className="flex flex-col items-end w-full">
            <SmallFont extraCss="text-light-font-60 dark:text-dark-font-60">
              Sells
            </SmallFont>
            <SmallFont>
              {getFormattedAmount(baseAsset?.[`sells_${timeframe}`])}
            </SmallFont>
          </div>
        </div>
        <div className="flex w-full h-[6px] rounded-full mt-1.5">
          <div
            className="flex h-full bg-green dark:bg-green rounded-l"
            style={{
              width: `${
                getPercentage(`buys_${timeframe}`, `sells_${timeframe}`)
                  ?.buyPercentage
              }%`,
            }}
          />
          <div
            className="flex h-full bg-red dark:bg-red rounded-r"
            style={{
              width: `${
                getPercentage(`buys_${timeframe}`, `sells_${timeframe}`)
                  ?.sellPercentage
              }%`,
            }}
          />
        </div>
      </div>
      <div className="flex flex-col w-full mt-5">
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col w-full">
            <SmallFont extraCss="text-light-font-60 dark:text-dark-font-60">
              Buy Vol
            </SmallFont>
            <SmallFont>
              ${getFormattedAmount(baseAsset?.[`buy_volume_${timeframe}`])}
            </SmallFont>
          </div>
          <div className="flex flex-col items-end w-full">
            <SmallFont extraCss="text-light-font-60 dark:text-dark-font-60">
              Sell Vol
            </SmallFont>
            <SmallFont>
              ${getFormattedAmount(baseAsset?.[`sell_volume_${timeframe}`])}
            </SmallFont>
          </div>
        </div>
        <div className="flex w-full h-[6px] rounded-full mt-1.5">
          <div
            className="flex h-full bg-green dark:bg-green rounded-l"
            style={{
              width: `${
                getPercentage(
                  `buy_volume_${timeframe}`,
                  `sell_volume_${timeframe}`
                )?.buyPercentage
              }%`,
            }}
          />
          <div
            className="flex h-full bg-red dark:bg-red rounded-r"
            style={{
              width: `${
                getPercentage(
                  `buy_volume_${timeframe}`,
                  `sell_volume_${timeframe}`
                )?.sellPercentage
              }%`,
            }}
          />
        </div>
      </div>
    </div>
  );
};
