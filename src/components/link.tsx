import { cn } from "lib/shadcn/lib/utils";
import React from "react";

interface NextChakraLinkProps {
  children: React.ReactNode;
  href?: string;
  extraCss?: string;
  [key: string]: any;
}

export const NextChakraLink = ({
  children,
  href,
  extraCss,
  ...props
}: NextChakraLinkProps) => {
  if (!href)
    return (
      <span
        className={cn(
          "text-light-font-100 dark:text-dark-font-100 text-sm md:text-xs",
          extraCss
        )}
        {...props}
      >
        {children}
      </span>
    );
  return (
    <a href={href} {...props}>
      <span
        className={cn(
          "text-light-font-100 dark:text-dark-font-100 text-sm md:text-xs w-full",

          extraCss
        )}
      >
        {children}
      </span>
    </a>
  );
};
