"use client";
import { Asset } from "interfaces/assets";
import { useRouter } from "next/navigation";
import React, { useContext } from "react";
import { Button } from "../components/button";
import { Drawer } from "../components/drawer";
import { LargeFont } from "../components/fonts";
import { PopupUpdateContext } from "../contexts/popup";
import { SettingsMetricContext } from "../contexts/settings";
import { SwapProvider } from "../layouts/swap";
import { MainSwap } from "../layouts/swap/swap-variant/main";

export const DexDrawer = () => {
  const { showBuyDrawer, setShowBuyDrawer } = useContext(SettingsMetricContext);
  const { setShowCard } = useContext(PopupUpdateContext);
  const router = useRouter();
  const token: Asset | any = {
    ...showBuyDrawer,
    blockchain: showBuyDrawer?.blockchains?.[0],
    address:
      showBuyDrawer && "contracts" in showBuyDrawer
        ? showBuyDrawer?.contracts?.[0]
        : undefined,
    logo: showBuyDrawer?.image || showBuyDrawer?.logo,
    name: (showBuyDrawer?.name || showBuyDrawer?.symbol) as string,
  };
  return (
    <Drawer
      titleChildren={
        <>
          <img
            src={token ? token.logo || token?.image : "/empty/unknown.png"}
            className="w-[22px] h-[22px] rounded-full mr-2.5"
            alt={`${token?.name} logo`}
          />
          <LargeFont>Buy or Sell {token ? token?.symbol : ""}</LargeFont>
        </>
      }
      isOpen={!!showBuyDrawer}
      onClose={() => setShowBuyDrawer(null)}
    >
      {showBuyDrawer ? (
        <>
          <SwapProvider tokenOutBuffer={token} lockToken={["out"]}>
            <MainSwap isDex />
          </SwapProvider>
          <div className="px-5 mt-0">
            {/* <Button
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
          </Button> */}
            <div className="bg-light-border-primary dark:bg-dark-border-primary h-[1px] w-full mb-[15px]" />
            <Button
              extraCss="w-full justify-center h-[45px] md:h-[40px] mt-5"
              onClick={() => {
                if (token) router.push("/swap");
              }}
            >
              Swap page
            </Button>
          </div>
        </>
      ) : null}
    </Drawer>
  );
};
