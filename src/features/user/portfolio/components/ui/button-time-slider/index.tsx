import React, { useContext } from "react";
import { cn } from "../../../../../../lib/shadcn/lib/utils";
import { PortfolioV2Context } from "../../../context-manager";

interface ButtonTimeSliderProps {
  isChart?: boolean;
  extraCss?: string;
}

export const ButtonTimeSlider = ({
  isChart = false,
  extraCss,
}: ButtonTimeSliderProps) => {
  const timeframes = ["24H", "7D", "30D", "1Y", "ALL"];
  const { timeframe, setTimeframe } = useContext(PortfolioV2Context);

  const getPosition = (time: string) => {
    if (time === "24H") return "4px";
    if (time === "7D") return "20%";
    if (time === "30D") return "40%";
    if (time === "1Y") return "60%";
    return "calc(80% - 4px)";
  };

  return (
    <div
      className={cn(
        `flex h-[38px] px-[4px] z-[1] items-center bg-light-bg-terciary dark:bg-dark-bg-terciary rounded-md w-fit sm:w-full relative ${
          isChart ? "mb-[70px] md:mb-0" : "mb-0"
        }`,
        extraCss
      )}
    >
      <div
        className="w-[40px] sm:w-1/5 h-[30px] bg-light-bg-hover dark:bg-dark-bg-hover rounded-md absolute transition-all duration-200 z-[0]"
        style={{ left: getPosition(timeframe) }}
      />
      {timeframes.map((time) => (
        <button
          className={`h-[30px] text-sm lg:text-[13px] md:text-xs transition-all duration-200 w-[40px] sm:w-1/5 ${
            timeframe === time
              ? "text-light-font-100 dark:text-dark-font-100"
              : "text-light-font-40 dark:text-dark-font-40"
          } z-[1] relative`}
          onClick={() => setTimeframe(time)}
        >
          <div className="w-full flex h-full items-center justify-center">
            {time}
          </div>
        </button>
      ))}
    </div>
  );
};
