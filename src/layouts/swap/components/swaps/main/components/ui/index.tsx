import {Flex} from "@chakra-ui/react";
import React from "react";

export const FlexBoxs = ({children, ...props}) => {
  return (
    <Flex
      position="relative"
      borderRadius="6px"
      border="1px solid var(--chakra-colors-borders-3)"
      h="80px"
      w="100%"
      p="10px"
      justify="space-between"
      align="flex-end"
      {...props}
    >
      {children}
    </Flex>
  );
};
