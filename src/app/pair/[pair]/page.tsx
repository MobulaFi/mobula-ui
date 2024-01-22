import { BaseAssetProvider } from "features/asset/context-manager";
import React from "react";
import { ShowMoreProvider } from "../../../features/asset/context-manager/navActive";
import { NavActiveProvider } from "../../../features/asset/context-manager/showMore";
import { Assets } from "../../../features/asset/index";

export const revalidate = 3600;
export const dynamic = "force-static";
export const dynamicParams = true;

async function fetchAssetData({ params }) {
  const { pair } = params;
  try {
    if (!pair) return;
    const fetchPair = fetch(
      `https://api.mobula.io/api/1/market/pair?address=${pair}`
    );

    const [activePair] = await Promise.all([fetchPair]).then((r) => {
      return Promise.all(r.map((res) => res.json()));
    });

    const { data: activePairData } = activePair;

    const fetchPairTrade = await fetch(
      `https://api.mobula.io/api/1/market/trades?asset=${activePairData?.token0?.address}`,
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "mobula-api-key",
        },
      }
    ).then((res) => res.json());

    try {
      const fetchPairHistory = await fetch(
        `https://api.mobula.io/api/1/market/history/pair?address=${pair}`,
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "mobula-api-key",
          },
        }
      ).then((res) => res.json());

      console.log("activePair", fetchPairTrade);

      return {
        data: activePairData,
        trade: fetchPairTrade,
        history: fetchPairHistory,
      };
    } catch (error) {
      console.log(error);
    }
    return {
      data: activePairData,
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
  const { data, trade, history }: any = await fetchAssetData({ params });
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
          token={data}
          tradHistory={trade || []}
          launchpad={data?.launchpads}
          hideTxCookie={"{ hideTx: false }"}
          tradeCookie={undefined}
          isAsset={false}
          tradePairs={trade.data || []}
        >
          <ShowMoreProvider>
            <NavActiveProvider>
              <Assets isAssetPage={false} />
            </NavActiveProvider>
          </ShowMoreProvider>
        </BaseAssetProvider>
        <pre>
          {JSON.stringify(
            {
              data,
            },
            null,
            2
          )}
        </pre>
        <pre>
          {JSON.stringify(
            {
              trade: trade?.data,
            },
            null,
            2
          )}
        </pre>
      </div>
    </>
  );
}

export default AssetPage;
