"use client";
import { blockchainsContentWithNonEVM } from "mobula-lite/lib/chains/constants";
import { useEffect, useRef, useState } from "react";
import { Container } from "../../../components/container";
import { ChainBox } from "../blockchains/components/chain-box";

export const Blockchains = () => {
  const [baseChainNumber, setBaseChainNumber] = useState(6);
  const containerRef = useRef<HTMLDivElement>(null);
  const blockchains = Object.entries(blockchainsContentWithNonEVM)?.filter(
    (x) => {
      return x[1]?.FETCH_BLOCKS;
    }
  );

  const handleScroll = () => {
    if (baseChainNumber === blockchains?.length) return;
    const windowHeight = window.innerHeight;
    const scrollPosition = window.scrollY;

    if (scrollPosition > windowHeight * 0.2) {
      setBaseChainNumber(blockchains?.length);
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
      extraCss="flex flex-row flex-wrap w-full justify-between"
      ref={containerRef}
      id="container"
    >
      {blockchains.map((blockchain, i) => {
        if (i < baseChainNumber)
          return <ChainBox key={i} blockchain={blockchain?.[1]} />;
      })}
    </Container>
  );
};
