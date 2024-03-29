import dynamic from "next/dynamic";
import React from "react";
import { BsDatabaseX } from "react-icons/bs";
import { SmallFont } from "../../../../../components/fonts";
import { useChains } from "../../context-manager";
import { getChainName } from "../../utils";
import { BoxTitle } from "../box-title";

const EChart = dynamic(() => import("../../../../../lib/echart/line"), {
  ssr: false,
});

export const LeftBox = () => {
  const { chain, pairs } = useChains();
  const chainName = getChainName(pairs?.[0]?.pair?.blockchain);
  const isValidData =
    chain?.volume_history?.length &&
    chain?.volume_history?.[chain?.volume_history?.length - 1 || 0]?.[1];

  const titleInfo = {
    value: chain?.volume_history?.[chain?.volume_history?.length - 1]?.[1],
    dollar: isValidData ? true : false,
    percentage: chain?.volume_change_24h,
    title: `${chainName} DeFi Volume`,
  };
  return (
    <div
      className="flex h-[200px] lg:h-[175px] rounded-xl bg-light-bg-secondary dark:bg-dark-bg-secondary border
        border-light-border-primary dark:border-dark-border-primary flex-col relative overflow-hidden
        min-w-[407px] md:min-w-full w-[31.5%] mr-2.5 lg:w-full transition duration-500 md:overflow-visible py-2.5"
    >
      <BoxTitle data={titleInfo} />
      {isValidData > 0 ? (
        <div className="w-[95%] mx-auto h-[210px] lg:h-[190px] -mt-[40px]">
          <EChart
            data={chain?.volume_history || []}
            timeframe="ALL"
            height="175px"
            noAxis
            noDataZoom
          />
        </div>
      ) : (
        <div className="h-[200px] w-full flex items-center flex-col justify-center">
          <BsDatabaseX className="text-light-font-100 dark:text-dark-font-100 text-2xl mb-2.5" />
          <SmallFont>No data available</SmallFont>
        </div>
      )}
    </div>
  );
};
