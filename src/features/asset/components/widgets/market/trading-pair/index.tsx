import { famousContractsLabelFromName } from "layouts/swap/utils";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useRef, useState } from "react";
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
  const { baseAsset, setPairs, pairs, isAssetPage } =
    useContext(BaseAssetContext);
  const [isLoading, setIsLoading] = useState(!pairs?.length);
  const router = useRouter();
  const [activePairs, setActivePairs] = useState("dex");
  const [page, setPage] = useState(0);
  const [isTradeScrollLoading, setIsTradeScrollLoading] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const containerRef = useRef<HTMLTableElement>(null);
  const [totalPairs, setTotalPairs] = useState(0);
  const titles = ["DEX", "Trading Pair", "Liquidity", "Price", "Pairs Address"];

  const filterPairs = (data) => {
    const newPairs = [...(pairs || []), ...data];

    let seenAddresses = new Set();
    const filteredPairs = newPairs?.filter((entry) => {
      if (entry.address && !seenAddresses.has(entry.address)) {
        seenAddresses.add(entry.address);
        return true;
      }
      return false;
    });
    setPairs(filteredPairs);
  };

  const fetchTrades = () => {
    if (!isAssetPage) return;
    setIsTradeScrollLoading(true);
    GET("/api/1/market/pairs", {
      asset: baseAsset?.name,
      offset: page,
      hideBrokenPairs: true,
      limit: page + 25,
    })
      .then((r) => r.json())
      .then(({ data }) => {
        if (data && data.pairs.length > 0) {
          filterPairs(data.pairs);
          setTotalPairs(data.total_count);
          // setPairs((prev) => [...(prev || []), ...data.pairs]);
          setPage((prevPage) => prevPage + data.pairs?.length);
          setIsLoading(false);
          if ((pairs?.length || 0) > 0)
            containerRef.current?.scrollTo({
              top: containerRef.current?.scrollHeight * data.pairs.length + 51,
              behavior: "smooth",
            });
          setIsTradeScrollLoading(false);
        }
        setIsLoading(false);
        setIsTradeScrollLoading(false);
      });
  };

  useEffect(() => {
    if (!pairs?.length || pairs?.length === 0) {
      fetchTrades();
    } else setIsLoading(false);
  }, [baseAsset]);

  const newPairs: IPairs[] | null = pairs;

  const getPositionFromPair = (pair: string) => {
    switch (pair) {
      case "all":
        return "calc(0% + 2px)";
      case "cex":
        return "calc(33.33% + 2px)";
      case "dex":
        return "calc(66.66% - 2px)";
      default:
        return "calc(0% + 2px)";
    }
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
        <div
          className="flex bg-light-bg-terciary dark:bg-dark-bg-terciary rounded
         p-0.5 h-[36px] md:h-[31px] relative max-w-[200px] w-full border 
         border-light-border-primary dark:border-dark-border-primary"
        >
          <div
            className="flex transition-all z-[0] duration-200 rounded-md absolute
             bg-light-bg-hover dark:bg-dark-bg-hover h-[30px] md:h-[25px] w-[33.33%]"
            style={{ left: getPositionFromPair(activePairs) }}
          />
          <button
            className="w-[33.33%] h-[30px] md:h-[25px] flex items-center justify-center relative z-[1]"
            onClick={() => setActivePairs("all")}
            disabled
          >
            <SmallFont
              extraCss={`transition-all duration-200 font-medium ${
                activePairs === "all"
                  ? "text-light-font-100 dark:text-dark-font-100"
                  : "text-light-font-40 dark:text-dark-font-40"
              }`}
            >
              All
            </SmallFont>
          </button>
          <button
            className="w-[33.33%] h-[30px] md:h-[25px] flex items-center justify-center relative z-[1]"
            onClick={() => setActivePairs("cex")}
            disabled
          >
            <SmallFont
              extraCss={`transition-all duration-200 font-medium ${
                activePairs === "cex"
                  ? "text-light-font-100 dark:text-dark-font-100"
                  : "text-light-font-40 dark:text-dark-font-40"
              }`}
            >
              CEX
            </SmallFont>
          </button>
          <button
            className="w-[33.33%] h-[30px] md:h-[25px] flex items-center justify-center  relative z-[1]"
            onClick={() => setActivePairs("dex")}
          >
            <SmallFont
              extraCss={`transition-all duration-200 font-medium ${
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
      <div className="max-h-[515px] md:max-h-[430px] overflow-y-scroll scroll  w-full">
        <table className="relative w-full" ref={containerRef}>
          <thead>
            <tr>
              {titles.map((entry, i) => {
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
                      isFirst || entry === "Trading Pair"
                        ? "text-start"
                        : "text-end"
                    } table-cell`}
                    key={i}
                  >
                    {entry === "Pairs Address" ? (
                      <div className="flex items-center justify-end">
                        <SmallFont extraCss="flex md:hidden text-end font-medium">
                          {entry}
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
                  ? pairs
                  : Array.from({ length: 8 })
                )?.map((pair: IPairs | any, i: number) => {
                  return (
                    <tr
                      key={i}
                      className="cursor-pointer hover:bg-light-bg-terciary dark:hover:bg-dark-bg-terciary"
                    >
                      <td
                        className="border-b border-light-border-primary dark:border-dark-border-primary py-[15px]
                     pl-5 md:pl-2.5 pr-2.5 md:pr-[25px] text-[11px] lg:text-[10px] md:text-[8px]"
                        onClick={() => router.push(`/pair/${pair?.address}`)}
                      >
                        {isLoading ? (
                          <div className="flex items-center">
                            <Skeleton extraCss="h-[23px] w-[23px] rounded-full ml-2.5" />
                            <Skeleton extraCss="h-[13px] md:h-[11px] w-[120px]" />
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
                            <SmallFont extraCss="flex sm:hidden">
                              {pair?.exchange || "Unknown"}
                            </SmallFont>
                          </div>
                        )}
                      </td>
                      <td
                        className="border-b border-light-border-primary dark:border-dark-border-primary py-[15px]
                      px-2.5 text-[11px] lg:text-[10px] md:text-[8px]"
                        onClick={() => router.push(`/pair/${pair?.address}`)}
                      >
                        <div className="flex w-full">
                          {isLoading ? (
                            <Skeleton extraCss="h-[13px] md:h-[11px] w-[80px] ml-2" />
                          ) : (
                            <SmallFont extraCss="-mb-0.5 md:mb-[-5px] text-blue dark:text-blue">
                              {`${baseAsset?.symbol}/`}
                              {getSymbol(pair) || "--"}
                            </SmallFont>
                          )}
                        </div>
                      </td>
                      <td
                        className="border-b border-light-border-primary
                       dark:border-dark-border-primary px-2.5 text-end"
                        onClick={() => router.push(`/pair/${pair?.address}`)}
                      >
                        <div className="flex justify-end w-full">
                          {isLoading ? (
                            <Skeleton extraCss="h-[13px] md:h-[11px] w-[70px]" />
                          ) : (
                            <SmallFont extraCss="-mb-0.5 md:mb-[-5px]">
                              $
                              {getFormattedAmount(
                                (pair.token0?.approximateReserveUSD || 0) +
                                  (pair.token1?.approximateReserveUSD || 0),
                                0,
                                { canUseHTML: true }
                              )}
                            </SmallFont>
                          )}
                        </div>
                      </td>
                      <td
                        className="border-b border-light-border-primary
                       dark:border-dark-border-primary px-2.5 text-end"
                        onClick={() => router.push(`/pair/${pair?.address}`)}
                      >
                        <div className="flex justify-end w-full">
                          {isLoading ? (
                            <Skeleton extraCss="h-[13px] md:h-[11px] w-[80px]" />
                          ) : (
                            <SmallFont extraCss="-mb-0.5 md:mb-[-5px]">
                              $
                              {getFormattedAmount(pair.price, 0, {
                                canUseHTML: true,
                              })}
                            </SmallFont>
                          )}
                        </div>
                      </td>
                      <td className="border-b border-light-border-primary dark:border-dark-border-primary px-2.5">
                        <div className="flex justify-end w-full md:hidden">
                          {isLoading ? (
                            <Skeleton extraCss="h-[13px] md:h-[11px] w-[100px]" />
                          ) : (
                            <SmallFont extraCss="-mb-0.5 md:mb-[-5px]">
                              {addressSlicer(pair.address)}
                            </SmallFont>
                          )}
                          <a
                            className="flex ml-1"
                            href={"/pair/" + pair?.address}
                          >
                            <FiExternalLink className="text-light-font-60 dark:text-dark-font-60 mr-auto" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              {totalPairs > (pairs?.length || 0) ? (
                <LoadMore
                  extraCss="sticky w-full bottom-0 z-[1] pt-2.5"
                  callback={fetchTrades}
                  isLoading={isTradeScrollLoading}
                  totalCount={totalPairs}
                  count={pairs?.length}
                />
              ) : null}
            </>
          ) : (
            <caption
              className="caption-bottom border border-light-border-primary
             dark:border-dark-border-primary rounded-b border-t-0 mt-0"
            >
              <div className="flex h-[250px] w-full items-enter justify-center flex-col">
                <img alt="no trading pairs image" src="/empty/ray.png" />
                <MediumFont extraCss="text-light-font-60 dark:text-font-60 mt-5 mb-2.5">
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
