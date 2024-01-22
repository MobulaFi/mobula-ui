/* eslint-disable no-fallthrough */
import Cookies from "js-cookie";
import { blockchainsContent } from "mobula-lite/lib/chains/constants";
import React, { useContext, useEffect, useState } from "react";
import { FiExternalLink, FiFilter } from "react-icons/fi";
import { useAccount } from "wagmi";
import { Button } from "../../../../../../components/button";
import { MediumFont, SmallFont } from "../../../../../../components/fonts";
import { NextChakraLink } from "../../../../../../components/link";
import { Spinner } from "../../../../../../components/spinner";
import { Ths } from "../../../../../../components/table";
import { PopupUpdateContext } from "../../../../../../contexts/popup";
import { UserTrade } from "../../../../../../interfaces/assets";
import { GET } from "../../../../../../utils/fetch";
import {
  getClosest,
  getFormattedAmount,
} from "../../../../../../utils/formaters";
import { BaseAssetContext } from "../../../../context-manager";
import { Trade, UserTrades } from "../../../../models";
import { formatFilters } from "../../../../utils";
import { TradeBlockchainPopup } from "../../../popup/trade-blockchain-selector";
import { TradeTypePopup } from "../../../popup/trade-type";
import { TradeValueAmountPopup } from "../../../popup/trade-value-amount";
import { PopoverTrade } from "../../../ui/popover-trade";

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
        if (r.data) setUserTrades(r.data.transactions);
      });
  }, []);

  const fetchPairTrade = () => {
    console.log("INSIDE FUNCTION");
    GET(`/api/1/market/trades`, {
      asset: baseAsset?.token0?.address,
    })
      .then((res) => res.json())
      .then((r) => {
        console.log("RRRRR", r?.data);
        if (r.data) {
          setPairTrades(r.data);
          console.log("IM CALLED");
          setTimeout(() => {
            fetchPairTrade();
          }, 5000);
        }
      });
  };

  useEffect(() => {
    console.log("issssss", isAssetPage, baseAsset);
    if (isAssetPage) return;
    fetchPairTrade();
  }, [baseAsset]);

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
          {isMarketMetricsLoading && isAssetPage ? (
            <caption className="caption-bottom border border-light-border-primary dark:border-dark-border-primary mt-0 rounded-b border-t-0">
              <div className="h-[250px] flex w-full items-center justify-center">
                <Spinner extraCss="h-[50px] w-[50px]" />
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
              >
                <tr>
                  <td
                    className="border-b border-light-border-primary dark:border-dark-border-primary pl-5 
                  md:pl-2.5 pr-2.5 py-[15px] text-[11px] lg:text-[10px] md:text-[8px] md:hidden"
                  >
                    <div>
                      <SmallFont
                        extraCss={`mb-[-2px] md:mb-[-5px] ${
                          isSell
                            ? "text-red dark:text-red"
                            : "text-green dark:text-green"
                        }`}
                      >
                        {isSell ? "Sell" : "Buy"}
                      </SmallFont>
                    </div>
                  </td>
                  <td
                    className="border-b border-light-border-primary dark:border-dark-border-primary pl-5 
                  px-2.5 pr-5 md:pr-2.5 md:py-1.5"
                  >
                    <div className="flex items-end md:items-start w-full justify-center flex-col">
                      {"blockchain" in trade || isMyTrades ? (
                        <SmallFont extraCss="font-medium">
                          <NextChakraLink
                            href={
                              "blockchain" in trade && "hash" in trade
                                ? `${
                                    blockchainsContent[trade.blockchain]
                                      ?.explorer
                                  }/tx/${trade.hash}`
                                : "/"
                            }
                            key={trade.hash}
                            target="_blank"
                          >
                            {getFormattedAmount(
                              (isMyTrades
                                ? trade.amount
                                : trade.token_amount) as number
                            )}
                          </NextChakraLink>
                        </SmallFont>
                      ) : null}
                      <SmallFont
                        extraCss={`mt-[-4px] md:mt-0 hidden md:flex ${
                          isSell
                            ? "text-red dark:text-red"
                            : "text-green dark:text-green"
                        } font-medium`}
                      >
                        $
                        {getFormattedAmount(
                          (isMyTrades
                            ? trade.amount_usd
                            : trade.value_usd) as number,
                          2
                        )}
                      </SmallFont>
                    </div>
                  </td>
                  <td
                    className="border-b border-light-border-primary dark:border-dark-border-primary pl-5 
                     px-2.5 table-cell md:hidden"
                  >
                    <div className="flex justify-end w-full min-w-[60%]">
                      <SmallFont
                        extraCss={`${
                          isSell
                            ? "text-red dark:text-red"
                            : "text-green dark:text-green"
                        } mr-0 lg:mr-2.5 md:mr-0`}
                      >
                        $
                        {getFormattedAmount(
                          (isMyTrades
                            ? trade.amount_usd
                            : trade.value_usd) as number,
                          2
                        )}
                      </SmallFont>
                    </div>
                  </td>
                  <td
                    className="border-b border-light-border-primary dark:border-dark-border-primary pl-5 
                  px-2.5 min-w-[90px]"
                  >
                    <div className="flex justify-end w-full">
                      <SmallFont
                        extraCss={`text-end ${
                          isSell
                            ? "text-red dark:text-red"
                            : "text-green dark:text-green"
                        }`}
                      >
                        {`$${getFormattedAmount(
                          isMyTrades
                            ? getClosest(
                                baseAsset?.price_history?.price || [],
                                trade?.timestamp as number
                              )
                            : trade.token_price
                        )}`}
                      </SmallFont>
                    </div>
                  </td>
                  <td
                    className="border-b border-light-border-primary dark:border-dark-border-primary pl-5 
                     px-2.5 pr-5 md:pr-2.5"
                  >
                    <div className="flex items-end flex-col">
                      <SmallFont extraCss="font-medium">
                        {new Date(date).getHours() > 9
                          ? new Date(date).getHours()
                          : `0${new Date(date).getHours()}`}
                        :
                        {new Date(date).getMinutes() > 9
                          ? new Date(date).getMinutes()
                          : `0${new Date(date).getMinutes()}`}
                        :
                        {new Date(date).getSeconds() > 9
                          ? new Date(date).getSeconds()
                          : `0${new Date(date).getSeconds()}`}
                      </SmallFont>
                      {isMyTrades ? (
                        <SmallFont extraCss="text-xs font-medium">
                          {trade.date}
                        </SmallFont>
                      ) : null}{" "}
                    </div>
                  </td>
                  <td
                    className="border-b border-light-border-primary dark:border-dark-border-primary pl-5 
                            px-2.5 pr-5 md:pr-2.5"
                  >
                    <div className="flex items-center justify-end  w-full">
                      {"blockchain" in trade || isMyTrades ? (
                        <>
                          {" "}
                          <NextChakraLink
                            href={
                              "blockchain" in trade && "hash" in trade
                                ? `${
                                    blockchainsContent[trade.blockchain]
                                      ?.explorer
                                  }/tx/${trade.hash}`
                                : "/"
                            }
                            key={trade.hash}
                            target="_blank"
                          >
                            <FiExternalLink className="ml-[15px] md:ml-0 mb-[3px] mr-[7.5px] text-light-font-40 dark:text-dark-font-40" />
                          </NextChakraLink>
                          <img
                            className="w-[18px] h-[18px] min-w-[18px] mb-0.5 rounded-full"
                            src={
                              blockchainsContent[trade.blockchain]?.logo ||
                              `/logo/${
                                trade.blockchain.toLowerCase().split(" ")[0]
                              }.png`
                            }
                            alt={`${trade.blockchain} logo`}
                          />
                        </>
                      ) : null}
                    </div>
                  </td>
                </tr>
              </tbody>
            );
          })}
        </table>
      </div>
    </div>
  );
};
