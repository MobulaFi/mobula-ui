import { Metadata } from "next";
import { Blockchains } from "../../features/data/blockchains";

export const revalidate = 3600;
export const dynamic = "force-static";
export const dynamicParams = true;

export const metadata: Metadata = {
  title: "Trending DeFi Tokens by network | Mobula",
  description:
    "Track trending tokens on each blockchain with our real-time dashboard. Get price updates and DeFi stats tailored to each network.",
  robots: "index, follow",
  keywords:
    "Mobula, Mobula crypto, Mobula Crypto Data Aggregator, crypto movers, crypto gainers, crypto losers",
};

async function BlockchainsPage() {
  const title = `Trending DeFi Tokens by network | Mobula`;
  const description = `Track trending tokens on each blockchain with our real-time dashboard. Get price updates and DeFi stats tailored to each network.`;
  return (
    <>
      <head>
        <title>{title}</title>
        <meta name="description" content={description} />
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
      <Blockchains />
    </>
  );
}

export default BlockchainsPage;
