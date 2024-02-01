import { blockchainsContent } from "mobula-lite/lib/chains/constants";
import React, { useContext } from "react";
import { BiSolidChevronDown } from "react-icons/bi";
import { Button } from "../../../../../components/button";
import { PortfolioV2Context } from "../../context-manager";

interface NetworkButtonProps {
  extraCss?: string;
}

export const NetworkButton = ({ extraCss, ...props }: NetworkButtonProps) => {
  const {
    setShowNetwork,
    activeNetworks,
    setShowWallet,
    activePortfolio,
    isWalletExplorer,
    activeStep,
  } = useContext(PortfolioV2Context);
  return (
    <div className="flex" {...props}>
      {false && (
        <Button
          extraCss={`${isWalletExplorer ? "mr-0" : "mr-2.5"} z-[2]`}
          disabled
          onClick={() => setShowNetwork(true)}
        >
          {activeNetworks
            ?.filter((entry) => entry !== null)
            .map((blockchain, i) => {
              if (i < 4)
                return (
                  <img
                    className="h-[18px] w-[18px] mr-[-3px] bg-light-bg-hover dark:bg-dark-bg-hover rounded-full"
                    alt={`${blockchain} logo`}
                    src={blockchainsContent[blockchain]?.logo}
                  />
                );
              return null;
            })}
          {activeNetworks?.length > 4 ? (
            <p className="ml-2">
              {activeNetworks?.length !==
              Object.keys(blockchainsContent)?.length
                ? `+${
                    activeNetworks?.filter((entry) => entry !== null)?.length -
                    4
                  }`
                : "  All networks"}
            </p>
          ) : null}
          <BiSolidChevronDown className="ml-[5px] text-sm" />
        </Button>
      )}
    </div>
  );
};
