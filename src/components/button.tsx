import React from "react";
import { cn } from "../lib/shadcn/lib/utils";

interface ButtonProps {
  extraCss?: string;
  manyChildren?: boolean;
  children?: React.ReactNode;
  [key: string]: any;
}

export const Button = ({ extraCss, children, ...props }: ButtonProps) => {
  return (
    <button
      className={cn(
        "w-fit px-2 whitespace-nowrap flex items-center text-sm lg:text-xs font-normal justify-center rounded-md h-8 sm:h-7 bg-light-bg-terciary hover:bg-light-bg-hover dark:bg-dark-bg-terciary dark:hover:bg-dark-bg-hover text-light-font-100 dark:text-dark-font-100 transition-all border border-light-border-primary dark:border-dark-border-primary duration-200 ease-in-out",
        extraCss
      )}
      {...props}
    >
      {children}
    </button>
  );
};
