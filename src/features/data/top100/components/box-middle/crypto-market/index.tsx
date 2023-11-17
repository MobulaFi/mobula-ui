import dynamic from "next/dynamic";
import React from "react";
import { LargeFont, MediumFont } from "../../../../../../components/fonts";
import { TagPercentage } from "../../../../../../components/tag-percentage";
import { getFormattedAmount } from "../../../../../../utils/formaters";
import { useTop100 } from "../../../context-manager";

const EChart = dynamic(() => import("../../../../../../lib/echart/line"), {
  ssr: false,
});

interface CryptoMarketProps {
  showPage: number;
  height: string;
}

export const CryptoMarket = ({ showPage, height }: CryptoMarketProps) => {
  const { totalMarketCap, marketCapChange } = useTop100();
  return (
    <div
      className={`flex flex-col transition-all duration-250 w-[200px] min-w-full`}
      style={{ transform: `translateX(-${showPage * 100}%)` }}
    >
      <div className="flex flex-col absolute z-[1] w-[94%] top-2.5">
        <div className="w-full flex justify-between">
          <MediumFont extraCss="ml-[15px]">Crypto Market Cap</MediumFont>
        </div>
        <div className="flex">
          <LargeFont extraCss="mt-[-2px] ml-[15px]">
            $
            {getFormattedAmount(
              totalMarketCap?.[totalMarketCap.length - 1 || 0]?.[1]
            )}
          </LargeFont>
          <div className="mt-0.5">
            <TagPercentage
              isUp={(marketCapChange || 0) > 0}
              percentage={marketCapChange || 0}
            />
          </div>
        </div>
      </div>
      <div className="w-full mt-3 h-full justify-center mb-2.5 px-[15px]">
        <EChart
          data={(totalMarketCap as []) || []}
          timeframe="24H"
          width="100%"
          leftMargin={["0%", "0%"]}
          height={height}
          bg="transparent"
          type="Total MC"
          noDataZoom
          noAxis
        />
      </div>
    </div>
  );
};
