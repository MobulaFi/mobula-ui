/* eslint-disable no-fallthrough */
import { useContext, useEffect, useState } from "react";
import { BsFilterLeft } from "react-icons/bs";
import { FaCheck, FaRegCalendarAlt } from "react-icons/fa";
import { MdOutlineTimer } from "react-icons/md";
import { useAccount } from "wagmi";
import { Button } from "../../../../../../components/button";
import { MediumFont, SmallFont } from "../../../../../../components/fonts";
import { Popover } from "../../../../../../components/popover";
import { Spinner } from "../../../../../../components/spinner";
import { Ths } from "../../../../../../components/table";
import { PopupUpdateContext } from "../../../../../../contexts/popup";
import { UserTrade } from "../../../../../../interfaces/assets";
import { TransactionResponse } from "../../../../../../interfaces/transactions";
import { GET } from "../../../../../../utils/fetch";
import { BaseAssetContext } from "../../../../context-manager";
import { Trade, UserTrades } from "../../../../models";
import { TradesTemplate } from "../../../ui/trades-template";

export const TokenTrades = () => {
  const { setConnect } = useContext(PopupUpdateContext);
  const {
    marketMetrics,
    baseAsset,
    isAssetPage,
    globalPairs,
    setGlobalPairs,
    fadeIn,
    switchedToNative,
    orderBy,
    setOrderBy,
    changeToDate,
    setChangeToDate,
  } = useContext(BaseAssetContext);
  const { address } = useAccount();
  const [userTrades, setUserTrades] = useState<UserTrades[] | null>(null);
  const [isMyTrades, setIsMyTrades] = useState<boolean>(false);
  const { isDisconnected } = useAccount();
  const baseSymbol = baseAsset?.[baseAsset?.baseToken]?.symbol;
  const quoteSymbol = baseAsset?.[baseAsset?.quoteToken]?.symbol;
  const [isTradeLoading, setIsTradeLoading] = useState(true);

  const [offset, setOffset] = useState(0);
  const [isLoadingMoreTrade, setIsLoadingMoreTrade] = useState(false);
  const isUsd = !switchedToNative || isAssetPage;

  const titles: string[] = [
    "Type",
    isAssetPage ? "Tokens" : baseSymbol,
    isAssetPage ? null : quoteSymbol,
    "Value",
    "Price",
    "Time",
    "Explorer",
  ];

  const getPositionOfSwitcherButton = (myTrade: boolean) => {
    if (myTrade) return "calc(50% - 2px)";
    return "calc(0% + 2px)";
  };

  useEffect(() => {
    if (!baseAsset || (userTrades?.length || 0) > 0 || !isAssetPage) return;
    GET("/api/1/wallet/transactions", {
      asset: baseAsset.name,
      wallet: address || "",
      limit: 25,
      order: "desc",
    })
      .then((r) => r.json())
      .then((r: TransactionResponse) => {
        if (r.data) {
          const newTransactions =
            "transactions" in r.data ? r.data.transactions : r.data;
          const length = newTransactions.length;
          setUserTrades((prev) => {
            let existingTrades = [];
            if (prev?.length > 0) {
              existingTrades = prev?.slice(length);
            }
            return [...existingTrades, ...newTransactions];
          });
        }
      });
  }, []);

  useEffect(() => {
    setIsLoadingMoreTrade(true);
    const params = {
      address: isAssetPage ? baseAsset?.contracts?.[0] : baseAsset?.address,
      blockchain: isAssetPage
        ? baseAsset?.blockchains?.[0]
        : baseAsset?.blockchain,
      date: isAssetPage ? "&sortBy=date" : "&sortBy=date",
      type: isAssetPage ? "asset" : "address",
    };
    try {
      fetch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/1/market/trades/pair?${params.type}=${params.address}&blockchain=${params.blockchain}&amount=100${params.date}&sortOrder=${orderBy}&offset=${offset}`,
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
            if (offset > globalPairs?.length) {
              const removeDoublePairs = r?.data?.filter((entry) => {
                if (globalPairs?.some((trade) => trade?.hash === entry?.hash))
                  return false;
                return true;
              });
              setGlobalPairs((prev) => [...prev, ...removeDoublePairs]);
            } else setGlobalPairs(r.data);
            if (orderBy === "desc") setChangeToDate(false);
            else setChangeToDate(true);
            setIsTradeLoading(false);
            setIsLoadingMoreTrade(false);
          }
          setIsLoadingMoreTrade(false);
        });
    } catch (e) {
      console.log(e);
    }
  }, [offset, orderBy]);

  const handleMoreTrades = () => setOffset((prev) => prev + 100);
  return (
    <div
      className={`flex flex-col ${
        isAssetPage ? "mt-2.5" : "mt-5 md:mt-2.5"
      } w-full mx-auto`}
    >
      <div className="flex justify-between items-center mt-2.5">
        {/* <div
              className={`min-h-[45px] flex items-center transition-all ${
                isMyTrades ? "opacity-50" : ""
              }`}
            >
              {/* <PopoverTrade title={activeNames.liquidity_pool}>
            <TradeLiquidityPoolPopup />
          </PopoverTrade> 
              <PopoverTrade
                title={activeNames.blockchain}
                isImage={activeNames.blockchain !== "All Chains"}
              >
                <TradeBlockchainPopup setActiveName={setActiveNames} />
              </PopoverTrade>
              <PopoverTrade title={activeNames.type}>
                <TradeTypePopup setActiveName={setActiveNames} />
              </PopoverTrade>
              <PopoverTrade title={activeNames.token_amount}>
                <TradeValueAmountPopup
                  title="token_amount"
                  state={showTradeTokenAmount}
                  setActiveName={setActiveNames}
                  setStateValue={setShowTradeTokenAmount}
                  activeName={activeNames}
                />
              </PopoverTrade>
              <PopoverTrade title={activeNames.value}>
                <TradeValueAmountPopup
                  title="Value"
                  setActiveName={setActiveNames}
                  state={showTradeValue}
                  setStateValue={setShowTradeValue}
                  activeName={activeNames}
                />
              </PopoverTrade>
            </div> */}
        <div className="flex w-fit">
          <Popover
            visibleContent={
              <Button>
                <BsFilterLeft className="text-xl mt-[1px] mr-2.5 md:mr-0" />
                <SmallFont extraCss="md:hidden">Order</SmallFont>
              </Button>
            }
            extraCss={`${isMyTrades ? "hidden" : ""} mr-auto`}
            hiddenContent={
              <div className="flex flex-col">
                <button
                  className="pb-2.5 flex justify-between w-[200px] items-center"
                  onClick={() => {
                    setOrderBy("desc");
                    setOffset(0);
                  }}
                >
                  <SmallFont>Order by newest</SmallFont>
                  <div className="w-5 h-5 rounded border-2 border-light-border-secondary dark:border-dark-border-secondary flex items-center justify-center">
                    {orderBy === "desc" ? (
                      <FaCheck className="text-[10px] text-light-font-100 dark:text-dark-font-100" />
                    ) : null}
                  </div>
                </button>
                <button
                  className="flex justify-between w-[200px] items-center"
                  onClick={() => {
                    setOrderBy("asc");
                    setOffset(0);
                  }}
                >
                  <SmallFont>Order by oldest</SmallFont>
                  <div className="w-5 h-5 rounded border-2 border-light-border-secondary dark:border-dark-border-secondary flex items-center justify-center">
                    {orderBy === "asc" ? (
                      <FaCheck className="text-[10px] text-light-font-100 dark:text-dark-font-100" />
                    ) : null}
                  </div>
                </button>
              </div>
            }
          />{" "}
        </div>
        <div
          className="flex items-center bg-light-bg-terciary dark:bg-dark-bg-terciary h-[35px] relative
         w-[200px] border border-light-border-primary dark:border-dark-border-primary mb-2 rounded-lg"
        >
          <div
            className="flex z-[0] w-[50%] h-[29px] bg-light-bg-hover dark:bg-dark-bg-hover rounded-md absolute transition-all duration-200"
            style={{ left: getPositionOfSwitcherButton(isMyTrades) }}
          />
          <button
            className={`flex items-center justify-center h-full w-[50%] text-sm lg:text-[13px] 
          md:text-xs transition-all duration-200 ${
            !isMyTrades
              ? "text-light-font-100 dark:text-dark-font-100"
              : "text-light-font-40 dark:text-dark-font-40"
          } z-[2] relative`}
            onClick={() => {
              setIsMyTrades(false);
            }}
          >
            All trades
          </button>
          <button
            className={`flex items-center justify-center h-full w-[50%] text-sm lg:text-[13px] 
            md:text-xs transition-all duration-200 ${
              isMyTrades
                ? "text-light-font-100 dark:text-dark-font-100"
                : "text-light-font-40 dark:text-dark-font-40"
            } z-[2] relative`}
            onClick={() => {
              if (isDisconnected) {
                setConnect(true);
              } else setIsMyTrades(true);
            }}
          >
            My Trades
          </button>
        </div>
      </div>
      {/* <div className="items-center justify-between hidden lg:flex my-2.5">
            <Button
              extraCss="max-w-fit h-[32px] px-3"
              onClick={() => setShowTradeFilters(true)}
            >
              <FiFilter className="mr-[7.5px]" />
              Filters
            </Button>
            <div
              className="flex h-[32px] items-center justify-center relative bg-light-bg-terciary
         dark:bg-dark-bg-terciary px-2 w-[180px] rounded-md border border-light-border-primary dark:border-dark-border-primary"
            >
              <div
                className="w-[50%] z-[0] flex bg-light-bg-hover dark:bg-dark-bg-hover h-[26px] rounded-md absolute transition-all duration-200"
                style={{ left: getPositionOfSwitcherButton(isMyTrades) }}
              />
              <button
                className={`flex items-center justify-center h-full w-[50%] text-sm lg:text-[13px] 
               md:text-xs font-medium transition-all duration-200 ${
                 !isMyTrades
                   ? "text-light-font-100 dark:text-dark-font-100"
                   : "text-light-font-40 dark:text-dark-font-40"
               }  z-[2] relative`}
                onClick={() => {
                  setIsMyTrades(false);
                  if (!isConnected) setConnect(true);
                }}
              >
                All trades
              </button>
              <button
                className={`flex items-center justify-center h-full w-[50%] text-sm lg:text-[13px] 
            md:text-xs font-medium transition-all duration-200 ${
              isMyTrades
                ? "text-light-font-100 dark:text-dark-font-100"
                : "text-light-font-40 dark:text-dark-font-40"
            }  z-[2] relative`}
                onClick={() => setIsMyTrades(true)}
              >
                My Trades
              </button>
            </div>
          </div> */}
      <div className="w-full h-full mx-auto max-h-[480px] overflow-y-scroll ">
        <table className="relative  w-full ">
          {!isTradeLoading && isMyTrades && (userTrades?.length || 0) === 0 ? (
            <caption className="caption-bottom border border-light-border-primary dark:border-dark-border-primary mt-0 rounded-b border-t-0">
              <div className="h-[250px] flex flex-col w-full items-center justify-center">
                <img src="/empty/ray.png" alt="No trade image" />
                <MediumFont extraCss="font-medium text-light-font-60 dark:text-dark-font-60 mt-5 mb-2.5">
                  You don&apos;t have any trades
                </MediumFont>
              </div>
            </caption>
          ) : null}
          {!isTradeLoading &&
          marketMetrics?.trade_history?.length === 0 &&
          !isMyTrades ? (
            <caption className="caption-bottom border border-light-border-primary dark:border-dark-border-primary mt-0 rounded-b border-t-0">
              <div className="h-[250px] flex w-full items-center justify-center flex-col">
                <img src="/empty/ray.png" alt="No trade image" />
                <MediumFont extraCss="font-medium text-light-font-60 dark:text-dark-font-60 mt-5 mb-2.5">
                  No trades available
                </MediumFont>
              </div>
            </caption>
          ) : null}
          <thead>
            <tr>
              {titles
                .filter((entry) => entry !== "Unit Price" && entry)
                .map((entry, i) => {
                  const isFirst = i === 0;
                  const isLast = i === titles.length - 1;
                  const isExplorer = entry === "Explorer";
                  const isBaseSymbol = entry === baseSymbol;
                  const isQuoteSymbol = entry === quoteSymbol;
                  const isTime = entry === "Time";
                  return (
                    <Ths
                      extraCss={`sticky z-[2] top-[-1px] bg-light-bg-secondary dark:bg-dark-bg-secondary 
                      border-t border-b border-light-border-primary dark:border-dark-border-primary px-2.5 
                      py-[10px] ${
                        isFirst
                          ? "pl-2.5 md:pl-0 text-start"
                          : "pl-2.5 text-end"
                      } ${isLast || isExplorer ? "pr-2.5" : "pr-2.5"} 
                       table-cell ${
                         entry === "Unit Price" ||
                         entry === "Value" ||
                         entry === "Type" ||
                         isQuoteSymbol
                           ? "md:hidden"
                           : "md:table-cell"
                       } ${isTime ? "cursor-pointer" : ""}`}
                      key={entry}
                      onClick={() => {
                        if (isTime) {
                          setChangeToDate((prev) => !prev);
                        }
                      }}
                    >
                      {isBaseSymbol ? (
                        <SmallFont
                          extraCss={`pl-2.5 text-end pr-2.5 md:text-start`}
                        >
                          <>
                            <span className="inline md:hidden">
                              {baseSymbol}
                            </span>
                            <span className="hidden md:inline">Tokens</span>
                          </>
                        </SmallFont>
                      ) : (
                        <div
                          className={`flex items-center ${
                            entry === "Type" ? "" : "justify-end"
                          } ${
                            entry === "Tokens"
                              ? "justify-end md:justify-start"
                              : ""
                          } w-full `}
                        >
                          {isTime ? (
                            <>
                              {changeToDate ? (
                                <MdOutlineTimer className="text-sm text-light-font-100 dark:text-dark-font-100" />
                              ) : (
                                <FaRegCalendarAlt className="text-sm text-light-font-100 dark:text-dark-font-100" />
                              )}
                            </>
                          ) : null}
                          <SmallFont
                            extraCss={`${
                              isFirst
                                ? " pl-0 text-start"
                                : entry === "Tokens"
                                ? "pl-2.5 md:text-start md:pl-2.5"
                                : "pl-2.5 text-end"
                            } ${isLast || isExplorer ? "pr-0 " : "pr-2.5"} `}
                          >
                            {entry}
                          </SmallFont>
                        </div>
                      )}
                    </Ths>
                  );
                })}
            </tr>
          </thead>
          {isTradeLoading ? (
            <>
              {Array.from({ length: 9 }).map((_, i) => (
                <TradesTemplate
                  key={i}
                  isLoading
                  trade={{} as Trade}
                  date={0}
                />
              ))}
            </>
          ) : (
            <>
              {(isMyTrades
                ? userTrades?.filter((entry) => entry.amount > 0)
                : globalPairs
              )?.map((trade: Trade | UserTrade | any, i: number) => {
                const isSell = trade.type === "sell";
                const date: number = isMyTrades
                  ? (trade?.timestamp as number)
                  : trade?.date;
                const tradeClass = trade.type === "sell" ? "sell-bg" : "buy-bg";
                return (
                  <>
                    <tbody
                      key={
                        trade.date +
                        trade.value_usd +
                        trade.token_amount +
                        trade.type +
                        (trade?.hash || 0) +
                        (trade?.unique_discriminator || 0) +
                        (trade?.id || 0)
                      }
                      className={`${
                        fadeIn?.includes(trade?.hash) ? tradeClass : null
                      } hover:bg-light-bg-terciary hover:dark:bg-dark-bg-terciary transition-all duration-100 ease-linear cursor-pointer`}
                    >
                      <TradesTemplate
                        trade={trade}
                        isSell={isSell}
                        isMyTrades={isMyTrades}
                        date={date}
                        isUsd={isUsd}
                        changeToDate={changeToDate}
                      />
                    </tbody>
                  </>
                );
              })}
              {!isMyTrades ? (
                <caption className="py-3 caption-bottom">
                  <div className="flex justify-center items-center">
                    {isLoadingMoreTrade ? (
                      <Spinner extraCss="h-[16px] w-[16px]" />
                    ) : null}
                    <button
                      className="text-light-font-60 dark:text-dark-font-60 text-sm md:text-xs hover:text-light-font-100 hover:dark:text-dark-font-100 transition-all duration-100 ease-linear"
                      onClick={handleMoreTrades}
                    >
                      Load more
                    </button>
                  </div>
                </caption>
              ) : null}
            </>
          )}
        </table>
      </div>
    </div>
  );
};
