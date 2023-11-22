import {Flex, FlexProps} from "@chakra-ui/react";
import React from "react";
import {useColors} from "../../../../../common/utils/color-mode";

export const BoxContainer: React.FC<FlexProps> = ({children, ...props}) => {
  const {boxBg3, borders, text80} = useColors();
  return (
    <Flex
      direction="column"
      borderRadius="16px"
      bg={boxBg3}
      w="100%"
      border={borders}
      color={text80}
      {...props}
    >
      {children}
    </Flex>
  );
};
