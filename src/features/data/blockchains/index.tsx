"use client";
import { blockchainsContent } from "mobula-lite/lib/chains/constants";
import { useEffect, useRef, useState } from "react";
import { Container } from "../../../components/container";
import { ChainBox } from "../blockchains/components/chain-box";

export const Blockchains = () => {
  const [chainNumber, setChainNumber] = useState(6);
  const containerRef = useRef<HTMLDivElement>(null);
  const blockchains = Object.entries(blockchainsContent)?.filter((x) => {
    return x[1]?.FETCH_BLOCKS;
  });

  const handleScroll = () => {
    const bottom =
      document.documentElement.scrollHeight - window.innerHeight - 500 <=
      window.scrollY;
    if (bottom) {
      setChainNumber((prev) => prev + 6);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Container
      extraCss="flex flex-row flex-wrap w-[95%] justify-between md:w-full"
      ref={containerRef}
      id="container"
    >
      {blockchains.map((blockchain, i) => {
        if (i < chainNumber)
          return <ChainBox key={i} blockchain={blockchain?.[1]} />;
      })}
    </Container>
  );
};
