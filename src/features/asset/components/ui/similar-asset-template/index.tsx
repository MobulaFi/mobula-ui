import { useRouter } from "next/navigation";
import React, { useContext } from "react";
import { Button } from "../../../../../components/button";
import { SmallFont } from "../../../../../components/fonts";
import { TagPercentage } from "../../../../../components/tag-percentage";
import {
  formatNameClean,
  getFormattedAmount,
  getTokenPercentage,
  getUrlFromName,
} from "../../../../../utils/formaters";
import { BaseAssetContext } from "../../../context-manager";

interface SimilarAssetTemplateProps {
  content: {
    id: number;
    name: string;
    logo: string;
    price: number;
    price_change_24h?: number;
  };
}

export const SimilarAssetTemplate = ({
  content,
}: SimilarAssetTemplateProps) => {
  const { isAssetPage } = useContext(BaseAssetContext);
  const router = useRouter();
  return (
    <Button
      key={content.id}
      extraCss="w-[300px] lg:w-[200px] min-w-[280px] p-[15px] lg:py-2.5 lg:px-2.5 mx-auto rounded-2xl mr-[15px] h-auto md:h-auto bg-light-bg-secondary dark:bg-dark-bg-secondary"
      onClick={() => {
        if (isAssetPage) router.push(`/asset/${getUrlFromName(content.name)}`);
      }}
    >
      <div className="flex w-full h-full flex-col">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <img
              className="rounded-full w-[28px] h-[28px] min-w-[28px] md:w-[16px] md:h-[16px] md:min-w-[16px] mr-2.5"
              src={content.logo}
              alt={content.name}
            />
            <div className="flex flex-col">
              <SmallFont extraCss="text-start">
                {formatNameClean(content.name, 15)}
              </SmallFont>
              <SmallFont extraCss="text-light-font-40 dark:text-dark-font-40 text-start">
                ${getFormattedAmount(content.price)}
              </SmallFont>
            </div>
          </div>
          <TagPercentage
            percentage={
              parseFloat(getTokenPercentage(content?.price_change_24h)) > 0
                ? `+${getTokenPercentage(content?.price_change_24h)}`
                : getTokenPercentage(content?.price_change_24h)
            }
            isUp={parseFloat(getTokenPercentage(content.price_change_24h)) > 0}
          />
        </div>
        <img
          className="mt-5 md:mt-2.5 w-full lg:w-[90%]"
          src={
            `https://storage.googleapis.com/mobula-assets/sparklines/${content.id}/24h.png` ||
            "/empty/sparkline.png"
          }
          alt="sparkline"
        />
      </div>
    </Button>
  );
};
