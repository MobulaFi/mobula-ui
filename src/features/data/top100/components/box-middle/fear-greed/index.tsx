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
      className={`flex flex-col translate-x-[-${
        showPage * 100
      }%] transition-all duration-250 w-[200px] min-w-full`}
    >
      <MediumFont className="z-[1] absolute top-2.5 left-[15px] text-light-font-100 dark:text-dark-font-100">
        Today Fear & Greed
      </MediumFont>
      <div className="flex items-center justify-center w-[45%] max-w-[185px] h-fit mt-[45px] lg:mt-[35px] mx-auto">
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
