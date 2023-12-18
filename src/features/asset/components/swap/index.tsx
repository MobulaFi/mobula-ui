import React, { useContext } from "react";
import { BsChevronDown } from "react-icons/bs";
import { Button } from "../../../../components/button";
import { Container } from "../../../../components/container";
import { LargeFont } from "../../../../components/fonts";
import { SwapProvider } from "../../../../layouts/swap";
import { BasicSwap } from "../../../../layouts/swap/swap-variant/basic-swap";
import { BaseAssetContext } from "../../context-manager";

export const SwapPopup = () => {
  const { baseAsset, showSwap, setShowSwap } = useContext(BaseAssetContext);

  const getSwapPosition = () => {
    if (showSwap === 2) return "bottom-[0px]";
    if (showSwap === 1) return "bottom-[420px]";
    return "bottom-[-475px]";
  };
  const swapPosition = getSwapPosition();

  return (
    <Container
      extraCss={`${swapPosition} translate-x-[50%] right-[50%] fixed z-10 mb-0 justify-end transition-all duration-200 hidden lg:flex`}
    >
      <div
        className="flex flex-col max-w-[420px] w-full ml-auto mr-0 lg:mr-auto bg-light-bg-terciary 
      dark:bg-dark-bg-terciary border border-light-border-primary dark:border-dark-border-primary rounded-l-2xl 
      shadow-md transition-all duration-200"
      >
        <div className="bg-light-bg-terciary dark:bg-dark-bg-terciary rounded-l-2xl justify-between flex items-center px-[15px] h-[50px]">
          <LargeFont>Trade {baseAsset?.symbol}</LargeFont>
          <Button
            extraCss="w-[36px] h-[36px] min-w-[36px] sm:w-[30px] sm:min-w-[30px] sm:h-[30px] rounded-full"
            onClick={() => {
              if (showSwap === 1) setShowSwap(2);
              else setShowSwap(1);
            }}
          >
            <BsChevronDown
              className={`${
                showSwap ? "rotate-180" : ""
              } text-blue dark:text-blue transition-all duration-200 text-3xl`}
            />
          </Button>
        </div>
        <div className="flex md:hidden">
          <SwapProvider
            tokenOutBuffer={{
              ...baseAsset,
              blockchain: baseAsset?.blockchains[0],
              address:
                baseAsset && "contracts" in baseAsset
                  ? baseAsset.contracts[0]
                  : undefined,
              logo: baseAsset?.image || baseAsset?.logo,
              name: baseAsset?.name || baseAsset?.symbol,
            }}
            lockToken={["out"]}
          >
            <BasicSwap activeStep={0} />
          </SwapProvider>
        </div>
      </div>
    </Container>
  );
};
