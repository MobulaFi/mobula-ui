import { cn } from "../lib/shadcn/lib/utils";
import { getTokenPercentage } from "../utils/formaters";
import { Skeleton } from "./skeleton";

interface TagPercentageProps {
  percentage: number | string;
  isUp: boolean;
  isLoading?: boolean;
  h?: string;
  fs?: string;
  isMultiple?: boolean;
  extraCss?: string;
}

export const TagPercentage = ({
  percentage,
  isUp,
  isLoading = false,
  h,
  fs,
  isMultiple = false,
  extraCss = "",
}: TagPercentageProps) => {
  const getDisplay = () => {
    if (isMultiple) return `x${getTokenPercentage(Number(percentage))}`;
    if (isUp) return `+${getTokenPercentage(Number(percentage))}%`;
    return `${getTokenPercentage(Number(percentage))}%`;
  };

  const finalPercentage = getDisplay();

  return isLoading ? (
    <Skeleton
      extraCss={cn(
        "h-[23px] lg:h-[21.5px] md:h-[20px] w-[60px] rounded-md ml-2.5",
        extraCss
      )}
    />
  ) : (
    <div
      className={cn(
        `flex items-center justify-center${
          h || "h-[26px] lg:h-[21.5px]"
        } w-fit px-1.5 rounded ml-2.5 ${
          isUp ? "text-green bg-darkgreen" : "text-red bg-darkred"
        } ${
          fs || "text-sm lg:text-[13px] md:text-xs"
        } font-medium text-center py-0.5`,
        extraCss
      )}
    >
      {finalPercentage}
    </div>
  );
};
