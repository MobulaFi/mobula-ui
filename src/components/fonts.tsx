import React from "react";
import { cn } from "../lib/shadcn/lib/utils";

interface defaultProps {
  children: React.ReactNode;
  [key: string]: any;
  extraCss?: string;
}

interface TitleProps {
  title: string;
  subtitle?: string;
}

export const SmallFont = ({ extraCss, children }: defaultProps) => {
  return (
    <p
      className={cn(
        "text-light-font-100 dark:text-dark-font-100 text-sm md:text-xs font-normal",
        extraCss
      )}
    >
      {children}
    </p>
  );
};

export const MediumFont = ({ extraCss, children }: defaultProps) => {
  return (
    <p
      className={cn(
        "text-light-font-100 dark:text-dark-font-100 text-base lg:text-sm font-normal",
        extraCss
      )}
    >
      {children}
    </p>
  );
};

export const LargeFont = ({ extraCss, children }: defaultProps) => {
  return (
    <p
      className={cn(
        "text-light-font-100 dark:text-dark-font-100 text-lg lg:text-base font-medium ",
        extraCss
      )}
    >
      {children}
    </p>
  );
};

export const ExtraLargeFont = ({ extraCss, children }: defaultProps) => {
  return (
    <p
      className={cn(
        "text-light-font-100 dark:text-dark-font-100 text-3xl  lg:text-xl font-bold ",
        extraCss
      )}
    >
      {children}
    </p>
  );
};

export const ExtraSmallFont = ({ extraCss, children }: defaultProps) => {
  return (
    <p
      className={cn(
        "text-light-font-100 dark:text-dark-font-100 text-[10px]  lg:text-[8px] font-medium ",
        extraCss
      )}
    >
      {children}
    </p>
  );
};

export const Font = ({ extraCss, children }: defaultProps) => {
  return (
    <p
      className={cn(
        "text-light-font-100 dark:text-dark-font-100 font-normal",
        extraCss
      )}
    >
      {children}
    </p>
  );
};

export const Title = ({ title, subtitle, extraCss }) => {
  return (
    <div className={cn("flex flex-col mx-auto w-full sm:w-[95%]", extraCss)}>
      <h1 className="text-xl lg:text-lg  text-light-font-100 dark:text-dark-font-100 font-bold mb-3 font-['Poppins']">
        {title}
      </h1>
      <div>
        <SmallFont className="text-light-font-40 dark:text-dark-font-40 font-['Poppins']">
          {subtitle}
        </SmallFont>
      </div>
    </div>
  );
};
