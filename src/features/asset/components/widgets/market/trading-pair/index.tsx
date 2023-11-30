import { famousContractsLabelFromName } from "layouts/swap/utils";
import { blockchainsContent } from "mobula-lite/lib/chains/constants";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useRef, useState } from "react";
import { BsCheckLg } from "react-icons/bs";
import { FaRegCopy } from "react-icons/fa6";
import { FiExternalLink } from "react-icons/fi";
import {
  LargeFont,
  MediumFont,
  SmallFont,
} from "../../../../../../components/fonts";
import { LoadMore } from "../../../../../../components/load-more";
import { Skeleton } from "../../../../../../components/skeleton";
import { Ths } from "../../../../../../components/table";
import { GET } from "../../../../../../utils/fetch";
import {
  addressSlicer,
  getFormattedAmount,
} from "../../../../../../utils/formaters";
import { BaseAssetContext } from "../../../../context-manager";
import { IPairs } from "../../../../models";

export const TradingPairs = () => {
  const { baseAsset, setPairs, pairs } = useContext(BaseAssetContext);
  const [isLoading, setIsLoading] = useState(!pairs?.length);
  const router = useRouter();
  const [isCopied, setIsCopied] = useState("");
  const [activePairs, setActivePairs] = useState("dex");
  const [page, setPage] = useState(0);
  const [isTradeScrollLoading, setIsTradeScrollLoading] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const [totalPairs, setTotalPairs] = useState(0);
  const titles = [
    "DEX",
    "Trading Pairs",
    "Liquidity",
    "Price",
    "Pairs Address",
  ];

  const fetchTrades = () => {
    setIsTradeScrollLoading(true);
    GET("/api/1/market/pairs", {
      asset: baseAsset?.name,
      offset: page,
      hideBrokenPairs: true,
    })
      .then((r) => r.json())
      .then(({ data }) => {
        if (data && data.pairs.length > 0) {
          setPairs((prevTrades) => [...(prevTrades || []), ...data.pairs]);
          setTotalPairs(data.total_count);
          setPage((prevPage) => prevPage + 1);
          setIsTradeScrollLoading(false);
          setIsLoading(false);
          if ((pairs?.length || 0) > 0)
            containerRef.current?.scrollTo({
              top: containerRef.current?.scrollHeight * data.pairs.length + 51,
              behavior: "smooth",
            });
        } else {
          console.log("ERROR:", data);
        }
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (!pairs?.length || pairs?.length === 0) {
      fetchTrades();
    } else setIsLoading(false);
  }, [baseAsset]);

  const copyText = (pair) => {
    window.navigator.clipboard.writeText(pair?.address);
    window.focus();
    setIsCopied(pair.address);
    setTimeout(() => {
      setIsCopied("");
    }, 2000);
  };

  const newPairs: IPairs[] | null = pairs;

  const getPositionFromPair = (pair: string) => {
    switch (pair) {
      case "all":
        return "calc(0% + 2px)";
      case "cex":
        return "calc(33.33% + 2px)";
      case "dex":
        return "calc(66.66% + 2px)";
      default:
        return "calc(0% + 2px)";
    }
  };

  const fetchMoreTrades = async () => {
    fetchTrades();
  };

  const getSymbol = (pair) => {
    if (pair.token1.symbol === baseAsset?.symbol) return pair.token0.symbol;
    return pair.token1.symbol;
  };

  return (
    <div
      className={`flex-col mt-0 lg:mt-5 md:mt-[5px] mb-5 w-full ${
        (newPairs?.length || 0) > 0 || isLoading ? "flex" : "hidden"
      }`}
    >
      <div className="flex items-center mb-[15px] justify-between pr-0 md:pr-[7.5px]">
        <LargeFont extraCss="ml-0 md:ml-2.5">Trading Pairs</LargeFont>
        <div className="flex bg-light-bg-terciary dark:bg-dark-bg-terciary rounded p-0.5 h-[36px] md:h-[31px] relative max-w-[200px] w-full">
          <div
            className="flex transition-all duration-250 rounded absolute bg-light-bg-hover dark:bg-dark-bg-hover h-[30px] md:h-[25px]"
            style={{ left: getPositionFromPair(activePairs) }}
          />
          <button
            className="w-[33.33%] h-[30px] md:h-[25px] flex items-center justify-center"
            onClick={() => setActivePairs("all")}
            disabled
          >
            <SmallFont
              extraCss={`transition-all duration-250 font-medium ${
                activePairs === "all"
                  ? "text-light-font-100 dark:text-dark-font-100"
                  : "text-light-font-40 dark:text-dark-font-40"
              }`}
            >
              All
            </SmallFont>
          </button>
          <button
            className="w-[33.33%] h-[30px] md:h-[25px] flex items-center justify-center"
            onClick={() => setActivePairs("cex")}
            disabled
          >
            <SmallFont
              extraCss={`transition-all duration-250 font-medium ${
                activePairs === "cex"
                  ? "text-light-font-100 dark:text-dark-font-100"
                  : "text-light-font-40 dark:text-dark-font-40"
              }`}
            >
              CEX
            </SmallFont>
          </button>
          <button
            className="w-[33.33%] h-[30px] md:h-[25px] flex items-center justify-center"
            onClick={() => setActivePairs("dex")}
          >
            <SmallFont
              extraCss={`transition-all duration-250 font-medium ${
                activePairs === "dex"
                  ? "text-light-font-100 dark:text-dark-font-100"
                  : "text-light-font-40 dark:text-dark-font-40"
              }`}
            >
              DEX
            </SmallFont>
          </button>
        </div>
      </div>
      <div className="max-h-[500px] md:max-h-[430px] overflow-y-scroll scroll  w-full">
        <table className="relative w-full" ref={containerRef as never}>
          <thead>
            <tr>
              {titles
                .filter((entry) => entry !== "Unit Price")
                .map((entry, i) => {
                  const isFirst = i === 0;
                  const isLast = i === titles.length - 1;
                  const isOpen = entry === "Open";
                  return (
                    <Ths
                      extraCss={`sticky bg-light-bg-secondary dark:bg-dark-bg-secondary z-[2] top-[-1px]
                   border-t border-b px-2.5 py-[10px] border-light-border-primary dark:border-dark-border-primary
                    ${isFirst ? "pl-5 md:pl-2.5" : "pl-2.5"} ${
                        isLast || isOpen ? "pr-5 md:pr-2.5" : "pr-2.5"
                      } 
                    ${
                      isFirst || entry === "Trading Pairs"
                        ? "text-start"
                        : "text-end"
                    } table-cell ${entry === "Unit Price" ? "md:hidden" : ""}`}
                      key={entry}
                    >
                      {entry === "Pairs Address" ? (
                        <div className="flex items-center justify-end">
                          <SmallFont extraCss="flex md:hidden text-end font-medium">
                            {entry}
                          </SmallFont>
                          <SmallFont extraCss="hidden md:flex text-end font-medium">
                            Link
                          </SmallFont>
                        </div>
                      ) : (
                        <SmallFont extraCss="font-medium">{entry}</SmallFont>
                      )}
                    </Ths>
                  );
                })}
            </tr>
          </thead>
          {(newPairs?.length || 0) > 0 || isLoading ? (
            <>
              <tbody>
                {((pairs?.length || 0) > 0
                  ? pairs?.sort((a, b) => b.liquidity - a.liquidity)
                  : Array.from({ length: 8 })
                )?.map((pair: IPairs | any, i: number) => {
                  const geckoId =
                    blockchainsContent[pair?.blockchain]?.geckoterminalChain;
                  const geckoUrl = geckoId
                    ? `https://www.geckoterminal.com/${geckoId}/pools/${pair.address}`
                    : "";
                  return (
                    <tr
                      key={
                        pair?.exchange + pair?.address + pair?.liquidity || i
                      }
                    >
                      <td
                        className="border-b border-light-border-primary dark:border-dark-border-primary py-[15px]
                     pl-5 md:pl-2.5 pr-2.5 md:pr-[25px] text-[11px] lg:text-[10px] md:text-[8px]"
                      >
                        {isLoading ? (
                          <div className="flex items-center">
                            <Skeleton extraCss="h-[20px] w-[120px]" />
                            <Skeleton extraCss="h-[23px] w-[23px] rounded-full ml-2.5" />
                          </div>
                        ) : (
                          <div className="flex items-center sm:justify-center justify-start">
                            <img
                              className="w-[23px] h-[23px] min-w-[23px] md:w-[18px] md:h-[18px] md:min-w-[18px] 
                          rounded-full mr-2.5 md:mr-[5px]"
                              src={
                                famousContractsLabelFromName?.[pair?.exchange]
                                  ?.logo || "/empty/unknown.png"
                              }
                            />
                            <SmallFont extraCss="font-medium flex sm:hidden">
                              {pair?.exchange || "Unknown"}
                            </SmallFont>
                          </div>
                        )}
                      </td>
                      <td
                        className="border-b border-light-border-primary dark:border-dark-border-primary py-[15px]
                      px-2.5 text-[11px] lg:text-[10px] md:text-[8px]"
                      >
                        <div className="flex w-full">
                          {isLoading ? (
                            <Skeleton extraCss="h-[20px] w-[120px]" />
                          ) : (
                            <SmallFont extraCss="-mb-0.5 md:mb-[-5px] text-blue dark:text-blue">
                              {`${baseAsset?.symbol}/`}
                              {getSymbol(pair) || "--"}
                            </SmallFont>
                          )}
                        </div>
                      </td>
                      <td className="border-b border-light-border-primary dark:border-dark-border-primary px-2.5 text-end">
                        <div className="flex justify-end w-full">
                          {isLoading ? (
                            <Skeleton extraCss="h-[20px] w-[120px]" />
                          ) : (
                            <SmallFont extraCss="-mb-0.5 md:mb-[-5px] font-medium">
                              ${getFormattedAmount(pair.liquidity)}
                            </SmallFont>
                          )}
                        </div>
                      </td>
                      <td className="border-b border-light-border-primary dark:border-dark-border-primary px-2.5 text-end">
                        <div className="flex justify-end w-full">
                          {isLoading ? (
                            <Skeleton extraCss="h-[20px] w-[80px]" />
                          ) : (
                            <SmallFont extraCss="-mb-0.5 md:mb-[-5px] font-medium">
                              ${getFormattedAmount(pair.price)}
                            </SmallFont>
                          )}
                        </div>
                      </td>
                      <td className="border-b border-light-border-primary dark:border-dark-border-primary px-2.5">
                        <div className="flex justify-end w-full md:hidden">
                          {isLoading ? (
                            <Skeleton extraCss="h-[20px] w-[100px]" />
                          ) : (
                            <div
                              className="flex items-center cursor-pointer"
                              onClick={() => copyText(pair)}
                            >
                              <SmallFont extraCss="-mb-0.5 md:mb-[-5px] font-medium">
                                {addressSlicer(pair.address)}
                              </SmallFont>
                              {isCopied === pair.address ? (
                                <BsCheckLg className="text-green dark:text-green text-sm lg:text-[13px] md:text-xs ml-2.5" />
                              ) : (
                                <FaRegCopy className="ml-2.5 text-light-font-100 dark:text-dark-font-100 text-sm lg:text-[13px] md:text-xs" />
                              )}
                            </div>
                          )}
                        </div>
                        <div
                          className="hidden md:flex"
                          onClick={() => router.push(geckoUrl)}
                        >
                          <FiExternalLink className="text-light-font-60 dark:text-dark-font-60 mr-auto" />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              {hasMoreData && totalPairs !== pairs?.length ? (
                <LoadMore
                  extraCss="sticky w-full bottom-0 z-[1]"
                  callback={fetchMoreTrades}
                  isLoading={isTradeScrollLoading}
                  totalCount={totalPairs}
                  count={pairs?.length}
                />
              ) : null}
            </>
          ) : (
            <caption className="border border-light-border-primary dark:border-dark-border-primary rounded-b border-t-0 mt-0">
              <div className="flex h-[250px] w-full items-enter justify-center flex-col">
                <img alt="no trading pairs image" src="/empty/ray.png" />
                <MediumFont extraCss="text-light-font-60 dark:text-font-60 font-medium mt-5 mb-2.5">
                  No trading pairs detected for this token.
                </MediumFont>
              </div>
            </caption>
          )}
        </table>
      </div>
    </div>
  );
};
