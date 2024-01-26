import { BaseAssetProvider } from "features/asset/context-manager";
import React from "react";
import { ShowMoreProvider } from "../../../features/asset/context-manager/navActive";
import { NavActiveProvider } from "../../../features/asset/context-manager/showMore";
import { Assets } from "../../../features/asset/index";

export const revalidate = 3600;
export const dynamic = "force-static";
export const dynamicParams = true;

const apiKey = process.env.NEXT_PUBLIC_PRICE_KEY || "";

async function fetchAssetData({ params }) {
  const { pair } = params;
  try {
    if (!pair) return;
    console.log(
      "hjddhhdhdhd",
      `https://general-api-preprod-fgpupeioaa-uc.a.run.app/api/1/market/pair?address=${pair}&stats=true`
    );
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

    console.log("HHHHHHHHHH", activePair);
    const pairData = activePair?.data;

    const fetchPairTrade = await fetch(
      `https://api.mobula.io/api/1/market/trades/pair?asset=${
        activePair?.[activePair?.baseToken]?.address
      }`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: process.env.NEXT_PUBLIC_PRICE_KEY as string,
        },
      }
    ).then((res) => res.json());

    console.log("activePair", fetchPairTrade);

    return {
      data: pairData,
      trade: fetchPairTrade,
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
  const { data }: any = await fetchAssetData({ params });
  const pairInfo = {
    liquidity: 1_000_000_000,
    market_cap: 1_000_000_000,
    circ_supply: 1_000_000_000,
    change_1h: 12,
    change_24h: 1.23,
    change_7d: 20.23,
    change_30d: 12.23,
    ath: [1606015467481, 1243],
    atl: [1506015467481, 0.3],
  };

  console.log("YOOOOOOOOOOOO", data);
  const newPair = {
    ...data,
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
      <div className="h-screen w-screen text-white dark:text-white">
        <BaseAssetProvider
          token={newPair}
          tradHistory={data || []}
          launchpad={data?.launchpads}
          hideTxCookie={"{ hideTx: false }"}
          tradeCookie={undefined}
          isAsset={false}
          tradePairs={[]}
        >
          <ShowMoreProvider>
            <NavActiveProvider>
              <Assets isAssetPage={false} />
            </NavActiveProvider>
          </ShowMoreProvider>
        </BaseAssetProvider>
      </div>
    </>
  );
}

export default AssetPage;
