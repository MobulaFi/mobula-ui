"use client";
import { createSupabaseDOClient } from "lib/supabase";
import React, { useEffect, useState } from "react";
import { AiOutlineArrowUp } from "react-icons/ai";
import Swiper from "swiper";
import "swiper/css";
import { register } from "swiper/element/bundle";
import { Button } from "../../../components/button";
import { Container } from "../../../components/container";
import { Spinner } from "../../../components/spinner";
import { OrderBy, TableAsset } from "../../../interfaces/assets";
import { tabs } from "../../../layouts/menu-mobile/constant";
import { TopNav } from "../../../layouts/menu-mobile/top-nav";
import BoxMiddle from "./components/box-middle";
import BoxRight from "./components/box-right";
import Portfolio from "./components/portfolio";
import { Top100Table } from "./components/table";
import { useFilter } from "./hooks/useFilter";
import { Query, View } from "./models";
import { TABLE_ASSETS_QUERY } from "./utils";
import { Views } from "./views";

interface Top100Props {
  tokens: TableAsset[];
  count: number;
  cookieTop100?: View;
  defaultFilter: Query[] | null;
  metrics?: {
    fear_and_greed_value: number;
    fear_and_greed_value_classification: string;
  } | null;
  actualView?: View;
}

register();

export const Top100 = ({
  tokens: bufferTokens,
  count,
  defaultFilter,
  metrics,
}: Top100Props) => {
  const [orderBy, setOrderBy] = useState<OrderBy>({
    type: "market_cap",
    ascending: false,
    first: true,
  });
  const [resultsData, setResultsData] = useState({ data: bufferTokens, count });
  const [showPage, setShowPage] = useState(0);
  const [activePage, setActivePage] = useState(1);
  const supabase = createSupabaseDOClient();
  const [isPageLoading, setIsPageLoading] = useState(false);
  const tableRef = React.useRef<HTMLDivElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const [isButtonVisible, setIsButtonVisible] = useState(false);
  const [initialTableHeight, setInitialTableHeight] = useState(0);
  const [isFetching, setIsFetching] = useState(false);
  const [filters, setFilters] = useState<Query[] | null>(
    defaultFilter || [{ action: "", value: [], isFirst: true }]
  );
  useFilter({ setFilters, orderBy });

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
  }, []);

  const fetchAssets = async () => {
    if (activePage === 1) {
      setIsFetching(false);
      return;
    }
    setIsPageLoading(true);
    const start = (activePage - 1) * 25;
    const end = activePage * 25 - 1;
    const query = supabase
      .from("assets")
      .select(TABLE_ASSETS_QUERY, {
        count: "exact",
      })
      .order("market_cap", { ascending: false })
      .range(start, end);
    if (filters) {
      filters
        .filter((entry) => entry.action)
        .forEach((filter) => {
          query[filter.action]?.(...filter.value);
        });
    }
    const result = await query.limit(25);

    if (result.error) {
      setIsPageLoading(false);
      setIsFetching(false);
    } else {
      const newData = result.data;
      setResultsData((prev) => {
        const existingNames = new Set(prev.data.map((item) => item.name));
        const uniqueNewData = newData.filter(
          (item) => !existingNames.has(item.name)
        );
        return {
          ...prev,
          data: [...prev.data, ...uniqueNewData],
          count: result.count,
        };
      });
      setIsFetching(false);
      setIsPageLoading(false);
    }
  };

  useEffect(() => {
    if ((isFetching && tableRef?.current) || !tableRef?.current) return;
    setIsFetching(true);
    fetchAssets();
  }, [activePage]);

  useEffect(() => {
    const handleScroll = () => {
      if (!tableRef.current) return;

      const windowHeight = window.innerHeight;
      const scrollPosition = window.scrollY + windowHeight;

      setIsButtonVisible(scrollPosition > windowHeight * 1.5);

      const tableBottomPosition =
        tableRef.current.offsetTop + tableRef.current.offsetHeight;

      if (
        scrollPosition >= tableBottomPosition * 0.6 &&
        !isPageLoading &&
        !isFetching
      ) {
        setActivePage(activePage + 1);
      }
    };

    const updateTableHeight = () => {
      if (tableRef.current) {
        setInitialTableHeight(tableRef.current.offsetHeight);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", updateTableHeight);

    updateTableHeight();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateTableHeight);
    };
  }, [isPageLoading, isButtonVisible, isFetching]);

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  function detectMob() {
    const toMatch = [
      /Android/i,
      /webOS/i,
      /iPhone/i,
      /iPad/i,
      /iPod/i,
      /BlackBerry/i,
      /Windows Phone/i,
    ];

    return toMatch.some((toMatchItem) => {
      try {
        return navigator?.userAgent?.match(toMatchItem);
      } catch (e) {
        return false;
      }
    });
  }
  const isMobile = detectMob();
  return (
    <>
      <TopNav list={tabs} active="Home" isGeneral />
      <div className="flex flex-col bg-light-bg-primary dark:bg-dark-bg-primary overflow-x-hidden">
        <div className="flex bg-light-bg-table dark:bg-dark-bg-table pb-5 md:pb-2.5 w-full">
          <Container
            extraCss="lg:flex flex-row max-w-[1300px] bg-light-bg-table dark:bg-dark-bg-table 
            justify-between mb-0 md:mb-0 pb-0 overflow-x-scroll w-full hidden"
          >
            <div className="flex w-95per mx-auto ">
              <div className="swiper">
                <div className="swiper-wrapper">
                  <div className="swiper-slide flex justify-center">
                    <Portfolio showPageMobile={showPage} />
                  </div>
                  <div className="swiper-slide flex justify-center">
                    <BoxMiddle showPageMobile={showPage} metrics={metrics} />
                  </div>
                  <div className="swiper-slide flex justify-center">
                    <BoxRight showPageMobile={showPage} />
                  </div>
                </div>
              </div>
            </div>
          </Container>
          <Container extraCss="scroll flex lg:hidden flex-row max-w-[1300px] bg-light-bg-table dark:bg-dark-bg-table justify-between mb-0 overflow-x-scroll md:mb-0 mt-7 md:mt-2.5 min-h-full">
            <Portfolio />
            <BoxMiddle metrics={metrics} />
            <BoxRight />
          </Container>
        </div>
      </div>
      <div className="bg-light-bg-table dark:bg-dark-bg-table">
        <Views setResultsData={setResultsData} />
        <Container extraCss="flex-row max-w-[1300px] justify-between mb-0 mt-0 overflow-x-hidden lg:mt-0 mb-0 md:mb-0">
          <div className="w-full h-full" ref={tableRef}>
            <Top100Table
              resultsData={resultsData}
              setResultsData={setResultsData}
              orderBy={orderBy}
              setOrderBy={setOrderBy}
              filters={filters}
              isTop100
              showRank
              isMobile={isMobile}
            />
            {isPageLoading ? (
              <div className="w-full h-[60px] mb-[50px] flex items-center justify-center">
                <Spinner extraCss="h-[30px] w-[30px]" />
              </div>
            ) : null}
          </div>
        </Container>
      </div>
      {isButtonVisible ? (
        <Button
          extraCss="fixed bottom-[50px] md:bottom-[100px] right-[50px] md:right-[30px] z-[2] rounded-full
         h-[45px] w-[45px] min-h-[45px] flex items-center justify-center shadow-lg"
          ref={buttonRef}
          onClick={scrollTop}
        >
          <AiOutlineArrowUp className="text-2xl text-light-font-100 dark:text-dark-font-100 font-bold" />
        </Button>
      ) : null}
    </>
  );
};
