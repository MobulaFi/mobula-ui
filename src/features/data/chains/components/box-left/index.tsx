import { Spinner } from "components/spinner";
import dynamic from "next/dynamic";
import React from "react";
import { useChains } from "../../context-manager";
import { getChainName } from "../../utils";
import { BoxTitle } from "../box-title";

const EChart = dynamic(() => import("../../../../../lib/echart/line"), {
  ssr: false,
});

export const LeftBox = () => {
  const { chain, pairs } = useChains();
  const chainName = getChainName(pairs?.[0]?.pair?.blockchain);
  const titleInfo = {
    value: chain?.volume_history?.[chain?.volume_history?.length - 1]?.[1],
    dollar: true,
    percentage: chain?.volume_change_24h,
    title: `${chainName} DeFi Volume`,
  };
  return (
    <div
      className={`flex h-[200px] lg:h-[175px] rounded-xl bg-light-bg-secondary dark:bg-dark-bg-secondary border
        border-light-border-primary dark:border-dark-border-primary flex-col relative overflow-hidden
        min-w-[407px] md:min-w-full w-[31.5%] mr-2.5 lg:w-full transition duration-500 md:overflow-visible  py-2.5`}
    >
      <BoxTitle data={titleInfo} />
      {chain?.volume_history?.length > 0 ? (
        <div className="w-[95%] mx-auto h-[210px] lg:h-[190px] -mt-[48px]">
          <EChart
            data={chain?.volume_history || []}
            timeframe="ALL"
            height="200px"
            noAxis
            noDataZoom
          />
        </div>
      ) : (
        <div className="h-[200px] w-full flex items-center justify-center">
          <Spinner extraCss="w-[30px] h-[30px]" />
        </div>
      )}
    </div>
  );
};
