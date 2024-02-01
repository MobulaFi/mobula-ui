import React from "react";
import { Chains } from "../../../features/data/chains";
import { ChainsProvider } from "../../../features/data/chains/context-manager";

export const revalidate = 3600;
export const dynamic = "force-static";
export const dynamicParams = true;

async function fetchAssetData({ params }) {}

type Props = {
  params: { asset: string };
};

async function AssetPage({ params }) {
  const { pair } = params;

  return (
    <>
      <head>
        {/* <title>Test asset pair</title>
        <meta
          name="description"
          content={`Dive into the real-time price, detailed chart analysis, and liquidity data of ${data?.asset?.name} on Mobula. Gain insights into its current market dynamics and trends, all in one place for informed trading and investment decisions.`}
        /> */}
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
      <ChainsProvider>
        <Chains />
      </ChainsProvider>
    </>
  );
}

export default AssetPage;
