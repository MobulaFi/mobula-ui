"use client";
import { useTheme } from "next-themes";
import React from "react";
import { cn } from "../lib/shadcn/lib/utils";

interface InputProps {
  extraCss?: string;
  children?: React.ReactNode;
  isError?: boolean;
  [key: string]: any;
}

export const Input = ({
  extraCss,
  isError = false,
  children,
  ...props
}: InputProps) => {
  const { theme } = useTheme();
  const isLightTheme = theme === "light";
  return (
    <input
      className={cn(
        `${
          isError
            ? "border border-red dark:border-red"
            : "border border-light-border-primary dark:border-dark-border-primary"
        } text-sm rounded-md text-light-font-100 dark:text-dark-font-100 bg-light-bg-terciary 
        dark:bg-dark-bg-terciary h-[35px] md:h-[30px] px-2 flex items-center`,
        extraCss
      )}
      style={{
        border: isLightTheme
          ? "1px solid rgba(0, 0, 0, 0.03)"
          : "1px solid rgba(255, 255, 255, 0.03)",
      }}
      {...props}
    />
  );
};
