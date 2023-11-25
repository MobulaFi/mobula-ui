import React from "react";
import { cn } from "../lib/shadcn/lib/utils";

interface BoxProps {
  extraClass?: string;
  children: React.ReactNode;
  [key: string]: any;
}

export const Box = ({ extraCss, children, ...props }: BoxProps) => {
  return (
    <div
      className={cn(
        "w-fit p-3.5 flex rounded-lg bg-light-bg-secondary text-sm lg:text-xs dark:bg-dark-bg-secondary  text-light-font-100 dark:text-dark-font-100 transition border border-light-border-primary dark:border-dark-border-primary",
        extraCss
      )}
      {...props}
    >
      {children}
    </div>
  );
};
