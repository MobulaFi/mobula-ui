import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "../../../../../../components/button";
import { LargeFont, SmallFont } from "../../../../../../components/fonts";
import { TagPercentage } from "../../../../../../components/tag-percentage";
import {
  formatNameClean,
  getFormattedAmount,
  getTokenPercentage,
  getUrlFromName,
} from "../../../../../../utils/formaters";
import { useTrendings } from "../../../../hooks/use-trendings";

export const SimilarAsset = () => {
  const trendings = useTrendings();
  const router = useRouter();

  return (
    <div className="flex flex-col mt-[50px] md:mt-[30px] w-full md:w-[95%] mx-auto">
      <LargeFont extraCss="mb-[15px]">Similar Assets</LargeFont>
      <div className="flex">
        <div className="flex overflow-x-scroll scroll">
          {trendings?.map((trending) => {
            if (trending.name)
              return (
                <Button
                  key={trending.id}
                  extraCss="w-[300px] lg:w-[200px] min-w-[280px] p-[15px] lg:py-2.5 lg:px-2.5 mx-auto rounded-2xl mr-[15px] h-auto md:h-auto bg-light-bg-secondary dark:bg-dark-bg-secondary"
                  onClick={() => {
                    router.push(`/asset/${getUrlFromName(trending.name)}`);
                  }}
                >
                  <div className="flex w-full h-full flex-col">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <img
                          className="rounded-full w-[28px] h-[28px] min-w-[28px] md:w-[16px] md:h-[16px] md:min-w-[16px] mr-2.5"
                          src={trending.logo}
                          alt={trending.name}
                        />
                        <div className="flex flex-col">
                          <SmallFont extraCss="text-start">
                            {formatNameClean(trending.name, 15)}
                          </SmallFont>
                          <SmallFont extraCss="text-light-font-40 dark:text-dark-font-40 text-start">
                            ${getFormattedAmount(trending.price)}
                          </SmallFont>
                        </div>
                      </div>
                      <TagPercentage
                        percentage={
                          (parseFloat(
                            getTokenPercentage(trending.price_change_24h)
                          ) > 0
                            ? `+${getTokenPercentage(
                                trending.price_change_24h
                              )}`
                            : getTokenPercentage(
                                trending.price_change_24h
                              )) as never
                        }
                        isUp={
                          parseFloat(
                            getTokenPercentage(trending.price_change_24h)
                          ) > 0
                        }
                      />
                    </div>
                    <img
                      className="mt-5 md:mt-2.5 w-full lg:w-[90%]"
                      src={
                        `https://storage.googleapis.com/mobula-assets/sparklines/${trending.id}/24h.png` ||
                        "/empty/sparkline.png"
                      }
                      alt="sparkline"
                    />
                  </div>
                </Button>
              );
            return null;
          })}
        </div>
      </div>
    </div>
  );
};
