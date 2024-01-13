import React from "react";
import { IoInformationCircleOutline } from "react-icons/io5";
import { cn } from "../lib/shadcn/lib/utils";

interface TooltipProps {
  tooltipText: string;
  extraCss?: string;
  iconCss?: string;
}

export const Tooltip = ({ tooltipText, iconCss, extraCss }: TooltipProps) => {
  const [showTooltip, setShowTooltip] = React.useState(false);
  return (
    <div className="w-fit h-fit flex items-center relative">
      <button
        className={cn("ml-1.5", iconCss)}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <IoInformationCircleOutline className="text-light-font-60 dark:text-dark-font-60 text-sm md:text-xs" />
      </button>
      {showTooltip ? (
        <div
          className={cn(
            "absolute text-sm md:text-xs text-light-font-60 dark:text-dark-font-60 flex bg-light-bg-terciary dark:bg-dark-bg-terciary border border-light-border-primary dark:border-dark-border-primary rounded-md p-2 md:p-1.5 z-50 w-[200px]",
            extraCss
          )}
        >
          {tooltipText}
        </div>
      ) : null}
    </div>
  );
};
