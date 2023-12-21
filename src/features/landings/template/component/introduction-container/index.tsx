import React from "react";
import { LargeFont, MediumFont } from "../../../../../components/fonts";
import { WatchlistButton } from "../ui";

interface IntroductionContainerProps {
  textButton: string;
  logo: string;
  title: string;
  description: string;
  onClick?: () => void;
}

export const IntroductionContainer = ({
  textButton,
  logo,
  title,
  description,
  onClick,
}: IntroductionContainerProps) => (
  <div className="flex md:flex-col mt-5 md:mt-0">
    <div className="flex flex-col w-[50%] md:w-full mt-[45px] md:mt-0">
      <LargeFont>{title}</LargeFont>
      <MediumFont extraCss="mt-2.5 md:mt-[5px] max-w-[470px] mb-[60] md:mb-0">
        {description}
      </MediumFont>
      <WatchlistButton textButton={textButton} onClick={onClick} />
    </div>
    <img className="my-5 w-[50%] md:w-full ml-5 md:ml-0" src={logo} />
    <WatchlistButton isMobile textButton={textButton} onClick={onClick} />
  </div>
);
