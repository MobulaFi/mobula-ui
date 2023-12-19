import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { defaultFilter, defaultTop100 } from "features/data/top100/constants";
import { Metadata } from "next";
import { cookies, headers } from "next/headers";
import React from "react";
import { Top100 } from "../features/data/top100";
import { Top100Provider } from "../features/data/top100/context-manager";
import { TABLE_ASSETS_QUERY } from "../features/data/top100/utils";
import {
  INewsGeneral,
  StaticHomeQueries,
  View,
} from "../interfaces/pages/top100";
import { createSupabaseDOClient } from "../lib/supabase";

export const dynamic = "force-static";
export const revalidate = 86400;
export const runtime = "edge";

const fetchAssetsAndViews = async ({ searchParams }) => {
  const getCookie = (name: string) => cookies().get(name);
  const supabase = createSupabaseDOClient();
  const portfolioCookie = getCookie("portfolio")?.value;
  const actualPortfolio = portfolioCookie ? portfolioCookie : null;
  const page = searchParams.page;
  const userAgent: string = headers().get("user-agent") || "";
  const isMobile = /mobile/i.test(userAgent) && !/tablet/i.test(userAgent);
  const isTablet = /tablet|ipad|playbook|silk/i.test(userAgent);
  const newCookies = cookies();

  let actualView: View | null = null;

  const filteredValues: { action: string; value: any[] }[] = [];
  filteredValues.push(...defaultFilter);
  actualView = {
    ...defaultTop100,
    name: "All",
    color: "grey",
    isFirst: true,
    disconnected: true,
  };

  const getViewQuery = async () => {
    const query = supabase
      .from("assets")
      .select(TABLE_ASSETS_QUERY, {
        count: "exact",
      })
      .order("market_cap", { ascending: false });

    if (filteredValues) {
      filteredValues
        .filter((entry) => entry.action)
        .forEach((filter) => {
          query[filter.action]?.(...filter.value);
        });
    }
    const result = await query.limit(100);
    return result;
  };

  async function fetchNews(): Promise<PostgrestSingleResponse<INewsGeneral>> {
    return supabase
      .from("news")
      .select("news, news_count, summary, created_at")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();
  }

  const queries: StaticHomeQueries = [
    supabase
      .from("metrics")
      .select("fear_and_greed_value,fear_and_greed_value_classification")
      .match({ id: 1 })
      .single(),
    getViewQuery(),
    supabase
      .from("assets")
      .select("name,price")
      .eq("name", "Ethereum")
      .single(),
    supabase.from("assets").select("name,price").eq("name", "Bitcoin").single(),
    fetchNews(),
  ];

  const [
    { data: metrics },
    { data, count },
    { data: ethPrice },
    { data: btcPrice },
    { data: aiNews },
  ] = await Promise.all(queries);

  const props = {
    tokens: data || [],
    metrics,
    count,
    ethPrice,
    btcPrice,
    actualView,
    aiNews,
    filteredValues,
    actualPortfolio,
    page,
    isMobile,
    isTablet,
    cookies: newCookies ?? "",
  };

  return props;
};

export const metadata: Metadata = {
  title: "Crypto Live Prices, Market caps, Charts and Volumes | Mobula",
  description:
    "Price, volume, liquidity, and market cap of any crypto, in real-time. Track crypto information & insights, buy at best price, analyse your wallets and more.",
  keywords: "Mobula, Mobula crypto, Mobula Crypto Data Aggregator",
};

const HomePage = async ({ searchParams }) => {
  const url = headers();
  const props = await fetchAssetsAndViews({ searchParams });
  const description =
    "Price, volume, liquidity, and market cap of any crypto, in real-time. Track crypto information & insights, buy at best price, analyse your wallets and more.";
  const title = "Crypto Live Prices, Market caps, Charts and Volumes | Mobula";
  return (
    <>
      <meta property="og:title" content={title} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta
        property="og:image"
        content="https://mobula.fi/metaimage/Generic/others.png"
      />
      <meta
        name="twitter:image"
        content="https://mobula.fi/metaimage/Generic/others.png"
      />
      <meta
        itemProp="image"
        content="https://mobula.fi/metaimage/Generic/others.png"
      />
      <meta name="url" content="https://mobula.fi" />
      <Top100Provider
        activeViewCookie={props.actualView}
        ethPrice={props.ethPrice}
        btcPrice={props.btcPrice}
        page={props.page}
        aiNews={props.aiNews}
        isMobile={props.isMobile}
        isTablet={props.isTablet}
      >
        {/* <Suspense fallback={<p>Loading feed...</p>}> */}
        <Top100
          tokens={props.tokens}
          count={props.count}
          defaultFilter={props.filteredValues}
          metrics={props.metrics}
        />
        {/* </Suspense> */}
      </Top100Provider>
    </>
  );
};

export default HomePage;
