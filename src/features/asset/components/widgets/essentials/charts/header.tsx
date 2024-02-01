import React, { useContext } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { MdCandlestickChart, MdShowChart } from "react-icons/md";
import { Button } from "../../../../../../components/button";
import { CompareButtons } from "../../../../../../features/user/portfolio/components/chart/compare-buttons";
import { ComparePopover } from "../../../../../../features/user/portfolio/components/chart/compare-popover";
import { pushData } from "../../../../../../lib/mixpanel";
import { createSupabaseDOClient } from "../../../../../../lib/supabase";
import { BaseAssetContext } from "../../../../context-manager";
import { TimeSwitcher } from "../time-switcher";

interface ChartHeaderProps {
  setChartPreference: React.Dispatch<React.SetStateAction<string>>;
  chartPreference: string;
}

export const ChartHeader = ({
  setChartPreference,
  chartPreference,
}: ChartHeaderProps) => {
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
    isAssetPage,
  } = useContext(BaseAssetContext);
  const supabase = createSupabaseDOClient();

  const capitalizeFirstLetter = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  const getPosition = () => {
    if (chartType === "price") return "calc(0% + 1.5px)";
    return "calc(50% - 1px)";
  };
  const buttonPosition = getPosition();

  return (
    <>
      <div
        className={`flex items-center justify-between ${
          chartPreference === "Trading view"
            ? "mb-2.5 md:mb-0"
            : "mb-0  md:mb-0"
        } w-full mx-auto mt-0  md:mt-[5px] z-[5]`}
      >
        <div className="flex items-center justify-start sm:justify-between w-full overflow-x-scroll scroll">
          {/* <div
            className="h-[30px] flex w-[190px] sm:w-[160px] min-w-[160px] rounded-md p-0.5 bg-light-bg-secondary 
          dark:bg-dark-bg-secondary border border-light-border-primary dark:border-dark-border-primary 
          relative mr-[7.5px] "
          >
            <div
              className="flex h-[90%] top-[50%] z-[0] -translate-y-[50%] w-[50%] transition-all duration-200 rounded-md absolute bg-light-bg-hover dark:bg-dark-bg-hover"
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
            className="flex h-[30px] w-[70px] min-w-[70px] p-0.5 rounded-md bg-light-bg-secondary dark:bg-dark-bg-secondary
           border border-light-border-primary dark:border-dark-border-primary relative"
          >
            <div
              className={`h-[90%] top-[50%] -translate-y-[50%] w-[50%] transition-all duration-200
             rounded-md absolute bg-light-bg-hover dark:bg-dark-bg-hover z-[0] ${
               chartPreference !== "Trading view" ? "ml-0.5 mr-0" : ""
             }`}
              style={{
                left:
                  chartPreference !== "Trading view"
                    ? "calc(0% - 1px)"
                    : "calc(50% - 1px)",
              }}
            />
            <button
              className={`h-full w-[50%] relative flex justify-center items-center 
            ${
              chartPreference === "Linear"
                ? "text-light-font-100 dark:text-dark-font-100"
                : "text-light-font-40 dark:text-dark-font-40"
            } 
            transition-all duration-200 z-[2]`}
              onClick={() => {
                pushData("Chart Button", {
                  "Chart Type": "Linear",
                });
                setChartPreference("Linear");
                localStorage.setItem("chartPreference", "Linear");
              }}
            >
              <MdShowChart className="text-xl" />
            </button>
            <button
              className={`h-full w-[50%] relative flex justify-center items-center 
              ${
                chartPreference === "Trading view"
                  ? "text-light-font-100 dark:text-dark-font-100"
                  : "text-light-font-40 dark:text-dark-font-40"
              }  transition-all duration-200 z-[2]`}
              onClick={() => {
                pushData("Chart Button", {
                  "Chart Type": "Trading view",
                });
                setChartPreference("Trading view");
                localStorage.setItem("chartPreference", "Trading view");
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
          extraCss="ml-2.5 mb-0"
        />
        {chartPreference !== "Trading view" && isAssetPage ? (
          <TimeSwitcher extraCss="flex md:hidden" />
        ) : null}
      </div>
      {chartPreference === "Trading view" ? null : (
        <CompareButtons
          buttonH="h-[30px] ml-0 mt-2"
          comparedEntities={comparedEntities}
          setComparedEntities={setComparedEntities}
        />
      )}
    </>
  );
};
