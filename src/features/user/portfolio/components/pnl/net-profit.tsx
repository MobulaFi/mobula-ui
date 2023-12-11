import React, {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { BsChevronDown } from "react-icons/bs";
import { Skeleton } from "../../../../../components/skeleton";
import { TagPercentage } from "../../../../../components/tag-percentage";
import { getFormattedAmount } from "../../../../../utils/formaters";
import { PortfolioV2Context } from "../../context-manager";
import { Gains } from "../../models";
import { Privacy } from "../ui/privacy";

interface NetProfitProps {
  showMorePnl: boolean;
  setShowMorePnl: Dispatch<SetStateAction<boolean>>;
  extraCss?: string;
}

export const NetProfit = ({
  showMorePnl,
  setShowMorePnl,
  extraCss,
  ...props
}: NetProfitProps) => {
  const { manager, isLoading, timeframe, wallet } =
    useContext(PortfolioV2Context);
  const [gains, setGains] = useState<Gains>({
    difference: null,
    percentage: null,
    difference_raw: null,
    percentage_raw: null,
  });

  function getGainsForPeriod() {
    const now = Date.now();
    const periods = {
      "24H": 24 * 60 * 60 * 1000,
      "7D": 7 * 24 * 60 * 60 * 1000,
      "30D": 30 * 24 * 60 * 60 * 1000,
      "1Y": 365 * 24 * 60 * 60 * 1000,
      ALL: Infinity,
    };
    const periodMillis = periods[timeframe];
    const periodData =
      wallet?.estimated_history?.filter(
        ([timestamp]) => now - timestamp <= periodMillis
      ) || [];
    if (periodData.length < 2) return { difference: null, percentage: null };
    const startAmount = periodData.find((e) => e[1] !== 0)?.[1] ?? 0;
    const endAmount = wallet?.estimated_balance;
    const difference = (endAmount || 0) - startAmount;
    const percentage = (difference / startAmount) * 100;

    return {
      difference: getFormattedAmount(difference),
      percentage: getFormattedAmount(percentage),
      difference_raw: difference,
      percentage_raw: percentage,
    };
  }

  useEffect(() => {
    function createGainsObject(wallet) {
      if (wallet?.estimated_history?.length) {
        const { difference, percentage, difference_raw, percentage_raw } =
          getGainsForPeriod();
        return {
          difference,
          percentage,
          difference_raw: difference_raw ?? null,
          percentage_raw: percentage_raw ?? null,
        };
      }
      return {
        difference: null,
        percentage: null,
        difference_raw: null,
        percentage_raw: null,
      };
    }

    setGains(createGainsObject(wallet));
  }, [timeframe, wallet]);

  return (
    <div className={`flex justify-between items-center ${extraCss}`} {...props}>
      <div className="flex items-center">
        {manager.privacy_mode ? (
          <Privacy extraCss="text-light-font-60 dark:text-dark-font-60 text-xl lg:text-lg md:text-base" />
        ) : (
          <div className="flex items-center">
            {isLoading ? (
              <Skeleton extraCss="h-[20px] lg:h-[18px] md:h-[16px] w-[100px] rounded-lg mt-[2.5px]" />
            ) : (
              <p
                className={`text-xl lg:text-lg md:text-base ${
                  (gains?.difference_raw || 0) > 0
                    ? "text-green dark:text-green"
                    : "text-red dark:text-red"
                }`}
              >
                {Number(gains.difference_raw) > 0 ? "+" : "-"}$
                {getFormattedAmount(Math.abs(Number(gains.difference_raw)))}
              </p>
            )}
          </div>
        )}
        {isLoading ? (
          <Skeleton extraCss="h-[20px] lg:h-[18px] md:h-[16px] w-[60px] rounded-lg mt-[2.5px] ml-[7.5px]" />
        ) : (
          <TagPercentage
            isUp={Number(gains.percentage_raw) > 0}
            percentage={gains.percentage_raw as number}
          />
        )}
      </div>
      <button
        className="hidden sm:flex"
        onClick={() => setShowMorePnl(!showMorePnl)}
      >
        <BsChevronDown
          className={`text-light-font-100 dark:text-dark-font-100 transition-all duration-200 text-base ml-[5px] ${
            showMorePnl ? "rotate-180" : "rotate-0"
          }"}`}
        />
      </button>
    </div>
  );
};
