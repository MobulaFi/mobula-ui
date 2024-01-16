import React, { useEffect, useState } from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { Button } from "../../components/button";
import { SmallFont } from "../../components/fonts";
import { Modal } from "../../components/modal-container";
import { pushData } from "../../lib/mixpanel";

interface FeedBackPopupProps {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export const FeedBackPopup = ({ visible, setVisible }: FeedBackPopupProps) => {
  const [reason, setReason] = useState("");
  const [activeGrade, setActiveGrade] = useState(0);
  const [hoveredGrade, setHoveredGrade] = useState(0);
  const [pushedData, setPushedData] = useState(false);

  const handleMouseEnter = (score: number) => setHoveredGrade(score);
  const handleMouseLeave = () => setHoveredGrade(0);
  const handleClick = (score: number) => {
    if (score === activeGrade) setActiveGrade(0);
    else setActiveGrade(score);
  };

  useEffect(
    () => () => {
      if (activeGrade && !pushedData) {
        pushData("Net Promoter Score Vote", {
          score: activeGrade,
          reason,
        });
      }
    },
    [visible, activeGrade]
  );

  return (
    <Modal
      extraCss="max-w-[410px]"
      isOpen={visible}
      titleCss="mb-2.5"
      title="Help improve Mobula!"
      onClose={() => setVisible(false)}
    >
      <SmallFont>How much would you recommend Mobula to a fren?</SmallFont>
      <div className="flex">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => {
          let IconComponent: JSX.Element;
          if (hoveredGrade ? score <= hoveredGrade : score <= activeGrade) {
            IconComponent = (
              <AiFillStar
                onMouseEnter={() => handleMouseEnter(score)}
                onMouseLeave={handleMouseLeave}
                onClick={() => handleClick(score)}
                className={`text-yellow dark:text-yellow mt-2.5 transition-all duration-200 cursor-pointer text-[35px] lg:text-[31px] md:text-[26px]`}
              />
            );
          } else {
            IconComponent = (
              <AiOutlineStar
                onMouseEnter={() => handleMouseEnter(score)}
                onMouseLeave={handleMouseLeave}
                onClick={() => handleClick(score)}
                className={`text-light-font-60 dark:text-dark-font-60 mt-2.5 transition-all duration-200 cursor-pointer text-[35px] lg:text-[31px] md:text-[26px]`}
              />
            );
          }

          return IconComponent;
        })}
      </div>
      <textarea
        className="mt-5 bg-light-bg-terciary dark:bg-dark-bg-terciary border
               border-light-border-primary dark:border-dark-border-primary rounded
                w-full h-[120px] text-light-font-100 dark:text-dark-font-100"
        placeholder="Details (Optional)"
        onChange={(e) => setReason(e.target.value)}
      />
      <Button
        extraCss="mt-[15px] border-darkblue dark:border-darkblue hover:border-blue hover:dark:border-blue"
        variant="outlined"
        onClick={() => {
          pushData("Net Promoter Score Vote", {
            score: activeGrade,
            reason,
          });
          setPushedData(true);
          setVisible(false);
        }}
      >
        Submit
      </Button>
    </Modal>
  );
};
