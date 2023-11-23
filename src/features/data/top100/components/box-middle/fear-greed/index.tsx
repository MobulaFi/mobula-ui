import React from "react";
import { MediumFont } from "../../../../../../components/fonts";
import CryptoFearAndGreedChart from "./crypto-fear-greed";

interface FearGreedProps {
  showPage: number;
  metrics: {
    fear_and_greed_value: number;
    fear_and_greed_value_classification: string;
  };
}

export const FearGreed = ({ showPage, metrics }: FearGreedProps) => {
  return (
    <div
      className={`flex flex-col transition-all duration-250 px-2.5 w-[200px] min-w-full`}
      style={{ transform: `translateX(-${showPage * 100}%)` }}
    >
      <MediumFont className="z-[1] text-light-font-100 dark:text-dark-font-100">
        Today Fear & Greed
      </MediumFont>
      <div className="flex items-center justify-center w-[60%] max-w-[200px] h-fit lg:w-[50%] mt-2 lg:mt-0 mx-auto">
        <CryptoFearAndGreedChart
          fearLevel={metrics?.fear_and_greed_value || 50}
          fearClassification={
            metrics?.fear_and_greed_value_classification || "Neutral"
          }
        />
      </div>
    </div>
  );
};
