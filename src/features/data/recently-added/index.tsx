"use client";
import { generateFilters } from "@utils/filters";
import { Asset } from "features/asset/models";
import React, { useEffect, useState } from "react";
import { Container } from "../../../components/container";
import { Title } from "../../../components/fonts";
import { Spinner } from "../../../components/spinner";
import { OrderBy } from "../../../interfaces/assets";
import { BlockchainsNav } from "../../../layouts/blockchains-nav";
import { tabs } from "../../../layouts/menu-mobile/constant";
import { TopNav } from "../../../layouts/menu-mobile/top-nav";
import { AssetsTable } from "../../../layouts/tables/components/index";
import { Query } from "../top100/models";

interface recentlyAddedProps {
  tokensBuffer: Asset[];
  isMobile: boolean;
  count: number;
}

export const RecentlyAdded = ({
  tokensBuffer,
  isMobile,
  count,
}: recentlyAddedProps) => {
  const [blockchain, setBlockchain] = useState("all");
  const [resultsData, setResultsData] = useState({ data: tokensBuffer, count });
  const [filters, setFilters] = useState<Query[]>([
    // To avoid the first render
    { action: "", value: [], isFirst: true },
    ...generateFilters("all", true),
  ]);
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

  console.log("tokensBuffer", tokensBuffer);

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
          <BlockchainsNav
            page="recently"
            blockchain={blockchain}
            setBlockchain={setBlockchain}
            setFilters={setFilters}
          />
          {resultsData?.data?.length > 0 ? (
            <AssetsTable
              resultsData={resultsData}
              setResultsData={setResultsData}
              lastColumn="Added"
              orderBy={orderBy}
              setOrderBy={setOrderBy}
              filters={filters}
              hideDEXVolume
              isMobile={isMobile}
            />
          ) : (
            <div className="w-full h-[600px] flex items-center justify-center">
              <Spinner extraCss="w-[60px] h-[60px]" />
            </div>
          )}
        </div>
      </Container>
    </>
  );
};
