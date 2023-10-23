import { Flex, FlexProps } from "@chakra-ui/react";
import React from "react";

interface ContainerProps {
  children: React.ReactNode;
  isMobile?: boolean;
}

export const MainContainer = ({
  children,
  isMobile,
  ...props
}: ContainerProps & FlexProps) => {
  if (
    isMobile === true &&
    typeof window !== "undefined" &&
    window.innerWidth > 990
  ) {
    return null;
  }
  if (
    isMobile === false &&
    typeof window !== "undefined" &&
    window.innerWidth < 990
  ) {
    return null;
  }

  return (
    <Flex
      mt={["10px", "10px", "28px", "28px"]}
      mb="100px"
      maxWidth="1200px"
      mx="auto"
      w={["95%", "90%", "90%", "90%"]}
      direction="column"
      {...props}
    >
      {children}
    </Flex>
  );
};
