import { blockchainsContent } from "mobula-lite/lib/chains/constants";
import React, { useContext } from "react";
import { FiExternalLink } from "react-icons/fi";
import { SmallFont } from "../../../../../components/fonts";
import { NextChakraLink } from "../../../../../components/link";
import { Skeleton } from "../../../../../components/skeleton";
import { getClosest, getFormattedAmount } from "../../../../../utils/formaters";
import { BaseAssetContext } from "../../../context-manager";
import { Trade } from "../../../models";

interface TradesTemplateProps {
  trade: Trade;
  isSell?: boolean;
  isMyTrades?: boolean;
  date: string | number | undefined;
  isLoading?: boolean;
}

export const TradesTemplate = ({
  trade,
  isSell,
  isMyTrades,
  date,
  isLoading = false,
}: TradesTemplateProps) => {
  const { baseAsset } = useContext(BaseAssetContext);
  return (
    <tr>
      <td
        className={`border-b border-light-border-primary dark:border-dark-border-primary pl-5 
                  md:pl-2.5 pr-2.5 ${
                    isLoading ? "py-5" : "py-[15px]"
                  } text-[11px] lg:text-[10px] md:text-[8px] md:hidden`}
      >
        <div>
          {isLoading ? (
            <Skeleton extraCss="mb-[-2px] md:mb-[-5px] h-[13px] md:h-[11px] w-[40px]" />
          ) : (
            <SmallFont
              extraCss={`mb-[-2px] md:mb-[-5px] ${
                isSell ? "text-red dark:text-red" : "text-green dark:text-green"
              }`}
            >
              {isSell ? "Sell" : "Buy"}
            </SmallFont>
          )}
        </div>
      </td>
      <td
        className="border-b border-light-border-primary dark:border-dark-border-primary pl-5 
                  px-2.5 pr-5 md:pr-2.5 md:py-1.5"
      >
        <div className="flex items-end md:items-start w-full justify-center flex-col">
          {"blockchain" in (trade || {}) || isMyTrades || isLoading ? (
            <SmallFont extraCss="font-medium">
              {isLoading ? (
                <Skeleton extraCss="h-[13px] md:h-[11px] w-[60px]" />
              ) : (
                <NextChakraLink
                  href={
                    "blockchain" in trade && "hash" in trade
                      ? `${blockchainsContent[trade.blockchain]?.explorer}/tx/${
                          trade.hash
                        }`
                      : ""
                  }
                  key={trade.hash}
                  target="_blank"
                >
                  {isMyTrades
                    ? getFormattedAmount((trade.amount || 0) as number, 2)
                    : getFormattedAmount(trade.token_amount as number, 2)}
                </NextChakraLink>
              )}
            </SmallFont>
          ) : null}
          {isLoading ? (
            <Skeleton extraCss="mt-[-4px] md:mt-2 hidden md:flex h-[13px] md:h-[11px] w-[40px]" />
          ) : (
            <SmallFont
              extraCss={`mt-[-4px] md:mt-0 hidden md:flex ${
                isSell ? "text-red dark:text-red" : "text-green dark:text-green"
              } font-medium`}
            >
              $
              {isMyTrades
                ? getFormattedAmount(trade.amount_usd as number, 2)
                : getFormattedAmount(trade.value_usd as number, 2)}
            </SmallFont>
          )}
        </div>
      </td>
      <td
        className="border-b border-light-border-primary dark:border-dark-border-primary pl-5 
                     px-2.5 table-cell md:hidden"
      >
        <div className="flex justify-end w-full min-w-[60%]">
          {isLoading ? (
            <Skeleton extraCss="mr-0 lg:mr-2.5 md:mr-0 h-[13px] md:h-[11px] w-[70px]" />
          ) : (
            <SmallFont
              extraCss={`${
                isSell ? "text-red dark:text-red" : "text-green dark:text-green"
              } mr-0 lg:mr-2.5 md:mr-0`}
            >
              $
              {isMyTrades
                ? getFormattedAmount(trade.amount_usd as number, 2)
                : getFormattedAmount(trade.value_usd as number, 2)}
            </SmallFont>
          )}
        </div>
      </td>
      <td
        className="border-b border-light-border-primary dark:border-dark-border-primary pl-5 
                  px-2.5 min-w-[90px]"
      >
        <div className="flex justify-end w-full">
          {isLoading ? (
            <Skeleton extraCss="h-[13px] md:h-[11px] w-[70px] text-end" />
          ) : (
            <SmallFont
              extraCss={`text-end ${
                isSell ? "text-red dark:text-red" : "text-green dark:text-green"
              }`}
            >
              {isMyTrades ? (
                getFormattedAmount(
                  getClosest(
                    baseAsset?.price_history?.price || [],
                    trade?.timestamp as number
                  )
                )
              ) : (
                <>${getFormattedAmount(trade.token_price)}</>
              )}
            </SmallFont>
          )}
        </div>
      </td>
      <td
        className="border-b border-light-border-primary dark:border-dark-border-primary pl-5 
                     px-2.5 pr-5 md:pr-2.5"
      >
        <div className="flex items-end flex-col">
          {isLoading ? (
            <Skeleton extraCss="h-[13px] md:h-[11px] w-[100px]" />
          ) : (
            <>
              <SmallFont extraCss="font-medium">
                {new Date(date).getHours() > 9
                  ? new Date(date).getHours()
                  : `0${new Date(date).getHours()}`}
                :
                {new Date(date).getMinutes() > 9
                  ? new Date(date).getMinutes()
                  : `0${new Date(date).getMinutes()}`}
                :
                {new Date(date).getSeconds() > 9
                  ? new Date(date).getSeconds()
                  : `0${new Date(date).getSeconds()}`}
              </SmallFont>
              {isMyTrades ? (
                <SmallFont extraCss="text-xs font-medium">
                  {trade.date}
                </SmallFont>
              ) : null}{" "}
            </>
          )}
        </div>
      </td>
      <td
        className="border-b border-light-border-primary dark:border-dark-border-primary pl-5 
                            px-2.5 pr-5 md:pr-2.5"
      >
        <div className="flex items-center justify-end  w-full">
          {"blockchain" in trade || isMyTrades || isLoading ? (
            <>
              {isLoading ? (
                <>
                  <Skeleton extraCss="ml-[15px] md:ml-0 mb-[3px] mr-[7.5px] h-[13px] md:h-[11px] w-[30px]" />
                  <Skeleton extraCss="w-[18px] h-[18px] min-w-[18px] mb-0.5 rounded-full" />
                </>
              ) : (
                <>
                  <NextChakraLink
                    href={
                      "blockchain" in trade && "hash" in trade
                        ? `${
                            blockchainsContent[trade.blockchain]?.explorer
                          }/tx/${trade.hash}`
                        : ""
                    }
                    key={trade.hash}
                    target="_blank"
                  >
                    <FiExternalLink className="ml-[15px] md:ml-0 mb-[3px] mr-[7.5px] text-light-font-40 dark:text-dark-font-40" />
                  </NextChakraLink>

                  <img
                    className="w-[18px] h-[18px] min-w-[18px] mb-0.5 rounded-full"
                    src={
                      blockchainsContent[trade.blockchain]?.logo ||
                      `/logo/${
                        trade.blockchain.toLowerCase().split(" ")[0]
                      }.png`
                    }
                    alt={`${trade.blockchain} logo`}
                  />
                </>
              )}
            </>
          ) : null}
        </div>
      </td>
    </tr>
  );
};
