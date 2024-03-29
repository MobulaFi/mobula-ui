import { blockchainsContent } from "mobula-lite/lib/chains/constants";
import { BlockchainName } from "mobula-lite/lib/model";
import { useEffect, useRef } from "react";
import { createWalletClient, custom } from "viem";
import { Chain, mainnet, useNetwork, useSwitchNetwork } from "wagmi";
import { triggerAlert } from "../lib/toastify";
import { idToWagmiChain } from "../utils/chains";

export const useSafeSwitchNetwork = () => {
  const { switchNetworkAsync } = useSwitchNetwork();
  const { chain } = useNetwork();
  const chainRef = useRef<Chain>();

  useEffect(() => {
    chainRef.current = chain;
  }, [chain]);

  const handleSwitchNetwork = async (blockchain: BlockchainName) => {
    let switched = false;
    if (switchNetworkAsync && blockchainsContent[blockchain]) {
      try {
        await new Promise((resolve, reject) => {
          switchNetworkAsync(
            blockchainsContent?.[blockchain as string]?.evmChainId as number
          )
            .catch((e) => {
              reject(e);
            })
            .then(() => {
              resolve(null);
            });

          let i = 0;
          const interval = setInterval(() => {
            i += 1;
            if (
              chainRef.current?.id ===
              (blockchainsContent[blockchain].evmChainId || 0)
            ) {
              resolve(null);
              clearInterval(interval);
            }

            if (i >= 10) {
              reject(new Error("Timeout"));
              clearInterval(interval);
            }
          }, 500);
        });
        switched = true;
      } catch (e: any) {
        console.error(e);
        if (e.message === "User denied account authorization") {
          triggerAlert("Error", "Please authorize the switch of network.");
        } else if (e.message?.includes("not configured")) {
          let added = false;
          // Tries to add the network to the wallet
          if (typeof (window as any)?.ethereum !== "undefined") {
            try {
              const client = createWalletClient({
                chain: mainnet,
                transport: custom((window as any).ethereum as any),
              });
              const wishedBlockchain = Object.values(idToWagmiChain).find(
                (entry) =>
                  entry.id === (blockchainsContent[blockchain].evmChainId || 0)
              );

              client.addChain({
                chain: wishedBlockchain as any,
              });
              added = true;
            } catch (error) {
              console.error(error);
            }
          }

          if (!added)
            triggerAlert("Error", "You must add this network to your wallet.");
        } else {
          triggerAlert(
            "Error",
            "Something went wrong. Please try again later."
          );
          return {
            error: e,
          };
        }
      }
    } else if (switchNetworkAsync) {
      triggerAlert(
        "Warning",
        `${blockchain} is not supported on the aggregator.. yet.`
      );
    } else if (chain) {
      triggerAlert("Warning", `You must switch to ${blockchain}`);
    } else {
      triggerAlert("Warning", "You must connect a wallet to switch networks.");
    }

    return { success: switched };
  };

  return { handleSwitchNetwork };
};
