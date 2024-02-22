/* eslint-disable import/no-cycle */
import { useContext, useState } from "react";
import { BiChevronDown } from "react-icons/bi";
import { MediumFont, SmallFont } from "../../../../../../components/fonts";
import { Menu } from "../../../../../../components/menu";
import { cn } from "../../../../../../lib/shadcn/lib/utils";
import { getFormattedAmount } from "../../../../../../utils/formaters";
import { BaseAssetContext } from "../../../../context-manager";
import { FlexBorderBox } from "../../../../style";

interface PairTxnsProps {
  extraCss?: string;
}

export const PairTxns = ({ extraCss }: PairTxnsProps) => {
  const { baseAsset } = useContext(BaseAssetContext);
  const [timeframe, setTimeframe] = useState("24h");
  const timestamps = ["24h", "12h", "4h", "1h", "5min"];

  const getPercentage = (buys: string, sells: string) => {
    const buy = baseAsset?.[buys] ?? 0;
    const sell = baseAsset?.[sells] ?? 0;
    const total = buy + sell;
    if (total === 0) return { buyPercentage: 50, sellPercentage: 50 };
    const buyPercentage = (buy / total) * 100;
    const sellPercentage = (sell / total) * 100;
    return { buyPercentage, sellPercentage };
  };

  return (
    <div
      className={cn(
        `${FlexBorderBox} flex p-5 lg:p-[15px] rounded-2xl lg:rounded-0 lg:mt-2.5`,
        extraCss
      )}
    >
      <div className="flex items-center justify-between">
        <MediumFont extraCss="text-lg lg:text-base font-medium mb-0 md:mb-[7.5px] mr-4">
          Trades
        </MediumFont>
        <Menu
          titleCss="px-[7.5px] h-[28px] md:h-[24px] rounded-md bg-light-bg-terciary dark:bg-dark-bg-terciary
                rounded-md text-light-font-100 dark:text-dark-font-100 hover:bg-light-bg-hover hover:dark:bg-dark-bg-hover
                transition-all duration-200 ease-in-out border border-light-border-primary dark:border-dark-border-primary"
          title={
            <div className="flex items-center">
              <SmallFont>{timeframe}</SmallFont>
              <BiChevronDown className="ml-[5px] text-lg md:text-base text-light-font-100 dark:text-dark-font-100" />
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
      <div
        className="flex flex-col w-full mt-2.5
      "
      >
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
              $
              {getFormattedAmount(baseAsset?.[`buy_volume_${timeframe}`], 0, {
                canUseHTML: true,
              })}
            </SmallFont>
          </div>
          <div className="flex flex-col items-end w-full">
            <SmallFont extraCss="text-light-font-60 dark:text-dark-font-60">
              Sell Vol
            </SmallFont>
            <SmallFont>
              $
              {getFormattedAmount(baseAsset?.[`sell_volume_${timeframe}`], 0, {
                canUseHTML: true,
              })}
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
      <div
        className={`flex w-full justify-between items-center border-b border-light-border-primary dark:border-dark-border-primary py-2.5 px-0 md:px-[2.5%] mt-2`}
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
        className={`flex w-full justify-between items-center pt-2.5 px-0 md:px-[2.5%]`}
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
    </div>
  );
};
