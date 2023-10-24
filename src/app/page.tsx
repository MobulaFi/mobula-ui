import { PostgrestSingleResponse } from "@supabase/supabase-js";
import {
  defaultCategories,
  defaultFilter,
  defaultTop100,
} from "features/data/home/constants";
import { blockchainsContent } from "mobula-lite/lib/chains/constants";
import { cookies, headers } from "next/headers";
import { Top100Provider } from "../features/data/Home/context-manager";
import { Top100 } from "../features/data/home";
import {
  TABLE_ASSETS_QUERY,
  timeout,
  unformatActiveView,
} from "../features/data/home/utils";
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

  // const getViewKey = () => {
  //   if (!actualView?.filters?.length) return null;
  //   let VIEW_KEY = `HOMEPAGE_VIEW-${address}-${actualView?.name}`;
  //   Object.entries(actualView?.filters).forEach(
  //     ([key, value]: [string, { from: number; to: number }]) => {
  //       if (
  //         key !== "blockchains" &&
  //         key !== "price_change" &&
  //         key !== "categories" &&
  //         value.from !== 0 &&
  //         value.to !== maxValue
  //       ) {
  //         VIEW_KEY += `_${key}-${value.from}-${value.to}`;
  //       }
  //     }
  //   );
  //   console.log(VIEW_KEY, "VIEW_KEY");
  //   return VIEW_KEY;
  // };

  // const viewKey = getViewKey();
  // const viewCache = memoryCache.get(viewKey || 'DEFAULT');

  // if (viewCache) {
  //   const props = {
  //     tokens: viewCache[0] || [],
  //     count: viewCache[1],
  //     metrics: viewCache[2],
  //     marketCapTotal: viewCache[3],
  //     ethPrice: viewCache[4],
  //     btcPrice: viewCache[5],
  //     actualView,
  //     isMobile,
  //     isTablet,
  //     cookies: req.headers.cookie ?? '',
  //     page,
  //   } as any;

  //   console.log('PHASE AFTER CALL CACHED', new Date(Date.now()));
  //   return {
  //     props,
  //   };
  // }

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
    Promise.race([
      fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/1/market/total`),
      timeout(7000),
    ]),
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
    res,
    { data: ethPrice },
    { data: btcPrice },
    { data: aiNews },
  ] = await Promise.all(queries);

  let marketCapTotal = {
    market_cap_history: [],
    btc_dominance_history: [],
    market_cap_change_24h: 0,
  };

  try {
    marketCapTotal = await res.json();
  } catch (e) {
    console.log("ERROR FETCHING MARKET CAP TOTAL", e);
  }
  const newCookies = cookies();
  const props = {
    marketCapTotal,
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

async function HomePage({ searchParams }) {
  const url = headers();
  const props = await fetchAssetsAndViews({ searchParams });

  console.log("propsprops", props.actualView);

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
          marketCapTotal={props.marketCapTotal}
        />
      </Top100Provider>
    </>
  );
}

export default HomePage;
