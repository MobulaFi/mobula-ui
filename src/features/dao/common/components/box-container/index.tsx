import React from "react";
import { cn } from "../../../../../lib/shadcn/lib/utils";

interface BoxContainerProps {
  children: React.ReactNode;
  extraCss?: string;
  [key: string]: any;
}

export const BoxContainer = ({
  children,
  extraCss,
  ...props
}: BoxContainerProps) => {
  return (
    <div
      className={cn(
        "flex flex-col rounded-2xl bg-light-bg-secondary dark:bg-dark-bg-secondary w-full border border-light-border-primary dark:border-dark-border-primary text-light-font-100 dark:text-dark-font-100",
        extraCss
      )}
      {...props}
    >
      {children}
    </div>
  );
};
