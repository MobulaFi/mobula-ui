import { blockchainsContent } from "mobula-lite/lib/chains/constants";
import { BlockchainName } from "mobula-lite/lib/model";
import { useEffect, useRef } from "react";
// import { useAlert } from "react-alert";
import { createWalletClient, custom } from "viem";
import { Chain, mainnet, useNetwork, useSwitchNetwork } from "wagmi";
import { idToWagmiChain } from "../utils/chains";

export const useSafeSwitchNetwork = () => {
  const { switchNetworkAsync } = useSwitchNetwork();
  const { chain } = useNetwork();
  const chainRef = useRef<Chain>();
  //   const alert = useAlert();

  useEffect(() => {
    chainRef.current = chain;
  }, [chain]);

  const handleSwitchNetwork = async (blockchain: BlockchainName) => {
    let switched = false;
    if (switchNetworkAsync && blockchainsContent[blockchain]) {
      try {
        await new Promise((resolve, reject) => {
          switchNetworkAsync(blockchainsContent[blockchain].chainId)
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
              chainRef.current?.id === blockchainsContent[blockchain].chainId
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
      } catch (e) {
        console.error(e);
        // if (e.message === "User denied account authorization") {
        //   alert.error("Please authorize the switch of network.");
        // } else
        if (e.message?.includes("not configured")) {
          let added = false;
          // Tries to add the network to the wallet
          if (typeof window.ethereum !== "undefined") {
            try {
              const client = createWalletClient({
                chain: mainnet,
                transport: custom(window.ethereum as any),
              });
              const wishedBlockchain = Object.values(idToWagmiChain).find(
                (entry) => entry.id === blockchainsContent[blockchain].chainId
              );

              client.addChain({
                chain: wishedBlockchain,
              });
              added = true;
            } catch (error) {
              console.error(error);
            }
          }

          //   if (!added) alert.error("You must add this network to your wallet.");
        } else {
          //   alert.error("Something went wrong... Please retry.");
          return {
            error: e,
          };
        }
      }
    }
    // else if (switchNetworkAsync) {
    //   alert.error(`${blockchain} is not supported on the aggregator.. yet.`);
    // } else if (chain) {
    //   alert.error(`You must switch to ${blockchain}`);
    // } else {
    //   alert.error("You must connect a wallet to switch networks.");
    // }

    return { success: switched };
  };

  return { handleSwitchNetwork };
};
