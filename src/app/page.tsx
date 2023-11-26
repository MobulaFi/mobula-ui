import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { kv } from "@vercel/kv";
import {
  defaultCategories,
  defaultFilter,
  defaultTop100,
} from "features/data/top100/constants";
import { blockchainsContent } from "mobula-lite/lib/chains/constants";
import { cookies, headers } from "next/headers";
import React from "react";
import { Top100 } from "../features/data/top100";
import { Top100Provider } from "../features/data/top100/context-manager";
import {
  TABLE_ASSETS_QUERY,
  unformatActiveView,
} from "../features/data/top100/utils";
import {
  INewsGeneral,
  StaticHomeQueries,
  View,
} from "../interfaces/pages/top100";
import { createSupabaseDOClient } from "../lib/supabase";

const fetchAssetsAndViews = async ({ searchParams }) => {
  const getCookie = (name: string) => cookies().get(name);
  const supabase = createSupabaseDOClient();
  const address = getCookie("address")?.value;
  const viewCookie = getCookie("actual-view")?.value;
  const mainUserView = getCookie(`view-${address}`)?.value;
  const portfolioCookie = getCookie("portfolio")?.value;
  const actualPortfolio = portfolioCookie ? portfolioCookie : null;
  const page = searchParams.page;
  const userAgent: string = headers().get("user-agent") || "";
  const isMobile = /mobile/i.test(userAgent) && !/tablet/i.test(userAgent);
  const isTablet = /tablet|ipad|playbook|silk/i.test(userAgent);
  const newCookies = cookies();

  let actualView: View | null = null;
  let allView: View | null = null;
  const maxValue = 100_000_000_000_000_000;

  actualView = unformatActiveView(viewCookie, "others", mainUserView, address);
  allView = unformatActiveView(mainUserView, "all", viewCookie, address);

  const filteredValues: { action: string; value: any[] }[] = [];

  if (actualView?.filters && address) {
    Object.entries(actualView?.filters).forEach(
      ([key, value]: [
        key: string,
        value: { from: number; to: number } | string[] | any
      ]) => {
        const defaultValue = { from: 0, to: maxValue };
        const defaultFilterValue = JSON.stringify(defaultValue);
        const isPriceChange = key === "price_change";

        if (
          JSON.stringify(value) !== defaultFilterValue &&
          key !== "blockchains"
        ) {
          if (
            value.from !== defaultTop100.filters[key].from &&
            key === "volume"
          )
            filteredValues.push({
              action: "filter",
              value: ["global_volume", "gte", value.from],
            });
          else if (value.from !== defaultTop100.filters[key].from)
            filteredValues.push({
              action: "filter",
              value: [isPriceChange ? `${key}_24h` : key, "gte", value.from],
            });
          if (value.to !== defaultTop100.filters[key].to && key === "volume")
            filteredValues.push({
              action: "filter",
              value: ["global_volume", "lte", value.to],
            });
          else if (value.to !== defaultTop100.filters[key].to)
            filteredValues.push({
              action: "filter",
              value: [isPriceChange ? `${key}_24h` : key, "lte", value.to],
            });
        }

        if (key === "tokens") {
          filteredValues.push({
            action: "in",
            value: ["id", value],
          });
        }
        if (
          key === "blockchains" &&
          value.length !== Object.keys(blockchainsContent)?.length
        ) {
          const filters = value.map((v) => `blockchains.cs.{${v}}`);
          const filterString = filters.join(",");
          filteredValues.push({
            action: "or",
            value: [filterString],
          });
        }
        if (
          key === "categories" &&
          value.length !== defaultCategories?.length
        ) {
          const filters = value.map((v) => `tags.cs.{${v}}`);
          const filterString = filters.join(",");
          filteredValues.push({
            action: "or",
            value: [filterString],
          });
        }
      }
    );
    if (filteredValues.length === 0) filteredValues.push(...defaultFilter);
  } else filteredValues.push(...defaultFilter);

  if (!actualView && Object.keys(actualView)?.length === 0) {
    if (!allView)
      actualView = {
        ...defaultTop100,
        name: "All",
        color: "grey",
        isFirst: true,
        disconnected: true,
      };
    else actualView = { ...(allView as View), disconnected: false };
  }

  try {
    const assetsCache = await kv.hgetall("assets");
    if (assetsCache) {
      const props = {
        tokens: assetsCache.data || [],
        metrics: assetsCache.metrics,
        count: assetsCache.count,
        ethPrice: assetsCache.ethPrice,
        btcPrice: assetsCache.btcPrice,
        actualView,
        actualPortfolio,
        allView,
        aiNews: assetsCache.aiNews,
        filteredValues,
        page,
        isMobile,
        isTablet,
        cookies: newCookies ?? "",
      };

      console.log("PHASE AFTER CALL CACHED", new Date(Date.now()));
      return props;
    }
  } catch (error) {
    // Handle errors
  }

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

  try {
    await kv.hset("assets", {
      metrics,
      count,
      data,
      ethPrice,
      btcPrice,
      aiNews,
    });
  } catch (error) {}

  const props = {
    tokens: data || [],
    metrics,
    count,
    ethPrice,
    btcPrice,
    actualView,
    actualPortfolio,
    allView,
    aiNews,
    filteredValues,
    page,
    isMobile,
    isTablet,
    cookies: newCookies ?? "",
  };

  return props;
};

const HomePage = async ({ searchParams }) => {
  const url = headers();
  const props = await fetchAssetsAndViews({ searchParams });

  const description =
    "Price, volume, liquidity, and market cap of any crypto, in real-time. Track crypto information & insights, buy at best price, analyse your wallets and more.";
  const title = "Crypto Live Prices, Market caps, Charts and Volumes - Mobula";

  return (
    <>
      {/* <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="twitter:description" content={description} />
        <meta property="og:title" content={title} />
        <meta name="twitter:title" content={title} />
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
        <meta name="keywords" content="Mobula Crypto Data Aggregator" />
      </Head> */}
      <Top100Provider
        activeViewCookie={props.actualView as any}
        portfolioCookie={props.actualPortfolio as any}
        ethPrice={props.ethPrice as any}
        btcPrice={props.btcPrice as any}
        page={props.page}
        aiNews={props.aiNews as any}
        isMobile={props.isMobile}
        isTablet={props.isTablet}
      >
        <Top100
          tokens={props.tokens}
          metrics={props.metrics as any}
          count={props.count}
          defaultFilter={props.filteredValues}
          actualView={props.actualView as any}
          cookieTop100={props.allView as any}
        />
      </Top100Provider>
    </>
  );
};

export default HomePage;
