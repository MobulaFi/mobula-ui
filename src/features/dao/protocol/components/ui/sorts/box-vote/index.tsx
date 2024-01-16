import React, { useContext } from "react";
import { AiOutlineEye } from "react-icons/ai";
import { MediumFont } from "../../../../../../../components/fonts";
import { getScores } from "../../../../constants/sorts";
import { ShowReasonContext } from "../../../../context-manager/reason-vote";
import { VoteContext } from "../../../../context-manager/vote";
import { TokenDivs } from "../../../../models";
import { ButtonVote } from "../button-vote";
import { Countdown } from "../countdown";

interface VoteBoxProps {
  token: TokenDivs;
  typeVote: string;
}

export const VoteBox = ({ typeVote, token }: VoteBoxProps) => {
  const scores = getScores();
  const grades = [1, 2, 3, 4, 5];
  const { setShowUtility, setShowSocial, setShowTrust } =
    useContext(ShowReasonContext);
  const context = useContext(VoteContext);

  const getColorFromGrad = (bad: boolean, good: boolean, neutral: boolean) => {
    if (bad) return "text-red dark:text-red";
    if (good) return "text-green dark:text-green";
    if (neutral) return "text-yellow dark:text-yellow";
    return "text-light-font-100 dark:text-dark-font-100";
  };

  const getBorderFromGrad = (bad: boolean, good: boolean, neutral: boolean) => {
    if (bad) return "border border-red dark:border-red";
    if (good) return "border border-green dark:border-green";
    if (neutral) return "border border-yellow dark:border-yellow";
    return "";
  };

  const bar = (score: number) => {
    switch (score) {
      case 0:
        return 0;
      case 1:
        return 0;
      case 2:
        return 25;
      case 3:
        return 48;
      case 4:
        return 68;
      case 5:
        return 88;
      default:
        return 0;
    }
  };

  return (
    <div
      className={`flex flex-col rounded-2xl sm:rounded-0 bg-light-bg-secondary dark:bg-dark-bg-secondary w-full
    border border-light-border-primary dark:border-dark-border-primary ${
      typeVote ? "mt-2.5" : ""
    } ${token.alreadyVoted ? "opacity-50" : "opacity-100"}`}
    >
      <Countdown token={token} />
      <div className="flex flex-col py-[5px]">
        {scores.map((entry) => {
          const {
            [`${entry.title.toLowerCase()}Score`]: score,
            [`set${entry.title}Score`]: setScore,
          } = context;
          return (
            <div
              key={entry.title}
              className="flex items-center py-[15px] px-5 lg:px-[15px] md:p-2.5"
            >
              <MediumFont extraCss="w-[100px]">{entry.title}</MediumFont>
              <div className="flex w-full justify-between items-center relative pl-5">
                <div
                  className="flex absolute top-[3px] left-5 rounded-md h-[30px] text-light-font-100 
                dark:text-dark-font-100 bg-light-bg-hover dark:bg-dark-bg-hover transition-all duration-200"
                  style={{
                    width: `${bar(score)}%`,
                  }}
                />
                {grades.map((grade) => {
                  const badNote = score === grade && score < 3;
                  const goodNote = score === grade && score > 3;
                  const neutralNote = score === grade;
                  return (
                    <button
                      key={grade}
                      className={`flex items-center w-[70px] justify-center transition-all duration-200 rounded-xl h-[34px] relative z-[2]
                      ${
                        score === grade
                          ? "bg-light-bg-hover dark:bg-dark-bg-hover"
                          : ""
                      } ${getBorderFromGrad(
                        badNote,
                        goodNote,
                        neutralNote
                      )} ${getColorFromGrad(badNote, goodNote, neutralNote)}`}
                      onClick={() => {
                        setScore(grade);
                        if (grade) {
                          setTimeout(() => {
                            switch (entry.title) {
                              case "Utility":
                                setShowUtility(true);
                                return;
                              case "Social":
                                setShowSocial(true);
                                return;
                              case "Trust":
                                setShowTrust(true);
                            }
                          }, 300);
                        }
                      }}
                    >
                      <div className="flex justify-around w-[70%] items-center text-sm lg:text-[13px] md:text-xs">
                        {grade}
                        {typeVote === "review" && (
                          <AiOutlineEye className="text-light-font-60 dark:text-dark-font-60 ml-[5px]" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      <div className="pb-5 px-5 flex flex-col mt-2.5">
        <ButtonVote token={token} />
      </div>
    </div>
  );
};
