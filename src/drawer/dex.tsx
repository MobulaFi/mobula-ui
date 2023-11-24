import React, { useState } from "react";
import { SwapProvider } from "../layouts/swap";
import { MainSwap } from "../layouts/swap/swap-variant/main";

export const DexDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm">
      <button onClick={() => setIsOpen(!isOpen)}>OPEN</button>
      <div
        className="fixed top-0 w-[400px] h-[100vh] border-l border-light-border-primary
         dark:border-dark-border-primary bg-light-bg-secondary dark:bg-dark-bg-secondary 
         transition-all duration-500 ease-in-out "
        style={{
          right: isOpen ? "0%" : "-100%",
        }}
      >
        <SwapProvider tokenOutBuffer={{ name: "bitcoin" }} lockToken={["out"]}>
          <MainSwap />
        </SwapProvider>
      </div>
    </div>
  );
};
