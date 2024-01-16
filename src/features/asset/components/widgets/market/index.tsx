import { useContext } from "react";
import { LargeFont, SmallFont } from "../../../../../components/fonts";
import { BaseAssetContext } from "../../../context-manager";
import { AllTime } from "./ath-atl";
import { BuySellSpread } from "./buy-sell-spread";
import { Liquidity } from "./liquidity";
import { PriceInTime } from "./price-time";
import { TokenVersusMarket } from "./token-versus-market";
import { TradingPairs } from "./trading-pair";

export const Market = () => {
  const { baseAsset } = useContext(BaseAssetContext);
  return (
    <div className="flex mt-5 lg:mt-0 flex-row lg:flex-col-reverse">
      <div className="flex flex-col w-full-345 lg:w-full mr-[25px] lg:mr-0">
        <TradingPairs />
        <TokenVersusMarket />
        <div className="w-full flex md:w-[95%] mx-auto flex-col mt-[50px] md:mt-[30px]">
          <LargeFont extraCss="mb-2.5">
            More about {baseAsset.name} trading pairs
          </LargeFont>
          <SmallFont extraCss="text-light-font-60 dark:text-dark-font-60">
            Mobula aggregates trading pairs directly from the blockchain as well
            as from all CEX to give you the most accurate and up to date
            information. Data is refreshed in real time.
          </SmallFont>
        </div>
        <div className="w-full flex md:w-[95%] mx-auto flex-col mt-[50px] md:mt-[30px]">
          <LargeFont extraCss="mb-2.5">
            More about {baseAsset.name} vs Market
          </LargeFont>
          <SmallFont extraCss="text-light-font-60 dark:text-dark-font-60">
            {baseAsset.name} is compared to market categories & other crypto
            assets over time to give an overview of its performance relative to
            the overall market, and not just its price, especially useful during
            high volatility periods.
          </SmallFont>
        </div>
        <div className="hidden lg:flex flex-col">
          <BuySellSpread extraCss="mt-[30px]" />
          <PriceInTime extraCss="mt-2.5" />
          {Object.keys(baseAsset?.assets_raw_pairs?.pairs_data || {})?.length >
          0 ? (
            <Liquidity extraCss="mt-2.5" />
          ) : null}
        </div>
      </div>
      <div className="flex flex-col lg:hidden max-w-[345px] w-full">
        <PriceInTime />
        <BuySellSpread />
        {Object.keys(baseAsset?.assets_raw_pairs?.pairs_data || {})?.length >
        0 ? (
          <Liquidity />
        ) : null}
        <AllTime />
      </div>
    </div>
  );
};
