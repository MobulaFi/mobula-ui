/* eslint-disable react-hooks/exhaustive-deps */
import { Spinner } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import React, { useContext } from "react";
import { LargeFont, MediumFont } from "../../../../../components/fonts";
import { PortfolioV2Context } from "../../context-manager";
import { boxStyle } from "../../style";

const EChart = dynamic(() => import("../../../../../lib/echart/line"), {
  ssr: false,
});

export const CumulativePnl = () => {
  const { wallet, timeframe, asset, isAssetPage, isLoading } =
    useContext(PortfolioV2Context);

  const getFormatedCumulativePNL = () => {
    if (wallet) {
      let pnlData;
      if (isAssetPage) {
        pnlData = asset?.pnl_history?.[timeframe.toLowerCase()];
      } else {
        pnlData = wallet?.global_pnl?.[timeframe.toLowerCase()];
      }

      const newArr = pnlData?.map((entry) => [
        entry[0],
        entry[1].realized + entry[1].unrealized,
      ]);

      const cumulativeArr = newArr?.reduce((accumulator, current, index) => {
        const prevCumulativeY = index > 0 ? accumulator[index - 1][1] : 0;
        const newY = current[1] + prevCumulativeY;
        accumulator.push([current[0], newY]);
        return accumulator;
      }, []);

      return cumulativeArr;
    }
    return null;
  };

  const cumulativePNL = getFormatedCumulativePNL();

  return (
    <div
      className={`${boxStyle} flex-col border border-light-border-primary dark:border-dark-border-primary bg-light-bg-secondary dark:bg-dark-bg-secondary my-2.5 w-[320px] lg:w-full`}
    >
      <LargeFont extraCss="text-light-font-100 dark:text-dark-font-100 mb-2.5 ml-[5px] font-bold">
        Cumulative P&L
      </LargeFont>
      {cumulativePNL?.length === 0 && !isLoading ? (
        <div className="flex relative max-h-[170px] min-h-[170px] h-[170px] w-full items-center justify-center border-t-[1px] border-light-border-primary dark:border-dark-border-primary mb-[5px]">
          {Array.from(Array(5).keys()).map((_, i) => (
            <div
              key={i}
              className="h-[1px] bg-light-border-primary dark:bg-dark-border-primary w-full absolute"
              style={{ top: `${(i + 1) * 20}%` }}
            />
          ))}
          <MediumFont extraCss="text-light-font-40 dark:text-dark-font-40">
            No data
          </MediumFont>
        </div>
      ) : (
        <div className="h-[170px]">
          {cumulativePNL?.length > 0 && !isLoading ? (
            <EChart
              data={cumulativePNL}
              timeframe="ALL"
              width="100%"
              leftMargin={["0%", "0%"]}
              height="100%"
              bg="bg-transparent dark:bg-transparent"
              type="Cumulative Pnl"
              noDataZoom
              isVesting
            />
          ) : null}
          {isLoading ? (
            <Spinner className="w-[50px] h-[50px] m-auto mt-[40px]" />
          ) : null}
        </div>
      )}
    </div>
  );
};
