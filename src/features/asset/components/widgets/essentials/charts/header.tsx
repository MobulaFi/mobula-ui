import Cookies from "js-cookie";
import React, { useContext, useEffect } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { MdCandlestickChart, MdShowChart } from "react-icons/md";
import { Button } from "../../../../../../components/button";
import { CompareButtons } from "../../../../../../features/user/portfolio/components/chart/compare-buttons";
import { ComparePopover } from "../../../../../../features/user/portfolio/components/chart/compare-popover";
import { pushData } from "../../../../../../lib/mixpanel";
import { createSupabaseDOClient } from "../../../../../../lib/supabase";
import { BaseAssetContext } from "../../../../context-manager";
import { TimeSwitcher } from "../time-switcher";

export const ChartHeader = () => {
  const {
    timeSelected,
    chartType,
    shouldLoadHistory,
    loadHistoryData,
    setChartType,
    activeChart,
    setActiveChart,
    setHideTx,
    hideTx,
    transactions,
    setComparedEntities,
    comparedEntities,
    baseAsset,
    unformattedHistoricalData,
    setUnformattedHistoricalData,
    historyData,
    setHistoryData,
  } = useContext(BaseAssetContext);
  const supabase = createSupabaseDOClient();

  const capitalizeFirstLetter = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  const getPosition = () => {
    if (chartType === "price") return "calc(0% + 1.5px)";
    return "calc(50% - 1px)";
  };
  const buttonPosition = getPosition();

  useEffect(() => {
    const hideTxCookie = Cookies.get("hideTx");
    if (!hideTxCookie || JSON.parse(hideTxCookie) !== hideTx) {
      Cookies.set("hideTx", JSON.stringify(hideTx));
    }
  }, [hideTx]);
  // const fetchMarketHistory = () => {
  //   console.log("clicked", unformattedHistoricalData?.market_cap);
  //   console.log(
  //     "fetchMarketHistory",
  //     baseAsset.id,
  //     unformattedHistoricalData,
  //     historyData
  //   );
  //   supabase
  //     .from("history")
  //     .select("market_cap_history")
  //     .match({ asset: baseAsset.id })
  //     .then((res) => {
  //       if (res.data) {
  //         setUnformattedHistoricalData({
  //           ...unformattedHistoricalData,
  //           market_cap: generateNewBuffer(
  //             baseAsset?.market_cap_history?.market_cap || [],
  //             res?.data?.[0]?.market_cap_history || []
  //           ),
  //         });
  //       }
  //       console.log(
  //         "res?.data?.[0]?.market_cap_history",
  //         res?.data?.[0]?.market_cap_history
  //       );
  //     });
  // };

  return (
    <>
      <div
        className={`flex items-center justify-between ${
          activeChart === "Trading view" ? "mb-2.5 md:mb-0" : "mb-0  md:mb-0"
        } w-full mx-auto mt-0  md:mt-[5px] z-[5]`}
      >
        <div className="flex items-center justify-start sm:justify-between w-full overflow-x-scroll scroll mb-2.5">
          {/* <div
            className="h-[30px] flex w-[190px] sm:w-[160px] min-w-[160px] rounded p-0.5 bg-light-bg-secondary 
          dark:bg-dark-bg-secondary border border-light-border-primary dark:border-dark-border-primary 
          relative mr-[7.5px] "
          >
            <div
              className="flex h-[90%] top-[50%] z-[0] -translate-y-[50%] w-[50%] transition-all duration-200 rounded absolute bg-light-bg-hover dark:bg-dark-bg-hover"
              style={{ left: buttonPosition }}
            />
            <button
              className={`flex relative justify-center items-center h-full w-[50%] ${
                chartType === "price"
                  ? "text-light-font-100 dark:text-dark-font-100"
                  : "text-light-font-40 dark:text-dark-font-40"
              } transition-all duration-200 text-sm lg:text-[13px] md:text-xs z-[2] whitespace-nowrap`}
              disabled={activeChart === "Trading view"}
              onClick={() => {
                const newChartType = "price" as ChartType;
                if (shouldLoadHistory(newChartType, timeSelected))
                  loadHistoryData(newChartType, timeSelected);
                setChartType(newChartType);
              }}
            >
              {capitalizeFirstLetter("price")}
            </button>
            <button
              className={`flex items-center relative justify-center h-full w-[50%] ${
                chartType === "market_cap"
                  ? "text-light-font-100 dark:text-dark-font-100"
                  : "text-light-font-40 dark:text-dark-font-40"
              }  transition-all duration-200 text-sm lg:text-[13px] md:text-xs z-[2] whitespace-nowrap`}
              onClick={() => {
                const newChartType = "market_cap" as ChartType;
                setChartType(newChartType);
              }}
            >
              {capitalizeFirstLetter("market cap")}
            </button>
          </div> */}
          <div
            className="flex h-[30px] w-[70px] min-w-[70px] p-0.5 rounded bg-light-bg-secondary dark:bg-dark-bg-secondary
           border border-light-border-primary dark:border-dark-border-primary relative"
          >
            <div
              className={`h-[90%] top-[50%] -translate-y-[50%] w-[50%] transition-all duration-200
             rounded absolute bg-light-bg-hover dark:bg-dark-bg-hover z-[0] ${
               activeChart !== "Trading view" ? "ml-0.5 mr-0" : ""
             }`}
              style={{
                left:
                  activeChart !== "Trading view"
                    ? "calc(0% - 1px)"
                    : "calc(50% - 1px)",
              }}
            />
            <button
              className={`h-full w-[50%] relative flex justify-center items-center 
            ${
              activeChart === "Linear"
                ? "text-light-font-100 dark:text-dark-font-100"
                : "text-light-font-40 dark:text-dark-font-40"
            } 
            transition-all duration-200 z-[2]`}
              onClick={() => {
                pushData("Chart Button", {
                  "Chart Type": "Linear",
                });
                setActiveChart("Linear");
              }}
            >
              <MdShowChart className="text-xl" />
            </button>
            <button
              className={`h-full w-[50%] relative flex justify-center items-center 
              ${
                activeChart === "Trading view"
                  ? "text-light-font-100 dark:text-dark-font-100"
                  : "text-light-font-40 dark:text-dark-font-40"
              }  transition-all duration-200 z-[2]`}
              onClick={() => {
                pushData("Chart Button", {
                  "Chart Type": "Trading view",
                });
                setActiveChart("Trading view");
              }}
            >
              <MdCandlestickChart className="text-xl" />
            </button>
          </div>
          {(transactions?.length as number) > 0 ? (
            <Button
              extraCss="flex items-center justify-center h-[30px] ml-2.5 px-2.5 "
              onClick={() => {
                setHideTx((prev) => !prev);
              }}
            >
              {hideTx ? (
                <>
                  <AiOutlineEye className="text-lg md:text-base mr-[5px]" />
                  Show tx
                </>
              ) : (
                <>
                  <AiOutlineEyeInvisible className="text-lg md:text-base mr-[5px]" />
                  Hide tx
                </>
              )}
            </Button>
          ) : null}
        </div>
        <ComparePopover
          setComparedEntities={setComparedEntities}
          comparedEntities={comparedEntities}
          extraCss="ml-2.5 mb-0 md:mb-2"
        />
        {activeChart !== "Trading view" ? (
          <TimeSwitcher extraCss="flex md:hidden" />
        ) : null}
      </div>
      {activeChart === "Trading view" ? null : (
        <CompareButtons
          buttonH="h-[30px] ml-0"
          comparedEntities={comparedEntities}
          setComparedEntities={setComparedEntities}
        />
      )}
    </>
  );
};
