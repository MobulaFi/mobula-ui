import {InfoIcon} from "@chakra-ui/icons";
import {Flex, Box, Text} from "@chakra-ui/react";
import React from "react";

export const EarnMobl = ({amount, ...props}) => {
  return (
    <Flex align="center" {...props}>
      <InfoIcon fontSize="14px" color="text.30" mt="2px" mr="10px" />
      <Text>
        You will earn{" "}
        <Box as="span" color="text.100" ml="5px">
          {isNaN(amount) ? "--" : amount.toFixed(3)} MOBL
        </Box>
      </Text>
    </Flex>
  );
};
