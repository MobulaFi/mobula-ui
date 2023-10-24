"use client";
import { Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Swiper from "swiper";
import "swiper/css";
import { register } from "swiper/element/bundle";
import { MainContainer } from "../../../components/container";
import { OrderBy, TableAsset } from "../../../interfaces/assets";
import { tabs } from "../../../layouts/menu-mobile/constant";
import { TopNav } from "../../../layouts/menu-mobile/top-nav";
import { AssetsTable } from "../../../layouts/tables/components";
import { useColors } from "../../../lib/chakra/colorMode";
import { BoxMiddle } from "./components/box-middle";
import { BoxRight } from "./components/box-right";
import { Pagination } from "./components/pagination";
import { Portfolio } from "./components/portfolio";
import { useTop100 } from "./context-manager";
import { useFilter } from "./hooks/useFilter";
import { Query, View } from "./models";
import { Views } from "./views";

register();

export const Top100 = ({
  tokens: bufferTokens,
  count,
  metrics,
  cookieTop100,
  defaultFilter,
  actualView,
  marketCapTotal,
}: {
  tokens: TableAsset[];
  count: number;
  cookieTop100: View;
  defaultFilter: Query[] | null;
  metrics: {
    fear_and_greed_value: number;
    fear_and_greed_value_classification: string;
  };
  actualView: View;
  marketCapTotal: {
    market_cap_history: [number, number][];
    btc_dominance_history: [number, number][];
    market_cap_change_24h: number;
  };
}) => {
  const { bgTable, bgMain } = useColors();
  const [orderBy, setOrderBy] = useState<OrderBy>({
    type: "market_cap",
    ascending: false,
    first: true,
  });
  const { isMobile, setTotalMarketCap, setBtcDominance, setMarketCapChange } =
    useTop100();
  const [resultsData, setResultsData] = useState({ data: bufferTokens, count });
  const [showPage, setShowPage] = useState(0);
  const [filters, setFilters] = useState<Query[] | null>(
    defaultFilter || [{ action: "", value: [], isFirst: true }]
  );
  useFilter({ setFilters, orderBy });

  useEffect(() => {
    setTotalMarketCap(marketCapTotal.market_cap_history || []);
    setBtcDominance(
      marketCapTotal?.btc_dominance_history?.map(([time, value]) => [
        time,
        value * 100,
      ]) || []
    );
    setMarketCapChange(marketCapTotal?.market_cap_change_24h || 0);
  }, [marketCapTotal]);

  useEffect(() => {
    const swiper = new Swiper(".swiper", {
      speed: 300,
      spaceBetween: 0,
      autoplay: false,
      loop: false,
      modules: [],
      centerInsufficientSlides: true,
      longSwipes: false,
    });
    console.log(swiper);
  }, []);

  return (
    <>
      {isMobile ? <TopNav list={tabs} active="Home" isGeneral /> : null}
      <Flex direction="column" bg={bgMain} overflowX="hidden">
        <Flex w="100%" bg={bgTable} pb={["10px", "10px", "20px"]}>
          {isMobile ? (
            <MainContainer
              maxWidth="1300px"
              mb="0px"
              justify="space-between"
              direction="row"
              bg={bgTable}
              display="flex"
              pb="0px"
              w="100%"
            >
              <Flex w="95%" mx="auto">
                <div className="swiper">
                  <div className="swiper-wrapper">
                    <div
                      className="swiper-slide"
                      style={{ display: "flex", justifyContent: "center" }}
                    >
                      <Portfolio showPageMobile={showPage} />
                    </div>
                    <div
                      className="swiper-slide"
                      style={{ display: "flex", justifyContent: "center" }}
                    >
                      <BoxMiddle showPageMobile={showPage} metrics={metrics} />
                    </div>
                    <div
                      className="swiper-slide"
                      style={{ display: "flex", justifyContent: "center" }}
                    >
                      <BoxRight showPageMobile={showPage} />
                    </div>
                  </div>
                </div>
              </Flex>
            </MainContainer>
          ) : (
            <MainContainer
              maxWidth="1300px"
              mb="0px"
              justify="space-between"
              direction="row"
              bg={bgTable}
              overflowX="scroll"
              className="scroll"
            >
              <Portfolio />
              <BoxMiddle metrics={metrics} />
              <BoxRight />
            </MainContainer>
          )}
        </Flex>
        <Views
          actualView={actualView}
          cookieTop100={cookieTop100}
          setResultsData={setResultsData}
        />
      </Flex>
      <Flex bg={bgTable}>
        <MainContainer
          maxWidth="1300px"
          mb="0px"
          justify="space-between"
          direction="row"
          w={["100%", "95%", "90%", "90%"]}
          mt="0px"
          overflowX="hidden"
        >
          <AssetsTable
            resultsData={resultsData}
            setResultsData={setResultsData}
            bg={bgTable}
            orderBy={orderBy}
            setOrderBy={setOrderBy}
            filters={filters}
            isTop100
            showRank
            isMobile={isMobile}
            // noResult={!(resultsData?.data?.length > 0)}
          />
        </MainContainer>
      </Flex>

      {resultsData.count > 100 && (
        <Pagination maxPage={Math.floor(resultsData.count / 100)} />
      )}
      {/* 
      <Flex h="1400px" w="100%" bg={bgTable} pt="150px" direction="column">
        <Flex maxW="1300px" mx="auto" h="200px">
          <Button bg="#FFA519" h="40px" w="120px">
            Depot
          </Button>
        </Flex>
        <Flex maxW="1300px" mx="auto" h="200px">
          <Button bg="rebeccapurple" h="40px" w="120px">
            Depot
          </Button>
        </Flex>
        <Flex maxW="1300px" mx="auto" h="200px">
          <Button bg="#E4C9B0" h="40px" w="120px" color="rgba(0,0,0,0.8)">
            Depot
          </Button>
        </Flex>
      </Flex> */}
    </>
  );
};
