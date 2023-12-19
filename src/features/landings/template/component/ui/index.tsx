import React, { useContext } from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import { Button } from "../../../../../components/button";
import { Title } from "../../../../../components/fonts";
import { PopupUpdateContext } from "../../../../../contexts/popup";

interface WatchlistProps {
  isMobile?: boolean;
  isBoth?: boolean;
  textButton: string;
  onClick?: () => void;
}

export const WatchlistButton = ({
  isMobile,
  isBoth,
  textButton,
  ...props
}: WatchlistProps) => {
  const { setConnect } = useContext(PopupUpdateContext);

  // Can be undefined on IntroductionContainer component, need
  // to delete if so, to avoid overriding onClick
  if (props && !props.onClick) delete props.onClick;

  return (
    <Button
      extraCss={`w-[175px] md:w-[150px] ${isMobile ? "hidden" : "flex"} ${
        isMobile || isBoth ? "md:flex" : "hidden"
      }`}
      onClick={() => {
        setConnect(true);
      }}
      {...props}
    >
      {textButton}
    </Button>
  );
};

export const ListContainer = ({
  onClick,
  lists,
  title,
  isLast,
}: {
  onClick?: () => void;
  lists: string[];
  title: string;
  isLast?: boolean;
}) => {
  const { setConnect } = useContext(PopupUpdateContext);
  return (
    <div
      className={`${
        isLast ? "lg:mt-2.5" : ""
      } rounded-lg border border-light-border-primary dark:border-dark-border-primary flex flex-col w-[49%] lg:w-full`}
    >
      <Title title={title} subtitle="" extraCss="" />
      <div className="p-5 md:px-[15px] flex flex-col h-full">
        {/* <UnorderedList color={text60}>
          {lists.map((entry, i) => (
            <ListItem
              fontSize="14px"
              mb={i === entry.length - 1 ? "20px" : "15px"}
            >
              {entry}
            </ListItem>
          ))}
        </UnorderedList> */}
        <Button
          extraCss="mt-auto max-w-[200px] rounded-lg h-[40px] m:h-[35px] "
          onClick={onClick}
        >
          <div className="flex w-full justify-between px-[15px] items-center text-light-font-100 dark:text-font-100 text-sm lg:text-[13px]">
            Connect to Mobula
            <FaArrowRightLong className="text-xs" />
          </div>
        </Button>
      </div>
    </div>
  );
};
