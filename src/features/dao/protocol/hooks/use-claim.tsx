import {useContext} from "react";
import {useAlert} from "react-alert";
import {useNetwork, useSwitchNetwork} from "wagmi";
import {writeContract} from "wagmi/actions";
import {VAULT_ADDRESS} from "../../../../../utils/constants";
import {PopupUpdateContext} from "../../../../common/context-manager/popup";
import {handleEthersError} from "../../../../common/utils/error";

export const useClaim = () => {
  const alert = useAlert();
  const {chain} = useNetwork();
  const {switchNetwork} = useSwitchNetwork();
  const {setConnect} = useContext(PopupUpdateContext);

  const claim = async (e: {preventDefault: () => void}) => {
    e.preventDefault();
    if (!chain) {
      setConnect(true);
      return;
    }
    if (chain?.id !== 137) {
      if (switchNetwork) switchNetwork(137);
      else alert.error("Please connect your wallet to the Polygon network.");
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
      alert.success("Successfully claimed 1 MATIC.");
    } catch (err) {
      console.log(err);
      handleEthersError(err, alert);
    }
  };

  return claim;
};
