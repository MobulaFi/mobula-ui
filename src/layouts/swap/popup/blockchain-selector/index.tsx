import { blockchainsContent } from "mobula-lite/lib/chains/constants";
import { BlockchainName, BlockchainParams } from "mobula-lite/lib/model";
import React, { Key, useContext } from "react";
import { useNetwork } from "wagmi";
import { SwapContext } from "../..";
import { SmallFont } from "../../../../components/fonts";
import { ModalContainer } from "../../../../components/modal-container";
import { PopupUpdateContext } from "../../../../contexts/popup";

interface BlockchainSelectorProps {
  setShowBlockchainSelector: React.Dispatch<React.SetStateAction<boolean>>;
  showBlockchainSelector: boolean;
  isFrom: boolean;
}

export const BlockchainSelector = ({
  showBlockchainSelector,
  setShowBlockchainSelector,
  isFrom,
  ...props
}: BlockchainSelectorProps) => {
  const { tokenIn, setChainNeeded, chainNeeded } = useContext(SwapContext);
  const { chain } = useNetwork();
  const { setShowSwitchNetwork } = useContext(PopupUpdateContext);
  let blockchains: (string | undefined)[] | undefined = [];

  if (isFrom) blockchains = tokenIn?.blockchains ?? [tokenIn?.blockchain];

  return (
    <ModalContainer
      title="Select a chain"
      isOpen={showBlockchainSelector}
      onClose={() => setShowBlockchainSelector(false)}
      extraCss="max-w-[450px]"
    >
      <div className="flex flex-wrap flex-col" {...props}>
        <div className="flex flex-wrap">
          {blockchains?.map((entry, i) => {
            const blockchain: BlockchainParams =
              blockchainsContent[entry as BlockchainName];
            if (blockchain === undefined) return null;
            return (
              <div
                className={`flex items-center mr-2.5 mt-2.5 px-[7.5px] py-[5px] h-[30px] rounded-lg w-fit bg-light-bg-terciary
                 dark:bg-dark-bg-terciary border border-light-border-primary dark:border-dark-border-primary
                  cursor-pointer hover:border-light-border-secondary dark:hover:border-dark-border-secondary transition-all duration-200 ${
                    isFrom ? "cursor-pointer" : "cursor-not-allowed"
                  }`}
                key={(entry || i) as Key}
                onClick={async () => {
                  setShowBlockchainSelector((prev) => !prev);
                  if (chain?.id !== blockchain.chainId) {
                    setShowSwitchNetwork(blockchain.chainId);
                  } else if (chainNeeded) {
                    setChainNeeded(undefined);
                  }
                }}
              >
                <img
                  src={blockchain.logo || "/empty/unknown.png"}
                  alt={blockchain.name}
                  className="w-[17px] h-[17px] md:h-[14px] md:w-[14px] rounded-full mr-[7.5px]"
                />
                <SmallFont
                  className={`ml-[7.55px] transition-all ${
                    isFrom ? "opacity-100" : "opacity-20"
                  } font-medium`}
                >
                  {entry}
                </SmallFont>
              </div>
            );
          })}
        </div>
      </div>
    </ModalContainer>
  );
};
