import {Flex} from "@chakra-ui/react";
import React from "react";
import {useColors} from "../../../../../common/utils/color-mode";

export const Tags = ({children, ...props}) => {
  const {text80, borders, boxBg6} = useColors();
  return (
    <Flex
      border={borders}
      opacity={1}
      color={text80}
      bg={boxBg6}
      h="28px"
      px="12px"
      minW="50px"
      justify="center"
      fontSize="13px"
      fontWeight="400"
      align="center"
      py="0px"
      borderRadius="full"
      {...props}
    >
      {children}
    </Flex>
  );
};
