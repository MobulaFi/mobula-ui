import React from "react";
import { cn } from "../@/lib/utils";

interface InputProps {
  extraCss?: string;
  children?: React.ReactNode;
  isError?: boolean;
  [key: string]: any;
}

const getBorderColor = (error: boolean) => {
  if (error) return "border-red";
  return "border-light-border-primary dark:border-dark-border-primary";
};

export const Input = ({
  extraCss,
  isError = false,
  children,
  ...props
}: InputProps) => {
  const borderColor = getBorderColor(isError);
  return (
    <input
      className={cn(
        `border ${borderColor} text-sm rounded text-light-font-100 dark:text-dark-font-100 bg-light-bg-terciary dark:bg-dark-bg-terciary h-[35px] md:h-[30px] px-2 flex items-center transition-all duration-250`,
        extraCss
      )}
      {...props}
    />
  );
};
