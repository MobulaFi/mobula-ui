import { usePathname, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { useContractWrite, useNetwork, useSwitchNetwork } from "wagmi";
import { PROTOCOL_ADDRESS } from "../../../../constants";
import { PopupUpdateContext } from "../../../../contexts/popup";
import { triggerAlert } from "../../../../lib/toastify";
import { handleViewError } from "../../../../utils/error";
import { listingAbi } from "../../../misc/listing-form/constant";
import { SortContext } from "../context-manager";
import { TokenDivs } from "../models";

export const useVote = () => {
  const { isFirstSort, votes, setVotes } = useContext(SortContext);
  const { setConnect } = useContext(PopupUpdateContext);
  const { switchNetwork } = useSwitchNetwork();
  const { chain } = useNetwork();
  const router = useRouter();
  const [tokenID, setTokenID] = useState(0);
  const pathname = usePathname();

  const { isSuccess, error, write } = useContractWrite<any, any, any>({
    address: PROTOCOL_ADDRESS as never,
    abi: listingAbi as never,
    functionName: pathname.includes("validation")
      ? "voteValidation"
      : "voteSorting",
  });

  useEffect(() => {
    const endingVoteFunction = async () => {
      if (isSuccess) {
        localStorage.setItem(
          isFirstSort ? "votes" : "votesFinal",
          JSON.stringify([...votes, Number(tokenID)])
        );
        setVotes([...votes, tokenID]);
        triggerAlert("Success", "Your vote has been successfully registered.");
        await new Promise((resolve) => setTimeout(resolve, 3000));
        router.refresh();
      } else if (error) {
        triggerAlert(
          "Error",
          `Something went wrong, are you sure you are in the DAO?Error: ${error}`
        );
      }
    };
    endingVoteFunction();
  }, [isSuccess, error]);

  async function voteToken(
    token: TokenDivs,
    validate: number,
    utilityScore: number,
    socialScore: number,
    trustScore: number
  ) {
    setTokenID(token.id);
    if (token.lastUpdate + 5 * 60 > Date.now() / 1000) {
      triggerAlert("Error", "You must wait the end of the countdown to vote.");
      return; // DELETE WHEN REPLACE ALERT
    } else {
      if (!chain) {
        setConnect(true);
        return;
      }
      if (chain?.id !== 137) {
        if (switchNetwork) switchNetwork(137);
        else
          triggerAlert(
            "Error",
            "Please connect your wallet to the Polygon network."
          );
        return;
      }
      try {
        write({
          args: [token.voteId, validate, utilityScore, socialScore, trustScore],
        });
        if (isSuccess) triggerAlert("Success", "Your vote has been submited");
      } catch (e) {
        handleViewError(e, alert);
      }
    }
  }
  return voteToken;
};
