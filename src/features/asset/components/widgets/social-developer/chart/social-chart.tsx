import dynamic from "next/dynamic";
import React, { ReactElement, useContext, useEffect } from "react";
import { LargeFont, MediumFont } from "../../../../../../components/fonts";
import { cn } from "../../../../../../lib/shadcn/lib/utils";
import { timestamps } from "../../../../constant";
import { BaseAssetContext } from "../../../../context-manager";

const EChart: ReactElement | any = dynamic(() => import("./multi-echart"), {
  ssr: false,
});

interface MultiChart {
  chartId?: string;
  dividor?: number;
  extraCss?: string;
  [key: string]: any;
}

export const MultiChart = ({
  chartId,
  dividor = 1,
  extraCss,
  ...props
}: MultiChart) => {
  const { baseAsset } = useContext(BaseAssetContext);
  const {
    timeSelected,
    chartType,
    setTimeSelected,
    shouldLoadHistory,
    loadHistoryData,
  } = useContext(BaseAssetContext);
  useEffect(() => {
    setTimeSelected("ALL");
  }, []);
  const twitter = baseAsset?.twitter_history || [];
  // const telegram = [];
  // const discord = [];

  return (
    <div className="flex flex-col w-full mt-5">
      <div className="flex items-center justify-between w-full">
        <LargeFont mb="10px">Socials Analytics</LargeFont>
        <div
          className="h-[38px] w-[260px] p-0.5 rounded-md bg-light-bg-secondary
         dark:bg-dark-bg-secondary relative z-[1] border border-light-border-primary 
         dark:border-dark-border-primary"
        >
          <div
            className={`flex h-[90%] top-1/2 -translate-y-1/2 w-[16.66%] transition-all duration-200 
          ease-in-out rounded-md absolute bg-light-bg-hover dark:bg-dark-bg-hover ${
            timestamps.indexOf(timeSelected) === 0 ? "ml-0.5" : ""
          } ${
              timestamps.indexOf(timeSelected) === timestamps.length - 1
                ? "mr-0.5"
                : ""
            }`}
            style={{
              left: `${
                (100 / timestamps.length) * timestamps.indexOf(timeSelected)
              }%`,
            }}
          />
          {timestamps.map((time) => (
            <button
              className={`h-full font-medium transition-all duration-400 ease-in-out w-[16.66%] ${
                timeSelected === time
                  ? "text-light-font-100 dark:text-dark-font-100"
                  : "text-light-font-40 dark:text-dark-font-40"
              }`}
              key={time}
              disabled={time !== "ALL"}
              onClick={() => {
                if (shouldLoadHistory(chartType, time))
                  loadHistoryData(chartType, time);

                setTimeSelected(time);
              }}
            >
              {time}
            </button>
          ))}
        </div>
      </div>
      <div
        className={cn(
          "flex justify-center items-center w-full mt-[110px] mb-[100px] h-[310px] relative",
          extraCss
        )}
        {...props}
      >
        <EChart
          height={500}
          width={1000}
          data={twitter || []}
          timeframe={timeSelected}
        />
      </div>
      <div className="flex items-center mt-2.5">
        <div className="flex items-center mr-[15px]">
          <div className="w-2.5 h-2.5 bg-green dark:bg-green rounded-full" />
          <MediumFont ml="7.5px">Twitter followers</MediumFont>
        </div>
        {/* <Flex align="center" mr="15px">
          <Flex boxSize="10px" bg="#64D1FF" borderRadius="full" />
          <TextLandingSmall ml="7.5px">Telegram users</TextLandingSmall>
        </Flex>
        <Flex align="center">
          <Flex boxSize="10px" bg="#4055A7" borderRadius="full" />
          <TextLandingSmall ml="7.5px">Discord users</TextLandingSmall>
        </Flex> */}
      </div>
    </div>
  );
};
