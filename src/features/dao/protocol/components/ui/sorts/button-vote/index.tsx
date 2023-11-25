import { useContext, useState } from "react";
// import {useAlert} from "react-alert";
import React from "react";
import { AiOutlineWarning } from "react-icons/ai";
import { BsCheckLg } from "react-icons/bs";
import { Button } from "../../../../../../../components/button";
import { ExtraSmallFont } from "../../../../../../../components/fonts";
import { Asset } from "../../../../../../../interfaces/assets";
import { ButtonOutlined } from "../../../../../common/components/button-outlined";
import { ReasonVoteContext } from "../../../../context-manager/reason-vote";
import { VoteContext } from "../../../../context-manager/vote";
import { useVote } from "../../../../hooks/use-vote";

interface ButtonVoteProps {
  token: Asset;
}

export const ButtonVote = ({ token }: ButtonVoteProps) => {
  const vote = useContext(VoteContext);
  const { reasonSocial, reasonTrust, reasonUtility } =
    useContext(ReasonVoteContext);
  // const alert = useAlert();
  const hasVoted = reasonSocial && reasonTrust && reasonUtility !== 0;
  const voteToken = useVote();
  const [isAbleToSubmit, setIsAbleToSubmit] = useState(false);

  const buttonOutlined =
    "w-full flex items-center justify-center h-[42px] lg:h-[40px] md:h-[35px] max-w-full text-light-font-100 dark:text-dark-font-100 rounded text-sm lg:text-[13px] md:text-xs mr-[5px] border";

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center mb-[15px]">
        <div className="flex items-center mr-2.5">
          <AiOutlineWarning className="text-yellow dark:text-yellow mr-[5px]" />
          <ExtraSmallFont>
            I correctly checked if every single information is valid. I&apos;m
            aware of the consequences if I made a mistake
          </ExtraSmallFont>
        </div>
        <Button
          extraCss="ml-auto w-[15px] h-[15px] min-w-[15px] -mt-0.5 bg-inherit dark:bg-inherit 
        hover:bg-inherit hover:dark:bg-inherit border-light-border-secondary dark:border-dark-border-secondary"
          onClick={() => setIsAbleToSubmit((prev) => !prev)}
        >
          {isAbleToSubmit ? (
            <BsCheckLg className="ml-[1px] mb-[1px] text-[8px]" />
          ) : null}
        </Button>
      </div>
      <div className="flex w-full">
        <button
          className={`${buttonOutlined} ${
            token.alreadyVoted
              ? "border-light-border-secondary dark:border-dark-border-secondary"
              : "border-green dark:border-green"
          }`}
          onClick={() => {
            if (isAbleToSubmit) {
              if (hasVoted || !token.isListing) {
                const { utilityScore, socialScore, trustScore } = vote;
                voteToken(
                  token as any,
                  0,
                  utilityScore,
                  socialScore,
                  trustScore
                );
              }
              // else {
              //   alert.error(
              //     "You must select a reason for the score you assign to this asset."
              //   );
              // }
            }
            // else {
            //   alert.error("You must check the box to submit your vote.");
            // }
          }}
        >
          Validate Listing
        </button>
        <ButtonOutlined
          className={`${buttonOutlined} ${
            token.alreadyVoted
              ? "border-light-border-secondary dark:border-dark-border-secondary"
              : "border-red dark:border-red"
          }`}
          onClick={() => {
            if (isAbleToSubmit) {
              const { utilityScore, socialScore, trustScore } = vote;
              voteToken(token as any, 1, utilityScore, socialScore, trustScore);
            }
          }}
        >
          Reject Listing
        </ButtonOutlined>
      </div>
    </div>
  );
};
