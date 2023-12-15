"use client";
import { RefObject, useEffect, useRef, useState } from "react";
import { Container } from "../../../components/container";
import { Title } from "../../../components/fonts";
import { BlockchainsNav } from "../../../layouts/blockchains-nav";
import { tabs } from "../../../layouts/menu-mobile/constant";
import { TopNav } from "../../../layouts/menu-mobile/top-nav";
import { createSupabaseDOClient } from "../../../lib/supabase";
import { ButtonSelectorMobile } from "./components/button-selector-mobile";
import { MoversTable } from "./components/table-mover";
import { MoversType } from "./models";

interface MoversProps {
  gainersBuffer: MoversType[];
  losersBuffer: MoversType[];
}

export const Movers = ({ gainersBuffer, losersBuffer }: MoversProps) => {
  const gainersRef: RefObject<HTMLDivElement> = useRef();
  const [isGainer, setIsGainer] = useState(true);
  const losersRef: RefObject<HTMLDivElement> | undefined = useRef();
  const [blockchain, setBlockchain] = useState("all");
  const [isFirstRequest, setIsFirstRequest] = useState(true);
  const [activeTab, setActiveTab] = useState("Gainers");
  const [gainers, setGainers] = useState<MoversType[]>(
    (gainersBuffer as MoversType[]) || []
  );
  const [losers, setLosers] = useState<MoversType[]>(
    (losersBuffer as MoversType[]) || []
  );

  const moverPath = {
    url: "/movers",
    name: "Gainers & Losers",
    theme: "Crypto",
  };

  useEffect(() => {
    localStorage.setItem("path", JSON.stringify(moverPath));
  }, []);

  useEffect(() => {
    localStorage.setItem("path", JSON.stringify(moverPath));
  }, []);

  useEffect(() => {
    if (isFirstRequest) return;
    const supabase = createSupabaseDOClient();
    const winnersQuery = supabase
      .from("assets")
      .select(
        "id,name,price_change_24h,global_volume,off_chain_volume,symbol,logo,market_cap, price, rank,contracts,blockchains"
      )
      .gte("price_change_24h", 0)
      .order("price_change_24h", { ascending: false })
      .filter("liquidity", "gt", 1000)
      .filter("global_volume", "gt", 1000);

    const loserQuery = supabase
      .from("assets")
      .select(
        "id,name,price_change_24h,global_volume,off_chain_volume,symbol,logo,market_cap, price, rank,contracts,blockchains"
      )
      .lte("price_change_24h", 0)
      .order("price_change_24h", { ascending: true })
      .filter("liquidity", "gt", 1000)
      .filter("global_volume", "gt", 1000);

    if (blockchain !== "all") {
      loserQuery.contains("blockchains", [blockchain]);
      winnersQuery.contains("blockchains", [blockchain]);
    }

    winnersQuery.limit(100).then((r) => {
      if (r.error) {
        // console.log(r.error);
      } else {
        setGainers(
          r.data.filter((entry) => entry.contracts.length > 0).slice(0, 25)
        );
      }
    });
    loserQuery.limit(100).then((r) => {
      if (r.error) {
        // console.log(r.error);
      } else {
        setLosers(
          r.data.filter((entry) => entry.contracts.length > 0).slice(0, 25)
        );
      }
    });
  }, [blockchain]);

  return (
    <>
      <TopNav list={tabs} active="G&L" isGeneral />
      <Container>
        <div className="flex flex-col">
          <Title
            title="Biggest Crypto Gainers and Losers"
            subtitle="Discover the biggest crypto movers of the day, their real time price, chart, liquidity, and more."
            extraCss="mb-5 md:mx-0"
          />
          <div className="item-center justify-between hidden md:flex w-full mb-2.5">
            <div className="w-full flex items-center">
              <ButtonSelectorMobile
                onClick={() => setIsGainer(true)}
                isGainer
                activeTab={isGainer === true}
              />
              <ButtonSelectorMobile
                onClick={() => setIsGainer(false)}
                activeTab={isGainer === false}
              />
            </div>
          </div>
          <div className="flex w-full md:pt-0">
            <BlockchainsNav
              isMovers
              blockchain={blockchain}
              setBlockchain={setBlockchain}
              setIsFirstRequest={setIsFirstRequest}
            />
          </div>
        </div>
        <div className="flex mt-2.5 md:mt-0 lg:overflow-x-scroll scroll">
          <div
            className={`flex mr-3 lg:mr-0 w-2/4 lg:w-full ${
              isGainer ? "" : "lg:hidden"
            }`}
            id="left"
            ref={gainersRef}
          >
            <MoversTable assets={isGainer ? gainers : losers} />
          </div>
          <div
            className={`flex ml-3 lg:ml-0 w-2/4 lg:w-full ${
              !isGainer ? "" : "lg:hidden"
            }`}
            ref={losersRef}
          >
            <MoversTable assets={losers} />
          </div>
        </div>
      </Container>
    </>
  );
};
