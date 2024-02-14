import dynamic from "next/dynamic";
import React from "react";
import { MediumFont } from "../../../../../../components/fonts";
import { getTokenPercentage } from "../../../../../../utils/formaters";
import { useTop100 } from "../../../context-manager";
import { boxStyle } from "../constant";

const EChart = dynamic(() => import("../../../../../../lib/echart/line"), {
  ssr: false,
});

interface BtcDominanceProps {
  showPage: number;
}

export const BtcDominance = ({ showPage }: BtcDominanceProps) => {
  const { btcDominance } = useTop100();

  return (
    <div
      className={`${boxStyle}`}
      style={{ transform: `translateX(-${showPage * 100}%)` }}
    >
      <div className="flex flex-col w-[95%] mx-auto">
        <div className="flex flex-col absolute z-[1]">
          <div className="flex justify-between w-full pt-2.5">
            <MediumFont>Bitcoin Dominance</MediumFont>
          </div>
          <div className="flex mt-1">
            <MediumFont extraCss="flex mt-[-2px] font-medium">
              {getTokenPercentage(
                btcDominance?.[(btcDominance?.length || 1) - 1]?.[1] * 100 || 0
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
        <div className="w-full h-full justify-center mt-[45px] lg:mt-[13px]">
          <EChart
            data={btcDominance || []}
            timeframe="24H"
            leftMargin={["0%", "0%"]}
            height="160px"
            bg="transparent"
            type="BTC Dominance"
            isPercentage
            noDataZoom
            noAxis
            width="100%"
          />
        </div>
      </div>
    </div>
  );
};
