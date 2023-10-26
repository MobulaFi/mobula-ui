import { Flex } from "@chakra-ui/react";
import React from "react";
import { ToggleColorMode } from "../../layouts/toggle-mode";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Flex direction="column">
      {/* <Header /> */}
      <ToggleColorMode />
      {children}
      {/* <Footer /> */}
    </Flex>
  );
};

export default Layout;
