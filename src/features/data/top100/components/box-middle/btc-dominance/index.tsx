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
      className={`min-w-full px-2.5 flex flex-col w-[200px] transition-all duration-250`}
      style={{ transform: `translateX(-${showPage * 100}%)` }}
    >
      <div className="flex flex-col absolute z-[1]">
        <div className="flex justify-between w-full">
          <MediumFont>Bitcoin Dominance</MediumFont>
        </div>
        <div className="flex mt-1">
          <MediumFont extraCss="flex mt-[-2px] font-bold">
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
      <div className="w-full h-full justify-center absolute top-5 lg:top-3">
        <EChart
          data={btcDominance || []}
          timeframe="24H"
          leftMargin={["0%", "0%"]}
          height={"100%"}
          bg="transparent"
          type="BTC Dominance %"
          noDataZoom
          noAxis
        />
      </div>
    </div>
  );
};
