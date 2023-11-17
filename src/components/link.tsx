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
}

export const NextChakraLink = ({
  children,
  href,
  extraCss,
  target,
  rel,
  onClick,
  ...props
}: NextChakraLinkProps) => {
  if (!href)
    return (
      <div
        className={cn("text-light-font-100 dark:text-dark-font-100", extraCss)}
        {...props}
      >
        {children}
      </div>
    );
  return (
    <NextLink href={href} target="_blank" rel={rel} onClick={onClick}>
      <div
        className={cn("text-light-font-100 dark:text-dark-font-100", extraCss)}
        {...props}
      >
        {children}
      </div>
    </NextLink>
  );
};
