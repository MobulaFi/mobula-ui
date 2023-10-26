import React from "react";

interface ButtonProps {
  extraCss?: string;
  manyChildren?: boolean;
  children: React.ReactNode;
  [key: string]: any;
}

export const Button = ({ extraCss, children, ...props }: ButtonProps) => {
  return (
    <button
      className={`w-fit px-2 flex items-center text-sm lg:text-xs font-normal justify-center rounded h-8 sm:h-7 bg-light-bg-terciary hover:bg-light-bg-hover dark:bg-dark-bg-terciary dark:hover:bg-dark-bg-hover text-light-font-100 dark:text-dark-font-100 transition border border-light-border-primary dark:border-dark-border-primary ${extraCss}`}
      {...props}
    >
      {children}
    </button>
  );
};
