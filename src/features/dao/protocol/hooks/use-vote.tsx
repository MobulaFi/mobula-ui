import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
// import {useAlert} from "react-alert";
import { useContractWrite, useNetwork, useSwitchNetwork } from "wagmi";
import { PROTOCOL_ADDRESS } from "../../../../constants";
import { PopupUpdateContext } from "../../../../contexts/popup";
import { handleViewError } from "../../../../utils/error";
import { listingAbi } from "../../../misc/listing-form/constant";
import { SortContext } from "../context-manager";
import { TokenDivs } from "../models";

export const useVote = () => {
  const { isFirstSort, votes, setVotes } = useContext(SortContext);
  const { setConnect } = useContext(PopupUpdateContext);
  const { switchNetwork } = useSwitchNetwork();
  const { chain } = useNetwork();
  // const alert = useAlert();
  const router = useRouter();
  const [tokenID, setTokenID] = useState(0);

  const { isSuccess, error, write } = useContractWrite<any, any, any>({
    address: PROTOCOL_ADDRESS as never,
    abi: listingAbi as never,
    functionName: router.pathname.includes("validation")
      ? ("voteValidation" as never)
      : ("voteSorting" as never),
  });

  useEffect(() => {
    const endingVoteFunction = async () => {
      if (isSuccess) {
        localStorage.setItem(
          isFirstSort ? "votes" : "votesFinal",
          JSON.stringify([...votes, Number(tokenID)])
        );
        setVotes([...votes, tokenID]);
        // alert.success("Your vote has been successfully registered.");
        // eslint-disable-next-line no-promise-executor-return
        await new Promise((resolve) => setTimeout(resolve, 3000));
        router.reload();
      } else if (error) {
        console.error(error);
        // alert.error(
        //   `Something went wrong, are you sure you are in the DAO?Error: ${error}`
        // );
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
      // alert.error("You must wait the end of the countdown to vote.");
    } else {
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
        write({
          args: [token.voteId, validate, utilityScore, socialScore, trustScore],
        });
        // if (isSuccess) alert.success("Your vote has been submited");
      } catch (e) {
        handleViewError(e, alert);
      }
    }
  }
  return voteToken;
};
