import React from "react";
import {NextChakraLink} from "../../../../../common/components/links";

export const LinkBlank = ({
  children,
  url,
  ...props
}: {
  children: string | JSX.Element | JSX.Element[];
  url: string;
  [key: string]: unknown;
}) => (
  <NextChakraLink
    href={url}
    h="100%"
    w="100%"
    color="text.80"
    target="_blank"
    rel="noreferre"
    isExternal
    _hover={{color: "text.60 !important"}}
    {...props}
  >
    {children}
  </NextChakraLink>
);
