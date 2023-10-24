import { Td, Th } from "@chakra-ui/react";
import React from "react";
import { useColors } from "../lib/chakra/colorMode";

export const Ths = ({
  children,
  bg,
  ...props
}: {
  children: any;
  bg?: any;
  [key: string]: any;
}) => {
  const { borders, text80 } = useColors();
  return (
    <Th
      borderBottom={borders}
      fontSize={["12px", "12px", "13px", "14px"]}
      fontWeight="500"
      fontFamily="Inter"
      letterSpacing="auto"
      py={["10px", "10px", "20px"]}
      bg={bg || "none"}
      color={text80}
      textTransform="capitalize"
      {...props}
    >
      {children}
    </Th>
  );
};

export const Tds = ({
  children,
  bg,
  ...props
}: {
  children: any;
  bg?: any;
  [key: string]: any;
}) => {
  const { borders, text80 } = useColors();
  return (
    <Td
      borderBottom={borders}
      fontSize={["12px", "12px", "13px", "14px"]}
      fontWeight="500"
      fontFamily="Inter"
      letterSpacing="auto"
      py={["10px", "10px", "20px"]}
      bg={bg || "none"}
      color={text80}
      textTransform="capitalize"
      {...props}
    >
      {children}
    </Td>
  );
};
