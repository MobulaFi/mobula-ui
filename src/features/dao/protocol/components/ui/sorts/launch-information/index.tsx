import React, { useEffect, useState } from "react";
import { SiConvertio } from "react-icons/si";
import { MediumFont, SmallFont } from "../../../../../../../components/fonts";
import { BoxContainer } from "../../../../../common/components/box-container";
import { TokenDivs } from "../../../../models";

interface LaunchInformationProps {
  token: TokenDivs;
}

function getCountdown(targetDate: string) {
  const target = new Date(targetDate);
  const now = new Date();
  const difference = target.getTime() - now.getTime();
  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
}

export const LaunchInformation = ({ token }: LaunchInformationProps) => {
  const [timeLeft, setTimeLeft] = useState(
    getCountdown(token?.tokenomics?.launch?.date)
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(getCountdown(token?.tokenomics?.launch?.date));
    }, 1000);
    return () => clearTimeout(timer);
  });

  const timeBoxStyle =
    "mr-2.5 h-[40px] md:h-[35px] min-w-[55px] md:min-w-[45px] sm:min-w-[40px] px-3 sm:px-2 w-fit bg-light-bg-terciary dark:bg-dark-bg-terciary border border-light-border-primary dark:border-dark-border-primary rounded-md flex items-center justify-center";

  const getDisplay = () => {
    if (token?.tokenomics.launch?.vsToken || token?.tokenomics.launch?.exchange)
      return "flex";
    return "hidden";
  };
  const display = getDisplay();

  return (
    <BoxContainer
      extraCss={`mb-5 relative transition-all duration-200 py-[15px] md:py-2.5 px-5 lg:px-[15px] md:px-2.5 rounded-2xl sm:rounded-0 ${display}`}
    >
      <div
        className="flex items-center px-5 lg:px-[15px] md:px-2.5 border-b
       border-light-border-primary dark:border-dark-border-primary"
      >
        <SiConvertio className="text-blue dark:text-blue" />
        <MediumFont extraCss="ml-2.5">Launch Information</MediumFont>
      </div>
      <div className="flex items-center justify-between my-5">
        <div className="flex w-fit flex-col h-fit">
          <div className="flex items-center sm:items-start flex-row sm:flex-col mb-[15px]">
            <MediumFont extraCss="mr-[5px] text-light-font-40 dark:text-dark-font-40">
              Exchange:
            </MediumFont>
            <MediumFont extraCss="font-normal">
              {token?.tokenomics.launch?.exchange}
            </MediumFont>
          </div>
          <div className="flex items-center sm:items-start flex-row sm:flex-col">
            <MediumFont extraCss="mr-[5px] text-light-font-40 dark:text-dark-font-40">
              Pair:
            </MediumFont>
            <MediumFont extraCss="font-normal">
              {`${token?.symbol}/${token?.tokenomics.launch?.vsToken}`}
            </MediumFont>
          </div>
        </div>
        <div className="flex flex-col items-center w-2/4 md:w-fit">
          <MediumFont extraCss="mb-[15px]">Launch in:</MediumFont>
          <div className="flex">
            <div className={`${timeBoxStyle} flex`}>
              <SmallFont>{timeLeft.days}d</SmallFont>
            </div>
            <div className={`${timeBoxStyle} flex`}>
              <SmallFont>{timeLeft.hours}h</SmallFont>
            </div>
            <div className={`${timeBoxStyle} flex`}>
              <SmallFont>{timeLeft.minutes}m</SmallFont>
            </div>
            <div className={`${timeBoxStyle} flex`}>
              <SmallFont>{timeLeft.seconds}s</SmallFont>
            </div>
          </div>
        </div>
      </div>
    </BoxContainer>
  );
};
