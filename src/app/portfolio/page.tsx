import { Metadata } from "next";
import React from "react";
import { Portfolio } from "../../features/user/portfolio";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Analyze Your Crypto Portfolio - On-Chain & Off-Chain | Mobula",
  description:
    "Track multiple wallets on multiple chains, add CeFi transactions, NFTs, calculate PNL, ROI, historical balances, and more.",
  keywords:
    "Mobula, Mobula portfolio, portfolio tracker, crypto portfolio tracker",
};

export default function MainPortfolio() {
  // const { isConnected, isDisconnected } = useAccount();
  // const router = useRouter();
  // const { address } = useAccount();

  // useEffect(() => {
  //   if (isDisconnected) {
  //     router.push("/portfolio/discover");
  //   } else if (isConnected) {
  //     router.push("/portfolio");
  //   }
  // }, [isConnected]);

  // useEffect(() => {
  //   if (address)
  //     GET("/earn/adventure", {
  //       name: "Introduction",
  //       action: 6,
  //       account: address,
  //     });
  // }, [address]);

  return (
    <>
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
      <Portfolio />
    </>
  );
}
