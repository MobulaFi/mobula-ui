import React from "react";
import { cn } from "../../../../../../lib/shadcn/lib/utils";

interface PrivacyProps {
  extraCss?: string;
}

export const Privacy = ({ extraCss }: PrivacyProps) => (
  <div
    className={cn(
      "rounded-md flex text-light-font-100 dark:text-dark-font-100 text-sm lg:text-[13px] md:text-xs font-normal transition-all duration-200 items-center justify-start",
      extraCss
    )}
  >
    ****
  </div>
);
