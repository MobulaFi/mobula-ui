import { Collapse } from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import { BsChevronDown } from "react-icons/bs";
import { cn } from "../../../../../../@/lib/utils";
import { Button } from "../../../../../../components/button";
import { LargeFont } from "../../../../../../components/fonts";
import { TagPercentage } from "../../../../../../components/tag-percentage";
import {
  getFormattedAmount,
  getTokenPercentage,
} from "../../../../../../utils/formaters";
import { BaseAssetContext } from "../../../../context-manager";
import { FlexBorderBox } from "../../../../style";
import { getDateFromTimeStamp, timeframes } from "../../../../utils";

interface PriceInTimeProps {
  extraCss?: string;
}

export const PriceInTime = ({ extraCss }: PriceInTimeProps) => {
  const { unformattedHistoricalData, baseAsset } = useContext(BaseAssetContext);
  const [showMore, setShowMore] = useState(
    !Object.keys(baseAsset?.assets_raw_pairs?.pairs_data || {})?.length
  );

  const sortOrder = [
    "24h",
    "3D",
    "7D",
    "1M",
    "3M",
    "6M",
    "1Y",
    "2Y",
    "3Y",
    "4Y",
    "5Y",
    "6Y",
    "7Y",
    "8Y",
    "9Y",
    "10Y",
  ];

  function getHistoricalPrices(history) {
    const results = {};
    Object.keys(timeframes).forEach((key) => {
      const targetTimestamp = Date.now() - timeframes[key];
      const filteredHistory = history.filter(
        (item) => item[0] >= targetTimestamp
      );
      if (filteredHistory.length > 0) {
        const [, value] = filteredHistory[0];
        results[key] = value;
      }
    });

    let lastUniqueKey;
    for (let i = sortOrder.length - 1; i >= 1; i -= 1) {
      if (results[sortOrder[i]] !== results[sortOrder[i - 1]]) {
        lastUniqueKey = sortOrder[i - 1];
        break;
      }
    }

    const cutOffIndex = sortOrder.indexOf(lastUniqueKey) + 1;
    const newResults = {};

    Object.entries(results).forEach(([key, value], i, arr) => {
      if (sortOrder.indexOf(key) > cutOffIndex) return;

      const [, nextValue] = arr[i + 1] || [];

      if (!nextValue) {
        newResults[key] = [value, 0];
        return;
      }

      const percentageChange =
        ((Number(value) - Number(nextValue)) / Number(nextValue)) * 100;
      newResults[key] = [value, percentageChange];
    });

    return newResults;
  }

  getHistoricalPrices(
    Object.entries(getHistoricalPrices(unformattedHistoricalData?.price?.ALL))
  );

  return (
    <div
      className={cn(
        `${FlexBorderBox} p-0 pb-0 rounded-2xl md:rounded-0`,
        extraCss
      )}
    >
      <LargeFont extraCss="mt-0 lg:mt-5 mb-2.5 px-5 pt-5 pb-0 lg:py-0">
        Price-in-time
      </LargeFont>
      <Collapse
        startingHeight={
          Object.entries(
            getHistoricalPrices(unformattedHistoricalData?.price?.ALL)
          ).length > 5
            ? 220
            : Object.entries(
                getHistoricalPrices(unformattedHistoricalData?.price?.ALL)
              ).length * 44
        }
        in={showMore}
      >
        {Object.entries(
          getHistoricalPrices(unformattedHistoricalData?.price?.ALL)
        )
          ?.filter(
            (entry, i) =>
              entry[1] !==
              Object.entries(
                getHistoricalPrices(unformattedHistoricalData?.price?.ALL)
              )[i - 1]?.[1]
          )
          .map((entry, i) => (
            <div
              key={entry[0] + entry[1]}
              className={`flex px-5 text-light-font-100 dark:text-dark-font-100 justify-between py-2.5 ${
                i === 0
                  ? ""
                  : "border-t border-light-border-primary dark:border-dark-border-primary"
              } pb-2.5`}
            >
              <div className="flex items-center text-sm mb-[5px] text-light-font-60 dark:text-dark-font-60">
                {getDateFromTimeStamp(entry[0])}
              </div>
              <div className="flex items-center">
                <p className="text-light-font-60 dark:text-dark-font-60 text-[13px] font-medium">
                  ${getFormattedAmount(entry[1][0])}
                </p>
                <TagPercentage
                  fs={["12px", "12px", "13px"]}
                  h={["20px", "20px", "21.5px", "21.5px"]}
                  percentage={Number(getTokenPercentage(entry[1][1]))}
                  isUp={Number(getTokenPercentage(entry[1][1])) > 0}
                />
              </div>
            </div>
          ))}
      </Collapse>
      {Object.entries(
        getHistoricalPrices(unformattedHistoricalData?.price?.ALL)
      )?.filter(
        (entry, i) =>
          entry[1] !==
          Object.entries(
            getHistoricalPrices(unformattedHistoricalData?.price?.ALL)
          )[i - 1]?.[1]
      ).length > 5 ? (
        <Button
          extraCss="mx-auto h-[30px] mt-2.5 text-sm w-full rounded-b-xl"
          onClick={() => setShowMore(!showMore)}
        >
          {showMore ? "Show less" : "Show more"}
          <BsChevronDown
            className={`ml-[5px] text-base transition-all duration-250 ${
              showMore ? "rotate-180" : ""
            }`}
          />
        </Button>
      ) : null}
    </div>
  );
};
