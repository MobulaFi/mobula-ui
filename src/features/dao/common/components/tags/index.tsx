import React from "react";
import { cn } from "../../../../../lib/shadcn/lib/utils";

interface TagsProps {
  children: React.ReactNode;
  extraCss?: string;
  [key: string]: any;
}

export const Tags = ({ children, extraCss, ...props }: TagsProps) => {
  return (
    <div
      className={cn(
        "flex border border-light-border-primary dark:border-dark-border-primary h-[28px] text-light-font-100 dark:text-dark-font-100 bg-light-bg-terciary dark:bg-dark-bg-terciary px-3 min-w-[50px] justify-center items-center text-[13px] font-medium rounded-full",
        extraCss
      )}
      {...props}
    >
      {children}
    </div>
  );
};
