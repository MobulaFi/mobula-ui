import { Skeleton } from "@chakra-ui/react";
import React from "react";
import { useColors } from "../lib/chakra/colorMode";
import { getTokenPercentage } from "../utils/formaters";

export const TagPercentage = ({
  percentage,
  isUp,
  isLoading = false,
  h,
  fs,
  isMultiple = false,
}: {
  percentage: number;
  isUp: boolean;
  isLoading?: boolean;
  h?: string[];
  fs?: string[];
  isMultiple?: boolean;
}) => {
  const { boxBg6, hover } = useColors();
  const getDisplay = () => {
    if (isMultiple) return `x${getTokenPercentage(percentage)}`;
    if (isUp) return `+${getTokenPercentage(percentage)}%`;
    return `${getTokenPercentage(percentage)}%`;
  };

  const finalPercentage = getDisplay();
  return isLoading ? (
    <Skeleton
      h={["20px", "20px", "21.5px", "23px"]}
      w="60px"
      px="6px"
      borderRadius="8px"
      ml="10px"
      color={isUp ? "green" : "red"}
      bg={isUp ? "darkgreen" : "red_bg"}
      fontSize={["12px", "12px", "13px", "14px"]}
      startColor={boxBg6}
      endColor={hover}
    />
  ) : (
    <div
      className={`flex h-${
        h || "23px"
      } lg:h-[21.5px] md:h-[20px] w-fit px-1.5 rounded-lg items-center font-medium ${
        isUp ? "bg-darkgreen" : "bg-darkred"
      } ml-2.5 text-sm lg:text-xs font-medium ${
        isUp ? "text-green" : "text-red"
      }`}
    >
      {finalPercentage}
    </div>
  );
};
