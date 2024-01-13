import React, { useContext } from "react";
import { BsCheckLg } from "react-icons/bs";
import { ExtraSmallFont, SmallFont } from "../../../../../components/fonts";
import { NextImageFallback } from "../../../../../components/image";
import { BaseAssetContext } from "../../../context-manager";

export const TradeLiquidityPoolPopup = () => {
  const { selectedTradeFilters } = useContext(BaseAssetContext);
  return (
    <div className="flex flex-col max-h-[400px] overflow-y-scroll">
      {Array.from({ length: 5 })?.map((_, i) => (
        <div
          key={i}
          className={`flex items-center ${i !== 0 ? "mt-[7.5px]" : ""} ${
            i === ([1, 2, 3, 4, 5].length || 0) - 1 ? "" : "mb-[7.5px]"
          }`}
        >
          <button className="flex items-center justify-center w-4 h-4 rounded-md border-light-border-secondary dark:border-dark-border-secondary border">
            <BsCheckLg
              className={`text-[11px] text-light-font-100 dark:text-dark-font-100 ${
                selectedTradeFilters.liquidity_pool.includes("entry")
                  ? "opacity-100"
                  : "opacity-0"
              }`}
            />
          </button>
          <NextImageFallback
            width={25}
            height={25}
            className="ml-[15px] rounded-full mr-2.5 min-w-[25px]"
            src="/logo/cardano.png"
            fallbackSrc="/logo/cardano.png"
          />
          <div className="flex flex-col">
            <SmallFont>Cardano</SmallFont>
            <ExtraSmallFont extraCss="text-light-font-40 dark:text-dark-font-40">
              Uniswap * Liquidity: $XXM
            </ExtraSmallFont>
          </div>
        </div>
      ))}
    </div>
  );
};
