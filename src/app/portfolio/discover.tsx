import Head from "next/head";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAccount } from "wagmi";
import { PortfolioLanding } from "../../components/Pages/Landings/Portfolio";

export { getServerSideProps } from "../../Chakra";

export default function discover() {
  const { isConnected } = useAccount();
  const router = useRouter();

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (isConnected === true) {
      router.push("/portfolio");
    }
  }, [isConnected]);

  return (
    <>
      <Head>
        <title>Web3 Portfolio multi-wallet tracking | Mobula</title>
        <meta
          name="description"
          content="Track multiple wallets on multiple chains, add CeFi transactions, NFTs, calculate PNL, ROI, historical balances, and more."
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
      </Head>
      <PortfolioLanding />
    </>
  );
}
