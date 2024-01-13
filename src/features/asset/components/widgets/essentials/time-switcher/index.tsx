import { useContext } from "react";
import { cn } from "../../../../../../lib/shadcn/lib/utils";
import { timestamps } from "../../../../constant";
import { BaseAssetContext } from "../../../../context-manager";

interface TimeSwitcherProps {
  extraCss?: string;
}

export const TimeSwitcher = ({ extraCss }: TimeSwitcherProps) => {
  const {
    timeSelected,
    chartType,
    setTimeSelected,
    shouldLoadHistory,
    loadHistoryData,
  } = useContext(BaseAssetContext);

  const getPosition = () => {
    if (timeSelected === "24H") return "calc(0% + 1px)";
    if (timeSelected === "ALL") return "calc(83.34% - 1px)";
    return `${(100 / timestamps.length) * timestamps.indexOf(timeSelected)}%`;
  };
  const buttonPosition = getPosition();

  return (
    <div
      className={cn(
        `flex items-center justify-between mt-0 md:mt-2.5 mb-0 md:mb-[25px] ml-auto md:ml-0 w-fit md:w-full mx-0 md:mx-auto`,
        extraCss
      )}
    >
      <div className="h-[34px] w-[230px] md:w-full p-0.5 rounded-md bg-light-bg-secondary dark:bg-dark-bg-secondary relative border border-light-border-primary dark:border-dark-border-primary">
        <div
          className="h-[90%] top-[50%] -translate-y-[50%] w-[16.66%] transition-all duration-200 rounded-md absolute bg-light-bg-hover dark:bg-dark-bg-hover z-[0]"
          style={{ left: buttonPosition }}
        />
        {timestamps.map((time) => (
          <button
            className={`h-full ${
              timeSelected === time
                ? "text-light-font-100 dark:text-dark-font-100"
                : "text-light-font-40 dark:text-dark-font-40"
            } transition-all duration-200 w-[16.66%] text-sm lg:text-[13px] md:text-xs font-medium relative z-[2]`}
            key={time}
            onClick={() => {
              if (shouldLoadHistory(chartType, time))
                loadHistoryData(chartType, time);
              setTimeSelected(time);
            }}
          >
            {time}
          </button>
        ))}
      </div>
    </div>
  );
};
