"use client";
import { generateFilters } from "@utils/filters";
import React, { useEffect, useState } from "react";
import { Container } from "../../../components/container";
import { Title } from "../../../components/fonts";
import { OrderBy } from "../../../interfaces/assets";
import { BlockchainsNav } from "../../../layouts/blockchains-nav";
import { tabs } from "../../../layouts/menu-mobile/constant";
import { TopNav } from "../../../layouts/menu-mobile/top-nav";
import { AssetsTable } from "../../../layouts/tables/components/index";
import { Query } from "../top100/models";

export default function Trendings({ tokensBuffer, isMobile, count }) {
  const [blockchain, setBlockchain] = useState("all");
  const [resultsData, setResultsData] = useState({
    data: tokensBuffer,
    count,
  });
  const [filters, setFilters] = useState<Query[]>([
    { action: "", value: [], isFirst: true },
    ...generateFilters("all"),
  ]);
  const [orderBy, setOrderBy] = useState<OrderBy>({
    type: "views_change_24h",
    ascending: false,
    first: true,
  });

  const trendingPath = {
    url: "/trendings",
    name: "Trendings",
    theme: "Crypto",
  };

  useEffect(() => {
    localStorage.setItem("path", JSON.stringify(trendingPath));
  }, []);

  return (
    <>
      {isMobile ? <TopNav list={tabs} active="Trending" isGeneral /> : null}
      <Container>
        <div className="flex flex-col w-full">
          <Title
            title=" Trending cryptocurrencies, fast growing and hidden gems"
            subtitle="Discover hidden gems gaining traction on Mobula, their real time
          price, liquidity and rank (based on visits, trades and 10+ other
          factors)."
            extraCss="mb-5"
          />
          <BlockchainsNav
            isMovers
            blockchain={blockchain}
            setBlockchain={setBlockchain}
            setFilters={setFilters}
          />
          <div className="mt-2.5">
            <AssetsTable
              title="Advanced Settings"
              resultsData={resultsData}
              setResultsData={setResultsData}
              filters={filters}
              orderBy={orderBy}
              setOrderBy={setOrderBy}
              isMobile={isMobile}
            />
          </div>
        </div>
      </Container>
    </>
  );
}