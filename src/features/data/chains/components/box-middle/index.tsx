import { AddressAvatar } from "components/avatar";
import { MediumFont } from "components/fonts";
import { TagPercentage } from "components/tag-percentage";
import { useState } from "react";
import { useChains } from "../../context-manager";

interface MiddleBoxProps {
  showPageMobile?: number;
}

export const MiddleBox = ({ showPageMobile = 0 }: MiddleBoxProps) => {
  const [showPage, setShowPage] = useState(0);
  const { pairs, chain } = useChains();
  return (
    <div
      className={`flex h-[200px] lg:h-[175px] rounded-xl bg-light-bg-secondary dark:bg-dark-bg-secondary border
      border-light-border-primary dark:border-dark-border-primary py-2.5 relative  
      min-w-[407px] md:min-w-full w-[31.5%] lg:w-full transition duration-500 ${
        showPageMobile === 1 ? "z-[3]" : "z-[1]"
      }] mx-2.5 md:mx-0`}
    >
      <div className="flex flex-col px-[15px] z-[1] h-full w-full">
        <MediumFont>Top Pairs (24H)</MediumFont>
        <div className="overflow-hidden max-h-[170px] w-full mt-3.5">
          {pairs &&
            pairs.length > 0 &&
            pairs
              ?.filter((_, i) => i < 4)
              .map((entry, i) => {
                if (i === 0) console.log("pair", entry);
                const pair = entry.pair;
                return (
                  <div
                    key={pair.id}
                    className={`flex items-center w-full justify-between ${
                      i === 0 ? "mt-0" : "mt-3"
                    } ${i === pairs?.length}  "mb-0" : "mb-3"`}
                  >
                    <div className="flex truncate items-center mr-5">
                      {pair?.token1?.logo ? (
                        <img
                          src={pair?.token1?.logo}
                          alt={pair?.token1?.name}
                          className="w-5 h-5 mr-1.5 rounded-full bg-light-bg-hover dark:bg-dark-bg-hover"
                        />
                      ) : (
                        <AddressAvatar
                          address={pair?.address}
                          extraCss="w-5 h-5 mr-2.5 rounded-full"
                        />
                      )}
                      {pair?.token1?.logo ? (
                        <img
                          src={pair?.token1?.logo}
                          alt={pair?.token1?.name}
                          className="w-5 h-5 mr-2.5 rounded-full bg-light-bg-hover dark:bg-dark-bg-hover"
                        />
                      ) : (
                        <AddressAvatar
                          address={pair?.address}
                          extraCss="w-5 h-5 mr-2.5 rounded-full"
                        />
                      )}
                      <p className="text-light-text-primary dark:text-dark-text-primary text-sm md:text-xs text-light-font-60 dark:text-dark-font-60">
                        <span className="font-medium text-light-font-100 dark:text-dark-font-100">
                          {pair?.token0?.symbol}
                        </span>{" "}
                        / {pair?.token1?.symbol}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <p className="text-light-text-primary dark:text-dark-text-primary text-sm md:text-xs text-light-font-60 dark:text-dark-font-60">
                        <TagPercentage
                          percentage={pair?.price_change_24h}
                          isUp={pair?.price_change_24h > 0}
                        />
                      </p>
                    </div>
                  </div>
                );
              })}
        </div>
      </div>
    </div>
  );
};
