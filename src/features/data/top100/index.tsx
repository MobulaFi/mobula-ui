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
import { AssetsTable } from "../../../layouts/tables/components";
import { BoxMiddle } from "./components/box-middle";
import { BoxRight } from "./components/box-right";
import { Portfolio } from "./components/portfolio";
import { useTop100 } from "./context-manager";
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
  const { isMobile } = useTop100();
  const [resultsData, setResultsData] = useState({ data: bufferTokens, count });
  const [showPage, setShowPage] = useState(0);
  const [activePage, setActivePage] = useState(1);
  const supabase = createSupabaseDOClient();
  const [isPageLoading, setIsPageLoading] = useState(false);
  const tableRef = React.useRef<HTMLDivElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const [isButtonVisible, setIsButtonVisible] = useState(false);
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
    if (activePage === 1) return;
    setIsPageLoading(true);
    const query = supabase
      .from("assets")
      .select(TABLE_ASSETS_QUERY, {
        count: "exact",
      })
      .order("market_cap", { ascending: false })
      .range(activePage * 100 - 100, activePage * 100 - 1);
    if (filters) {
      filters
        .filter((entry) => entry.action)
        .forEach((filter) => {
          query[filter.action]?.(...filter.value);
        });
    }
    const result = await query.limit(100);

    if (result.error) setIsPageLoading(false);
    else {
      setResultsData((prev) => ({
        ...prev,
        data: [...prev.data, ...result.data],
        count: result.count,
      }));

      setIsPageLoading(false);
    }
  };

  useEffect(() => {
    if (tableRef?.current) fetchAssets();
  }, [activePage]);

  let ticking = false;

  useEffect(() => {
    const appContainer = document.getElementById("app");
    let ticking = false;

    const handleScroll = () => {
      if (!appContainer || !tableRef.current) return;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          const windowHeight = appContainer.clientHeight; // Utilisez clientHeight ici
          const scrollPosition = appContainer.scrollTop + windowHeight; // Utilisez scrollTop ici
          const triggerHeight = windowHeight * 1.5;

          setIsButtonVisible(
            scrollPosition > triggerHeight && !isButtonVisible
          );

          const tableBottomPosition =
            tableRef.current.offsetTop + tableRef.current.offsetHeight;

          if (scrollPosition >= tableBottomPosition * 0.8 && !isPageLoading) {
            // Supposons que resultsData est défini ailleurs
            setActivePage(Math.round(resultsData?.data?.length / 100) + 1);
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    appContainer.addEventListener("scroll", handleScroll);

    return () => {
      appContainer.removeEventListener("scroll", handleScroll);
    };
  }, [isPageLoading, isButtonVisible]);

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
            <AssetsTable
              resultsData={resultsData}
              setResultsData={setResultsData}
              orderBy={orderBy}
              setOrderBy={setOrderBy}
              filters={filters}
              isTop100
              showRank
              isMobile={isMobile}
              // noResult={!(resultsData?.data?.length > 0)}
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
