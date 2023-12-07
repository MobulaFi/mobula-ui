"use client";
import { usePathname } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import { BsChevronRight, BsTelegram } from "react-icons/bs";
import { useSwipeable } from "react-swipeable";
import { Button } from "../../components/button";
import { Container } from "../../components/container";
import { SmallFont } from "../../components/fonts";
import { NextChakraLink } from "../../components/link";
import { Skeleton } from "../../components/skeleton";
import { PopupUpdateContext } from "../../contexts/popup";
import { TopNav } from "../../layouts/menu-mobile/top-nav";
import { SwapProvider } from "../../layouts/swap";
import { BasicSwap } from "../../layouts/swap/swap-variant/basic-swap";
import { pushData } from "../../lib/mixpanel";
import { PriceAlertPopup } from "../../popup/price-alert";
import { useLiteStreamMarketDataModule } from "../../utils/stream-chains";
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
import { PrevPathProps } from "./models";
import { mainButtonStyle } from "./style";

export const Assets = () => {
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
  } = useContext(BaseAssetContext);
  const pathname = usePathname();
  const [isBreadCrumbLoading, setIsBreadCrumbLoading] = useState(true);
  const [previousTab, setPreviousTab] = useState<string | null>(null);
  const [canSwipe, setCanSwipe] = useState(false);
  const { setShowCard } = useContext(PopupUpdateContext);
  const [prevPaths, setPrevPaths] = useState<PrevPathProps[]>([
    {
      name: "Home",
      url: "/",
    },
  ]);

  useLiteStreamMarketDataModule(
    baseAsset,
    marketMetrics as any,
    setMarketMetrics as any,
    filters,
    setIsMarketMetricsLoading,
    shouldInstantLoad
  );

  useEffect(() => {
    setIsMarketMetricsLoading(true);
  }, [filters]);

  useEffect(() => {
    if (baseAsset)
      setMarketMetrics({
        price: baseAsset.price,
        priceChange: null,
        volume: 0,
        volumeChange: null,
        liquidity: 0,
        market_cap: baseAsset.market_cap,
        trade_history: (filters.length > 0
          ? []
          : baseAsset?.trade_history) as any,
      });
  }, [baseAsset]);

  const isMobile =
    (typeof window !== "undefined" ? window.innerWidth : 0) < 768;

  const tabs = [
    "Essentials",
    // "Tokenomic",
    "Market",
    "Fundraising",
    "Vesting",
    ...(isMobile ? ["Buy"] : []),
  ];

  // console.log("baseAsset", baseAsset);
  // const token =
  //   "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";

  // const formatGithub = url => {
  //   const site = url.split("github.com");
  //   const apiRepo = `https://api.github.com/repos${site[1]}`;
  //   return apiRepo;
  // };

  // useEffect(() => {
  //   if (!baseAsset) return;

  //   // fetch(commits, {
  //   //   headers: {
  //   //     Authorization: `token ${token}`,
  //   //   },
  //   // })
  //   //   .then(res => res.json())
  //   //   .then(data => {
  //   //     console.log("data", data);
  //   //   });

  //   const fetchCommits = async () => {
  //     let commits = [];
  //     const github = formatGithub(baseAsset?.github);
  //     let url = `${github}/commits?per_page=100`;
  //     do {
  //       const response = await axios.get(url, {
  //         // Ajout de await ici
  //         headers: {Authorization: `token ${token}`},
  //       });

  //       commits = commits.concat(response.data);

  //       const linkHeader = response.headers.link || "";
  //       const nextLink = linkHeader
  //         .split(",")
  //         .find(s => s.includes('rel="next"'));

  //       url = nextLink ? nextLink.match(/<(.*)>/)[1] : null;
  //     } while (url);

  //     console.log("THEY ARE HERE", commits);
  //     return commits;
  //   };

  //   fetchCommits();
  // }, [baseAsset]);

  function switchTab(dir) {
    setPreviousTab(activeTab);
    if (isMobile) {
      const currentIndex = tabs.findIndex((tab) => tab === activeTab);
      if (dir === "next" && currentIndex < tabs.length - 1) {
        if (
          tabs[currentIndex + 1] === "Fundraising" &&
          !baseAsset?.sales?.length &&
          tabs[currentIndex + 2] === "Vesting" &&
          !baseAsset?.release_schedule?.length
        ) {
          setActiveTab(tabs[currentIndex + 3]);
        } else if (
          tabs[currentIndex + 1] === "Fundraising" &&
          !baseAsset?.sales?.length &&
          tabs[currentIndex + 2] === "Vesting" &&
          baseAsset?.release_schedule?.length > 0
        ) {
          setActiveTab(tabs[currentIndex + 2]);
        } else if (
          tabs[currentIndex + 1] === "Fundraising" &&
          baseAsset?.sales?.length > 0
        ) {
          setActiveTab(tabs[currentIndex + 1]);
        } else if (
          tabs[currentIndex + 1] === "Vesting" &&
          !baseAsset?.release_schedule?.length
        ) {
          setActiveTab(tabs[currentIndex + 2]);
        } else setActiveTab(tabs[currentIndex + 1]);
      } else if (dir === "previous" && currentIndex > 0) {
        if (
          tabs[currentIndex - 2] === "Fundraising" &&
          !baseAsset?.sales?.length &&
          tabs[currentIndex - 1] === "Vesting" &&
          !baseAsset?.release_schedule?.length
        ) {
          setActiveTab(tabs[currentIndex - 3]);
        } else if (
          tabs[currentIndex - 2] === "Fundraising" &&
          !baseAsset?.sales?.length &&
          tabs[currentIndex + 1] === "Vesting" &&
          baseAsset?.release_schedule?.length > 0
        ) {
          setActiveTab(tabs[currentIndex - 2]);
        } else if (
          tabs[currentIndex - 1] === "Fundraising" &&
          baseAsset?.sales?.length > 0
        ) {
          setActiveTab(tabs[currentIndex - 1]);
        } else if (
          tabs[currentIndex - 1] === "Vesting" &&
          !baseAsset?.release_schedule?.length &&
          tabs[currentIndex - 2] === "Fundraising" &&
          baseAsset?.sales?.length > 0
        ) {
          setActiveTab(tabs[currentIndex - 2]);
        } else setActiveTab(tabs[currentIndex - 1]);
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

    if (beforeFormattedPaths === "/") {
      previous.push({
        name: "Home",
        url: "/",
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
    setPrevPaths(previous as never);
    setIsBreadCrumbLoading(false);
  };
  useEffect(() => {
    setTimeout(() => {
      getPreviousPath();
    }, 200);
  }, [pathname]);

  return (
    <>
      <div className="flex flex-col" {...handlers}>
        <TopNav
          list={tabs}
          setActive={setActiveTab}
          active={activeTab}
          setPreviousTab={setPreviousTab as never}
        />
        <Container extraCss="md:w-full mb-2 lg:mb-1 pb-0">
          {prevPaths?.length > 1 || isBreadCrumbLoading ? (
            <div className="flex items-center ml-0 md:ml-2.5">
              <NextChakraLink
                extraCss="text-sm lg:text-[13px] md:text-xs text-light-font-40 dark:text-dark-font-40"
                href={
                  process.env.NEXT_PUBLIC_WEBSITE_URL +
                  (prevPaths?.[0]?.url || "/")
                }
              >
                {isBreadCrumbLoading ? (
                  <Skeleton extraCss="w-[45px] h-[15px] lg:h-[14px] md:h-[13px]" />
                ) : (
                  prevPaths?.[0]?.name
                )}
              </NextChakraLink>
              <BsChevronRight className="text-xs text-light-font-60 dark:text-dark-font-60 mx-2 lg:mx-1.5 md:1" />
              <NextChakraLink
                extraCss="text-sm lg:text-[13px] md:text-xs"
                href={
                  process.env.NEXT_PUBLIC_WEBSITE_URL +
                  (prevPaths?.[1]?.url || "/")
                }
              >
                {isBreadCrumbLoading ? (
                  <Skeleton extraCss="w-[45px] h-[15px] lg:h-[14px] md:h-[13px]" />
                ) : (
                  prevPaths?.[1]?.name
                )}
              </NextChakraLink>
            </div>
          ) : null}
        </Container>
        <Container extraCss="md:w-full mt-0">
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
          ) : null}
          <div className="flex items-center lg:items-start flex-row lg:flex-col justify-between w-full md:w-[95%] mx-auto pb-0 md:pb-2.5">
            <TokenMainInfo />
            <TokenSocialsInfo />
          </div>
          <div className="hidden md:flex mb-0 md:mb-2.5 h-0.5 bg-light-border-primary dark:bg-dark-border-primary w-full" />
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
                ?.map((tab) => (
                  <Button
                    key={tab}
                    extraCss={`${mainButtonStyle} px-2.5 border ${
                      tab === activeTab ? "border-blue dark:border-blue" : ""
                    } ${
                      (tab === "Fundraising" && !baseAsset?.sales?.length) ||
                      (tab === "Vesting" &&
                        !baseAsset?.release_schedule?.length)
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    disabled={
                      (tab === "Fundraising" && !baseAsset?.sales?.length) ||
                      (tab === "Vesting" &&
                        !baseAsset?.release_schedule?.length)
                    }
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </Button>
                ))}
            </div>
          </div>
          {activeTab === "Essentials" ? (
            <div
              style={{
                animation: getAnimation("Essentials"),
                position: activeTab === "Essentials" ? "static" : "absolute",
              }}
            >
              <Essentials marketMetrics={marketMetrics as any} />
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
                  activeTab === "Social & Developer" ? "static" : "absolute",
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
                position: activeTab === "Fundraising" ? "static" : "absolute",
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
              {/* <div className="flex items-center">
                <Button
                  extraCss="my-2.5 h-[45px] md:h-[40px] w-full"
                  onClick={() => {
                    pushData("Buy with Credit Card on Asset Page");
                    setShowCard("USD");
                  }}
                >
                  Buy with credit-card
                  <img
                    className="h-[15px] mx-[7.5px]"
                    src="/logo/mastercard.png"
                    alt="mastercard logo"
                  />
                  <img
                    src="/logo/visa.png"
                    className="h-[13px]"
                    alt="visa logo"
                  />
                </Button>
              </div>{" "} */}
            </div>
          ) : null}

          <TradeFiltersPopup />
          <PopupSocialMobile />
          <PriceAlertPopup
            show={showTargetPrice}
            setShow={setShowTargetPrice}
          />
          <PopupAllTags />
        </Container>
      </div>{" "}
    </>
  );
};
