import { Button } from "components/button";
import { Spinner } from "components/spinner";
import dynamic from "next/dynamic";
import { Key, useContext } from "react";
import { FaBitcoin } from "react-icons/fa";
import { MediumFont } from "../../../../../components/fonts";
import { TimeSelected } from "../../../../../interfaces/pages/asset";
import { colors } from "../../constants";
import { PortfolioV2Context } from "../../context-manager";
import { ButtonTimeSlider } from "../ui/button-time-slider";
import { CompareButtons } from "./compare-buttons";
import { ComparePopover } from "./compare-popover";

const EChart = dynamic(() => import("../../../../../lib/echart/line"), {
  ssr: false,
});

interface PortfolioChartProps {
  isExplorer: boolean;
}

export const PortfolioChart = ({ isExplorer }) => {
  const {
    wallet,
    isLoading,
    timeframe,
    setShowSelect,
    comparedEntities,
    error,
    isMobile,
    setComparedEntities,
  } = useContext(PortfolioV2Context);

  const isMoreThan991 =
    ((typeof window !== "undefined" && window.innerWidth) || 0) > 991;

  return (
    <div className="relative w-full mt-0 lg:mt-2.5 mb-[80px] lg:mb-5 sm:mb-2.5">
      <div className="flex justify-between items-center sm:items-start w-full flex-wrap mb-[30px] lg:mb-0 md:mb-[30px] flex-row sm:flex-col">
        <CompareButtons
          extraCss="flex lg:hidden"
          buttonH="35px"
          comparedEntities={comparedEntities}
          setComparedEntities={setComparedEntities}
        />
        <ComparePopover
          extraCss="flex lg:hidden"
          setComparedEntities={setComparedEntities}
          comparedEntities={comparedEntities}
        />
        <ButtonTimeSlider />
        <div className="lg:flex justify-between w-full items-center mb-[-30px] hidden">
          <CompareButtons
            extraCss="hidden mb-[-20px] mt-[10px] sm:mt-2.5"
            buttonH="30px"
            comparedEntities={comparedEntities}
            setComparedEntities={setComparedEntities}
          />
          <ComparePopover
            extraCss="hidden lg:flex mb-[-50px] sm:mt-2.5 h-[30px] mr-0 md:left-0 md:right-auto"
            setComparedEntities={setComparedEntities}
            comparedEntities={comparedEntities}
            isPortfolio
          />
        </div>
      </div>
      <div className="flex items-center w-full">
        {!wallet && !isLoading ? (
          <div className="flex relative min-h-[250px] mt-5 lg:mt-0 w-full border-2 border-light-border-primary dark:border-dark-border-primary rounded-2xl justify-center items-center">
            {Array.from(Array(4).keys()).map((_, i) => (
              <div
                key={i as Key}
                className="flex h-[1px] w-full absolute bg-light-border-primary dark:bg-dark-border-primary"
                style={{ top: `${(i + 1) * 20}%` }}
              />
            ))}
            <div className="flex flex-col items-center justify-center">
              <MediumFont extraCss="text-light-font-80 dark:text-dark-font-80 mb-[15px]">
                No history found
                {error ? `: ${error}` : ""}
              </MediumFont>
              {isExplorer ? (
                <Button onClick={() => setShowSelect(true)}>
                  <FaBitcoin className="text-lg mr-1.5 text-light-font-80 dark:text-dark-font-80" />
                  Add an asset
                </Button>
              ) : null}
            </div>
          </div>
        ) : (
          <div className="flex justify-center w-full min-h-[320px] max-h-[320px] items-center relative max-w-full mr-5 mt-5 md:mt-[60px]">
            {isLoading ? (
              <Spinner extraCss="w-[60px] h-[60px]" />
            ) : (
              <EChart
                height={isMobile || !isMoreThan991 ? 350 : 500}
                data={wallet?.estimated_history || []}
                timeframe={timeframe as TimeSelected}
                leftMargin={["0%", "0%"]}
                extraData={
                  comparedEntities.filter((entity) => entity.data.length).length
                    ? comparedEntities
                        .filter((entity) => entity.data.length)
                        .map((entity, i) => ({
                          data: entity.data,
                          name: entity.label,
                          color: colors[i],
                        }))
                    : null
                }
                unit={comparedEntities.length ? "%" : "$"}
                unitPosition={comparedEntities.length ? "after" : "before"}
                type="Balance"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
