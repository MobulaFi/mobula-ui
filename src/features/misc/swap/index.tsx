"use client";
import { useEffect, useState } from "react";
// import { SwapProvider } from "../../../common/providers/swap";
// import { BuySellSwap } from "../../../common/providers/swap/components/buy-sell";
import React from "react";
import { Container } from "../../../components/container";
import { LargeFont } from "../../../components/fonts";
import { SwapProvider } from "../../../layouts/swap";
import { SearchTokenProps } from "../../../layouts/swap/popup/select/model";
import { BasicSwap } from "../../../layouts/swap/swap-variant/basic-swap";
import { CardsAndCTA } from "./components/cards-and-cta";
import { TopConvertion } from "./components/top-convertion";

interface BuySellProps {
  token?: SearchTokenProps;
}

export const BuySell = ({ token }: BuySellProps) => {
  const [showTuto, setShowTuto] = useState(false);
  const [activeStep, setActiveStep] = useState({
    nbr: 1,
    title: "Select a crypto",
    subtitle: "to input",
    top: ["-15%", "-15%", "13%"],
    right: ["50%", "50%", "100%"],
    transform: ["translateX(50%)", "translateX(50%)", "translateX(0%)"],
  });

  useEffect(() => {
    if (!localStorage.getItem("showTuto")) setShowTuto(true);
  }, []);

  const getNextStep = () => {
    switch (activeStep.nbr) {
      case 1:
        setActiveStep({
          nbr: 2,
          title: "Select a crypto",
          subtitle: "to buy",
          top: ["15%", "15%", "43%"],
          right: ["50%", "50%", "100%"],
          transform: ["translateX(50%)", "translateX(50%)", "translateX(0%)"],
        });
        break;
      case 2:
        setActiveStep({
          nbr: 3,
          title: "Select the aggregator",
          subtitle: "you want",
          top: ["43%", "43%", "62%"],
          right: ["50%", "50%", "100%"],
          transform: ["translateX(50%)", "translateX(50%)", "translateX(0%)"],
        });
        break;
      case 3:
        setShowTuto(false);
        localStorage.setItem("showTuto", "false");
        break;
      default:
        break;
    }
  };

  return (
    <>
      {/* {activeStep.nbr <= 3 && showTuto ? (
        <div className="flex w-screen h-screen top-0 fixed z-[3] bg-[rgba(0,0,0,0.3)]" />
      ) : null} */}
      <Container extraCss="flex flex-row items-center justify-center lg:flex-col bg-top mt-[70px] lg:mt-[28px] mb-[90px] lg:mb-[40px] md:mb-[28px] min-h-[60vh] lg:min-h-full">
        <div className="flex flex-col w-2/4 md:w-[95%] mr-[30px] md:mr-0">
          <p
            className="md:hidden flex text-5xl lg:text-2xl font-medium text-light-font-100 dark:text-dark-font-100 mb-5 
           leading-[55px] lg:leading-[30px] tracking-tight font-['Poppins'] lg:text-center sm:max-w-[80%] mx-auto"
          >
            Buy any crypto, at the best price.
          </p>
          <div className="flex lg:hidden">
            <LargeFont extraCss="max-w-[540px] md:text-sm font-normal">
              Buy Bitcoin and +1.3M other cryptos from any blockchain, at the
              best price, with{" "}
              <span className="text-xl lg:text-[17px] md:text-sm text-light-font-100 dark:text-dark-font-100 font-medium">
                0% fees from Mobula.
              </span>
            </LargeFont>
          </div>
          <CardsAndCTA extraCss="flex lg:hidden mt-0" />
        </div>
        <div className="flex justify-center w-full lg:w-[100%] ml-auto lg:ml-0 ">
          <SwapProvider tokenOutBuffer={token} lockToken={token ? ["out"] : []}>
            <BasicSwap activeStep={activeStep.nbr} />
          </SwapProvider>

          {/* {showTuto ? (
            <StepPopup
              setShowTuto={setShowTuto}
              activeStep={activeStep}
              getNextStep={getNextStep}
            />
          ) : null} */}
        </div>
        <div className="hidden lg:flex mt-5 mb-2">
          <p className="w-[80%] text-light-font-100 dark:text-dark-font-100 max-w-[520px] md:text-sm font-light text-center mx-auto">
            Buy Bitcoin and +1.3M other cryptos from any blockchain, at the best
            price, with{" "}
            <span className="text-xl md:text-sm text-light-font-100 dark:text-dark-font-100 font-medium">
              0% fees from Mobula.
            </span>
          </p>
        </div>
        <CardsAndCTA extraCss="hidden lg:flex lg:mt-0" />
      </Container>
      <div className="flex h-[1px] w-full bg-light-border-primary dark:bg-dark-border-primary my-8 md:mb-2" />
      <TopConvertion />
    </>
  );
};
