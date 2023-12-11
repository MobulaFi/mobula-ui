import dynamic from "next/dynamic";
import { LargeFont, MediumFont } from "../../../../../../components/fonts";
import { TagPercentage } from "../../../../../../components/tag-percentage";
import { getFormattedAmount } from "../../../../../../utils/formaters";
import { useTop100 } from "../../../context-manager";
import { boxStyle } from "../constant";

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
      className={boxStyle}
      style={{ transform: `translateX(-${showPage * 100}%)` }}
    >
      <div className="flex flex-col w-[95%] mx-auto">
        <div className="flex flex-col z-[1]">
          <div className="w-full flex justify-between">
            <MediumFont>Crypto Market Cap</MediumFont>
          </div>
          <div className="flex mt-1">
            <LargeFont extraCss="mt-[-2px] font-medium">
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
        <div className="w-full h-full justify-center -mt-5 lg:mt-[-35px]">
          <EChart
            data={(totalMarketCap as []) || []}
            timeframe="24H"
            leftMargin={["0%", "0%"]}
            height="160px"
            width="100%"
            bg="transparent"
            type="Total MC"
            noDataZoom
            noAxis
          />
        </div>
      </div>
    </div>
  );
};
