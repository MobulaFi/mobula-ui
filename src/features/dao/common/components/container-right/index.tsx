import React from "react";
import { cn } from "../../../../../lib/shadcn/lib/utils";

interface RightContainerProps {
  children: React.ReactNode;
  extraCss?: string;
}

export const RightContainer = ({ children, extraCss }: RightContainerProps) => (
  <div
    className={cn(
      "mt-[37px] lg:mt-5 w-full max-w-[800px] lg:max-w-full",
      extraCss
    )}
  >
    {children}
  </div>
);
