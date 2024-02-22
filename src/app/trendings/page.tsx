import { Metadata } from "next";
import { cookies, headers } from "next/headers";
import Trendings from "../../features/data/trending";

async function fetchTrendingsAssets() {
  const cookieStore = cookies();
  const userAgent: string = headers().get("user-agent") || "";
  const isMobile = /mobile/i.test(userAgent) && !/tablet/i.test(userAgent);

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/1/metadata/trendings`,
      {
        headers: {
          Authorization: process.env.NEXT_PUBLIC_PRICE_KEY as string,
        },
      }
    );
    const data = await response.json();
    return {
      tokens: data || [],
      count: 0,
      cookies: cookieStore ?? "",
      isMobile,
    };
  } catch (error) {
    return {
      tokens: [],
      count: 0,
      cookies: cookieStore ?? "",
      isMobile,
    };
  }
}

export const metadata: Metadata = {
  title: "Trending cryptocurrencies, fast growing and hidden gems on Mobula",
  description:
    "Discover hidden gems gaining traction on Mobula, their real time price, liquidity and rank.",
  keywords: "Mobula",
  robots: "index, follow",
};

export default async function trendings() {
  const data = await fetchTrendingsAssets();
  return (
    <>
      <meta
        property="og:image"
        content="https://mobula.fi/metaimage/Cryptocurrency/Trendings.png"
      />
      <meta
        name="twitter:image"
        content="https://mobula.fi/metaimage/Cryptocurrency/Trendings.png"
      />
      <meta
        itemProp="image"
        content="https://mobula.fi/metaimage/Cryptocurrency/Trendings.png"
      />
      <meta name="url" content="https://mobula.fi/trending" />
      <meta name="author" content="Mobula" />
      <meta name="copyright" content="Mobula" />
      <Trendings
        tokensBuffer={data.tokens}
        count={data.count}
        isMobile={data.isMobile}
      />
    </>
  );
}
