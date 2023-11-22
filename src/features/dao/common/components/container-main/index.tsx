import {FlexProps, Flex} from "@chakra-ui/react";
import React from "react";

export const MainContainer: React.FC<FlexProps> = ({children}) => (
  <Flex
    w={["100%", "90%", "90%", "90%"]}
    justify="center"
    position="relative"
    maxWidth="1450px"
    direction={["column", "column", "column", "row"]}
    mx="auto"
    mt="28px"
    mb="100px"
  >
    {children}
  </Flex>
);
