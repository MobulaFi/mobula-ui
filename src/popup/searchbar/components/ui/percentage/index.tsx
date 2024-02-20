import React from "react";
import { PiTriangleFill } from "react-icons/pi";
import { getFormattedAmount } from "../../../../../utils/formaters";
import { PercentageType } from "../../../models";

export const Percentage = ({
  value,
  isPercentage,
  noImage,
}: PercentageType) => {
  const negative = Number(value) < 0;

  const renderIcon = () => {
    if (isPercentage)
      return negative ? (
        <PiTriangleFill className="rotate-180 mr-[5px] text-red text-[10px]" />
      ) : (
        <PiTriangleFill className="mr-[5px] text-green text-[10px]" />
      );
    if (noImage) return null;
    return (
      <img
        src="/mobula/mobula-logo.svg"
        alt="mobula logo"
        className="w-[18px] h-[18px] mr-[5px]"
      />
    );
  };

  const icon = renderIcon();

  return (
    <div className="flex items-center">
      {icon}
      {isPercentage ? (
        <p className="font-medium text-light-font-100 dark:text-dark-font-100">
          ${getFormattedAmount(value as number, 0, { canUseHTML: true })}
        </p>
      ) : (
        <p className="font-medium text-light-font-100 dark:text-dark-font-100">
          ${value}
        </p>
      )}
    </div>
  );
};
