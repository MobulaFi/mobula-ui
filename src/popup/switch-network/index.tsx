import { blockchainsIdContent } from "mobula-lite/lib/chains/constants";
import React, { useContext, useEffect } from "react";
import { useNetwork, useSwitchNetwork } from "wagmi";
import { disconnect } from "wagmi/actions";
import { Button } from "../../components/button";
import { SmallFont } from "../../components/fonts";
import { Modal } from "../../components/modal-container";
import { PopupStateContext, PopupUpdateContext } from "../../contexts/popup";
import { useSafeSwitchNetwork } from "../../hooks/network";
import { SwapContext } from "../../layouts/swap";

export const SwitchNetworkPopup = () => {
  const { chain } = useNetwork();
  const { chainNeeded: chainNeededBuffer } = useContext(SwapContext);
  const [error, setError] = React.useState<Error | null>(null);
  const { isLoading, pendingChainId } = useSwitchNetwork();
  const { handleSwitchNetwork } = useSafeSwitchNetwork();
  const { setConnect, setShowSwitchNetwork } = useContext(PopupUpdateContext);
  const { showSwitchNetwork } = useContext(PopupStateContext);
  const chainNeeded =
    typeof showSwitchNetwork === "number"
      ? showSwitchNetwork
      : chainNeededBuffer;
  const blockchain =
    blockchainsIdContent[
      String((showSwitchNetwork as number) || (chainNeededBuffer as number))
    ];

  useEffect(() => {
    if (chain?.id === chainNeeded) setShowSwitchNetwork(false);
  }, [isLoading, pendingChainId, chain]);

  const getNameOfBlockchain = () => {
    if (blockchain?.name === "BNB Smart Chain (BEP20)") return "BNB Chain";
    if (blockchain?.name === "Avalanche C-Chain") return "Avalanche";
    return blockchain?.name;
  };

  const blockchainName = getNameOfBlockchain();

  return (
    <>
      <Modal
        title="Need to Switch!"
        isOpen={!!showSwitchNetwork}
        onClose={() => setShowSwitchNetwork(false)}
        extraCss="max-w-[350px] z-[111]"
      >
        <img
          className="w-[86px] h-[86px] mx-auto rounded-full border-2 border-light-border-primary dark:border-dark-border-primary mt-4"
          src={blockchain?.logo}
          alt={blockchain?.name}
        />
        <SmallFont
          extraCss="mt-5 pt-[15px] border-t border-light-border-primary dark:border-dark-border-primary 
        text-light-font-60 dark:text-dark-font-60 text-center w-[80%] mx-auto"
        >
          {error
            ? error.toString()
            : `Please ${
                !chain ? "connect your wallet and " : ""
              } switch your network to ${blockchain?.name} to continue`}
        </SmallFont>
        <div className="flex flex-col w-full">
          <button
            className="text-light-font-100 dark:text-dark-font-100 text-center mt-[15px] text-sm md:text-xs w-full flex items-center justify-center
             border border-darkblue hover:border-blue transition-all duration-200 ease-in-out h-[35px] md:h-[30px] rounded"
            onClick={async () => {
              if (!chain) {
                setConnect(true);
                return;
              }
              const result = await handleSwitchNetwork(blockchain.name);
              if (result && "error" in result) {
                setError(result?.error);
                setShowSwitchNetwork(false);
              }
            }}
          >
            {chain ? `Switch to ${blockchainName}` : "Connect Wallet"}
          </button>
          <Button
            className="text-light-font-100 dark:text-dark-font-100 text-center mt-2.5 
           text-sm md:text-xs w-full flex items-center justify-center bg-light-bg-terciary dark:bg-dark-bg-terciary
            border border-light-border-primary dark:border-dark-border-primary rounded-md hover:bg-light-bg-hover hover:dark:bg-dark-bg-hover
             transition-all duration-200 ease-in-out h-[35px] md:h-[30px]"
            onClick={() => {
              setShowSwitchNetwork(false);
              disconnect();
            }}
          >
            Disconnect
          </Button>
        </div>
      </Modal>
    </>
  );
};
