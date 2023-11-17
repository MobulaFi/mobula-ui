import React from "react";
import {Th, Td} from "@chakra-ui/react";

export const Ths = ({children, ...props}) => (
  <Th
    fontFamily="Roboto"
    textTransform="capitalize"
    letterSpacing="auto"
    fontSize="15px"
    px={["10px", "10px", "15px"]}
    fontWeight="400"
    color="text.60"
    py={["15px", "15px", "20px"]}
    borderBottom="1px solid var(--chakra-colors-borders-3)"
    {...props}
  >
    {children}
  </Th>
);

export const Tds = ({children, ...props}) => (
  <Td
    fontFamily="Roboto"
    letterSpacing="auto"
    fontSize="16px"
    fontWeight="400"
    color="text.100"
    px={["10px", "10px", "20px"]}
    py={["10px", "10px", "20px"]}
    {...props}
  >
    {children}
  </Td>
);
