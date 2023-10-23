"use client";
import { CacheProvider } from "@chakra-ui/next-js";
import React from "react";
import { Chakra as ChakraProvider } from "../chakra/chakra";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CacheProvider>
      <ChakraProvider>{children}</ChakraProvider>
    </CacheProvider>
  );
}
