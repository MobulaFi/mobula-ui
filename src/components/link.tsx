import { Box, LinkProps } from "@chakra-ui/react";
import NextLink from "next/link";
import React from "react";

export const NextChakraLink = ({
  children,
  href,
  ...props
}: {
  children: React.ReactNode;
  href?: string;
} & LinkProps) => {
  if (!href) return <Box {...props}>{children}</Box>;
  return (
    <NextLink href={href}>
      <Box {...props}>{children}</Box>
    </NextLink>
  );
};
