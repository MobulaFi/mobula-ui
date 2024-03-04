import { useContext, useEffect, useState } from "react";
import { SwapProvider } from "../../../../../layouts/swap/";
import { SmallSwap } from "../../../../../layouts/swap/swap-variant/small-swap";
import TradingViewChart from "../../../../../lib/trading-view/index";
import { BaseAssetContext } from "../../../context-manager";
import { ChartHeader } from "./charts/header";
import { ChartLite } from "./charts/linear";
import { CoreActor } from "./core-actor";
import { Description } from "./description";
import { ListingDetails } from "./listing-details";
import { PairTxns } from "./pairs-txns";
import { PresaleDetails } from "./presale-details";
import { PriceData } from "./price-data";
import { SimilarAsset } from "./similar-asset";
import { TimeSwitcher } from "./time-switcher";
import { TokenMetrics } from "./token-metrics";
import { TokenTrades } from "./trades";

export const Essentials = () => {
  const {
    baseAsset,
    setShowMobileMetric,
    setGlobalPairs,
    isAssetPage,
    setActiveMetric,
    setFadeIn,
    switchedToNative,
    orderBy,
  } = useContext(BaseAssetContext);
  const [chartPreference, setChartPreference] = useState("");
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

  useEffect(() => {
    const storedChartPreference = localStorage.getItem("chartPreference");
    if (storedChartPreference) {
      setChartPreference(storedChartPreference);
    } else {
      setChartPreference("Linear");
      localStorage.setItem("chartPreference", "Linear");
    }
  }, []);

  return (
    <>
      <div className="flex flex-row lg:flex-col-reverse mt-5 lg:mt-0">
        <div className="flex flex-col left-container-max-width w-calc-full-345 lg:w-full mr-[25px] md:mr-0 mt-1.5 md:mt-0">
          {isAssetPage ? (
            <ChartHeader
              setChartPreference={setChartPreference}
              chartPreference={chartPreference}
            />
          ) : null}
          {chartPreference !== "Trading view" && isAssetPage ? (
            <TimeSwitcher extraCss="hidden md:flex mr-0 mt-0" />
          ) : null}
          {chartPreference === "Trading view" || !isAssetPage ? (
            <TradingViewChart
              baseAsset={baseAsset}
              isPair={!isAssetPage}
              setFadeIn={setFadeIn}
              isUsd={isAssetPage ? undefined : !switchedToNative}
              setPairTrades={setGlobalPairs}
              shouldLoadMoreTrade={orderBy === "desc"}
              extraCss="min-h-[500px] lg:min-h-[370px] md:min-h-[320px] w-full md:w-full mx-auto h-[520px] lg:h-[420px] md:h-[370px] mt-2.5 md:mt-0"
            />
          ) : (
            <ChartLite extraCss="min-h-[480px] lg:min-h-[350px] md:min-h-[300px] sm:min-h-[250px] w-full md:w-[95%] mx-auto h-[480px] lg:h-[400px] md:h-[350px]" />
          )}
          {(!isOffChain && chartPreference === "Trading view") ||
          !isAssetPage ? (
            <TokenTrades />
          ) : null}
          <TokenMetrics isMobile extraCss="hidden lg:flex mt-[15px] w-full" />
          {isAssetPage ? (
            <>
              <Description />
              {/* <Socials /> */}
              <PriceData />
              <CoreActor
                extraCss={`${
                  baseAsset?.investors?.length > 0 ? "lg:flex" : "lg:hidden"
                } hidden`}
              />
            </>
          ) : (
            <PairTxns extraCss="hidden lg:flex" />
          )}
        </div>
        <div className="flex flex-col max-w-[345px] lg:max-w-full w-full lg:hidden">
          <div className="flex">
            {isDesktop && isAssetPage ? (
              <SwapProvider
                tokenOutBuffer={{
                  ...baseAsset,
                  blockchain: baseAsset?.blockchains?.[0],
                  address:
                    baseAsset && "contracts" in baseAsset
                      ? baseAsset.contracts?.[0]
                      : undefined,
                  logo: baseAsset?.image || baseAsset?.logo,
                  name: baseAsset?.name || baseAsset?.symbol,
                }}
                lockToken={["out"]}
              >
                <SmallSwap asset={baseAsset} />
              </SwapProvider>
            ) : null}
            {!isAssetPage && (
              <SwapProvider
                tokenInBuffer={{
                  ...baseAsset?.[baseAsset?.quoteToken],
                  contracts: [baseAsset?.[baseAsset?.quoteToken]?.address],
                  blockchains: [baseAsset?.blockchain],
                  blockchain: baseAsset?.blockchain,
                  address: baseAsset?.[baseAsset?.quoteToken]?.address,
                  logo:
                    baseAsset?.[baseAsset?.quoteToken]?.logo ||
                    "/empty/unknown.png",
                  name:
                    baseAsset?.[baseAsset?.quoteToken]?.name ||
                    baseAsset?.[baseAsset?.quoteToken]?.symbol,
                }}
                tokenOutBuffer={{
                  ...baseAsset?.[baseAsset?.baseToken],
                  contracts: [baseAsset?.[baseAsset?.baseToken]?.address],
                  blockchains: [baseAsset?.blockchain],
                  blockchain: baseAsset?.blockchain,
                  address: baseAsset?.[baseAsset?.baseToken]?.address,
                  logo:
                    baseAsset?.[baseAsset?.baseToken]?.logo ||
                    "/empty/unknown.png",
                  name:
                    baseAsset?.[baseAsset?.baseToken]?.name ||
                    baseAsset?.[baseAsset?.baseToken]?.symbol,
                }}
                lockToken={["in", "out"]}
              >
                <SmallSwap asset={baseAsset} />
              </SwapProvider>
            )}
          </div>
          {!isAssetPage ? <PairTxns extraCss="flex lg:hidden" /> : null}
          <TokenMetrics />
          {isAssetPage ? (
            <>
              <CoreActor
                extraCss={`${
                  baseAsset?.investors?.length > 0 ? "flex" : "hidden"
                } lg:hidden`}
              />
              <PresaleDetails
                extraCss={`${hasBeenListed ? "flex" : "hidden"}`}
              />
              <ListingDetails
                extraCss={`${hasBeenListed ? "flex" : "hidden"}`}
              />
              <ListingDetails
                extraCss={`${
                  hasBeenListed ? "md:flex" : "md:hidden"
                } hidden mt-2.5`}
              />
            </>
          ) : null}
        </div>
      </div>
      {isAssetPage ? <SimilarAsset /> : null}
    </>
  );
};
