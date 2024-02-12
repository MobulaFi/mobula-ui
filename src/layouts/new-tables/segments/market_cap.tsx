import React, { useState } from "react";
import { Segment } from ".";
import { SmallFont } from "../../../components/fonts";
import { Popover } from "../../../components/popover";
import {
  formatAmount,
  getFormattedAmount,
  getTokenPercentage,
} from "../../../utils/formaters";
import { TableAsset } from "../model";

interface MarketCapSegmentProps {
  token: TableAsset;
  display: string;
  metricsChanges: {
    market_cap: boolean | null;
    price: boolean | null;
    rank?: boolean | null;
    volume: boolean | null;
  };
  extraCss?: string;
}

export const MarketCapSegment = ({
  token,
  display,
  metricsChanges,
  extraCss = "",
}: MarketCapSegmentProps) => {
  const [isVisible, setIsVisible] = useState(false);

  const marketMoveColor = () => {
    if (display === "Market Cap") {
      if (metricsChanges.market_cap === true)
        return "text-green dark:text-green";
      if (metricsChanges.market_cap === false) return "text-red dark:text-red";
    }
    return "text-light-font-100 dark:text-dark-font-100";
  };
  const marketColor = marketMoveColor();

  const getMarketCapFromType = () => {
    if (display === "Market Cap" && token.market_cap)
      return `$${getFormattedAmount(token?.market_cap)}`;
    if (display === "Full. Dil. Valuation" && token.market_cap_diluted)
      return `${getFormattedAmount(token.market_cap_diluted)}`;
    if (display === "Circ. Supply" && token.circulating_supply)
      return `${getFormattedAmount(token.circulating_supply)}`;
    if (display === "Liquidity" && token.liquidity)
      return `$${getFormattedAmount(token.liquidity)}`;
    return "-";
  };
  const marketCapFromType = getMarketCapFromType();

  const getPercentage = () => {
    const parsedCirculating = parseFloat(token?.circulating_supply);
    const parsedMax = parseFloat(token?.max_supply);
    if (parsedCirculating && parsedMax) {
      const percentage = (parsedCirculating / parsedMax) * 100;
      return percentage;
    }
    return 0;
  };
  const percentage = getPercentage();

  const [show, setShow] = useState(false);

  return (
    <Segment extraCss={`${extraCss} text-end md:px-[5px]`}>
      {display === "Circ. Supply" ? (
        <div className="w-full items-center justify-end">
          <Popover
            extraCss="min-w-[200px] top-[40px] left-1/2 -translate-x-1/2"
            toggleOnHover={() => setShow((prev) => !prev)}
            visibleContent={
              <div className="flex flex-col items-end h-full w-full">
                <SmallFont
                  extraCss={`${marketColor} mb-[5px] font-medium whitespace-nowrap`}
                >
                  {`${marketCapFromType} ${token?.symbol}`}
                </SmallFont>
                {(percentage || 0) > 0 &&
                token?.circulating_supply < token?.max_supply ? (
                  <div className="w-full flex bg-light-font-10 dark:bg-dark-font-10 h-1.5 rounded-full">
                    <div
                      className="bg-light-font-20 dark:bg-dark-font-20 h-full rounded-full"
                      style={{
                        width: `${percentage}%`,
                      }}
                    />
                  </div>
                ) : null}
              </div>
            }
            hiddenContent={
              <div className="flex flex-col items-center w-full">
                <div className="flex justify-between items-center w-full">
                  <p className="text-[13px] text-light-font-100 dark:text-dark-font-100 text-start whitespace-nowrap font-medium  mr-5 mb-[5px]">
                    Circulating supply
                  </p>
                  <p className="text-[13px] text-light-font-60 dark:text-dark-font-60 mb-[5px] text-end whitespace-nowrap">
                    {`${formatAmount(token?.circulating_supply)} ${
                      token?.symbol
                    }`}
                  </p>
                </div>
                <div className="flex justify-between items-center w-full">
                  <p className="text-[13px] text-start whitespace-nowrap text-light-font-100 dark:text-dark-font-100 font-medium mr-5 mb-[5px]">
                    Max supply
                  </p>
                  <p className="text-[13px] text-light-font-60 dark:text-dark-font-60 mb-[5px] text-end whitespace-nowrap">
                    {`${formatAmount(token?.max_supply)} ${token?.symbol}`}
                  </p>
                </div>
                {token?.total_supply !== token?.max_supply ? (
                  <div className="flex justify-between items-center w-full">
                    <p className="text-[13px] text-start whitespace-nowrap text-light-font-100 dark:text-dark-font-100 font-medium mr-5 mb-[5px]">
                      Total supply
                    </p>
                    <p className="text-[13px] text-light-font-60 dark:text-dark-font-60 mb-[5px] text-end whitespace-nowrap">
                      {`${formatAmount(token?.total_supply)} ${token?.symbol}`}
                    </p>
                  </div>
                ) : null}
                <div className="h-[1px] w-full bg-light-border-primary dark:bg-dark-border-primary my-[5px]" />
                <div className="flex justify-between items-center w-full">
                  <p className="text-[13px] text-start whitespace-nowrap text-light-font-100 dark:text-dark-font-100 font-medium  mb-[5px]">
                    Percentage
                  </p>
                  <p className="text-[13px] text-light-font-60 dark:text-dark-font-60 mb-[5px]">
                    {`${getTokenPercentage(
                      ((token?.circulating_supply || 0) * 100) /
                        (token?.max_supply || 0)
                    )}%`}
                  </p>
                </div>
                <div className="h-1.5 w-full bg-light-border-primary dark:bg-dark-border-primary rounded-full">
                  <div
                    className="bg-light-font-20 dark:bg-dark-font-20 h-full rounded-full"
                    style={{
                      width: `${percentage}%`,
                    }}
                  />
                </div>
              </div>
            }
            isOpen={isVisible && token?.circulating_supply < token?.max_supply}
            onToggle={() => {
              if (
                token?.circulating_supply < token?.max_supply &&
                isVisible === false
              )
                setIsVisible((prev) => !prev);
              else setIsVisible((prev) => !prev);
            }}
          />
        </div>
      ) : (
        <SmallFont extraCss={`${marketColor} font-medium`}>
          {marketCapFromType}
        </SmallFont>
      )}
    </Segment>
  );
};
