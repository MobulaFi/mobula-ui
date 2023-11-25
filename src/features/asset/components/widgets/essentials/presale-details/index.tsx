import { getFormattedAmount } from "@utils/formaters";
import { MediumFont, SmallFont } from "components/fonts";
import { NextChakraLink } from "components/link";
import React, { useContext } from "react";
import { FiExternalLink } from "react-icons/fi";
import { cn } from "../../../../../../lib/shadcn/lib/utils";
import { BaseAssetContext } from "../../../../context-manager";
import { FlexBorderBox } from "../../../../style";
import { formatISODate } from "../../../../utils";

interface PresaleDetailsProps {
  extraCss?: string;
}

export const PresaleDetails = ({ extraCss }: PresaleDetailsProps) => {
  const { baseAsset } = useContext(BaseAssetContext);
  const currentSale = baseAsset?.sales?.[(baseAsset?.sales?.length || 0) - 1];
  if (!currentSale) return null;

  const metrics = [
    {
      title: "Platform",
      value: currentSale.platform || "-",
      link: currentSale.link,
    },
    {
      title: "Valuation",
      value: currentSale.valuation || "-",
    },
    {
      title: "Amount",
      value: currentSale?.amount
        ? `${getFormattedAmount(currentSale?.amount)} ${baseAsset?.symbol}`
        : "-",
    },
    {
      title: "Date",
      value: formatISODate(baseAsset?.created_at),
    },
    {
      title: "Price",
      value: currentSale?.price
        ? `$${getFormattedAmount(currentSale?.price)}`
        : "-",
    },
  ];

  return (
    <div className={cn(FlexBorderBox, extraCss)}>
      <MediumFont extraCss="mb-2.5 flex lg:hidden">Presale Details</MediumFont>
      <MediumFont extraCss="mb-[5px] mt-2.5 hidden lg:flex">
        Presale Details
      </MediumFont>
      {metrics.map((entry, i) => (
        <div
          className={`flex justify-between py-2.5 ${
            i === 0
              ? ""
              : "border-t border-light-border-primary dark:border-dark-border-primary"
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
                  rel="noreferrer"
                  extraCss="flex items-center justify-center"
                >
                  <FiExternalLink className="text-light-font-100 dark:text-dark-font-100" />
                </NextChakraLink>
              </div>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
};
