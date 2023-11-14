import React from "react";
import { SmallFont } from "../../../../../../components/fonts";

interface HoldingsListProps {
  isOdds: boolean;
  background: string;
  keys: string;
  value: string;
  size: string;
}

export const HoldingsList = ({
  isOdds,
  background,
  keys,
  value,
  size,
}: HoldingsListProps) => {
  return (
    <div
      className={`${
        isOdds ? "mr-[15px]" : "mr-0"
      } rounded-sm items-center flex mt-[5px] ${size}`}
    >
      <div
        className={`flex w-[10px] h-[10px] min-w-[10px] mr-[7.5px] ${background}`}
      />
      <div className="flex items-center">
        <SmallFont extraCss="text-light-font-40 dark:text-dark-font-40">
          {" "}
          {keys}:
        </SmallFont>
        <SmallFont extraCss="ml-[7.5px]">{value}</SmallFont>
      </div>
    </div>
  );
};
