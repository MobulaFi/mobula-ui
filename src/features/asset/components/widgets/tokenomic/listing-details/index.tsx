import React, { useContext } from "react";
import { MediumFont, SmallFont } from "../../../../../../components/fonts";
import { cn } from "../../../../../../lib/shadcn/lib/utils";
import { BaseAssetContext } from "../../../../context-manager";
import { FlexBorderBox } from "../../../../style";

interface ListingDetailsProps {
  extraCss?: string;
}

export const ListingDetails = ({ extraCss }: ListingDetailsProps) => {
  const { baseAsset } = useContext(BaseAssetContext);

  const getColorFromScore = (score: number) => {
    if (score >= 4) return "text-green dark:text-green";
    if (score === 3) return "text-yellow dark:text-yellow";
    return "text-red dark:text-red";
  };

  const metrics = [
    {
      title: "Price Paid",
      value: baseAsset?.market_cap,
    },
    {
      title: "Vote Time (DAO)",
      value: baseAsset?.market_cap_diluted || "-",
    },
    {
      title: "Utility Score",
      value: (
        <p
          className={`text-[13px] ${getColorFromScore(
            baseAsset?.utility_score
          )}`}
        >
          {`${baseAsset?.utility_score}/5`}
        </p>
      ),
    },
    {
      title: "Trust Score",
      value: (
        <p
          className={`text-[13px] ${getColorFromScore(baseAsset?.trust_score)}`}
        >
          {`${baseAsset?.trust_score}/5`}
        </p>
      ),
    },
    {
      title: "Social Score",
      value: (
        <p
          className={`text-[13px] ${getColorFromScore(
            baseAsset?.social_score
          )}`}
        >
          {`${baseAsset?.social_score}/5`}
        </p>
      ),
    },
  ];

  return (
    <div className={cn(`${FlexBorderBox} lg:border-0 lg:bg-inherit`, extraCss)}>
      <MediumFont extraCss="flex lg:hidden mb-2.5">Listing Details</MediumFont>
      <MediumFont extraCss="hidden lg:flex mt-2.5 mb-[5px]">
        Listing Details
      </MediumFont>
      {metrics.map((entry, i) => (
        <div
          key={entry.title}
          className={`flex justify-between ${
            i === 0
              ? ""
              : "border-t border-light-border-primary dark:border-dark-border-primary"
          } ${metrics.length - 1 === i ? "pb-0" : "pb-2.5"} pt-2.5`}
        >
          <div className="flex items-center mb-[5px]">
            <SmallFont extraCss="text-light-font-60 dark:text-dark-font-60">
              {entry.title}
            </SmallFont>
          </div>
          <div className="flex items-center text-light-font-100 dark:text-dark-font-100">
            {entry.value}
          </div>
        </div>
      ))}
    </div>
  );
};
