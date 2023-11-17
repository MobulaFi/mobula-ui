import React, { useEffect, useState } from "react";
import { Button } from "../../../../../components/button";
import { BtcDominance } from "./btc-dominance";
import { CryptoMarket } from "./crypto-market";
import { FearGreed } from "./fear-greed";

interface BoxMiddleProps {
  showPageMobile?: number;
  metrics: {
    fear_and_greed_value: number;
    fear_and_greed_value_classification: string;
  };
}

export const BoxMiddle = ({ showPageMobile = 0, metrics }: BoxMiddleProps) => {
  const [showPage, setShowPage] = useState(0);
  const tablet =
    (typeof window !== "undefined" ? window.innerWidth : 0) < 991 &&
    (typeof window !== "undefined" ? window.innerWidth : 0) >= 480;

  const render = [
    <FearGreed showPage={showPage} metrics={metrics} key="FearGreed" />,
    <CryptoMarket
      showPage={showPage}
      height={
        typeof showPageMobile === "number"
          ? "165px"
          : tablet
          ? "175px"
          : "190px"
      }
      key="CryptoMarket"
    />,
    <BtcDominance
      showPage={showPage}
      height={
        typeof showPageMobile === "number"
          ? "165px"
          : tablet
          ? "175px"
          : "190px"
      }
      key="BtcDominance"
    />,
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setShowPage((prevPage) => (prevPage + 1) % 3);
    }, 12000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div
      className={`flex h-[200px] lg:h-[175px] rounded-xl bg-light-bg-secondary dark:bg-dark-bg-secondary border
      border-light-border-primary dark:border-dark-border-primary py-2.5 px-2.5 relative overflow-hidden 
      min-w-[407px] md:min-w-full w-[31.5%] sm:w-full transition duration-500 ${
        showPageMobile === 1 ? "z-[3]" : "z-[1]"
      }] mx-2.5 md:mx-0`}
      style={{ transform: `translateX(-${showPageMobile * 100}%)` }}
    >
      <div className="flex items-center absolute top-0 right-0 h-[35px] px-[15px] bg-light-bg-secondary dark:bg-dark-bg-secondary z-[1]">
        {render.map((_, idx) => (
          <Button
            extraCss={`rounded-full ${
              showPage === idx ? "w-[9px]" : "w-[8px]"
            } ${showPage === idx ? "h-[9px]" : "h-[8px]"} ${
              showPage === idx ? "max-w-[9px]" : "max-w-[8px]"
            } ${
              showPage === idx ? "max-h-[9px]" : "max-h-[8px]"
            } px-0 ml-[5px] ${
              showPage === idx
                ? "bg-light-font-80 dark:bg-dark-font-80"
                : "bg-light-font-40 dark:bg-dark-font-40"
            } `}
            key={_.key}
            onClick={() => setShowPage(idx)}
          />
        ))}
      </div>
      {render}
    </div>
  );
};
