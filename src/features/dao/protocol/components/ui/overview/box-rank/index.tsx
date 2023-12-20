import { OverviewContext } from "features/dao/protocol/context-manager/overview";
import { useContext } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { BsCheckLg } from "react-icons/bs";
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";
import { writeContract } from "wagmi/actions";
import { Button } from "../../../../../../../components/button";
import { MediumFont, SmallFont } from "../../../../../../../components/fonts";
import { TitleContainer } from "../../../../../../../components/title";
import { PROTOCOL_ADDRESS } from "../../../../../../../constants";
import { PopupUpdateContext } from "../../../../../../../contexts/popup";
import { triggerAlert } from "../../../../../../../lib/toastify";
import { BoxContainer } from "../../../../../common/components/box-container";
import { BoxTime } from "../../../../../common/components/box-time";

interface RankBoxProps {
  goodChoice: number;
  badChoice: number;
}

export const RankBox = ({ goodChoice, badChoice }: RankBoxProps) => {
  const { setConnect } = useContext(PopupUpdateContext);
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();
  const { setTokensOwed, tokensOwed } = useContext(OverviewContext);
  const { address } = useAccount();

  const handleClaim = async (e: {
    preventDefault: () => void;
  }): Promise<void> => {
    e.preventDefault();
    if (!chain) {
      setConnect(true);
      return;
    }
    if (chain?.id !== 137) {
      if (switchNetwork) {
        switchNetwork(137);
      } else {
        triggerAlert(
          "Error",
          "Please connect your wallet to the Polygon network."
        );
      }
      return;
    }
    try {
      await writeContract({
        address: PROTOCOL_ADDRESS,
        abi: [
          {
            inputs: [
              { internalType: "address", name: "user", type: "address" },
            ],
            name: "claimRewards",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
        ],
        functionName: "claimRewards",
        args: [address],
      });
      triggerAlert("Success", "You successfully claimed your rewards.");
      setTokensOwed(0);
    } catch (error) {
      if (error?.details?.includes("User denied")) {
        triggerAlert("Error", "You rejected the transaction.");
      } else triggerAlert("Error", "You don't have anything to claim.");
    }
  };

  return (
    <BoxContainer extraCss="mb-5 md:mb-2.5 w-full">
      <TitleContainer extraCss="px-[15px] md:px-[5px]">
        <MediumFont extraCss="md:px-2.5">Overview</MediumFont>
      </TitleContainer>
      <div
        className="p-5 flex items-center sm:items-start justify-between flex-row sm:flex-col mb-5 
      md:mb-0 text-light-font-100 dark:text-dark-font-100"
      >
        <div
          className="w-[45%] md:w-[66%] sm:w-full flex justify-between text-light-font-100
         dark:text-dark-font-100 sm:mb-5 mb-0"
        >
          <div className="w-auto sm:w-full mr-5">
            <div className="mb-[15px] flex items-center">
              <BsCheckLg className="mr-[7.5px] text-green dark:text-green" />
              <SmallFont extraCss="whitespace-nowrap">
                Correct Decisions
              </SmallFont>
            </div>
            <BoxTime>{goodChoice}</BoxTime>
          </div>
          <div className="w-auto sm:w-full mr-5">
            <div className="flex text-sm lg:text-[13px] md:text-xs items-center mb-[15px]">
              <AiOutlineClose className="mr-[7.5px] h-full my-auto text-red dark:text-red" />
              <SmallFont extraCss="whitespace-nowrap">
                Wrong Decisions
              </SmallFont>
            </div>
            <BoxTime>{badChoice}</BoxTime>
          </div>
        </div>
        <div className="w-auto sm:w-full block sm:hidden mr-5 md:mr-0">
          <SmallFont extraCss="whitespace-nowrap mb-[15px]">
            Mobula owes you
          </SmallFont>
          <div className="flex items-center">
            <BoxTime>{tokensOwed || 0}</BoxTime>
            <SmallFont extraCss="ml-2.5">MOBL</SmallFont>
          </div>
        </div>
        <div className="mb-[15px] hidden sm:flex items-center">
          <SmallFont>Mobula owes you {tokensOwed || 0} MOBL</SmallFont>
        </div>
        <div className="flex md:hidden w-[15%] lg:w-full max-w-[230px]">
          <Button
            extraCss={`${
              tokensOwed && tokensOwed > 0
                ? "border-darkblue dark:border-darkblue hover:border-blue hover:dark:border-blue"
                : "border-light-border-primary dark:border-dark-border-primary"
            } h-[30px] w-full`}
            onClick={(e) => handleClaim(e)}
          >
            Claim
          </Button>
        </div>
      </div>
      <div className="md:flex hidden w-full max-w-[230px] p-5 -mt-[40px] sm:mt-[-40px] md:mt-[-20px]">
        <Button
          extraCss={`${
            tokensOwed && tokensOwed > 0
              ? "border-darkblue dark:border-darkblue hover:border-blue hover:dark:border-blue"
              : "border-light-border-primary dark:border-dark-border-primary"
          } h-[30px] w-full`}
          onClick={(e) => handleClaim(e)}
        >
          Claim
        </Button>
      </div>
    </BoxContainer>
  );
};
