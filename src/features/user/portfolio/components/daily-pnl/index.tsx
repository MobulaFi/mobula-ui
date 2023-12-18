import { Spinner } from "components/spinner";
import dynamic from "next/dynamic";
import { useContext } from "react";
import { LargeFont, MediumFont } from "../../../../../components/fonts";
import { PortfolioV2Context } from "../../context-manager";
import { UserHoldings, UserHoldingsAsset } from "../../models";
import { boxStyle } from "../../style";
import { getFormattedPNL } from "../../utils";

const BarChartComponent = dynamic(
  () => import("../../../../../lib/echart/bar"),
  {
    ssr: false,
  }
);
interface DailyPnlProps {
  wallet: UserHoldings | UserHoldingsAsset;
}

export const DailyPnl = ({ wallet }: DailyPnlProps) => {
  const { timeframe, isLoading } = useContext(PortfolioV2Context);
  const formattedPNL = getFormattedPNL(wallet, timeframe);
  return (
    <div
      className={`${boxStyle} flex-col border border-light-border-primary dark:border-dark-border-primary bg-light-bg-secondary dark:bg-dark-bg-secondary mt-2.5 w-[320px] lg:w-full`}
    >
      <LargeFont extraCss="text-light-font-100 dark:text-dark-font-100 mb-2.5 ml-[5px] font-medium">
        {timeframe} P&L
      </LargeFont>
      {formattedPNL?.length === 0 && !isLoading ? (
        <div className="flex relative max-h-[170px] min-h-[170px] h-[170px] w-full items-center justify-center border-t-[1px] border-light-border-primary dark:border-dark-border-primary mb-[5px]">
          {Array.from(Array(5).keys()).map((_, i) => (
            <div
              key={i}
              className="h-[1px] bg-light-border-primary dark:bg-dark-border-primary w-full absolute"
              style={{ top: `${(i + 1) * 20}%` }}
            />
          ))}
          <MediumFont extraCss="text-light-font-40 dark:text-dark-font-40">
            No data
          </MediumFont>
        </div>
      ) : (
        <div className="flex mt-[15px] mb-[5px] h-[170px] items-center justify-center">
          {formattedPNL?.length > 0 && !isLoading ? (
            <BarChartComponent data={formattedPNL} width="100%" height="100%" />
          ) : null}
          {isLoading ? <Spinner extraCss="w-[50px] h-[50px] mb-5" /> : null}
        </div>
      )}
    </div>
  );
};
