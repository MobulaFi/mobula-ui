import React from "react";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { cn } from "../../../../../../lib/shadcn/lib/utils";

interface EarnMoblProps {
  amount: number;
  extraCss?: string;
}

export const EarnMobl = ({ amount, extraCss }: EarnMoblProps) => {
  return (
    <div className={cn("flex items-center", extraCss)}>
      <AiOutlineInfoCircle className="text-sm text-light-font-40 dark:text-dark-font-40 mt-0.5 mr-2.5" />
      <p className="text-light-font-40 dark:text-dark-font-40 text-sm">
        You will earn{" "}
        <span className="text-light-font-100 dark:text-dark-font-100 ml-[5px]">
          {isNaN(amount) ? "--" : amount.toFixed(3)} MOBL
        </span>
      </p>
    </div>
  );
};
