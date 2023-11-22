import {Flex} from "@chakra-ui/react";
import React from "react";
import {useColors} from "../../../../../common/utils/color-mode";

export const BoxTime = ({children}: {children: number | JSX.Element}) => {
  const {boxBg6} = useColors();
  return (
    <Flex
      align="center"
      justify="center"
      fontSize="15px"
      fontWeight="400"
      bg={boxBg6}
      minW={["40px", "40px", "50px"]}
      h={["35px", "35px", "40px"]}
      borderRadius="8px"
      px="10px"
      w="fit-content"
    >
      {children}
    </Flex>
  );
};
