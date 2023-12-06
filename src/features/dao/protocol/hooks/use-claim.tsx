import { useContext } from "react";
import { useNetwork, useSwitchNetwork } from "wagmi";
import { writeContract } from "wagmi/actions";
import { VAULT_ADDRESS } from "../../../../constants";
import { PopupUpdateContext } from "../../../../contexts/popup";
import { handleEthersError } from "../../../../utils/error";

export const useClaim = () => {
  // const alert = useAlert();
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
  const { setConnect } = useContext(PopupUpdateContext);

  const claim = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!chain) {
      setConnect(true);
      return;
    }
    if (chain?.id !== 137) {
      if (switchNetwork) switchNetwork(137);
      // else alert.error("Please connect your wallet to the Polygon network.");
      return;
    }
    try {
      await writeContract({
        address: VAULT_ADDRESS as never,
        abi: [
          {
            inputs: [],
            outputs: [],
            name: "claim",
            type: "function",
            stateMutability: "nonpayable",
          },
        ] as never,
        functionName: "claim" as never,
      });
      // alert.success("Successfully claimed 1 MATIC.");
    } catch (err) {
      handleEthersError(err, alert);
    }
  };

  return claim;
};
