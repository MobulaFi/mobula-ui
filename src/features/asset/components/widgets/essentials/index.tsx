import { useContext, useEffect, useState } from "react";
import { SwapProvider } from "../../../../../layouts/swap/";
import { SmallSwap } from "../../../../../layouts/swap/swap-variant/small-swap";
import TradingViewChart from "../../../../../lib/trading-view/index";
import { BaseAssetContext } from "../../../context-manager";
import { SimilarAsset } from "./similar-asset";
import { TokenMetrics } from "./token-metrics";
import { TokenTrades } from "./trades";

export const Essentials = () => {
  const {
    baseAsset,
    setShowMobileMetric,
    isAssetPage,
    activeChart,
    setActiveMetric,
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
          <TradingViewChart
            baseAsset={baseAsset}
            isPair={!isAssetPage}
            extraCss="min-h-[500px] lg:min-h-[370px] md:min-h-[320px] w-full md:w-full mx-auto h-[520px] lg:h-[420px] md:h-[370px] mt-2.5 md:mt-0"
          />
          <TokenTrades />
          {/*     <ChartHeader
            setChartPreference={setChartPreference}
            chartPreference={chartPreference}
          />
          {chartPreference !== "Trading view" && !isAssetPage ? (
            <TimeSwitcher extraCss="hidden md:flex mr-0 mt-0" />
          ) : null}
          {chartPreference === "Trading view" || isAssetPage ? (
            <TradingViewChart
              baseAsset={{} as any || baseAsset}
              extraCss="min-h-[500px] lg:min-h-[370px] md:min-h-[320px] w-full md:w-full mx-auto h-[520px] lg:h-[420px] md:h-[370px] mt-2.5 md:mt-0"
            />
          ) : (
            <ChartLite extraCss="min-h-[480px] lg:min-h-[350px] md:min-h-[300px] sm:min-h-[250px] w-full md:w-[95%] mx-auto h-[480px] lg:h-[400px] md:h-[350px]" />
          )}
          <TokenMetrics isMobile extraCss="hidden lg:flex mt-[15px] w-full" />
          {isOffChain ? null : <TokenTrades />}
          <Description />
          <Socials />
          <PriceData />
          <CoreActor
            extraCss={`${
              baseAsset?.investors?.length > 0 ? "lg:flex" : "lg:hidden"
            } hidden`}
          />*/}
        </div>
        <div className="flex flex-col max-w-[345px] lg:max-w-full w-full lg:hidden">
          <div className="flex">
            {isDesktop && isAssetPage && (
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
          <TokenMetrics />
          {/* <CoreActor
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
          /> */}
        </div>
      </div>
      <SimilarAsset />
    </>
  );
};
