import { createSupabaseDOClient } from "lib/supabase";
import { useTheme } from "next-themes";
import React, { Key, useContext, useEffect, useMemo, useState } from "react";
import { BiHide } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoMdAddCircleOutline } from "react-icons/io";
import { VscArrowSwap } from "react-icons/vsc";
import { useAccount } from "wagmi";
import { MediumFont, SmallFont } from "../../../../../../components/fonts";
import { Menu } from "../../../../../../components/menu";
import {
  PopupStateContext,
  PopupUpdateContext,
} from "../../../../../../contexts/popup";
import { SettingsMetricContext } from "../../../../../../contexts/settings";
import { useWatchlist } from "../../../../../../layouts/tables/hooks/watchlist";
import EChart from "../../../../../../lib/echart/line";
import { pushData } from "../../../../../../lib/mixpanel";
import { GET } from "../../../../../../utils/fetch";
import {
  getFormattedAmount,
  getTokenPercentage,
} from "../../../../../../utils/formaters";
import { TimeSelected } from "../../../../../asset/models";
import { PortfolioV2Context } from "../../../context-manager";
import { useWebSocketResp } from "../../../hooks";
import { flexGreyBoxStyle, thStyle } from "../../../style";
import { Privacy } from "../../ui/privacy";
import { TbodySkeleton } from "../../ui/tbody-skeleton";
import { Transaction } from "./transaction";

export const Cryptocurrencies = () => {
  const {
    wallet,
    hiddenTokens,
    setHiddenTokens,
    isLoading,
    activePortfolio,
    isMobile,
    manager,
    asset,
    setShowAddTransaction,
    editAssetManager,
    tokenTsx,
    setTokenTsx,
    setAsset,
    setActivePortfolio,
  } = useContext(PortfolioV2Context);
  const [showMore, setShowMore] = useState(false);
  const [showTokenInfo, setShowTokenInfo] = useState(null);
  const { theme } = useTheme();
  const isWhiteMode = theme === "light";
  const [tokensData, setTokensData] = useState({});
  const [changeColor, setChangeColor] = useState(
    "text-light-font-100 dark:text-dark-font-100"
  );
  const { setShowBuyDrawer, showBuyDrawer } = useContext(SettingsMetricContext);
  const [isLoadingFetch, setIsLoadingFetch] = useState(
    showTokenInfo ? true : false
  );
  const { handleAddWatchlist, inWatchlist } = useWatchlist(asset?.id);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [isHover, setIsHover] = useState<number | null>(null);
  const [tokenTimeframe, setTokenTimeframe] = useState("24H");

  const {
    setShowAddedToWatchlist,
    setShowMenuTableMobileForToken,
    setShowMenuTableMobile,
    setShowAlert,
  } = useContext(PopupUpdateContext);

  const [showCustomMenu, setShowCustomMenu] = useState(false);

  const { showMenuTableMobileForToken } = useContext(PopupStateContext);

  const refreshPortfolio = useWebSocketResp();

  const { address } = useAccount();

  useEffect(() => {
    setIsInWatchlist(inWatchlist);
  }, [inWatchlist]);

  useEffect(() => {
    setIsLoadingFetch(showTokenInfo ? true : false);
  }, [showTokenInfo]);

  const newWallet = wallet?.portfolio.filter(
    (entry) => entry.name === asset?.name
  )[0];

  const getPercentageOfBuyRange = () => {
    if (newWallet) {
      const minPriceBought = newWallet?.min_buy_price;
      const maxPriceBought = newWallet?.max_buy_price;
      const priceBought = newWallet?.price_bought;

      const priceRange = maxPriceBought - Number(minPriceBought);
      const priceDifference = priceBought - Number(minPriceBought);

      const result = (priceDifference * 100) / priceRange;
      return getFormattedAmount(result);
    }
    return 0;
  };

  const triggerTokenInfo = (asset) => {
    if (showTokenInfo === asset?.id) {
      setAsset(null);
      setShowTokenInfo(null);
    } else if (showTokenInfo && showTokenInfo !== asset?.id) {
      setAsset(asset);
      setShowTokenInfo(asset?.id);
    } else {
      setAsset(asset);
      setShowTokenInfo(asset?.id);
    }
  };

  const hideAsset = () => {
    pushData("Asset Removed");
    const newPortfolio = {
      ...activePortfolio,
      removed_assets: [...activePortfolio.removed_assets, asset?.id],
    };
    setActivePortfolio(newPortfolio);
    refreshPortfolio(newPortfolio);
    GET("/portfolio/edit", {
      account: address as string,
      removed_assets: [...activePortfolio.removed_assets, asset?.id].join(","),
      removed_transactions: activePortfolio.removed_transactions.join(","),
      wallets: activePortfolio.wallets.join(","),
      id: activePortfolio.id,
      name: activePortfolio.name,
      reprocess: true,
      public: activePortfolio.public,
    });
  };

  const numberOfAsset =
    wallet?.portfolio?.reduce((count, entry) => {
      const meetsBalanceCondition = showMore || entry.estimated_balance > 1;
      return meetsBalanceCondition ? count : count + 1;
    }, 0) ?? 0;
  const isNormalBalance = wallet?.portfolio
    ? wallet?.portfolio.some((entry) => entry.estimated_balance > 1)
    : false;

  const getFilterFromBalance = () => {
    if (!wallet || !wallet?.portfolio) return [];

    return wallet.portfolio.filter((entry) => {
      const meetsBalanceCondition = showMore || entry.estimated_balance > 1;
      return isNormalBalance ? meetsBalanceCondition : true;
    });
  };

  const filteredData = useMemo(
    () => getFilterFromBalance(),
    [wallet, showMore]
  );

  useEffect(() => {
    if (!asset) return;

    if (asset.estimated_balance_change === true) {
      setChangeColor("text-green dark:text-green");

      setTimeout(() => {
        setChangeColor("text-light-font-100 dark:text-dark-font-100");
      }, 1000);
    } else if (asset.estimated_balance_change === false) {
      setChangeColor("text-red dark:text-red");

      setTimeout(() => {
        setChangeColor("text-light-font-100 dark:text-dark-font-100");
      }, 1000);
    }
  }, [asset]);

  useEffect(() => {
    if (showTokenInfo !== asset?.id || tokensData[asset?.id]) return;
    const supabase = createSupabaseDOClient();
    supabase
      .from("assets")
      .select("name, id, symbol, price_history")
      .eq("id", asset?.id)
      .single()
      .then(({ data, error }) => {
        if (error) {
          console.log(error);
          return;
        }
        setTokensData({ ...tokensData, [data.id]: data });
      });
  }, [tokensData, showTokenInfo]);

  const [test, setTest] = useState(false);

  const testStyle =
    "text-light-font-100 dark:text-dark-font-100 border-b border-light-border-primary dark:border-dark-border-primary font-normal text-[13px] md:text-xs py-2";

  return (
    <>
      <table className="relative overflow-x-scroll md:pb-5 border-separate border-spacing-0 w-full caption-bottom">
        <thead className="rounded-t-lg">
          <tr>
            {isMobile && (
              <th
                className={`${thStyle} border-b border-light-border-primary dark:border-dark-border-primary text-start w-2.5`}
              />
            )}
            <th
              className={`${thStyle} border-b border-light-border-primary dark:border-dark-border-primary sticky top-0 left-[-1px] text-start `}
              // bgColor={bg}
            >
              Asset
            </th>
            <th
              className={`${thStyle} border-b border-light-border-primary dark:border-dark-border-primary text-end`}
            >
              Holdings
            </th>
            {isMobile ? null : (
              <th
                className={`${thStyle} border-b border-light-border-primary dark:border-dark-border-primary text-end`}
              >
                Price
              </th>
            )}
            <th
              className={`${thStyle} border-b border-light-border-primary dark:border-dark-border-primary text-end`}
            >
              24h Profit
            </th>
            {isMobile ? null : (
              <th
                className={`${thStyle} border-b border-light-border-primary dark:border-dark-border-primary text-end`}
              >
                Realized PNL
              </th>
            )}
            {isMobile ? null : (
              <th
                className={`${thStyle} border-b border-light-border-primary dark:border-dark-border-primary text-end`}
              >
                Unrealized PNL
              </th>
            )}
            {!isMobile && (
              <th
                className={`${thStyle} border-b border-light-border-primary dark:border-dark-border-primary text-end`}
              >
                Actions
              </th>
            )}
          </tr>
        </thead>
        {!isLoading &&
        filteredData?.sort((a, b) => b.estimated_balance - a.estimated_balance)
          .length > 0 ? (
          <>
            {filteredData
              ?.sort((a, b) => b.estimated_balance - a.estimated_balance)
              .map((asset) => {
                console.log("assssss", asset);
                console.log(
                  "tokensData[asset.id]?.price_history?.price",
                  asset?.price_history?.price,
                  asset,
                  tokensData
                );
                return (
                  // <TbodyCryptocurrencies
                  //   key={asset.name}
                  //   asset={asset}
                  //   setShowTokenInfo={setShowTokenInfo as never}
                  //   showTokenInfo={showTokenInfo}
                  //   tokenInfo={tokensData[asset.id]}
                  // />
                  <caption
                    key={asset?.name}
                    className={`${
                      showTokenInfo === asset?.id ? "h-[500px]" : "h-[70px]"
                    } bg-light-bg-secondary dark:bg-dark-bg-secondary w-full transition-all duration-500 
                  overflow-y-hidden rounded-2xl ease-in-out mt-2.5 cursor-pointer border 
                  border-light-border-primary dark:border-dark-border-primary pt-0`}
                  >
                    <div className="flex flex-col w-full">
                      <div className="flex justify-between items-center w-full h-[70px] mt-0">
                        <div
                          className="h-full flex items-center w-full p-2.5"
                          onClick={() => {
                            triggerTokenInfo(asset);
                          }}
                        >
                          <img
                            className="w-[34px] h-[34px] rounded-full mr-2"
                            src={asset?.image || "/empty/unknown.png"}
                            alt="logo"
                          />
                          <div className="flex flex-col items-start">
                            <p className="text-light-font-100 dark:text-dark-font-100 text-sm lg:text-[13px] md:text-xs font-medium md:font-normal">
                              {asset?.symbol}
                            </p>
                            <p className="text-light-font-60 dark:text-dark-font-60 text-sm lg:text-[13px] font-medium md:font-normal">
                              {`${
                                getFormattedAmount(asset.token_balance) < 0.01
                                  ? "<0.01"
                                  : getFormattedAmount(asset.token_balance)
                              } `}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center  p-2.5">
                          <div className="flex flex-col items-end mr-5">
                            {manager.privacy_mode ? (
                              <Privacy extraCss="justify-end" />
                            ) : (
                              <SmallFont
                                extraCss={`font-medium text-end whitespace-nowrap ${changeColor}`}
                              >
                                ${getFormattedAmount(asset.estimated_balance)}
                              </SmallFont>
                            )}
                            {manager.privacy_mode ? (
                              <Privacy extraCss="justify-end" />
                            ) : (
                              <SmallFont
                                extraCss={`font-medium text-end ${
                                  Number(getTokenPercentage(asset.change_24h)) >
                                  0
                                    ? "text-green dark:text-green"
                                    : "text-red dark:text-red"
                                }`}
                              >
                                {getTokenPercentage(asset.change_24h)}%
                              </SmallFont>
                            )}
                          </div>
                          {/* <div className="flex flex-col items-end w-full max-w-[60px]">
                        <SmallFont
                          extraCss={`font-medium text-end ${changeColor}`}
                        >
                          ${getFormattedAmount(asset.price)}
                        </SmallFont>
                        <SmallFont
                          extraCss={`font-medium text-end ${
                            Number(getTokenPercentage(asset.change_24h)) > 0
                              ? "text-green dark:text-green"
                              : "text-red dark:text-red"
                          }`}
                        >
                          {getTokenPercentage(asset.change_24h)}%
                        </SmallFont>
                      </div>
                      <div className="flex w-full max-w-[60px]">
                        {manager.privacy_mode ? (
                          <Privacy extraCss="justify-end" />
                        ) : (
                          <div className="flex items-center justify-end">
                            {isMobile ? null : (
                              <TbTriangleFilled
                                className={`font-medium text-[10px] mr-1.5 text-end ${
                                  Number(
                                    getAmountLoseOrWin(
                                      asset.change_24h,
                                      asset.estimated_balance
                                    )
                                  ) > 0
                                    ? "text-green dark:text-green"
                                    : "text-red dark:text-red rotate-180"
                                }`}
                              />
                            )}
                            <SmallFont
                              extraCss={`font-medium text-end ${
                                Number(
                                  getAmountLoseOrWin(
                                    asset.change_24h,
                                    asset.estimated_balance
                                  )
                                ) > 0
                                  ? "text-green dark:text-green"
                                  : "text-red dark:text-red"
                              }`}
                            >
                              {getFormattedAmount(
                                getAmountLoseOrWin(
                                  asset.change_24h,
                                  asset.estimated_balance
                                )
                              )}
                              $
                            </SmallFont>
                          </div>
                        )}
                      </div>
                      <div className="flex w-full max-w-[60px]">
                        {manager.privacy_mode ? (
                          <Privacy extraCss="justify-end" />
                        ) : (
                          <SmallFont
                            extraCss={`font-medium text-end ${
                              Number(getTokenPercentage(asset.realized_usd)) > 0
                                ? "text-green dark:text-green"
                                : "text-red dark:text-red"
                            }`}
                          >
                            {getFormattedAmount(asset.realized_usd)}$
                          </SmallFont>
                        )}
                      </div>
                      <div className="flex w-full max-w-[60px]">
                        {manager.privacy_mode ? (
                          <Privacy extraCss="justify-end" />
                        ) : (
                          <SmallFont
                            extraCss={`font-medium text-end ${
                              Number(getTokenPercentage(asset.unrealized_usd)) >
                              0
                                ? "text-green dark:text-green"
                                : "text-red dark:text-red"
                            }`}
                          >
                            {getFormattedAmount(asset.unrealized_usd)}$
                          </SmallFont>
                        )}
                      </div> */}
                          <div className="flex justify-end items-start w-full max-w-[60px]">
                            <button
                              onClick={() => setShowBuyDrawer(asset as any)}
                            >
                              <VscArrowSwap className="text-light-font-100 dark:text-dark-font-100" />
                            </button>
                            <Menu
                              titleCss="ml-2.5"
                              title={
                                <BsThreeDotsVertical className="text-light-font-100 dark:text-dark-font-100" />
                              }
                            >
                              <div>
                                <div
                                  className="flex items-center bg-light-bg-secondary dark:bg-dark-bg-secondary text-sm lg:text-[13px] md:text-xs whitespace-nowrap mb-2.5"
                                  onMouseEnter={() => setIsHover(0)}
                                  onMouseLeave={() => setIsHover(null)}
                                  onClick={hideAsset}
                                >
                                  <div
                                    className={`${flexGreyBoxStyle} ${
                                      isHover === 0
                                        ? "bg-blue dark:bg-blue text-dark-font-100 dark:text-dark-font-100"
                                        : "bg-light-bg-hover dark:bg-dark-bg-hover text-light-font-100 dark:text-dark-font-100"
                                    }`}
                                  >
                                    <BiHide />
                                  </div>
                                  Hide asset
                                </div>
                                <div
                                  onMouseEnter={() => setIsHover(2)}
                                  onMouseLeave={() => setIsHover(null)}
                                  className="flex items-center bg-light-bg-secondary dark:bg-dark-bg-secondary text-sm lg:text-[13px] md:text-xs whitespace-nowrap"
                                  onClick={() => {
                                    setTokenTsx(asset);
                                    setShowAddTransaction(true);
                                    pushData("Add Asset Button Clicked");
                                  }}
                                >
                                  <div
                                    className={`${flexGreyBoxStyle} ${
                                      isHover === 2
                                        ? "bg-blue dark:bg-blue text-dark-font-100 dark:text-dark-font-100"
                                        : "bg-light-bg-hover dark:bg-dark-bg-hover text-light-font-100 dark:text-dark-font-100"
                                    }`}
                                  >
                                    <IoMdAddCircleOutline />
                                  </div>
                                  Add transactions
                                </div>
                              </div>
                            </Menu>
                          </div>
                        </div>
                      </div>
                      <div className="w-full p-2.5 pt-0">
                        <table className="w-[95%] md:w-full mx-auto px-5">
                          <thead>
                            <tr>
                              <th className={`${testStyle} text-start`}>
                                Price
                              </th>
                              <th className={`${testStyle} text-end`}>
                                Realized PNL
                              </th>
                              <th className={`${testStyle} text-end`}>
                                Unrealized PNL
                              </th>
                              <th className={`${testStyle} text-end`}>
                                Avg Price Bought
                              </th>
                              <th className={`${testStyle} text-end`}>
                                Total Invested
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className={`${testStyle} py-1.5 text-start`}>
                                <div className="flex flex-col items-start w-full">
                                  <SmallFont
                                    extraCss={`font-medium text-start text-[13px] ${changeColor}`}
                                  >
                                    ${getFormattedAmount(asset.price)}
                                  </SmallFont>
                                  <SmallFont
                                    extraCss={`font-medium text-start text-[13px] ${
                                      Number(
                                        getTokenPercentage(asset.change_24h)
                                      ) > 0
                                        ? "text-green dark:text-green"
                                        : "text-red dark:text-red"
                                    }`}
                                  >
                                    {getTokenPercentage(asset.change_24h)}%
                                  </SmallFont>
                                </div>
                              </td>
                              <td className={`${testStyle} py-1.5 text-end`}>
                                {manager.privacy_mode ? (
                                  <Privacy extraCss="justify-end text-[13px]" />
                                ) : (
                                  <SmallFont
                                    extraCss={`font-medium text-end text-[13px] ${
                                      Number(
                                        getTokenPercentage(asset.realized_usd)
                                      ) > 0
                                        ? "text-green dark:text-green"
                                        : "text-red dark:text-red"
                                    }`}
                                  >
                                    {getFormattedAmount(asset.realized_usd)}$
                                  </SmallFont>
                                )}
                              </td>
                              <td className={`${testStyle} py-1.5 text-end`}>
                                {manager.privacy_mode ? (
                                  <Privacy extraCss="justify-end text-[13px]" />
                                ) : (
                                  <SmallFont
                                    extraCss={`font-medium text-end text-[13px] ${
                                      Number(
                                        getTokenPercentage(asset.unrealized_usd)
                                      ) > 0
                                        ? "text-green dark:text-green"
                                        : "text-red dark:text-red"
                                    }`}
                                  >
                                    {getFormattedAmount(asset.unrealized_usd)}$
                                  </SmallFont>
                                )}
                              </td>
                              <td className={`${testStyle} py-1.5 text-end`}>
                                <SmallFont extraCss="font-medium text-[13px]">
                                  {getFormattedAmount(newWallet?.price_bought)}$
                                </SmallFont>
                              </td>
                              <td className={`${testStyle} py-1.5 text-end`}>
                                <SmallFont extraCss="font-medium text-[13px]">
                                  {getFormattedAmount(asset?.total_invested)}$
                                </SmallFont>
                              </td>
                            </tr>{" "}
                          </tbody>
                        </table>
                      </div>
                      <div className="flex items-start">
                        <div className="w-2/4 m-2.5 p-3 mr-0 pr-0 rounded-lg mt-[0px] relative">
                          <MediumFont extraCss="mt-5 absolute top-[-10px]">
                            {asset?.name} Price Chart
                          </MediumFont>
                          <EChart
                            data={
                              tokensData?.[asset?.id]?.price_history?.price ||
                              []
                            }
                            timeframe={tokenTimeframe as TimeSelected}
                            height="300px"
                            width="100%"
                            leftMargin={["0%", "0%"]}
                            type={tokensData[asset.id]?.name}
                            unit="$"
                            noDataZoom
                          />
                        </div>
                        <div className="w-2/4 m-2.5 mt-0 p-3 rounded-lg">
                          {editAssetManager.transactions ? (
                            <div className="flex flex-col w-full items-start rounded-lg pt-0">
                              <MediumFont extraCss="mb-4">
                                Transactions
                              </MediumFont>
                              <div className="overflow-y-scroll h-[215px] min-h-[215px] w-full relative">
                                {/* {!isLoadingFetch ? ( */}
                                {showTokenInfo === asset?.id ? (
                                  <Transaction
                                    isSmallTable
                                    asset={asset}
                                    setIsLoadingFetch={setIsLoadingFetch}
                                  />
                                ) : null}
                                <div className="h-[26px] bottom-0 w-full bg-gradient-to-t from-light-bg-terciary dark:from-dark-bg-terciary sticky z-[1]" />
                                {/* ) : (
                                  <Spinner extraCss="h-[30px] w-[30px]" />
                                )} */}
                              </div>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </caption>
                );
              })}
          </>
        ) : null}
        {isLoading ? (
          <tbody>
            {Array.from(Array(10).keys()).map((_, i) => (
              <TbodySkeleton key={i as Key} />
            ))}
          </tbody>
        ) : null}

        {isNormalBalance && numberOfAsset ? (
          <caption
            className="bg-light-bg-secondary dark:bg-dark-bg-secondary text-start 
          rounded-xl pl-0 h-[40px] border border-light-border-primary dark:border-dark-border-primary 
          hover:bg-light-bg-hover dark:hover:bg-dark-bg-hover cursor-pointer transition-all duration-250
           mt-2.5 md:mt-[-10px] caption-bottom"
          >
            <button
              className="flex items-center font-medium text-light-font-100 dark:text-dark-font-100 text-sm
               lg:text-[13px] md:text-xs h-full pl-5 sticky top-0 left-[-1px] "
              onClick={() => setShowMore(!showMore)}
            >
              {showMore
                ? "Hide low balances "
                : `Show low balances  (${numberOfAsset} assets) `}
            </button>
          </caption>
        ) : null}
      </table>
      {filteredData?.sort((a, b) => b.estimated_balance - a.estimated_balance)
        .length > 0 || isLoading ? null : (
        <div
          className="h-[300px] w-full rounded-r-lg flex items-center justify-center border border-light-border-primary dark:border-dark-border-primary flex-col"
          // bg={boxBg1}
        >
          <img
            className="h-[160px] mb-[-50px] mt-[25px]"
            src={isWhiteMode ? "/asset/empty-light.png" : "/asset/empty.png"}
            alt="empty logo"
          />
          <div className="flex w-[80%] flex-col m-auto mt-[40px] items-center justify-center">
            <MediumFont extraCss="mb-[5px] text-center text-light-font-40 dark:text-dark-font-40">
              No tokens found{" "}
            </MediumFont>
          </div>
        </div>
      )}
    </>
  );
};
