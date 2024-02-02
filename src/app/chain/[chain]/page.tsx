import { Chains } from "../../../features/data/chains";
import { ChainsProvider } from "../../../features/data/chains/context-manager";

export const revalidate = 3600;
export const dynamic = "force-static";
export const dynamicParams = true;

async function getChains({ params }) {
  const fetchChain = fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/1/market/blockchain/stats?blockchain=${params.chain}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: process.env.NEXT_PUBLIC_PRICE_KEY as string,
      },
    }
  );
  const fetchPairs = fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/api/1/market/blockchain/pairs?blockchain=${params.chain}`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: process.env.NEXT_PUBLIC_PRICE_KEY as string,
      },
    }
  );

  const [chain, pairs] = await Promise.all([fetchChain, fetchPairs]).then(
    (r) => {
      return Promise.all(r.map((res) => res.json()));
    }
  );

  return {
    blockchain: chain.data,
    pairs: pairs.data,
  };
}

type Props = {
  params: { chain: string };
};

async function ChainPage({ params }: Props) {
  const { blockchain, pairs } = await getChains({ params });
  const { chain } = params;

  console.log("blockchain", blockchain, pairs);

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
      <ChainsProvider chain={blockchain} pairs={pairs}>
        <Chains />
      </ChainsProvider>
    </>
  );
}

export default ChainPage;
