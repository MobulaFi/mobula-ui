/* eslint-disable import/no-cycle */
import React, { useContext, useState } from "react";
import { BsChevronDown } from "react-icons/bs";
import { MediumFont, SmallFont } from "../../../../../../components/fonts";
import { Menu } from "../../../../../../components/menu";
import { cn } from "../../../../../../lib/shadcn/lib/utils";
import { BaseAssetContext } from "../../../../context-manager";
import { FlexBorderBox } from "../../../../style";

interface PairTxnsProps {
  extraCss?: string;
}

type timeframeType = "24h" | "12h" | "4h" | "1h" | "5min";

export const PairTxns = ({ extraCss }: PairTxnsProps) => {
  const { baseAsset } = useContext(BaseAssetContext);
  const [timeframe, setTimeframe] = useState<timeframeType>("24h");
  console.log("baeeeee", baseAsset);
  const getPercentage = () => {
    const buy = baseAsset?.[`buys_${timeframe}`];
    const sell = baseAsset?.[`sells_${timeframe}`];
    const total = buy + sell;
    const buyPercentage = (buy / total) * 100;
    const sellPercentage = (sell / total) * 100;
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
      <div className="flex items-center justify-between w-full">
        <MediumFont extraCss="mb-0 md:mb-[7.5px]">Trades</MediumFont>
        <Menu
          titleCss="px-[7.5px] h-[28px] md:h-[24px] rounded-md bg-light-bg-terciary dark:bg-dark-bg-terciary
                rounded-md text-light-font-100 dark:text-dark-font-100 hover:bg-light-bg-hover hover:dark:bg-dark-bg-hover
                transition-all duration-200 ease-in-out border border-light-border-primary dark:border-dark-border-primary"
          title={
            <div className="flex items-center">
              <SmallFont>{timeframe}</SmallFont>
              <BsChevronDown className="ml-[7.5px] md:ml-[5px] text-sm md:text-xs text-light-font-100 dark:text-dark-font-100" />
            </div>
          }
        >
          {timestamps.map((time) => (
            <button
              key={time}
              onClick={() => setTimeframe(time)}
              className={`transition-all duration-200 py-[5px] bg-light-bg-terciary dark:bg-dark-bg-terciary text-sm lg:text-[13px] md:text-xs 
                       rounded-md ${
                         timeframe === time
                           ? "text-light-font-100 dark:text-dark-font-100"
                           : "text-light-font-40 dark:text-dark-font-40 hover:text-light-font-100 hover:dark:text-dark-font-100"
                       }`}
            >
              {time}
            </button>
          ))}
        </Menu>
      </div>
      <div className="flex items-center justify-space-around w-full mt-5">
        <div className="flex flex-col item-center justify-center bg-darkgreen dark:bg-darkgreen border border-green dark:border-green">
          <SmallFont>Buys</SmallFont>
          <MediumFont extraCss="font-medium text-green dark:text-green">
            {baseAsset?.sells_24h}
          </MediumFont>
        </div>
      </div>
      <div className="flex w-full h-[9px] rounded-full mt-[30px]">
        <div
          className="flex h-full bg-green dark:bg-green rounded-l"
          style={{
            width: `${getPercentage()?.buyPercentage}%`,
          }}
        />
        <div
          className="flex h-full bg-red dark:bg-red rounded-r"
          style={{
            width: `${getPercentage()?.sellPercentage}%`,
          }}
        />
      </div>
    </div>
  );
};
