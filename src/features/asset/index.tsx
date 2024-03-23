"use client";
import { usePathname } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import { BsTelegram } from "react-icons/bs";
import { useSwipeable } from "react-swipeable";
import { Button } from "../../components/button";
import { Container } from "../../components/container";
import { SmallFont } from "../../components/fonts";
import { NextChakraLink } from "../../components/link";
import { TagPercentage } from "../../components/tag-percentage";
import { TopNav } from "../../layouts/menu-mobile/top-nav";
import { SwapProvider } from "../../layouts/swap";
import { BasicSwap } from "../../layouts/swap/swap-variant/basic-swap";
import { pushData } from "../../lib/mixpanel";
import { PriceAlertPopup } from "../../popup/price-alert";
import {
  convertScientificNotation,
  getFormattedAmount,
  getUrlFromName,
} from "../../utils/formaters";
import { useLiteStreamMarketDataModule } from "../../utils/stream-chains";
import { PairsSocialInfo } from "./components/pairs-social-info";
import { PopupSocialMobile } from "./components/popup/popup-social-mobile";
import { PopupAllTags } from "./components/popup/tags";
import { TradeFiltersPopup } from "./components/popup/trade-filters";
import { TokenMainInfo } from "./components/token-main-info";
import { TokenSocialsInfo } from "./components/token-social-info";
import { Essentials } from "./components/widgets/essentials";
import { Fundraising } from "./components/widgets/fundraising";
import { Market } from "./components/widgets/market";
import { SocialsDeveloper } from "./components/widgets/social-developer";
import { Tokenomic } from "./components/widgets/tokenomic";
import { Vesting } from "./components/widgets/vesting";
import { BaseAssetContext } from "./context-manager";
import { Asset, PrevPathProps } from "./models";
import { mainButtonStyle } from "./style";

interface AssetProps {
  isAssetPage?: boolean;
  asset?: Asset;
}

export const Assets = ({ asset, isAssetPage }: AssetProps) => {
  const {
    baseAsset,
    marketMetrics,
    setMarketMetrics,
    filters,
    showTargetPrice,
    setShowTargetPrice,
    setIsMarketMetricsLoading,
    shouldInstantLoad,
    setActiveTab,
    activeTab,
    setBaseAsset,
  } = useContext(BaseAssetContext);
  const pathname = usePathname();
  const [isBreadCrumbLoading, setIsBreadCrumbLoading] = useState(true);
  const [previousTab, setPreviousTab] = useState<string | null>(null);
  const [canSwipe, setCanSwipe] = useState(false);
  const [prevPaths, setPrevPaths] = useState<PrevPathProps[]>([
    {
      name: "Home",
      url: "/home",
    },
  ]);

  useEffect(() => {
    if (!isAssetPage && baseAsset && !baseAsset?.social) {
      fetch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/1/metadata?asset=${
          baseAsset?.[baseAsset?.baseToken]?.address
        }&blockchain=${baseAsset?.blockchain}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: process.env.NEXT_PUBLIC_PRICE_KEY as string,
          },
        }
      )
        .then((r) => r.json())
        .then((r) => {
          if (r.data) {
            setBaseAsset((prev) => ({
              ...prev,
              social: r.data,
            }));
          }
        });

      fetch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/1/market/pair?address=${baseAsset?.address}&stats=true`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: process.env.NEXT_PUBLIC_PRICE_KEY as string,
          },
        }
      )
        .then((r) => r.json())
        .then((r) => {
          if (r.data) {
            setBaseAsset((prev) => ({
              ...prev,
              ...r.data,
            }));
          }
        });
    }
  }, [baseAsset]);

  useLiteStreamMarketDataModule(
    baseAsset,
    marketMetrics,
    setMarketMetrics,
    filters,
    setIsMarketMetricsLoading,
    true
  );

  useEffect(() => {
    setIsMarketMetricsLoading(true);
  }, [filters]);

  useEffect(() => {
    if (baseAsset)
      setMarketMetrics({
        price: baseAsset?.price,
        priceChange: null,
        volume: 0,
        volumeChange: null,
        liquidity: 0,
        market_cap: baseAsset.market_cap,
        trade_history: filters.length > 0 ? [] : baseAsset?.trade_history,
      });
  }, [baseAsset]);

  const isMobile =
    (typeof window !== "undefined" ? window.innerWidth : 0) < 768;

  const tabs = [
    "Essentials",
    "Market",
    "Fundraising",
    "Vesting",
    ...(isMobile ? ["Buy"] : []),
  ];

  function switchTab(dir) {
    if (isAssetPage) {
      setPreviousTab(activeTab);
      if (isMobile) {
        const currentIndex = tabs.findIndex((tab) => tab === activeTab);
        if (dir === "next" && currentIndex < tabs.length - 1) {
          if (
            tabs[currentIndex + 1] === "Fundraising" &&
            !asset?.sales?.length &&
            tabs[currentIndex + 2] === "Vesting" &&
            !asset?.release_schedule?.length
          ) {
            setActiveTab(tabs[currentIndex + 3]);
          } else if (
            tabs[currentIndex + 1] === "Fundraising" &&
            !asset?.sales?.length &&
            tabs[currentIndex + 2] === "Vesting" &&
            asset?.release_schedule?.length > 0
          ) {
            setActiveTab(tabs[currentIndex + 2]);
          } else if (
            tabs[currentIndex + 1] === "Fundraising" &&
            asset?.sales?.length > 0
          ) {
            setActiveTab(tabs[currentIndex + 1]);
          } else if (
            tabs[currentIndex + 1] === "Vesting" &&
            !asset?.release_schedule?.length
          ) {
            setActiveTab(tabs[currentIndex + 2]);
          } else setActiveTab(tabs[currentIndex + 1]);
        } else if (dir === "previous" && currentIndex > 0) {
          if (
            tabs[currentIndex - 2] === "Fundraising" &&
            !asset?.sales?.length &&
            tabs[currentIndex - 1] === "Vesting" &&
            !asset?.release_schedule?.length
          ) {
            setActiveTab(tabs[currentIndex - 3]);
          } else if (
            tabs[currentIndex - 2] === "Fundraising" &&
            !asset?.sales?.length &&
            tabs[currentIndex + 1] === "Vesting" &&
            asset?.release_schedule?.length > 0
          ) {
            setActiveTab(tabs[currentIndex - 2]);
          } else if (
            tabs[currentIndex - 1] === "Fundraising" &&
            asset?.sales?.length > 0
          ) {
            setActiveTab(tabs[currentIndex - 1]);
          } else if (
            tabs[currentIndex - 1] === "Vesting" &&
            !asset?.release_schedule?.length &&
            tabs[currentIndex - 2] === "Fundraising" &&
            asset?.sales?.length > 0
          ) {
            setActiveTab(tabs[currentIndex - 2]);
          } else setActiveTab(tabs[currentIndex - 1]);
        }
      }
    }
  }

  useEffect(() => {
    setTimeout(() => setCanSwipe(true), 1000);
  }, []);

  let swipeStartTime = 0;

  const handlers = useSwipeable({
    onSwiping: (event) => {
      if (swipeStartTime === 0) {
        swipeStartTime = event.event.timeStamp;
      }
    },
    onSwipedLeft: (event) => {
      const swipeEndTime = event.event.timeStamp;
      const duration = swipeEndTime - swipeStartTime;
      if (duration < 200) {
        window.scrollTo(0, 0);
        switchTab("next");
        swipeStartTime = 0;
      }
    },
    onSwipedRight: (event) => {
      const swipeEndTime = event.event.timeStamp;
      const duration = swipeEndTime - swipeStartTime;
      if (duration < 200) {
        window.scrollTo(0, 0);
        switchTab("previous");
        swipeStartTime = 0;
      }
    },
    trackMouse: false,
    delta: 80,
    trackTouch: true,
    rotationAngle: 0,
  });

  const getAnimation = (name) => {
    if (isMobile && canSwipe && previousTab && activeTab !== previousTab) {
      if (activeTab === name) {
        if (tabs.indexOf(previousTab) < tabs.indexOf(activeTab)) {
          return `animate-slide-in-right`;
        }
        return `animate-slide-in-left`;
      }
      if (previousTab === name) {
        if (tabs.indexOf(previousTab) < tabs.indexOf(activeTab)) {
          return `animate-slide-out-left`;
        }
        return `animate-slide-out-right`;
      }
    }
    return "none";
  };

  const format = (str) => {
    let formattedUrl = "";
    const splitUrl = str.split("/");
    formattedUrl = splitUrl[splitUrl.length - 1];
    return formattedUrl.charAt(0).toUpperCase() + formattedUrl.slice(1);
  };

  const getPreviousPath = () => {
    const previousPaths = localStorage.getItem("prevPath");
    const beforeFormattedPaths = previousPaths;
    const previous: PrevPathProps[] = [];

    if (!previousPaths) {
      setIsBreadCrumbLoading(false);
      return;
    }

    if (beforeFormattedPaths === "/home") {
      previous.push({
        name: "Home",
        url: "/home",
      });
    } else {
      previous.push({
        name: format(beforeFormattedPaths),
        url: beforeFormattedPaths,
      });
    }
    previous.push({
      name: format(pathname),
      url: pathname,
    });
    setPrevPaths(previous);
    setIsBreadCrumbLoading(false);
  };

  useEffect(() => {
    setTimeout(() => {
      getPreviousPath();
    }, 200);
  }, [pathname]);

  const pairsStats = [
    {
      key: "Liquidity",
      value:
        baseAsset?.token0?.approximateReserveUSD +
        baseAsset?.token1?.approximateReserveUSD,
      isAmount: true,
    },
    {
      key: "Volume",
      value: baseAsset?.volume_24h,
      isAmount: true,
    },
    {
      key: "M.Cap",
      value:
        baseAsset?.[baseAsset?.baseToken]?.circulatingSupply *
        baseAsset?.[baseAsset?.baseToken]?.price,
      isAmount: true,
    },

    {
      key: "5min",
      value: baseAsset?.price_change_5min,
      isPercentage: true,
    },
    {
      key: "1h",
      value: baseAsset?.price_change_1h,
      isPercentage: true,
    },
    {
      key: "4h",
      value: baseAsset?.price_change_4h,
      isPercentage: true,
    },
    {
      key: "12h",
      value: baseAsset?.price_change_12h,
      isPercentage: true,
    },
    {
      key: "24h",
      value: baseAsset?.price_change_24h,
      isPercentage: true,
    },
  ];

  const getUrlFromTab = (tab: string) => {
    if (!isAssetPage) return;
    let name = "";
    if (tab === "Market") name = "market";
    if (tab === "Fundraising" && asset?.sales?.length > 0) name = "fundraising";
    if (tab === "Vesting" && asset?.release_schedule?.length > 0)
      name = "vesting";
    return `/asset/${getUrlFromName(asset?.name as string)}/${name}`;
  };

  return (
    <>
      {!isAssetPage && !baseAsset?.[baseAsset?.baseToken]?.logo ? (
        <div
          className="flex py-2 items-center justify-center w-full bg-light-bg-secondary dark:bg-dark-bg-secondary 
          border-b border-light-border-primary dark:border-dark-border-primary"
        >
          <SmallFont extraCss="text-light-font-60 dark:text-dark-font-60">
            This asset isn't listed on Mobula.{" "}
            <NextChakraLink href="/list">List it now!</NextChakraLink>
          </SmallFont>
        </div>
      ) : null}
      <div className="flex flex-col mt-5 md:mt-0" {...handlers}>
        {isAssetPage ? (
          <TopNav
            list={tabs}
            setActive={setActiveTab}
            active={activeTab}
            setPreviousTab={setPreviousTab}
          />
        ) : null}
        <Container extraCss="md:w-full mt-0 maximum-width">
          {baseAsset?.name === "YEBAT" ? (
            <div
              className="flex bg-light-bg-terciary dark:bg-dark-bg-terciary rounded
             p-[5px] w-[90%] sm:w-[95%] mb-2.5 items-center justify-center"
            >
              <SmallFont extraCss="ml-2.5">
                Yebat is running a Buy contest on Telegram.{" "}
                {!isMobile
                  ? "Join them to learn more & try to earn up to 1 BNB!"
                  : ""}
              </SmallFont>
              <Button
                extraCss="mx-2.5"
                onClick={() => {
                  pushData("Telegram Clicked");
                  window.open("https://t.me/yebatcoin", "_blank");
                }}
              >
                <BsTelegram className="text-xl" />
              </Button>
            </div>
          ) : null}{" "}
          {isAssetPage ? (
            <div className="flex items-center lg:items-start flex-row lg:flex-col justify-between w-full md:w-[100%] mx-auto pb-0 md:pb-2.5">
              <div className="max-w-[400px] w-full lg:max-w-full">
                <TokenMainInfo />
              </div>
              <TokenSocialsInfo />
            </div>
          ) : (
            <div className="flex flex-col w-full">
              <div className="flex items-center justify-between w-full flex-wrap md:mt-2.5">
                <div className="max-w-[600px] w-fit lg:min-w-[340px] md:max-w-full md:w-full mb-2.5 ">
                  <TokenMainInfo />
                </div>
                <PairsSocialInfo />
              </div>
              <div className="flex items-center w-full flex-wrap mt-2.5 border-t border-b border-light-border-secondary dark:border-dark-border-secondary ">
                {pairsStats.map((pair, i) => {
                  return (
                    <div
                      key={pair.key}
                      className={`flex flex-col px-5 md:px-0 py-3 h-full min-w-[80px] items-center justify-center w-[12.5%] md:w-[25%] ${
                        i > 3
                          ? "md:border-t md:border-light-border-secondary md:dark:border-dark-border-secondary"
                          : ""
                      } ${
                        i !== 0 && i !== 4
                          ? "border-l border-light-border-secondary dark:border-dark-border-secondary "
                          : ""
                      }
                    ${i === 3 ? "border-r md:border-r-0" : ""}
                    `}
                    >
                      <SmallFont extraCss="text-light-font-100 dark:text-dark-font-100 text-center mb-1">
                        {pair.key}
                      </SmallFont>
                      {pair?.isPercentage ? (
                        <TagPercentage
                          percentage={convertScientificNotation(pair?.value)}
                          isUp={pair?.value > 0}
                          inhert={pair?.value === 0}
                          isLoading={!pair?.value && pair?.value !== 0}
                          extraCss="ml-0"
                        />
                      ) : (
                        <SmallFont extraCss={`mt-1 text-center`}>
                          {pair?.isAmount ? (
                            <span>
                              $
                              {getFormattedAmount(pair?.value, 0, {
                                canUseHTML: true,
                              })}
                            </span>
                          ) : (
                            <span>{getFormattedAmount(pair?.value)}</span>
                          )}
                        </SmallFont>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          <div
            className={`hidden ${
              isAssetPage ? "md:flex" : ""
            } mb-0 md:mb-0.5 h-0.5 bg-light-border-primary dark:bg-dark-border-primary w-full`}
          />
          {isAssetPage ? (
            <>
              <div
                className="flex items-center justify-between mt-5 lg:mt-[15px] md:mt-2.5 py-5 lg:py-[15px]
           md:py-2.5 border-t border-b border-light-border-primary dark:border-dark-border-primary 
           overflow-x-scroll scroll w-full md:w-[95%] mx-auto md:hidden"
              >
                <div className="flex">
                  {tabs
                    ?.filter((tab) => tab !== "Buy")
                    // ?.filter(tab => {
                    //   if (tab === "Fundraising") return baseAsset?.sales?.length > 0;
                    //   return tab;
                    // })
                    ?.map((tab) => {
                      return (
                        <NextChakraLink
                          key={tab}
                          href={getUrlFromTab(tab)}
                          disabled={
                            (tab === "Fundraising" && !asset?.sales?.length) ||
                            (tab === "Vesting" &&
                              !asset?.release_schedule?.length)
                          }
                        >
                          <Button
                            key={tab}
                            extraCss={`${mainButtonStyle} px-2.5 border ${
                              tab === activeTab
                                ? "border-blue dark:border-blue"
                                : ""
                            } ${
                              (tab === "Fundraising" &&
                                !asset?.sales?.length) ||
                              (tab === "Vesting" &&
                                !asset?.release_schedule?.length)
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}

                            // onClick={() => {
                            //   setActiveTab(tab);
                            // }}
                          >
                            {tab}
                          </Button>
                        </NextChakraLink>
                      );
                    })}
                </div>
              </div>
              {activeTab === "Essentials" ? (
                <div
                  style={{
                    animation: getAnimation("Essentials"),
                    position:
                      activeTab === "Essentials" ? "static" : "absolute",
                  }}
                >
                  <Essentials />
                </div>
              ) : null}
              {activeTab === "Market" ? (
                <div
                  style={{
                    animation: getAnimation("Market"),
                    position: activeTab === "Market" ? "static" : "absolute",
                  }}
                >
                  <Market />
                </div>
              ) : null}
              {activeTab === "Social & Developer" ? (
                <div
                  style={{
                    animation: getAnimation("Social & Developer"),
                    position:
                      activeTab === "Social & Developer"
                        ? "static"
                        : "absolute",
                  }}
                >
                  <SocialsDeveloper />
                </div>
              ) : null}
              {activeTab === "Tokenomic" ? (
                <div
                  style={{
                    animation: getAnimation("Tokenomic"),
                    position: activeTab === "Tokenomic" ? "static" : "absolute",
                  }}
                >
                  <Tokenomic />
                </div>
              ) : null}
              {activeTab === "Fundraising" ? (
                <div
                  style={{
                    animation: getAnimation("Fundraising"),
                    position:
                      activeTab === "Fundraising" ? "static" : "absolute",
                  }}
                >
                  <Fundraising />
                </div>
              ) : null}
              {activeTab === "Vesting" ? (
                <div
                  style={{
                    animation: getAnimation("Vesting"),
                    position: activeTab === "Vesting" ? "static" : "absolute",
                  }}
                >
                  <Vesting />
                </div>
              ) : null}
              {activeTab === "Buy" ? (
                <div
                  className="flex w-full justify-center lg:mt-2.5"
                  style={{
                    animation: getAnimation("Buy"),
                    position: activeTab === "Buy" ? "static" : "absolute",
                  }}
                >
                  <SwapProvider
                    tokenOutBuffer={{
                      ...baseAsset,
                      address: baseAsset?.contracts?.[0],
                      blockchain: baseAsset?.blockchains?.[0],
                    }}
                    lockToken={["out"]}
                  >
                    <BasicSwap activeStep={0} />
                  </SwapProvider>
                </div>
              ) : null}

              <TradeFiltersPopup />
              <PriceAlertPopup
                show={showTargetPrice}
                setShow={setShowTargetPrice}
              />
              <PopupAllTags />
            </>
          ) : (
            <Essentials />
          )}
          <PopupSocialMobile />
        </Container>
      </div>
    </>
  );
};
