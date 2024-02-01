"use client";
import { useContext } from "react";
import { Container } from "../../components/container";
import { PairsContext } from "./context-manager";

interface AssetProps {
  isAssetPage?: boolean;
}

export const Pairs = () => {
  const { basePair } = useContext(PairsContext);
  const isMobile =
    (typeof window !== "undefined" ? window.innerWidth : 0) < 768;

  return (
    <>
      <div className="flex flex-col">
        <Container extraCss="md:w-full mt-0 maximum-width">
          <div className="flex items-center lg:items-start flex-row lg:flex-col justify-between w-full md:w-[100%] mx-auto pb-0 md:pb-2.5">
            {/* <TokenMainInfo /> */}
            {/* <TokenSocialsInfo /> */}
          </div>
          <div className="hidden md:flex mb-0 md:mb-0.5 h-0.5 bg-light-border-primary dark:bg-dark-border-primary w-full" />
          <div
            className="flex items-center justify-between mt-5 lg:mt-[15px] md:mt-2.5 py-5 lg:py-[15px]
           md:py-2.5 border-t border-b border-light-border-primary dark:border-dark-border-primary 
           overflow-x-scroll scroll w-full md:w-[95%] mx-auto md:hidden"
          ></div>

          {/* <Essentials />  */}
        </Container>
      </div>{" "}
    </>
  );
};
