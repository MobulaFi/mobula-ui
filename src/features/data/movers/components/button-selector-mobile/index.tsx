import {Button, Icon} from "@chakra-ui/react";
import React from "react";
import {TrendingDown, TrendingUp} from "react-feather";

export const ButtonSelectorMobile = ({
  isGainer,
  ...props
}: {
  isGainer?: boolean;
  [key: string]: any;
}) => (
  <Button
    borderRadius="8px"
    minWidth="90px"
    h="30px"
    px="12px"
    mr="10px"
    fontWeight="400"
    fontSize={["12px", "12px", "13px", "14px"]}
    {...props}
  >
    {isGainer ? "Gainers" : "Losers"}
    <Icon as={isGainer ? TrendingUp : TrendingDown} w="15px" ml="10px" />
  </Button>
);
