import { Flex } from "@chakra-ui/react";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Flex direction="column">
      {/* <Header /> */}
      {children}
      {/* <Footer /> */}
    </Flex>
  );
};

export default Layout;
