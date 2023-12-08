import { MediumFont } from "../../../../../../components/fonts";
import { boxStyle } from "../constant";
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
      className={boxStyle}
      style={{ transform: `translateX(-${showPage * 100}%)` }}
    >
      <div className="flex flex-col w-[95%] mx-auto">
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
    </div>
  );
};
