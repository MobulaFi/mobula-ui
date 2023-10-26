import dynamic from "next/dynamic";
import React from "react";
import { MediumFont } from "../../../../../../components/fonts";
import { getTokenPercentage } from "../../../../../../utils/formaters";
import { useTop100 } from "../../../context-manager";

const EChart = dynamic(() => import("../../../../../../lib/echart/line"), {
  ssr: false,
});

interface BtcDominanceProps {
  showPage: number;
  height: string;
}

export const BtcDominance = ({ showPage, height }: BtcDominanceProps) => {
  const { btcDominance } = useTop100();
  return (
    <div
      className={`min-w-full flex flex-col w-[200px] translate-x-[-${
        showPage * 100
      }%] transition-all duration-250`}
    >
      <div className="flex flex-col absolute z-[1] w-[94%] top-2.5">
        <div className="flex justify-between w-full">
          <MediumFont extraCss="ml-[15px]">Bitcoin Dominance</MediumFont>
        </div>
        <div className="flex">
          <MediumFont extraCss="flex ml-[15px] mt-[-2px]">
            {getTokenPercentage(
              btcDominance?.[(btcDominance?.length || 1) - 1]?.[1] || 0
            )}
            %
          </MediumFont>
          <div className="flex mt-0.5">
            {/* <TagPercentage
              isUp={btcDominance > 0}
              percentage={marketCapChange}
            />{" "} */}
          </div>
        </div>
      </div>
      <div className="w-full mt-3 h-full justify-center mb-2.5 px-[15px]">
        <EChart
          data={btcDominance || []}
          timeframe="24H"
          width="98%"
          //   leftMargin={["20%", "12%"]}
          leftMargin={["0%", "0%"]}
          height={height}
          bg="transparent"
          // bg={isDarkMode ? "#151929" : "#F7F7F7"}
          type="BTC Dominance %"
          noDataZoom
          noAxis
        />
      </div>
    </div>
  );
};
