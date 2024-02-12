import dynamic from "next/dynamic";
import React from "react";
import { MediumFont } from "../../../../../components/fonts";
import { useChains } from "../../context-manager";

interface LeftBoxProps {
  showPageMobile: number;
}

const EChart = dynamic(() => import("../../../../../lib/echart/line"), {
  ssr: false,
});

export const LeftBox = ({ showPageMobile }: LeftBoxProps) => {
  const { chain } = useChains();
  return (
    <div
      className={`flex h-[200px] lg:h-[175px] rounded-xl bg-light-bg-secondary dark:bg-dark-bg-secondary border
        border-light-border-primary dark:border-dark-border-primary flex-col relative overflow-hidden
        min-w-[407px] md:min-w-full w-[31.5%] mr-2.5 lg:w-full transition duration-500 md:overflow-visible ${
          showPageMobile === 0 ? "z-[3]" : "z-[1]"
        }] py-2.5`}
      style={{ transform: `translateX(-${showPageMobile * 100}%)` }}
    >
      <MediumFont extraCss="ml-2.5">Volume History</MediumFont>
      <div className="w-[95%] mx-auto h-[210px] -mt-9">
        <EChart
          data={chain?.volume_history || []}
          timeframe="ALL"
          height="200px"
          noAxis
          noDataZoom
        />
      </div>
    </div>
  );
};
