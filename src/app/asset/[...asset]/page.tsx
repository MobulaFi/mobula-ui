import { BaseAssetProvider } from "features/asset/context-manager";
import { ShowMoreProvider } from "features/asset/context-manager/navActive";
import { NavActiveProvider } from "features/asset/context-manager/showMore";
import { cookies } from "next/headers";
import { Assets } from "../../../features/asset";
import { Asset } from "../../../interfaces/assets";
import { createSupabaseDOClient } from "../../../lib/supabase";
import { fromUrlToName } from "../../../utils/formaters";
import { unformatFilters } from "../../../utils/pages/asset";

export const revalidate = 3600;
export const dynamic = "force-static";
export const dynamicParams = true;

async function fetchAssetData({ asset }) {
  const cookieStore = cookies();
  try {
    const tradeCookie = cookieStore.get("trade-filters")?.value || null;
    const filters = tradeCookie ? unformatFilters(tradeCookie) : null;
    const supabase = createSupabaseDOClient();
    console.log("asset", asset);
    const request = supabase
      .from<Asset>("assets")
      .select(
        "id,logo,price,ath,atl,github,untrack_reason,decimals,tags,audit,kyc,volume,website,off_chain_volume,ath_volume,liquidity,ath_liquidity,rank,market_cap,market_cap_diluted,name,symbol,description,twitter,chat,discord,contracts,blockchains,market_score,trust_score,social_score,utility_score,circulating_supply,total_supply,trade_history!left(*),price_change_24h,price_change_1h,price_change_7d,price_change_1m,tracked,assets_social!left(*),launch"
      )
      .or(
        `name.ilike."${fromUrlToName(asset)}"` +
          `,name.ilike."${asset.split("-").join("%")}"`
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
      tradeHistory?.find((asset) => asset.name.toLowerCase() === asset) ||
      tradeHistory?.[0];

    if (rightAsset) {
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
}

type Props = {
  params: { asset: string };
};

// export async function generateMetadata(
//   { params }: Props,
//   parent: ResolvingMetadata
// ): Promise<Metadata> {
//   let asset = "";
//   if (params.asset?.[1]) asset = params.asset[2];
//   else asset = params.asset[0];
//   if (!asset) return;
//   return {
//     title: `${
//       asset.slice(0, 1)[0].toUpperCase() + asset.slice(1)
//     } on-chain data: price, liquidity, volume, trades & insights | Mobula`,
//     description: `Dive into the real-time price, detailed chart analysis, and liquidity data of ${asset} on Mobula. Gain insights into its current market dynamics and trends, all in one place for informed trading and investment decisions.`,
//   };
// }

async function AssetPage({ params }) {
  const data: any = await fetchAssetData({ asset: params?.asset[0] });
  const cookieStore = cookies();
  const hideTxCookie = cookieStore.get("hideTx")?.value || "false";
  const tradeCookie =
    unformatFilters(cookieStore.get("trade-filters")?.value || "") || [];
  const title = `${data?.asset?.name} on-chain data: price, liquidity, volume, trades & insights | Mobula`;

  const getSectionState = () => {
    const section = params?.asset[1];
    if (section === "market") return "Market";
    if (section === "fundraising") return "Fundraising";
    if (section === "vesting") return "Vesting";
    return "Essentials";
  };

  const activeSection = getSectionState();

  return (
    <>
      <head>
        <title>{title}</title>
        <meta
          name="description"
          content={`Dive into the real-time price, detailed chart analysis, and liquidity data of ${data?.asset?.name} on Mobula. Gain insights into its current market dynamics and trends, all in one place for informed trading and investment decisions.`}
        />
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
      </head>
      <BaseAssetProvider
        token={data?.asset}
        tradHistory={data?.tradHistory || []}
        launchpad={data?.launchpads}
        hideTxCookie={hideTxCookie}
        tradeCookie={tradeCookie}
        activeSection={activeSection}
      >
        <ShowMoreProvider>
          <NavActiveProvider>
            <Assets />
          </NavActiveProvider>
        </ShowMoreProvider>
      </BaseAssetProvider>
    </>
  );
}

export default AssetPage;
