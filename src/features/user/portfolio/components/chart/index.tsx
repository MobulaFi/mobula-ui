import { Button } from "components/button";
import { Spinner } from "components/spinner";
import dynamic from "next/dynamic";
import React, { Key, useContext } from "react";
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

export const PortfolioChart = () => {
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
        <div className="flex justify-between w-full items-center mb-[-30px]">
          <CompareButtons
            extraCss="hidden lg:flex mb-[-50px] mt-[-10px] sm:mt-2.5"
            buttonH="30px"
            comparedEntities={comparedEntities}
            setComparedEntities={setComparedEntities}
          />
          <ComparePopover
            extraCss="hidden lg:flex mb-[-50px] sm:mt-2.5 h-[30px] mr-0"
            setComparedEntities={setComparedEntities}
            comparedEntities={comparedEntities}
          />
        </div>
      </div>
      <div className="flex items-center w-full">
        {!wallet && !isLoading ? (
          <div className="flex relative max-h-[320px] min-h-[320px] mt-5 lg:mt-0 w-full border-2 border-light-border-primary dark:border-dark-border-primary rounded-2xl bg-light-bg-secondary dark:bg-dark-bg-secondary justify-center items-center">
            {Array.from(Array(4).keys()).map((_, i) => (
              <div
                key={i as Key}
                className="flex h-[1px] w-full absolute bg-light-border-primary dark:bg-dark-border-primary"
                style={{ top: `${(i + 1) * 20}%` }}
              />
            ))}
            <div className="flex flex-col items-center justify-center">
              <MediumFont extraCss="text-light-font-40 dark:text-dark-font-40 mb-[15px]">
                No data {error ? `: ${error}` : ""}
              </MediumFont>
              {true ? (
                <Button onClick={() => setShowSelect(true)}>
                  <img
                    className="w-[20px] h-[20px] mr-[7.5px] rounded-full"
                    src="/logo/bitcoin.png"
                    alt="bitcoin logo"
                  />
                  Add an asset
                </Button>
              ) : null}
            </div>
          </div>
        ) : (
          <div className="flex justify-center w-full min-h-[320px] max-h-[320px] items-center relative max-w-full mr-5 mt-5 ">
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
