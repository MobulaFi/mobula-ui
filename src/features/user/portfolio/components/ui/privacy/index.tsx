import React from "react";
import { cn } from "../../../../../../lib/shadcn/lib/utils";

interface PrivacyProps {
  extraCss?: string;
}

export const Privacy = ({ extraCss }: PrivacyProps) => (
  <div
    className={cn(
      "rounded flex text-light-font-100 dark:text-dark-font-100 text-sm lg:text-[13px] md:text-xs font-medium transition-all duration-250 items-center justify-start",
      extraCss
    )}
  >
    ****
  </div>
);
