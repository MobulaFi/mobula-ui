"use client";
import { useEffect, useState } from "react";
import { Container } from "../../../components/container";
import { Title } from "../../../components/fonts";
import { Spinner } from "../../../components/spinner";
import { OrderBy } from "../../../interfaces/assets";
import { tabs } from "../../../layouts/menu-mobile/constant";
import { TopNav } from "../../../layouts/menu-mobile/top-nav";
import { BasicBody } from "../../../layouts/new-tables/basic-table/basic-body";
import { CommonTableHeader } from "../../../layouts/new-tables/basic-table/basic-wrap";

export default function Trendings({ tokensBuffer, isMobile, count }) {
  const [isLoading, setIsLoading] = useState(true);
  const [resultsData, setResultsData] = useState({
    data: tokensBuffer,
    count,
  });

  const [orderBy, setOrderBy] = useState<OrderBy>({
    type: "trending_score",
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

  useEffect(() => {
    if (resultsData?.data?.length > 0) {
      setIsLoading(false);
    }
  }, [resultsData]);

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
          <div className="mt-2.5">
            {!isLoading ? (
              <CommonTableHeader
                orderBy={orderBy}
                setOrderBy={setOrderBy}
                hideDEXVolume
              >
                {resultsData?.data
                  ?.filter((entry) => entry.id)
                  ?.map((token, i) => (
                    <BasicBody
                      key={token?.id}
                      token={token}
                      index={i}
                      isTrending
                    />
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
}
