import NextLink from "next/link";
import React from "react";

interface NextChakraLinkProps {
  children: React.ReactNode;
  href?: string;
  extraCss?: string;
}

export const NextChakraLink = ({
  children,
  href,
  extraCss,
  ...props
}: NextChakraLinkProps) => {
  if (!href)
    return (
      <div className={extraCss} {...props}>
        {children}
      </div>
    );
  return (
    <NextLink href={href}>
      <div className={extraCss} {...props}>
        {children}
      </div>
    </NextLink>
  );
};
