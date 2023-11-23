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
}

export const CryptoMarket = ({ showPage }: CryptoMarketProps) => {
  const { totalMarketCap, marketCapChange } = useTop100();
  return (
    <div
      className={`flex flex-col relative px-2.5 transition-all duration-250 w-[200px] min-w-full`}
      style={{ transform: `translateX(-${showPage * 100}%)` }}
    >
      <div className="flex flex-col z-[1]">
        <div className="w-full flex justify-between">
          <MediumFont>Crypto Market Cap</MediumFont>
        </div>
        <div className="flex mt-1">
          <LargeFont extraCss="mt-[-2px]">
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
      <div className="w-full h-full justify-center absolute top-5 lg:top-3">
        <EChart
          data={(totalMarketCap as []) || []}
          timeframe="24H"
          leftMargin={["0%", "0%"]}
          height="100%"
          bg="transparent"
          type="Total MC"
          noDataZoom
          noAxis
        />
      </div>
    </div>
  );
};
