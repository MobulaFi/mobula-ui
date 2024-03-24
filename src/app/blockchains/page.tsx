import { Metadata } from "next";
import { Blockchains } from "../../features/data/blockchains";

export const revalidate = 3600;
export const dynamic = "force-static";
export const dynamicParams = true;

export const metadata: Metadata = {
  title: "Multichain DeFI Dashboard | Mobula",
  description:
    "Track multichain tokens and discover trendy blockchains for Defi",
  robots: "index, follow",
  keywords:
    "Mobula, Mobula crypto, Mobula Crypto Data Aggregator, crypto movers, crypto gainers, crypto losers, multichain, defi, trendy blockchains",
};

async function BlockchainsPage() {
  const title = `Multichain DeFI Dashboard | Mobula`;
  const description = `Track multichain tokens and discover trendy blockchains for Defi`;
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
