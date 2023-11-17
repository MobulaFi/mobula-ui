"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAccount } from "wagmi";
import { Portfolio } from "../../features/user/portfolio";
import { GET } from "../../utils/fetch";

export default function MainPortfolio() {
  const { isConnected, isDisconnected } = useAccount();
  const router = useRouter();
  const { address } = useAccount();

  useEffect(() => {
    if (isDisconnected) {
      router.push("/portfolio/discover");
    } else if (isConnected) {
      router.push("/portfolio");
    }
  }, [isConnected]);

  useEffect(() => {
    if (address)
      GET("/earn/adventure", {
        name: "Introduction",
        action: 6,
        account: address,
      });
  }, [address]);

  return (
    <>
      {/* <Head>
        <title>
          Analyze Your Crypto Portfolio - On-Chain & Off-Chain | Mobula
        </title>
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
      </Head> */}
      <Portfolio main />
    </>
  );
}
