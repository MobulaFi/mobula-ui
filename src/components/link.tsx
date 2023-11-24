import { cn } from "@/lib/utils";
import NextLink from "next/link";
import React from "react";

interface NextChakraLinkProps {
  children: React.ReactNode;
  href?: string;
  extraCss?: string;
  target?: string;
  rel?: string;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const NextChakraLink = ({
  children,
  href,
  extraCss,
  target,
  rel,
  onClick,
  onMouseEnter,
  onMouseLeave,
  ...props
}: NextChakraLinkProps) => {
  if (!href)
    return (
      <span
        className={cn(
          "text-light-font-100 dark:text-dark-font-100 text-sm lg:text-[13px] md:text-xs",
          extraCss
        )}
        {...props}
      >
        {children}
      </span>
    );
  return (
    <NextLink
      href={href}
      target="_blank"
      rel={rel}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <span
        className={cn(
          "text-light-font-100 dark:text-dark-font-100 text-sm lg:text-[13px] md:text-xs",
          extraCss
        )}
        {...props}
      >
        {children}
      </span>
    </NextLink>
  );
};
