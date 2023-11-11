import {
  default as React,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useSwipeable } from "react-swipeable";
import { Container } from "../../../components/container";
import { TopNav } from "../../../layouts/menu-mobile/top-nav";
import { Select } from "../../../layouts/swap/popup/select";
import { pushData } from "../../../lib/mixpanel";
import { Cryptocurrencies } from "./components/category/cryptocurrencies";
import { PortfolioChart } from "./components/chart";
import { Header } from "./components/header";
import { Holdings } from "./components/holdings";
import { Performers } from "./components/performers";
import { PNL } from "./components/pnl";
import { AddTransactionPopup } from "./components/popup/add-transaction";
import { DeleteNftPopup } from "./components/popup/delete-nft";
import { ManagePopup } from "./components/popup/manage";
import { ManageEdit } from "./components/popup/manage/edit";
import { NetworkPopup } from "./components/popup/network";
import { SelectorPortfolioPopup } from "./components/popup/selector-portfolio";
import { StepPopup } from "./components/popup/step-popup";
import { WalletsPopup } from "./components/popup/wallets";
import { ButtonTimeSlider } from "./components/ui/button-time-slider";
import { CategorySwitcher } from "./components/ui/category-switcher";
import { PortfolioV2Context } from "./context-manager";

export const PortfolioMain = () => {
  const [showTuto, setShowTuto] = useState(true);
  const {
    manager,
    activeCategory,
    setActiveCategory,
    setIsAssetPage,
    setAsset,
    showSelect,
    setShowSelect,
    setTokenTsx,
    setShowAddTransaction,
    wallet,
    timeframe,
    activeStep,
    showPortfolioSelector,
    showDeleteNft,
    showAddTransaction,
    showWallet,
    showNetwork,
    showManage,
    isMobile,
    showHiddenTokensPopup,
  } = useContext(PortfolioV2Context);
  const [previousTab, setPreviousTab] = useState<string | undefined>("");
  const firstRender = useRef(true);
  const isMoreThan991 =
    (typeof window !== "undefined" ? window.innerWidth : 0) > 991;
  const tabs = ["General", "Widgets", "NFTs", "Activity"];

  useEffect(() => {
    if (!localStorage.getItem("showTutoPortfolio")) setShowTuto(true);
  }, []);

  useEffect(() => {
    setIsAssetPage(false);
    setAsset(null);
  }, []);

  useEffect(() => {
    firstRender.current = false;
  }, []);

  function switchTab(dir) {
    setPreviousTab(activeCategory);
    if ((isMobile || !isMoreThan991) && !firstRender.current) {
      const currentIndex = tabs.findIndex((tab) => tab === activeCategory);
      if (dir === "next" && currentIndex < tabs.length - 1) {
        setActiveCategory(tabs[currentIndex + 1]);
      } else if (dir === "previous" && currentIndex > 0) {
        setActiveCategory(tabs[currentIndex - 1]);
      }
    }
  }

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
    delta: 10,
    trackTouch: true,
    rotationAngle: 0,
  });

  const getAnimation = (name: string) => {
    if (
      (isMobile || !isMoreThan991) &&
      activeCategory !== previousTab &&
      previousTab
    ) {
      if (activeCategory === name) {
        if (tabs.indexOf(previousTab) < tabs.indexOf(activeCategory)) {
          return `animate-slide-in-right`;
        }
        return `animate-slide-in-left`;
      }
      if (previousTab === name) {
        if (tabs.indexOf(previousTab) < tabs.indexOf(activeCategory)) {
          return `animate-slide-out-left`;
        }
        return `animate-slide-out-right`;
      }
    }
    return "none";
  };

  useEffect(() => {
    if (!isMobile && !isMoreThan991) setActiveCategory("General");
  }, []);

  return (
    <div className="flex flex-col overflow-x-hidden" {...handlers}>
      {activeStep.nbr ? (
        <div
          className="flex fixed w-screen h-screen top-0 bg-red z-[3]"
          // bg="rgba(0,0,0,0.3)"
        />
      ) : null}
      {isMobile || !isMoreThan991 ? (
        <TopNav
          list={["General", "Widgets", "NFTs", "Activity"]}
          setActive={setActiveCategory}
          active={activeCategory}
          setPreviousTab={setPreviousTab}
          isPortfolio
        />
      ) : null}
      <Container extraCss="mt-[15px]">
        <Header />
        <div className="flex mt-2.5 w-full flex-row lg:flex-col">
          <div className="flex flex-col max-w-[320px] lg:max-w-full w-full">
            {(manager.total_profit && activeCategory === "General") ||
            (manager.total_profit && !isMobile) ? (
              <PNL />
            ) : null}
            {/* MOBILE WIDGET / CHART */}
            {activeCategory === "Widgets" && (isMobile || !isMoreThan991) ? (
              <div
                className={`${
                  activeCategory === "Widgets" ? "static" : "absolute"
                } ${getAnimation("Widgets")}`}
              >
                <div className="hidden lg:flex flex-col w-full">
                  <ButtonTimeSlider mt="10px" />
                  {manager.performers ? <Performers /> : null}
                  {manager.holdings ? (
                    <Holdings chartId="piechart-mobile" />
                  ) : null}
                  {timeframe !== "ALL" ? (
                    <>
                      {/* {manager.daily_pnl ? (
                        <DailyPnl chartId="pnlchart-mobile" wallet={wallet} />
                      ) : null} */}
                      {/* {manager.cumulative_pnl ? (
                        <CumulativePnl chartId="cumulative-chart-mobile" />
                      ) : null} */}
                    </>
                  ) : null}
                </div>{" "}
              </div>
            ) : null}
            {/* DESKTOP */}
            <div className="flex flex-col lg:hidden w-fit max-w-full">
              {manager.performers ? <Performers /> : null}
              {manager.holdings ? (
                <Holdings chartId="piechart-desktop" />
              ) : null}
              {timeframe !== "ALL" ? (
                <>
                  {" "}
                  {/* {manager.daily_pnl ? (
                    <DailyPnl chartId="pnlchart-desktop" wallet={wallet} />
                  ) : null} */}
                  {/* {manager.cumulative_pnl ? (
                    <CumulativePnl chartId="cumulative-chart-desktop" />
                  ) : null} */}
                </>
              ) : null}
            </div>
          </div>
          <div className="hidden lg:flex flex-col ml-5 w-calc-full-340 lg:w-full">
            {activeCategory === "General" ? (
              <div
                className={`${
                  activeCategory === "General" ? "static" : "absolute"
                } ${getAnimation("General")}`}
              >
                {manager.portfolio_chart ? <PortfolioChart /> : null}
              </div>
            ) : null}

            <div className="w-full flex lg:hidden">
              <CategorySwitcher />
            </div>

            {activeCategory === "General" ? (
              <div
                className={`${
                  activeCategory === "General" ? "static" : "absolute"
                } ${getAnimation("General")}`}
              >
                <Cryptocurrencies />
              </div>
            ) : null}
            {/* {activeCategory === "NFTs" ? (
              <div
                className={`${
                activeCategory === "NFTs" ? "static" : "absolute"
              } ${getAnimation("NFTs")}`}
              >
                <NFTs />
              </div>
            ) : null}
            {activeCategory === "Activity" ? (
              <div
               className={`${
                activeCategory === "Activity" ? "static" : "absolute"
              } ${getAnimation("Activity")}`}
               
              >
                <Activity />
              </div>
            ) : null} */}
          </div>
          {/* MOBILE */}
          <div className="ml-5 lg:ml-0 flex flex-col lg:hidden w-calc-full-340 lg:w-full">
            {manager.portfolio_chart ? <PortfolioChart /> : null}
            {activeCategory === "Cryptos" ? <Cryptocurrencies /> : null}
            {/* <div className="w-full mt-0 lg:mt-[55px] md:mt-0 flex lg:hidden">
              <CategorySwitcher />
            </div>
          
            {activeCategory === "NFTs" ? <NFTs /> : null}
            {activeCategory === "Activity" ? <Activity /> : null} */}
          </div>
        </div>
        {showManage && <ManagePopup />}
        {showHiddenTokensPopup && <ManageEdit />}
        {showNetwork && <NetworkPopup />}
        {showWallet && <WalletsPopup />}
        {showAddTransaction && <AddTransactionPopup />}
        {/* <DrawerDex /> */}
        {showPortfolioSelector && <SelectorPortfolioPopup />}
        {showDeleteNft && <DeleteNftPopup />}
        {showSelect && (
          <Select
            visible={showSelect}
            setVisible={setShowSelect}
            callback={(token) => {
              setTokenTsx(token);
              setShowAddTransaction(true);
              pushData("Add Asset Button Clicked");
            }}
          />
        )}
        {showTuto ? <StepPopup /> : null}
      </Container>
    </div>
  );
};