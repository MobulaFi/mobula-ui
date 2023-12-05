import { Metadata } from "next";
import { BuySell } from "../../features/misc/swap";

export const metadata: Metadata = {
  title: "Swap Cryptocurrencies Easily on Mobula - Fast, Secure, and Efficient",
  description:
    "Explore a diverse range of emerging cryptocurrencies on Mobula for swapping. Experience secure, efficient trading with real-time price tracking and competitive liquidity options.",
  keywords: "Mobula swap, swap cryptocurrencies, swap crypto, swap tokens",
};

const buySell = () => {
  return (
    <>
      <BuySell />
    </>
  );
};

export default buySell;
