import React, { Dispatch, SetStateAction, useContext, useState } from "react";
import { Modal } from "../../../../../components/modal-container";
import { ShowReasonContext } from "../../context-manager/reason-vote";
import { VoteContext } from "../../context-manager/vote";
import { possibilities } from "./constant";
import { Lines } from "./lines";

interface ReasonVoteProps {
  type: string;
  setReason: Dispatch<SetStateAction<number>>;
  reason: number;
}

export const ReasonVote = ({ type, setReason, reason }: ReasonVoteProps) => {
  const [invisible, setInvisible] = useState(false);
  const showContext = useContext(ShowReasonContext);
  const voteContext = useContext(VoteContext);
  const { [`${type.toLowerCase()}Score`]: score } = voteContext;
  const { [`setShow${type}`]: setShowType } = showContext;
  const texts = possibilities[type]?.[score - 1 || 0];

  const getColor = () => {
    if (score === 3) return "text-yellow dark:text-yellow";
    if (score > 3) return "text-green dark:text-green";
    return "text-red dark:text-red";
  };
  const color = getColor();

  return (
    <Modal
      isOpen={!invisible}
      onClose={() => setShowType(false)}
      extraCss="max-w-[420px]"
      title={
        type !== "Reject" ? (
          <span>
            Why this {type} Score ? ({<span className={color}>{score}/5</span>})
          </span>
        ) : (
          "Why are you rejecting?"
        )
      }
    >
      {texts.map((entry: { code: string; name: string }, idx: number) => (
        <Lines
          key={entry.code}
          texts={entry}
          idx={idx}
          setReason={setReason}
          reason={reason}
        />
      ))}
      <button
        className="w-full py-2 rounded-md text-xs text-light-font-100 dark:text-dark-font-100 
      border border-darkblue dark:border-darblue hover:border-blue hover:dark:border-blue 
      transition-all duration-200"
        onClick={() => {
          if (reason !== 0) setInvisible(true);
        }}
      >
        OK
      </button>
    </Modal>
  );
};
