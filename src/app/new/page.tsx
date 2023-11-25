import { cookies, headers } from "next/headers";
import { RecentlyAdded } from "../../features/data/recently-added";
import { createSupabaseDOClient } from "../../lib/supabase";

async function fetchNewAssets() {
  const settings = {
    liquidity: 0,
    volume: 0,
    onChainOnly: false,
    default: true,
    trustScore: 2,
    marketScore: 1,
    socialScore: 1,
    utilityScore: 1,
  };
  const supabase = createSupabaseDOClient();
  const cookieStore = cookies();
  const userAgent: string = headers().get("user-agent") || "";
  const isMobile = /mobile/i.test(userAgent) && !/tablet/i.test(userAgent);
  const { data, count } = await supabase
    .from("assets")
    .select(
      "id,name,price_change_24h,global_volume,off_chain_volume,symbol,logo,market_cap,price,rank,contracts,blockchains,twitter,website,chat,created_at",
      { count: "exact" }
    )
    .gte("liquidity", settings.liquidity)
    .gte("global_volume", settings.volume)
    .or(`market_score.eq.0,market_score.gte.${settings.marketScore}`)
    .or(`trust_score.eq.0,trust_score.gte.${settings.trustScore}`)
    .or(`utility_score.eq.0,utility_score.gte.${settings.utilityScore}`)
    .or(`social_score.eq.0,social_score.gte.${settings.socialScore}`)
    .order("created_at", { ascending: false })
    .match({ processed: true })
    .limit(100);
  return {
    tokens: data || [],
    count: count || 0,
    cookies: cookieStore ?? "",
    isMobile,
  };
}

export default async function recentlyAdded() {
  const data = await fetchNewAssets();
  return (
    <>
      {/* <Head>
        <title>
          New Cryptocurrencies listed today and this week on Mobula | Mobula
        </title>
      </Head>
      <meta
        name="description"
        content="Discover the assets recently added on Mobula, their real time price, chart, liquidity, and more."
      />
      <meta
        property="og:image"
        content="https://mobula.fi/metaimage/Cryptocurrency/recently-added.png"
      />
      <meta
        name="twitter:image"
        content="https://mobula.fi/metaimage/Cryptocurrency/recently-added.png"
      />
      <meta
        itemProp="image"
        content="https://mobula.fi/metaimage/Cryptocurrency/recently-added.png"
      />
      <meta name="url" content="https://mobula.fi/new" />
      <meta name="keywords" content="Mobula" />
      <meta name="author" content="Mobula" />
      <meta name="copyright" content="Mobula" />
      <meta name="robots" content="index, follow" /> */}
      <RecentlyAdded
        tokensBuffer={data.tokens}
        count={data.count}
        isMobile={data.isMobile}
      />
    </>
  );
}
