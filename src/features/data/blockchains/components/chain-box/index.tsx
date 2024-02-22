import { getFormattedAmount } from "@utils/formaters";
import { AddressAvatar } from "components/avatar";
import { Skeleton } from "components/skeleton";
import { TagPercentage } from "components/tag-percentage";
import { useEffect, useState } from "react";
import { MediumFont, SmallFont } from "../../../../../components/fonts";
import { Segment } from "../../../../../layouts/new-tables/segments/index";

export const ChainBox = ({ blockchain }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [pairsData, setPairsData] = useState([]);

  const fetchPairs = async () => {
    if (pairsData?.length > 0) return;
    fetch(
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/1/market/blockchain/pairs?blockchain=${blockchain.name}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: process.env.NEXT_PUBLIC_PRICE_KEY as string,
        },
      }
    )
      .then((response) => response.json())
      .then((r) => {
        setIsLoading(false);
        if (r.data) {
          setPairsData(r.data.slice(0, 6));
        }
      });
  };

  useEffect(() => {
    fetchPairs();
  }, []);

  return (
    <div
      className="flex flex-col w-[49%] bg-light-bg-secondary dark:bg-dark-bg-secondary 
    rounded-lg border border-light-border-primary dark:border-dark-border-primary mb-5"
    >
      <div className="flex items-center justify-between w-full p-5">
        <div className="flex items-center">
          <img
            className="h-[45px] w-[45px] mr-2 rounded-full object-cover bg-light-bg-hover dark:bg-light-bg-hover"
            src={blockchain.logo}
            alt={blockchain.name}
          />
          <div>
            <MediumFont extraCss="leading-tight">
              {blockchain.eth.symbol}
            </MediumFont>
            <MediumFont extraCss="text-light-font-60 dark:text-dark-font-60 leading-tight">
              {blockchain?.shortName || blockchain.name}
            </MediumFont>
          </div>
        </div>
      </div>
      <table>
        {(isLoading ? Array.from({ length: 6 }) : pairsData)?.map((data, i) => {
          const baseToken = data?.pair?.[data.pair.baseToken];
          const quoteToken = data?.pair?.[data.pair.quoteToken];
          return (
            <tbody key={i}>
              <tr>
                <Segment extraCss="text-start py-2 border-light-border-secondary dark:border-dark-border-secondary">
                  <div className="flex w-full items-center">
                    {isLoading ? (
                      <Skeleton extraCss="h-[35px] w-[35px] rounded-full mr-2.5" />
                    ) : (
                      <>
                        {baseToken?.logo ? (
                          <img
                            className="w-[35px] h-[35px] mr-2.5 rounded-full object-cover bg-light-bg-hover dark:bg-light-bg-hover"
                            src={baseToken?.logo}
                            alt={baseToken?.name}
                          />
                        ) : (
                          <AddressAvatar
                            address={data?.pair?.address}
                            extraCss="w-[35px] h-[35px] mr-2.5 rounded-full"
                          />
                        )}
                      </>
                    )}
                    {isLoading ? (
                      <div>
                        <Skeleton extraCss="h-4 w-[100px]" />
                        <Skeleton extraCss="h-3 mt-1 w-[120px]" />
                      </div>
                    ) : (
                      <div>
                        <SmallFont extraCss="font-medium">
                          {baseToken?.symbol} /{" "}
                          <span className="text-light-font-40 dark:text-dark-font-40 font-normal">
                            {quoteToken?.symbol}
                          </span>
                        </SmallFont>
                        <SmallFont extraCss="text-light-font-60 dark:text-dark-font-60 truncate max-w-[130px]">
                          {baseToken?.name}
                        </SmallFont>
                      </div>
                    )}
                  </div>
                </Segment>
                <Segment extraCss="py-2 border-light-border-secondary dark:border-dark-border-secondary">
                  {isLoading ? (
                    <Skeleton extraCss="h-3.5 w-[100px]" />
                  ) : (
                    `$${getFormattedAmount(data?.price, 0, {
                      canUseHTML: true,
                    })}`
                  )}
                </Segment>
                <Segment extraCss="py-2 border-light-border-secondary dark:border-dark-border-secondary">
                  <div className="flex justify-end w-full">
                    <TagPercentage
                      percentage={data?.price_change_24h}
                      isUp={data?.price_change_24h > 0}
                      inhert={data?.price_change_24h === 0}
                      isLoading={isLoading}
                    />
                  </div>
                </Segment>
              </tr>
            </tbody>
          );
        })}
      </table>
    </div>
  );
};
