import React, { useContext, useState } from "react";
import { AiOutlineWarning } from "react-icons/ai";
import { BsCheckLg } from "react-icons/bs";
import { triggerAlert } from "../../../../../../../lib/toastify";
import { ButtonOutlined } from "../../../../../common/components/button-outlined";
import { ReasonVoteContext } from "../../../../context-manager/reason-vote";
import { VoteContext } from "../../../../context-manager/vote";
import { useVote } from "../../../../hooks/use-vote";
import { TokenDivs } from "../../../../models";

interface ButtonVoteProps {
  token: TokenDivs;
}

export const ButtonVote = ({ token }: ButtonVoteProps) => {
  const vote = useContext(VoteContext);
  const { reasonSocial, reasonTrust, reasonUtility } =
    useContext(ReasonVoteContext);
  const hasVoted = reasonSocial && reasonTrust && reasonUtility !== 0;
  const voteToken = useVote();
  const [isAbleToSubmit, setIsAbleToSubmit] = useState(false);
  const buttonOutlined =
    "w-full flex items-center justify-center h-[42px] lg:h-[40px] md:h-[35px] max-w-full text-light-font-100 dark:text-dark-font-100 rounded-md text-sm lg:text-[13px] md:text-xs border";

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center mb-[15px]">
        <div className="flex items-center mr-2.5">
          <AiOutlineWarning className="text-yellow dark:text-yellow mr-[7.5px]" />
          <p className="font-normal text-light-font-80 dark:text-dark-font-80 text-xs md:text-[10px]">
            I correctly checked if every single information is valid. I&apos;m
            aware of the consequences if I made a mistake
          </p>
        </div>
        <button
          className="ml-auto w-[15px] h-[15px] min-w-[15px] -mt-0.5 hover:bg-inherit hover:dark:bg-inherit
           border-light-border-secondary dark:border-dark-border-secondary bg-light-bg-hover 
           dark:bg-dark-bg-hover rounded"
          onClick={() => setIsAbleToSubmit((prev) => !prev)}
        >
          {isAbleToSubmit ? (
            <BsCheckLg className="ml-[1px] mb-[1px] text-xs z-[1] text-light-font-100 dark:text-dark-font-100" />
          ) : null}
        </button>
      </div>
      <div className="flex w-full">
        <button
          className={`${buttonOutlined} ${
            token.alreadyVoted
              ? "border-light-border-secondary dark:border-dark-border-secondary"
              : "border-green dark:border-green"
          } mr-1.5`}
          onClick={() => {
            if (isAbleToSubmit) {
              if (hasVoted || !token.isListing) {
                const { utilityScore, socialScore, trustScore } = vote;
                voteToken(token, 0, utilityScore, socialScore, trustScore);
              } else {
                triggerAlert(
                  "Error",
                  "You must select a reason for the score you assign to this asset."
                );
              }
            } else {
              triggerAlert(
                "Error",
                "You must check the box to submit your vote."
              );
            }
          }}
        >
          Validate Listing
        </button>
        <ButtonOutlined
          className={`${buttonOutlined} ${
            token.alreadyVoted
              ? "border-light-border-secondary dark:border-dark-border-secondary"
              : "border-red dark:border-red"
          } ml-1`}
          onClick={() => {
            if (isAbleToSubmit) {
              const { utilityScore, socialScore, trustScore } = vote;
              voteToken(token, 1, utilityScore, socialScore, trustScore);
            }
          }}
        >
          Reject Listing
        </ButtonOutlined>
      </div>
    </div>
  );
};
