import { useRouter } from "next/navigation";
import React, { useContext } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { Button } from "../components/button";
import { LargeFont } from "../components/fonts";
import { PopupUpdateContext } from "../contexts/popup";
import { SettingsMetricContext } from "../contexts/settings";
import { SwapProvider } from "../layouts/swap";
import { MainSwap } from "../layouts/swap/swap-variant/main";
import { pushData } from "../lib/mixpanel";
import { getUrlFromName } from "../utils/formaters";

export const DexDrawer = () => {
  const { showBuyDrawer, setShowBuyDrawer } = useContext(SettingsMetricContext);
  const { setShowCard } = useContext(PopupUpdateContext);
  const router = useRouter();
  const token = {
    ...showBuyDrawer,
    blockchain: showBuyDrawer?.blockchains?.[0],
    address:
      showBuyDrawer && "contracts" in showBuyDrawer
        ? showBuyDrawer?.contracts?.[0]
        : undefined,
    logo: showBuyDrawer?.image || showBuyDrawer?.logo,
    name: (showBuyDrawer?.name || showBuyDrawer?.symbol) as string,
  };
  if (showBuyDrawer)
    return (
      <div className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm">
        <button onClick={() => setShowBuyDrawer(null)}>OPEN</button>
        <div
          className="flex flex-col fixed top-0 w-[400px] h-[100vh] border-l border-light-border-primary
         dark:border-dark-border-primary bg-light-bg-secondary dark:bg-dark-bg-secondary 
         transition-all duration-500 ease-in-out "
          style={{
            right: showBuyDrawer ? "0%" : "-100%",
          }}
        >
          <div className="flex items-center justify-between border-b border-light-border-primary dark:border-dark-border-primary p-5 md:p-[15px]">
            <div className="flex items-center">
              <img
                src={token ? token.logo || token?.image : "/empty/unknown.png"}
                className="w-[22px] h-[22px] rounded-full mr-2.5"
                alt={`${token?.name} logo`}
              />
              <LargeFont>Buy or Sell {token ? token?.symbol : ""}</LargeFont>
            </div>
            <button onClick={() => setShowBuyDrawer(null)}>
              <AiOutlineClose className="text-light-font-100 dark:text-dark-font-100 text-xl" />
            </button>
          </div>
          <SwapProvider tokenOutBuffer={token} lockToken={["out"]}>
            <MainSwap isDex />
          </SwapProvider>
          <div className="px-5">
            <Button
              extraCss="w-full flex items-center justify-center h-[45px] md:h-[40px] mt-[15px]"
              onClick={() => {
                pushData("Buy with Credit Card");
                setShowCard("USD");
              }}
            >
              Buy with credit-card
              <img
                src="/logo/mastercard.png"
                className="h-[15px] mx-[7.5px]"
                alt="mastercard logo"
              />
              <img className="h-[13px]" src="/logo/visa.png" alt="visa logo" />
            </Button>
            <div className="bg-light-border-primary dark:bg-dark-border-primary h-[1px] w-full my-[15px]" />
            <Button
              extraCss="w-full justify-center h-[45px] md:h-[40px]"
              onClick={() => {
                if (token)
                  router.push(
                    `/trade/${getUrlFromName(token.name.toLowerCase())}`
                  );
              }}
            >
              Trading Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  return null;
};
