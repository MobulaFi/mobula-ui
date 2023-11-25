import { MediumFont, SmallFont } from "components/fonts";
import { NextChakraLink } from "components/link";
import React, { useContext } from "react";
import { FiExternalLink } from "react-icons/fi";
import { cn } from "../../../../../../lib/shadcn/lib/utils";
import { BaseAssetContext } from "../../../../context-manager";
import { FlexBorderBox } from "../../../../style";
import { formatISODate } from "../../../../utils";

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
      value: baseAsset?.listing_amount ? `${baseAsset?.listing_amount}$` : "",
      link: `https://polygonscan.com/tx/${baseAsset?.listing_hash}`,
    },
    {
      title: "Vote Time (DAO)",
      value: formatISODate(baseAsset?.created_at),
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
    <div className={cn(FlexBorderBox, extraCss)}>
      <MediumFont extraCss="mb-2.5 flex lg:hidden">Listing Details</MediumFont>
      <MediumFont extraCss="mt-2.5 mb-[5px] hidden lg:flex">
        Listing Details
      </MediumFont>
      {metrics.map(
        (entry, i) =>
          entry.value && (
            <div
              className={`flex justify-between py-2.5 ${
                i === 0 && i !== metrics.length - 1
                  ? ""
                  : "border-b border-light-border-primary dark:border-dark-border-primary"
              } ${metrics.length - 1 === i ? "" : "pb-2.5"}`}
            >
              <div className="flex items-center mb-[5px]">
                <SmallFont extraCss="text-light-font-60 dark:text-dark-font-60">
                  {entry.title}
                </SmallFont>
              </div>
              <div className="flex items-center text-light-font-100 dark:text-dark-font-100 font-medium">
                {entry.value}
                {entry.link ? (
                  <div className="flex items-center ml-[5px]">
                    <NextChakraLink
                      href={entry.link}
                      target="_blank"
                      extraCss="flex items-center justify-center"
                      rel="noreferrer"
                    >
                      <FiExternalLink className="text-light-font-60 dark:text-dark-font-60" />
                    </NextChakraLink>
                  </div>
                ) : null}
              </div>
            </div>
          )
      )}
    </div>
  );
};
