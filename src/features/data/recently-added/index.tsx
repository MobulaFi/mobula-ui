"use client";
import React, { useEffect, useState } from "react";
import { Container } from "../../../components/container";
import { Title } from "../../../components/fonts";
import { Spinner } from "../../../components/spinner";
import { OrderBy, TableAsset } from "../../../interfaces/assets";
import { tabs } from "../../../layouts/menu-mobile/constant";
import { TopNav } from "../../../layouts/menu-mobile/top-nav";
import { BasicBody } from "../../../layouts/new-tables/basic-table/basic-body";
import { CommonTableHeader } from "../../../layouts/new-tables/basic-table/basic-wrap";
interface recentlyAddedProps {
  tokensBuffer: TableAsset[];
  isMobile: boolean;
  count: number;
}

export const RecentlyAdded = ({
  tokensBuffer,
  isMobile,
  count,
}: recentlyAddedProps) => {
  const [resultsData, setResultsData] = useState({ data: tokensBuffer, count });
  const [isLoading, setIsLoading] = useState(true);
  const [orderBy, setOrderBy] = useState<OrderBy>({
    type: "created_at",
    ascending: false,
    first: true,
  });

  useEffect(() => {
    localStorage.setItem(
      "path",
      JSON.stringify({
        url: "/new",
        name: "Recently added",
        theme: "Crypto",
      })
    );
  }, []);

  useEffect(() => {
    if (resultsData?.data?.length > 0) {
      setIsLoading(false);
    }
  }, [resultsData]);

  return (
    <>
      {isMobile ? <TopNav list={tabs} active="New" isGeneral /> : null}
      <Container>
        <div className="flex flex-col w-full">
          <Title
            title="Crypto Tokens Recently Added to Mobula"
            subtitle="Discover the latest cryptocurrencies listed on Mobula, their price, volume, chart, liquidity, and more."
            extraCss="mb-5"
          />
          <div className="mt-2.5">
            {!isLoading ? (
              <CommonTableHeader
                orderBy={orderBy}
                setOrderBy={setOrderBy}
                lastColumn="Added"
                hideDEXVolume
              >
                {resultsData?.data?.map((token, i) => (
                  <BasicBody key={token?.id} token={token} index={i} />
                ))}
              </CommonTableHeader>
            ) : (
              <div className="w-full h-[600px] flex items-center justify-center">
                <Spinner extraCss="w-[60px] h-[60px]" />
              </div>
            )}
          </div>
        </div>
      </Container>
    </>
  );
};
