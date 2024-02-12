"use client";
import { AddressAvatar } from "components/avatar";
import { TagPercentage } from "components/tag-percentage";
import React, { useState } from "react";
import { Container } from "../../../components/container";
import { SmallFont } from "../../../components/fonts";
import { Segment } from "../../../layouts/new-tables/segments";
import { getFormattedAmount } from "../../../utils/formaters";
import { LeftBox } from "./components/box-left";
import { MiddleBox } from "./components/box-middle";
import { RightBox } from "./components/box-right";
import { TableHeader } from "./components/table-header";
import { useChains } from "./context-manager";

export const Chains = () => {
  const { pairs, chain } = useChains();
  const [showPage, setShowPage] = useState(0);

  console.log("PAIRS", pairs);
  console.log("CHAIN", chain);

  // Chain traders (chart)
  // Chain volume (chart)
  // Chain DEX TVL (chart)
  return (
    <>
      <div className="flex pb-5 md:pb-2.5 w-full">
        <Container extraCss="max-w-[1300px] ">
          <div className="flex w-95per mx-auto mb-5 ">
            <div className="swiper">
              <div className="swiper-wrapper flex">
                <div className="swiper-slide flex justify-center">
                  <LeftBox showPageMobile={showPage} />
                </div>
                <div className="swiper-slide flex justify-center">
                  <MiddleBox showPageMobile={showPage} />
                </div>
                <div className="swiper-slide flex justify-center">
                  <RightBox showPageMobile={showPage} />
                </div>
              </div>
            </div>
          </div>
          <TableHeader isLoading={false}>
            {pairs?.map((pair, i) => (
              <tbody key={i}>
                <Segment>
                  <div className="flex items-center">
                    <SmallFont extraCss="w-fit mr-2.5">#{i + 1}</SmallFont>
                    <div className="flex items-center">
                      <SmallFont extraCss="w-fit mr-2.5 whitespace-nowrap text-start">
                        {pair?.pair?.token0?.symbol} /{" "}
                        <span className="text-light-font-60 dark:text-dark-font-60">
                          {pair?.pair?.token1?.symbol}
                        </span>
                      </SmallFont>
                      <div className="flex items-center">
                        {pair?.pair?.token0?.logo ? (
                          <img
                            className="w-[20px] h-[20px] rounded-full"
                            alt="token logo"
                            src={pair?.pair?.token0?.logo || ""}
                          />
                        ) : (
                          <AddressAvatar
                            address={pair?.pair?.address}
                            extraCss="w-[20px] h-[20px] rounded-full"
                          />
                        )}
                        <SmallFont extraCss="w-fit ml-2 whitespace-nowrap text-start max-w-[150px] truncate">
                          {pair?.pair?.token0?.name}
                        </SmallFont>
                      </div>
                    </div>
                  </div>
                </Segment>
                <Segment>
                  {" "}
                  <div className="w-full flex justify-end">
                    <SmallFont extraCss="w-fit mr-2.5 whitespace-nowrap text-end">
                      $
                      {getFormattedAmount(pair?.price, 0, { canUseHTML: true })}
                    </SmallFont>
                  </div>
                </Segment>
                <Segment>
                  <div className="w-full flex justify-end">
                    <SmallFont extraCss="w-fit mr-2.5 whitespace-nowrap text-end">
                      {getFormattedAmount(pair?.trades)}
                    </SmallFont>
                  </div>
                </Segment>
                <Segment>
                  <div className="w-full flex justify-end">
                    <SmallFont extraCss="w-fit mr-2.5 whitespace-nowrap text-end">
                      ${getFormattedAmount(pair?.volume)}
                    </SmallFont>
                  </div>
                </Segment>
                <Segment>
                  <div className="w-full flex justify-end">
                    <SmallFont extraCss="w-fit mr-2.5 whitespace-nowrap text-end">
                      ${getFormattedAmount(pair?.liquidity)}
                    </SmallFont>
                  </div>
                </Segment>
                <Segment>
                  <div className="w-full flex justify-end">
                    <TagPercentage
                      isUp={pair?.price_change_5min > 0 || false}
                      percentage={pair?.price_change_5min}
                    />
                  </div>
                </Segment>
                <Segment>
                  <div className="w-full flex justify-end">
                    <TagPercentage
                      isUp={pair?.price_change_1h > 0 || false}
                      percentage={pair?.price_change_1h}
                    />
                  </div>
                </Segment>
                <Segment>
                  <div className="w-full flex justify-end">
                    <TagPercentage
                      isUp={pair?.price_change_12h > 0 || false}
                      percentage={pair?.price_change_12h}
                    />
                  </div>
                </Segment>
                <Segment>
                  <div className="w-full flex justify-end">
                    <TagPercentage
                      isUp={pair?.price_change_24h > 0 || false}
                      percentage={pair?.price_change_24h}
                    />
                  </div>
                </Segment>
              </tbody>
            ))}
          </TableHeader>
        </Container>
      </div>
    </>
  );
};
