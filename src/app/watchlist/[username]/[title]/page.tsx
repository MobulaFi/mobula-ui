/* eslint-disable react-hooks/rules-of-hooks */
import { Metadata } from "next";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { headers } from "next/headers";
import React from "react";
import { NavActiveProvider } from "../../../../features/asset/context-manager/showMore";
import { SeeWatchlist } from "../../../../features/user/watchlist/components/see-watchlist";
import { createSupabaseDOClient } from "../../../../lib/supabase";
import { fromUrlToName } from "../../../../utils/formaters";

const fetchWatchlist = async ({ params }) => {
  const username = params.username;
  const title = params.title;
  const userAgent: string = headers().get("user-agent") || "";
  const isMobile = /mobile/i.test(userAgent) && !/tablet/i.test(userAgent);
  //   console.log("searchParams", searchParams);
  try {
    const supabase = createSupabaseDOClient();
    const { data: userOfWatchlist } = await supabase
      .from("users")
      .select("*")
      .eq("address", username);
    if (userOfWatchlist) {
      const { data } = await supabase
        .from("watchlist")
        .select("*")
        .or(
          `name.ilike."${fromUrlToName(title)}"` +
            `,name.ilike."${title.split("-").join("%")}"`
        )
        .eq("user_id", userOfWatchlist[0].id);
      if (data && data[0]) {
        const { data: tokens } = await supabase
          .from("assets")
          .select(
            "price, name, symbol, logo, global_volume,  id,market_cap,price_change_24h,twitter,chat,volume,discord,website"
          )
          .in(
            "id",
            data[0]?.assets?.map((asset) => asset)
          );
        return {
          title: data[0],
          tokens,
          watchlist: data[0],
          userOfWatchlist: userOfWatchlist[0],
          key: data[0].id,
          revalidate: 120,
          isMobile,
        };
      }

      return {
        title: {},
        tokens: [],
        watchlist: {},
        userOfWatchlist: [],
        error: true,
        isMobile,
      };
    }
  } catch (e) {
    // console.log(e);
  }
  return {
    title: {},
    tokens: [],
    watchlist: {},
    userOfWatchlist: [],
    error: true,
    isMobile,
  };
};

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { title, username } = params;
  return {
    title: `${username} Watchlist Analyis on Mobula | Mobula`,
    robots: "index, follow",
    keywords:
      "Mobula, Mobula watchlist, watchlist tracker, crypto watchlist tracker,crypto,mobula, mobl",
    description: `Discover the watchlist of a particular user and gain valuable insights into their investment strategies. Copy successful investors and enhance your own portfolio performance.`,
  };
}

export default async function UserWatchlistPage({ params }) {
  //   const router = useRouter();
  //   const {isConnected} = useAccount();

  //   useEffect(() => {
  //     if (isConnected === false) {
  //       router.push("/watchlist/discover");
  //     }
  //   }, []);
  const data = await fetchWatchlist({ params });
  const { title, username } = params;

  return (
    <>
      <meta
        property="og:image"
        content="https://mobula.fi/metaimage/Features/Watchlist.png"
      />
      <meta
        name="twitter:image"
        content="https://mobula.fi/metaimage/Features/Watchlist.png"
      />
      <meta
        itemProp="image"
        content="https://mobula.fi/metaimage/Features/Watchlist.png"
      />
      <meta
        name="url"
        content={`https://mobula.fi/watchlist/${username}/${fromUrlToName(
          title || ""
        )}`}
      />
      <meta name="author" content="Mobula" />
      <meta name="copyright" content="Mobula" />
      <NavActiveProvider>
        <SeeWatchlist
          watchlist={data.watchlist}
          tokens={data.tokens}
          userOfWatchlist={data.userOfWatchlist}
          isMobile={data.isMobile}
        />
      </NavActiveProvider>
    </>
  );
}
