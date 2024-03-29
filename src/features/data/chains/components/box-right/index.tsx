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

export const RightBox = () => {
  const { chain, pairs } = useChains();
  const chainName = getChainName(pairs?.[0]?.pair?.blockchain);
  const hasLiqudity = chain?.liquidity_history?.[0]?.[1] > 0;
  const titleInfo = {
    value: hasLiqudity
      ? chain?.liquidity_history?.[chain?.liquidity_history?.length - 1]?.[1]
      : null,
    dollar: hasLiqudity ? true : false,
    percentage: chain?.liquidity_change_total,
    title: `${chainName} DeFi Liquidity`,
  };
  return (
    <div
      className={`flex flex-col h-[200px] lg:h-[175px] rounded-xl bg-light-bg-secondary dark:bg-dark-bg-secondary border
      border-light-border-primary dark:border-dark-border-primary py-2.5 relative  
      min-w-[407px] md:min-w-full w-[31.5%] lg:w-full transition duration-500 ml-2.5 md:mx-0`}
    >
      <BoxTitle data={titleInfo} />
      {chain?.liquidity_history?.length > 0 &&
      chain?.liquidity_history?.[
        chain?.liquidity_history?.length - 1 || 0
      ]?.[1] > 0 ? (
        <div className="w-[95%] mx-auto h-[210px] -mt-[40px]">
          <EChart
            data={chain?.liquidity_history || []}
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
