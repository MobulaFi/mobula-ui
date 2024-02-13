import { MediumFont } from "components/fonts";
import { Spinner } from "components/spinner";
import dynamic from "next/dynamic";
import React from "react";
import { useChains } from "../../context-manager";

interface BoxRightProps {
  showPageMobile?: number;
}

const EChart = dynamic(() => import("../../../../../lib/echart/line"), {
  ssr: false,
});

export const RightBox = ({ showPageMobile = 0 }: BoxRightProps) => {
  const { chain, pairs } = useChains();
  return (
    <div
      className={`flex flex-col h-[200px] lg:h-[175px] rounded-xl bg-light-bg-secondary dark:bg-dark-bg-secondary border
      border-light-border-primary dark:border-dark-border-primary py-2.5 relative  
      min-w-[407px] md:min-w-full w-[31.5%] lg:w-full transition duration-500 mx-2.5 md:mx-0`}
    >
      <MediumFont extraCss="ml-2.5 whitespace-nowrap">
        {pairs?.[0]?.pair?.blockchain} DeFi Liquidity
      </MediumFont>
      {chain?.liquidity_history?.length > 0 ? (
        <div className="w-[95%] mx-auto h-[210px] -mt-9">
          <EChart
            data={chain?.liquidity_history || []}
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
