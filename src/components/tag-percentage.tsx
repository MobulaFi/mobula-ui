import React from "react";
import { getTokenPercentage } from "../utils/formaters";
import { Skeleton } from "./skeleton";

interface TagPercentageProps {
  percentage: number;
  isUp: boolean;
  isLoading?: boolean;
  h?: string[];
  fs?: string[];
  isMultiple?: boolean;
}

export const TagPercentage = ({
  percentage,
  isUp,
  isLoading = false,
  h,
  fs,
  isMultiple = false,
}: TagPercentageProps) => {
  const getDisplay = () => {
    if (isMultiple) return `x${getTokenPercentage(percentage)}`;
    if (isUp) return `+${getTokenPercentage(percentage)}%`;
    return `${getTokenPercentage(percentage)}%`;
  };

  const finalPercentage = getDisplay();

  return isLoading ? (
    <Skeleton extraCss="h-[23px] lg:h-[21.5px] md:h-[20px] w-[60px] rounded-lg ml-2.5" />
  ) : (
    <div
      className={`${h || "h-[23px] lg:h-[21.5px] md:h-[20px]"} w-fit px-1.5 
    rounded-lg ml-2.5 ${
      isUp ? "text-green bg-darkgreen" : "text-red bg-darkred"
    } ${fs || "text-sm lg:text-[13px] md:text-xs"} font-medium text-center`}
    >
      {finalPercentage}
    </div>
  );
};
