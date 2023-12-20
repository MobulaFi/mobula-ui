import React, { useState } from "react";
import { FaHourglassEnd, FaHourglassHalf } from "react-icons/fa";
import { MediumFont } from "../../../../../../../components/fonts";
import { TokenDivs } from "../../../../models";

interface CountdownProps {
  token: TokenDivs;
  extraCss?: string;
}

export const Countdown = ({ token, extraCss }: CountdownProps) => {
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  setInterval(() => {
    const now = Date.now();
    const distance = Math.max((token.lastUpdate + 5 * 60) * 1000 - now, 0);
    setMinutes(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)));
    setSeconds(Math.floor((distance % (1000 * 60)) / 1000));
  }, 1000);

  return (
    <div className={extraCss}>
      <div className="flex items-center justify-between px-5 pt-[15px]">
        <MediumFont>Cast your vote</MediumFont>
        <div className="flex items-center ml-auto">
          {seconds + minutes === 0 ||
          (Number.isNaN(minutes) && Number.isNaN(seconds)) ? (
            <>
              <FaHourglassEnd className="text-light-font-100 dark:text-dark-font-100 text-sm mr-2.5" />
              <MediumFont>Vote now</MediumFont>
            </>
          ) : (
            <>
              <FaHourglassHalf className="text-light-font-100 dark:text-dark-font-100 text-sm mr-2.5" />
              <MediumFont>
                {`${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`}
              </MediumFont>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
