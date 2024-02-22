import { cn } from "../lib/shadcn/lib/utils";
import {
  convertScientificNotation,
  getFormattedAmount,
  getTokenPercentage,
} from "../utils/formaters";
import { Skeleton } from "./skeleton";

interface TagPercentageProps {
  percentage: number | string;
  isUp: boolean;
  isLoading?: boolean;
  h?: string;
  fs?: string;
  isMultiple?: boolean;
  extraCss?: string;
  isPercentage?: boolean;
  inhert?: boolean;
}

export const TagPercentage = ({
  percentage,
  isUp,
  isLoading = false,
  h,
  fs,
  isMultiple = false,
  extraCss = "",
  isPercentage = true,
  inhert = false,
}: TagPercentageProps) => {
  const getDisplay = () => {
    const removeScientificNotation = convertScientificNotation(
      percentage as number
    );
    if (
      typeof removeScientificNotation === "number" &&
      removeScientificNotation > 1_000_000_000
    ) {
      return "∞";
    }
    if (isPercentage) {
      if (isMultiple)
        return `x${getTokenPercentage(Number(removeScientificNotation))}`;
      if (isUp)
        return `+${getTokenPercentage(Number(removeScientificNotation))}%`;
      return `${getTokenPercentage(Number(removeScientificNotation))}%`;
    }
    return getFormattedAmount(Number(removeScientificNotation));
  };

  const finalPercentage = getDisplay();

  const getColors = () => {
    if (inhert) {
      return {
        bg: "bg-light-bg-hover dark:bg-dark-bg-hover",
        border:
          "border border-light-border-primary dark:border-dark-border-primary",
        color: "text-light-font-100 dark:text-dark-font-100",
      };
    } else {
      if (isUp)
        return {
          bg: "bg-darkgreen dark:bg-darkgreen",
          border: "",
          color: "text-green dark:text-green",
        };
      return {
        bg: "bg-darkred dark:bg-darkred",
        border: "",
        color: "text-red dark:text-red",
      };
    }
  };

  const { bg, border, color } = getColors();

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
        } w-fit px-1.5 rounded ml-2.5 ${bg} ${color} ${border} ${
          fs || "text-sm lg:text-[13px] md:text-xs"
        } font-medium text-center whitespace-nowrap py-0.5`,
        extraCss
      )}
    >
      {finalPercentage}
    </div>
  );
};
