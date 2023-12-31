import React, { useContext, useEffect } from "react";
import { MarketMetrics } from "../../../../../interfaces/trades";
import { SwapProvider } from "../../../../../layouts/swap";
import { SmallSwap } from "../../../../../layouts/swap/swap-variant/small-swap";
import { BaseAssetContext } from "../../../context-manager";
import { ChartHeader } from "./charts/header";
import { ChartLite } from "./charts/linear";
import { CoreActor } from "./core-actor";
import { Description } from "./description";
import { ListingDetails } from "./listing-details";
import { PresaleDetails } from "./presale-details";
import { PriceData } from "./price-data";
import { SimilarAsset } from "./similar-asset";
import { Socials } from "./socials";
import { TimeSwitcher } from "./time-switcher";
import { TokenMetrics } from "./token-metrics";
import { TokenTrades } from "./trades";

interface MarketMetricsProps {
  marketMetrics: MarketMetrics;
}

export const Essentials = ({ marketMetrics }: MarketMetricsProps) => {
  const {
    historyData,
    baseAsset,
    activeChart,
    setShowMobileMetric,
    setActiveMetric,
  } = useContext(BaseAssetContext);
  const isDesktop = typeof window !== "undefined" && window.innerWidth > 768;
  const isOffChain = !baseAsset?.blockchains?.length;
  const hasBeenListed =
    (baseAsset?.trust_score || 0) +
      (baseAsset?.social_score || 0) +
      (baseAsset?.utility || 0) >
    0;

  useEffect(() => {
    setShowMobileMetric(true);
    setActiveMetric("Metrics");
  }, []);

  return (
    <>
      <div className="flex flex-row lg:flex-col-reverse mt-5 lg:mt-0">
        <div className="flex flex-col max-w-[990px] w-calc-full-345 lg:w-full mr-[25px] md:mr-0">
          <ChartHeader />
          <TimeSwitcher extraCss="hidden md:flex mr-0 mt-0" />
          {/* {activeChart === "Trading view" ? (
            <ChartBox
              baseAsset={baseAsset}
              extraCss="min-h-[500px] lg:min-h-[370px] md:min-h-[320px] w-full md:w-[95%] mx-auto h-[520px] lg:h-[420px] md:h-[370px]"
            />
          ) : ( */}
          <ChartLite extraCss="min-h-[480px] lg:min-h-[350px] md:min-h-[300px] sm:min-h-[250px] w-full md:w-[95%] mx-auto h-[480px] lg:h-[400px] md:h-[350px]" />
          {/* )} */}

          <TokenMetrics isMobile extraCss="hidden lg:flex mt-[15px] w-full" />
          {isOffChain ? null : <TokenTrades />}
          <Description />
          <Socials />
          <PriceData />
          <CoreActor
            extraCss={`${
              baseAsset?.investors?.length > 0 ? "lg:flex" : "lg:hidden"
            } hidden`}
          />
        </div>
        <div className="flex flex-col max-w-[345px] lg:max-w-full w-full lg:hidden">
          <div className="flex">
            {isDesktop && (
              <SwapProvider
                tokenOutBuffer={{
                  ...baseAsset,
                  blockchain: baseAsset?.blockchains[0],
                  address:
                    baseAsset && "contracts" in baseAsset
                      ? baseAsset.contracts[0]
                      : undefined,
                  logo: baseAsset?.image || baseAsset?.logo,
                  name: baseAsset?.name || baseAsset?.symbol,
                }}
                lockToken={["out"]}
              >
                <SmallSwap asset={baseAsset} />
              </SwapProvider>
            )}
          </div>
          <TokenMetrics />
          <CoreActor
            extraCss={`${
              baseAsset?.investors?.length > 0 ? "flex" : "hidden"
            } lg:hidden`}
          />
          <PresaleDetails extraCss={`${hasBeenListed ? "flex" : "hidden"}`} />
          <ListingDetails extraCss={`${hasBeenListed ? "flex" : "hidden"}`} />
          <ListingDetails
            extraCss={`${
              hasBeenListed ? "md:flex" : "md:hidden"
            } hidden mt-2.5`}
          />
        </div>
      </div>
      <SimilarAsset />
    </>
  );
};
