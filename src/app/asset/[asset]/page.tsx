import { cookies } from "next/headers";
import React from "react";
import { Assets } from "../../../features/asset";
import { Asset } from "../../../interfaces/assets";
import { createSupabaseDOClient } from "../../../lib/supabase";
import { fromUrlToName } from "../../../utils/formaters";
import { unformatFilters } from "../../../utils/pages/asset";
import { memoryCache } from "../../../utils/redis";
import AssetLayout from "./layout";

export const fetchAssetData = async ({ params, searchParams }) => {
  const cookieStore = cookies();
  try {
    const cache: Asset = await memoryCache.get(`COIN_${params.asset}`);
    if (cache) {
      return {
        asset: cache,
        key: cache.id,
        tradeHistory: cache.trade_history ?? [],
      };
    }

    const tradeCookie = cookieStore.get("trade-filters")?.value || null;
    const filters = tradeCookie ? unformatFilters(tradeCookie) : null;
    const supabase = createSupabaseDOClient();

    const request = supabase
      .from<Asset>("assets")
      .select(
        "id,logo,price,ath,atl,github,untrack_reason,type,decimals,tags,audit,kyc,volume,website,off_chain_volume,ath_volume,liquidity,ath_liquidity,rank,market_cap,market_cap_diluted,name,symbol,description,twitter,chat,discord,contracts,blockchains,market_score,trust_score,social_score,utility_score,circulating_supply,total_supply,trade_history!left(*),price_change_24h,price_change_1h,price_change_7d,price_change_1m,tracked,assets_social!left(*),launch"
      )
      .or(
        `name.ilike."${fromUrlToName(params.asset)}"` +
          `,name.ilike."${params.asset.split("-").join("%")}"`
      )
      .order("date", { foreignTable: "trade_history", ascending: false })
      .order("market_cap", { ascending: false })
      .limit(20, {
        foreignTable: "trade_history",
      });
    if (filters)
      filters
        .filter((entry) => entry.action)
        .forEach((filter) => {
          request[filter.action](...filter.value);
        });

    const [tradHistoryResult, launchpadsResult] = await Promise.all([
      request,
      supabase.from("launchpads").select("logo,name"),
    ]);

    const { data: tradeHistory } = tradHistoryResult;
    const { data: launchpads } = launchpadsResult;

    const rightAsset =
      tradeHistory?.find(
        (asset) => asset.name.toLowerCase() === fromUrlToName(params.asset)
      ) || tradeHistory?.[0];

    if (rightAsset) {
      memoryCache.set(`COIN_${params.asset}`, rightAsset, 120);
      return {
        asset: rightAsset,
        key: rightAsset.id,
        tradHistory: tradeHistory ?? [],
        launchpads: launchpads ?? [],
      };
    }
    return {
      asset: {},
      error: true,
      holdings: [],
      tradeHistory: [],
      launchpads: launchpads ?? [],
    };
  } catch (e) {
    console.error("error: ", e);
    return {
      asset: "",
      error: true,
      tradeHistory: [],
      launchpads: [],
    };
  }
};

export const AssetPage = async ({ params, searchParams }) => {
  const data = await fetchAssetData({ params, searchParams });

  const { asset, key, tradeHistory, launchpads } = data;

  //   useEffect(() => {
  //     const timeout = setTimeout(() => {
  //       try {
  //         if (asset && asset.id) {
  //           GET("/ping", { id: asset.id, name: asset.name, account }).catch(
  //             () => {}
  //           );

  //           if (asset.name === "Bitcoin") {
  //             // Quest system

  //             GET("/earn/adventure", { name: "Genesis", action: 1, account });
  //             // Quest system
  //             if (
  //               localStorage.getItem("visitedEarn") &&
  //               !localStorage.getItem("Introduction3")
  //             ) {
  //               localStorage.setItem("Introduction3", "true");
  //             }
  //           }
  //         }
  //       } catch (e) {
  //         GET("/ping", {
  //           id: asset.id,
  //           name: asset.name,
  //         }).catch(() => {});
  //       }
  //     }, 1000);

  //     return () => {
  //       clearTimeout(timeout);
  //     };
  //   }, [account, asset]);

  //   useEffect(() => {
  //     if (error && router.isReady) {
  //       router.push("/");
  //     }
  //   }, [error, router]);

  //   useEffect(() => {
  //     const { chartType } = getUserPrefCookie(cookies);
  //     pushData("Asset Session", {
  //       "Chart Type": chartType ?? "Candlestick",
  //       "Asset Name": asset.name ?? "Unknown",
  //       "Asset Symbol": asset.symbol ?? "Unknown",
  //     });
  //   }, []);

  //   const title = `${asset.name} Real time price, ${asset.symbol} chart and liquidity on Mobula`;

  //   if (router.isFallback || !asset.id) {
  //     return null;
  //   }

  return (
    <AssetLayout props={data as never}>
      <Assets />
    </AssetLayout>
  );
};

// {/* <Head>
//   <title>{title}</title>
// </Head>
// <meta
//   property="og:image"
//   content="https://mobula.fi/metaimage/Generic/others.png"
// />
// <meta
//   name="twitter:image"
//   content="https://mobula.fi/metaimage/Generic/others.png"
// />
// <meta
//   itemProp="image"
//   content="https://mobula.fi/metaimage/Generic/others.png"
// /> */}

export default AssetPage;
