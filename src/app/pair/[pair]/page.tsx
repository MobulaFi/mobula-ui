import React from "react";
import { BaseAssetProvider } from "../../../features/asset/context-manager";
import { ShowMoreProvider } from "../../../features/asset/context-manager/navActive";
import { NavActiveProvider } from "../../../features/asset/context-manager/showMore";
import { Assets } from "../../../features/asset/index";

export const revalidate = 3600;
export const dynamic = "force-static";
export const dynamicParams = true;

async function fetchAssetData({ params }) {
  const { pair } = params;
  try {
    const fetchPair = fetch(
      `https://general-api-preprod-fgpupeioaa-uc.a.run.app/api/1/market/pair?address=${pair}&stats=true`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: process.env.NEXT_PUBLIC_PRICE_KEY as string,
        },
      }
    );

    const [activePair] = await Promise.all([fetchPair]).then((r) => {
      return Promise.all(r.map((res) => res.json()));
    });
    console.log(
      `https://general-api-preprod-fgpupeioaa-uc.a.run.app/api/1/market/pair?address=${pair}&stats=true&blockchain=`
    );
    console.log("fetchPair", pair, activePair);

    const pairData = activePair?.data;
    const fetchPairTrade = fetch(
      `https://general-api-preprod-fgpupeioaa-uc.a.run.app/api/1/market/trades/pair?address=${pair}&blockchain=${pairData?.blockchain}&amount=20`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: process.env.NEXT_PUBLIC_PRICE_KEY as string,
        },
      }
    );

    const fetchSocialLink = fetch(
      `https://general-api-preprod-fgpupeioaa-uc.a.run.app/api/1/metadata?asset=${
        pairData?.[pairData?.baseToken]?.name
      }`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: process.env.NEXT_PUBLIC_PRICE_KEY as string,
        },
      }
    );

    const [pairTrade, pairSocial] = await Promise.all([
      fetchPairTrade,
      fetchSocialLink,
    ]).then((r) => {
      return Promise.all(r.map((res) => res.json()));
    });

    console.log("pairTrade", pairTrade);

    return {
      data: pairData,
      trade: pairTrade?.data,
      social: pairSocial,
    };
  } catch (error) {
    console.log(error);
  }
}

type Props = {
  params: { asset: string };
};

async function AssetPage({ params }) {
  const { pair } = params;
  const { data, trade, social }: any = await fetchAssetData({ params });

  console.log("pair", pair);

  const newPair = {
    ...data,
    social: social?.data,
    isPair: true,
    address: pair,
  };

  return (
    <>
      <head>
        <title>Test asset pair</title>
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
        token={newPair}
        tradHistory={data || []}
        launchpad={data?.launchpads}
        hideTxCookie={"{ hideTx: false }"}
        tradeCookie={undefined}
        isAsset={false}
        tradePairs={trade || []}
      >
        <ShowMoreProvider>
          <NavActiveProvider>
            <Assets isAssetPage={false} />
          </NavActiveProvider>
        </ShowMoreProvider>
      </BaseAssetProvider>
    </>
  );
}

export default AssetPage;
