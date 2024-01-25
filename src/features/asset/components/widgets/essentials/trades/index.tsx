/* eslint-disable no-fallthrough */
import Cookies from "js-cookie";
import React, { useContext, useEffect, useState } from "react";
import { FiFilter } from "react-icons/fi";
import { useAccount } from "wagmi";
import { Button } from "../../../../../../components/button";
import { MediumFont, SmallFont } from "../../../../../../components/fonts";
import { Ths } from "../../../../../../components/table";
import { PopupUpdateContext } from "../../../../../../contexts/popup";
import { UserTrade } from "../../../../../../interfaces/assets";
import { GET } from "../../../../../../utils/fetch";
import { BaseAssetContext } from "../../../../context-manager";
import { Trade, UserTrades } from "../../../../models";
import { formatFilters } from "../../../../utils";
import { TradeBlockchainPopup } from "../../../popup/trade-blockchain-selector";
import { TradeTypePopup } from "../../../popup/trade-type";
import { TradeValueAmountPopup } from "../../../popup/trade-value-amount";
import { PopoverTrade } from "../../../ui/popover-trade";
import { TradesTemplate } from "../../../ui/trades-template";

export const TokenTrades = () => {
  const { setConnect } = useContext(PopupUpdateContext);
  const {
    setShowTradeFilters,
    marketMetrics,
    isMarketMetricsLoading,
    setShowTradeValue,
    showTradeValue,
    setShowTradeTokenAmount,
    showTradeTokenAmount,
    filters,
    baseAsset,
    setMarketMetrics,
    isAssetPage,
    pairTrades,
    setPairTrades,
    isLoading,
    setsMarketMetricsLoading,
  } = useContext(BaseAssetContext);
  const { address } = useAccount();
  const [userTrades, setUserTrades] = useState<UserTrades[] | null>(null);
  const [isMyTrades, setIsMyTrades] = useState<boolean>(false);
  const maxValue = 1_000_000_000_000;
  const { isConnected, isDisconnected } = useAccount();
  const titles: string[] = [
    "Type",
    "Tokens",
    "Value",
    "Price",
    "Time",
    "Explorer",
  ];

  const getDefaultName = (title: string) => {
    let newValue = "";
    const defaultValue = [0, maxValue];
    let tokenAmounts = [...defaultValue];
    let valueUsd = [...defaultValue];

    filters.forEach((filter) => {
      const name = filter.value?.[0]?.split("trade_history")[1].split(".")[1];
      const value = filter.value?.[1];
      switch (name) {
        case "token_amount": {
          if (title === "token_amount") {
            if (filter.action === "gte" && tokenAmounts[0] === value) {
              tokenAmounts = [tokenAmounts[0], tokenAmounts[1]];
              newValue = `${tokenAmounts[0]} - ${tokenAmounts[1]}`;
            } else if (filter.action === "gte" && tokenAmounts[0] !== value) {
              tokenAmounts = [value, tokenAmounts[1]];
              newValue = `${tokenAmounts[0]} - ${tokenAmounts[1]}`;
            } else if (filter.action === "lte" && tokenAmounts[1] === value) {
              tokenAmounts = [tokenAmounts[0], tokenAmounts[1]];
              newValue = `${tokenAmounts[0]} - ${tokenAmounts[1]}`;
            } else if (filter.action === "lte" && tokenAmounts[1] !== value) {
              tokenAmounts = [tokenAmounts[0], value];
              newValue = `${tokenAmounts[0]} - ${tokenAmounts[1]}`;
            } else newValue = "Any Amount";
            return newValue;
          }
          break;
        }
        case "value_usd": {
          if (title === "value_usd") {
            if (filter.action === "gte" && valueUsd[0] === value) {
              valueUsd = [valueUsd[0], valueUsd[1]];
              newValue = `${valueUsd[0]} - ${valueUsd[1]}`;
            } else if (filter.action === "gte" && valueUsd[0] !== value) {
              valueUsd = [value, valueUsd[1]];
              newValue = `${valueUsd[0]} - ${valueUsd[1]}`;
            } else if (filter.action === "lte" && valueUsd[1] === value) {
              valueUsd = [valueUsd[0], valueUsd[1]];
              newValue = `${valueUsd[0]} - ${valueUsd[1]}`;
            } else if (filter.action === "lte" && valueUsd[1] !== value) {
              valueUsd = [valueUsd[0], value];
              newValue = `${valueUsd[0]} - ${valueUsd[1]}`;
            } else newValue = "Any Amount";
            return newValue;
          }
          break;
        }
        case "type": {
          if (title === "type") {
            const text = filter.value?.[1];
            newValue = `${text.charAt(0).toUpperCase()}${text.slice(1)} Tx`;
          }
          break;
        }
        default:
          return "All";
      }
      return newValue;
    });

    if (newValue.includes(maxValue.toString()))
      newValue = newValue.replace(maxValue.toString(), "Any");

    return newValue;
  };

  const [activeNames, setActiveNames] = useState({
    liquidity_pool: "Any Liquidity Pool",
    blockchain: "All Chains",
    type: getDefaultName("type") || "Any Type",
    token_amount: getDefaultName("token_amount") || "Any Amount",
    value: getDefaultName("value_usd") || "Any Value",
  });
  const filterFormatted = formatFilters(filters);

  useEffect(() => {
    if (filters.length > 0) Cookies.set("trade-filters", filterFormatted);
  }, [filters]);

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
      .then((r) => {
        if (r.data) {
          const newTransactions = r.data.transactions;
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

  const fetchPairTrade = () => {
    GET(`/api/1/market/trades`, {
      asset: baseAsset?.token0?.address,
    })
      .then((res) => res.json())
      .then((r) => {
        if (r.data) {
          setPairTrades(r.data);
          setTimeout(() => {
            fetchPairTrade();
          }, 3000);
        } else {
          setTimeout(() => {
            fetchPairTrade();
          }, 3000);
        }
      });
  };

  useEffect(() => {
    if (isAssetPage) return;
    fetchPairTrade();
  }, [baseAsset]);

  console.log("baseAsset", baseAsset);

  return (
    <div className="flex flex-col mt-2.5 w-full mx-auto">
      <div className="flex justify-between items-center mt-2.5 lg:hidden">
        <div
          className={`min-h-[45px] flex items-center transition-all ${
            isMyTrades ? "opacity-50" : ""
          }`}
        >
          {/* <PopoverTrade title={activeNames.liquidity_pool}>
            <TradeLiquidityPoolPopup />
          </PopoverTrade> */}
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
        </div>
        <div
          className="flex items-center bg-light-bg-terciary dark:bg-dark-bg-terciary h-[35px] relative
         w-[200px] lg:hidden border border-light-border-primary dark:border-dark-border-primary mb-2 rounded-lg"
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
      <div className="items-center justify-between hidden lg:flex my-2.5">
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
      </div>
      <div className="w-full h-full mx-auto max-h-[480px] overflow-y-scroll ">
        <table className="relative  w-full ">
          {!isMarketMetricsLoading &&
          isMyTrades &&
          (userTrades?.length || 0) === 0 ? (
            <caption className="caption-bottom border border-light-border-primary dark:border-dark-border-primary mt-0 rounded-b border-t-0">
              <div className="h-[250px] flex flex-col w-full items-center justify-center">
                <img src="/empty/ray.png" alt="No trade image" />
                <MediumFont extraCss="font-medium text-light-font-60 dark:text-dark-font-60 mt-5 mb-2.5">
                  You don&apos;t have any trades
                </MediumFont>
              </div>
            </caption>
          ) : null}
          {!isMarketMetricsLoading &&
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
                .filter((entry) => entry !== "Unit Price")
                .map((entry, i) => {
                  const isFirst = i === 0;
                  const isLast = i === titles.length - 1;
                  const isExplorer = entry === "Explorer";
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
                         entry === "Type"
                           ? "md:hidden"
                           : "md:table-cell"
                       } `}
                      key={entry}
                    >
                      <SmallFont
                        extraCss={`${
                          isFirst
                            ? " pl-0 text-start"
                            : entry === "Tokens"
                            ? "pl-2.5 md:text-start md:pl-2.5"
                            : "pl-2.5 text-end"
                        } ${isLast || isExplorer ? "pr-0 " : "pr-2.5"}`}
                      >
                        {entry}
                      </SmallFont>
                    </Ths>
                  );
                })}
            </tr>
          </thead>
          {isMarketMetricsLoading && isAssetPage ? (
            <>
              {Array.from({ length: 9 }).map((_, i) => (
                <TradesTemplate
                  key={i}
                  isLoading
                  trade={{} as Trade}
                  date={"0"}
                />
              ))}
            </>
          ) : (
            <>
              {(isAssetPage
                ? isMyTrades
                  ? userTrades?.filter((entry) => entry.amount > 0)
                  : marketMetrics?.trade_history
                : pairTrades
              )?.map((trade: Trade | UserTrade | any) => {
                const isSell = trade.type === "sell";
                const date: number = isMyTrades
                  ? (trade?.timestamp as number)
                  : trade?.date;
                return (
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
                    className="animate-fadeInTrade"
                  >
                    <TradesTemplate
                      trade={trade}
                      isSell={isSell}
                      isMyTrades={isMyTrades}
                      date={date}
                    />
                  </tbody>
                );
              })}
            </>
          )}
        </table>
      </div>
    </div>
  );
};
