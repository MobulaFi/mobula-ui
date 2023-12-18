import { Spinner } from "components/spinner";
import { createSupabaseDOClient } from "lib/supabase";
import { useTheme } from "next-themes";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { BiHide } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoMdAddCircleOutline } from "react-icons/io";
import { VscArrowSwap } from "react-icons/vsc";
import { useAccount } from "wagmi";
import { MediumFont, SmallFont } from "../../../../../../components/fonts";
import { Menu } from "../../../../../../components/menu";
import { TagPercentage } from "../../../../../../components/tag-percentage";
import {
  PopupStateContext,
  PopupUpdateContext,
} from "../../../../../../contexts/popup";
import { SettingsMetricContext } from "../../../../../../contexts/settings";
import { TableAsset } from "../../../../../../interfaces/assets";
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
import { flexGreyBoxStyle } from "../../../style";
import { Privacy } from "../../ui/privacy";
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
    "text-light-font-60 dark:text-dark-font-60"
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
    setIsInWatchlist(inWatchlist as boolean);
  }, [inWatchlist]);

  useEffect(() => {
    setIsLoadingFetch(showTokenInfo ? true : false);
  }, [showTokenInfo]);

  const newWallet = wallet?.portfolio?.filter(
    (entry) => entry.name === asset?.name
  )[0];

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
    return wallet.portfolio as unknown as TableAsset;
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
        setChangeColor("text-light-font-60 dark:text-dark-font-60");
      }, 1000);
    } else if (asset.estimated_balance_change === false) {
      setChangeColor("text-red dark:text-red");

      setTimeout(() => {
        setChangeColor("text-light-font-60 dark:text-dark-font-60");
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

  const testStyle =
    "text-light-font-100 dark:text-dark-font-100 border-b border-light-border-primary dark:border-dark-border-primary font-normal text-[13px] md:text-xs py-2";

  return (
    <>
      <div className="relative md:pb-5 w-full">
        {!isLoading &&
        filteredData?.sort((a, b) => b.estimated_balance - a.estimated_balance)
          .length > 0 ? (
          <>
            {filteredData
              ?.sort((a, b) => b.estimated_balance - a.estimated_balance)
              .map((token) => {
                return (
                  <div
                    key={token?.name}
                    className={`${
                      showTokenInfo === token?.id
                        ? "h-[450px] lg:h-[710px]"
                        : "h-[70px]"
                    } bg-light-bg-secondary dark:bg-dark-bg-secondary w-full transition-all duration-500 
                  overflow-y-hidden rounded-2xl ease-in-out mt-2.5 cursor-pointer border 
                  border-light-border-primary dark:border-dark-border-primary pt-0`}
                  >
                    <div className="flex flex-col w-full">
                      <div className="flex justify-between items-center w-full h-[70px] mt-0">
                        <div
                          className="h-full flex items-center w-full p-2.5"
                          onClick={() => {
                            triggerTokenInfo(token);
                          }}
                        >
                          <img
                            className="w-[34px] h-[34px] rounded-full mr-2"
                            src={token?.image || "/empty/unknown.png"}
                            alt="logo"
                          />
                          <div className="flex flex-col items-start">
                            <p className="text-light-font-100 md:hidden dark:text-dark-font-100 text-sm lg:text-[13px] md:text-xs font-normal md:font-normal">
                              {token?.name}
                            </p>
                            <div className="flex items-center md:mb-[1px]">
                              <p className="text-light-font-100 hidden md:flex dark:text-dark-font-100 text-sm lg:text-[13px] md:text-xs font-normal">
                                {token?.symbol}
                              </p>
                              <TagPercentage
                                extraCss="lg:text-xs px-1 lg:h-[16px] hidden md:flex"
                                percentage={Number(
                                  getTokenPercentage(token.change_24h)
                                )}
                                isUp={
                                  Number(getTokenPercentage(token.change_24h)) >
                                  0
                                }
                              />
                            </div>
                            <div className="flex items-center">
                              <p className="text-light-font-60 dark:text-dark-font-60 text-sm lg:text-[13px] font-normal md:font-normal">
                                {getFormattedAmount(token.price)}$
                              </p>
                              <TagPercentage
                                extraCss="text-xs px-1 py-[1px] lg:text-xs lg:h-[18px] min-h-auto md:hidden"
                                percentage={Number(
                                  getTokenPercentage(token.change_24h)
                                )}
                                isUp={
                                  Number(getTokenPercentage(token.change_24h)) >
                                  0
                                }
                              />
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center  p-2.5">
                          <div className="flex flex-col items-end mr-5 md:mr-3">
                            {manager.privacy_mode ? (
                              <Privacy extraCss="justify-end" />
                            ) : (
                              <SmallFont
                                extraCss={`font-normal text-end md:font-normal whitespace-nowrap text-[13px] md:text-[13px]`}
                              >
                                {Number(
                                  getFormattedAmount(token.token_balance)
                                ) < 0.01
                                  ? `<0.01 ${token.symbol}`
                                  : `${getFormattedAmount(
                                      token.token_balance
                                    )} ${token.symbol}`}
                              </SmallFont>
                            )}
                            {manager.privacy_mode ? (
                              <Privacy extraCss="justify-end" />
                            ) : (
                              <SmallFont
                                extraCss={`font-normal text-end whitespace-nowrap md:font-normal text-[13px] md:text-[13px] ${changeColor}`}
                              >
                                ${getFormattedAmount(token.estimated_balance)}
                              </SmallFont>
                            )}
                          </div>
                          <div className="flex justify-end items-start w-full max-w-[60px]">
                            <button onClick={() => setShowBuyDrawer(token)}>
                              <VscArrowSwap className="text-light-font-100 dark:text-dark-font-100" />
                            </button>
                            <Menu
                              titleCss="ml-2.5"
                              title={
                                <BsThreeDotsVertical className="text-light-font-100 dark:text-dark-font-100" />
                              }
                              extraCss="top-[45%] -translate-y-1/2 right-[20px] p-1.5"
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
                                  Hide token
                                </div>
                                <div
                                  onMouseEnter={() => setIsHover(2)}
                                  onMouseLeave={() => setIsHover(null)}
                                  className="flex items-center bg-light-bg-secondary dark:bg-dark-bg-secondary text-sm lg:text-[13px] md:text-xs whitespace-nowrap"
                                  onClick={() => {
                                    setTokenTsx(token);
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
                                Realized PNL
                              </th>
                              <th className={`${testStyle} text-start`}>
                                Unrealized PNL
                              </th>
                              <th className={`${testStyle} text-start`}>
                                Avg Buy
                              </th>
                              <th className={`${testStyle} text-end`}>
                                Investment
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className={`${testStyle} py-1.5 text-start`}>
                                {manager.privacy_mode ? (
                                  <Privacy extraCss="justify-start text-[13px]" />
                                ) : (
                                  <SmallFont
                                    extraCss={`font-normal text-start md:font-normal text-[13px] ${
                                      Number(
                                        getTokenPercentage(token.realized_usd)
                                      ) > 0
                                        ? "text-green dark:text-green"
                                        : "text-red dark:text-red"
                                    }`}
                                  >
                                    {getFormattedAmount(token.realized_usd)}$
                                  </SmallFont>
                                )}
                              </td>
                              <td className={`${testStyle} py-1.5 text-start`}>
                                {manager.privacy_mode ? (
                                  <Privacy extraCss="justify-start text-[13px]" />
                                ) : (
                                  <SmallFont
                                    extraCss={`font-normal text-start md:font-normal text-[13px] ${
                                      Number(
                                        getTokenPercentage(token.unrealized_usd)
                                      ) > 0
                                        ? "text-green dark:text-green"
                                        : "text-red dark:text-red"
                                    }`}
                                  >
                                    {getFormattedAmount(token.unrealized_usd)}$
                                  </SmallFont>
                                )}
                              </td>
                              <td className={`${testStyle} py-1.5 text-start`}>
                                <SmallFont extraCss="font-normal md:font-normal text-[13px]">
                                  {getFormattedAmount(newWallet?.price_bought)}$
                                </SmallFont>
                              </td>
                              <td className={`${testStyle} py-1.5 text-end`}>
                                <SmallFont extraCss="font-normal md:font-normal text-[13px]">
                                  {getFormattedAmount(token?.total_invested)}$
                                </SmallFont>
                              </td>
                            </tr>{" "}
                          </tbody>
                        </table>
                      </div>
                      <div className="flex items-start lg:flex-col">
                        <div className="w-2/4 lg:w-full m-2.5 lg:m-0 p-3 mr-0 pr-0 lg:pr-2 rounded-lg mt-[0px] relative">
                          <MediumFont extraCss="mt-5 absolute top-[-10px]">
                            {token?.name} Price Chart
                          </MediumFont>
                          {tokensData?.[token?.id]?.price_history?.price
                            ?.length > 0 && token?.price !== 0 ? (
                            <EChart
                              data={
                                tokensData?.[token?.id]?.price_history?.price ||
                                []
                              }
                              timeframe={tokenTimeframe as TimeSelected}
                              height="300px"
                              width="100%"
                              leftMargin={["0%", "0%"]}
                              type={tokensData[token.id]?.name}
                              unit="$"
                              noDataZoom
                            />
                          ) : null}
                          {!tokensData?.[token?.id]?.price_history?.price
                            ?.length && token?.price !== 0 ? (
                            <div className="flex flex-col w-full h-[300px] items-center justify-center">
                              <Spinner extraCss="h-[30px] w-[30px]" />
                            </div>
                          ) : null}
                          {token?.price === 0 ? (
                            <div className="flex flex-col w-full h-[300px] items-center justify-center">
                              <img
                                className="h-[90px]"
                                src="/empty/ray.png"
                                alt="empty logo"
                              />
                              <div className="flex w-[80%] flex-col items-center justify-center">
                                <MediumFont extraCss="mb-[5px] text-center text-light-font-40 dark:text-dark-font-40 font-normal">
                                  No data found
                                </MediumFont>
                              </div>
                            </div>
                          ) : null}
                        </div>
                        <div className="w-2/4 lg:w-full m-2.5 lg:m-0 lg:mt-[-40px] mt-0 p-3 rounded-lg">
                          {editAssetManager.transactions ? (
                            <div className="flex flex-col w-full items-start rounded-lg pt-0">
                              <MediumFont extraCss="mb-4">
                                Transactions
                              </MediumFont>
                              <div className="overflow-y-scroll h-[215px] min-h-[215px] w-full relative">
                                {showTokenInfo === token?.id &&
                                showTokenInfo === asset?.id ? (
                                  <Transaction isSmallTable asset={token} />
                                ) : null}
                                <div className="h-[26px] bottom-0 w-full bg-gradient-to-t from-light-bg-terciary dark:from-dark-bg-terciary sticky z-[1]" />
                              </div>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </>
        ) : null}
        {/* {isLoading ? (
          <tbody>
            {Array.from(Array(10).keys()).map((_, i) => (
              <TbodySkeleton key={i as Key} />
            ))}
          </tbody>
        ) : null} */}

        {/* {isNormalBalance && numberOfAsset ? (
          <caption
            className="bg-light-bg-secondary dark:bg-dark-bg-secondary text-start 
          rounded-xl pl-0 h-[40px] border border-light-border-primary dark:border-dark-border-primary 
          hover:bg-light-bg-hover dark:hover:bg-dark-bg-hover cursor-pointer transition-all duration-200
           mt-2.5 md:mt-[-10px] caption-bottom"
          >
            <button
              className="flex items-center font-normal text-light-font-100 dark:text-dark-font-100 text-sm
               lg:text-[13px] md:text-xs h-full pl-5 sticky top-0 left-[-1px] "
              onClick={() => setShowMore(!showMore)}
            >
              {showMore
                ? "Hide low balances "
                : `Show low balances  (${numberOfAsset} assets) `}
            </button>
          </caption>
        ) : null} */}
      </div>
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
