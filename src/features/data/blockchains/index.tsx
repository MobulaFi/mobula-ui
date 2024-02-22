"use client";
import { blockchainsContentWithNonEVM } from "mobula-lite/lib/chains/constants";
import { Container } from "../../../components/container";
import { ChainBox } from "../blockchains/components/chain-box";

export const Blockchains = () => {
  const blockchains = Object.entries(blockchainsContentWithNonEVM)?.filter(
    (x) => {
      return x[1]?.FETCH_BLOCKS;
    }
  );
  return (
    <Container extraCss="flex flex-row flex-wrap w-full justify-between">
      {blockchains.map((blockchain, i) => {
        return <ChainBox key={i} blockchain={blockchain?.[1]} />;
      })}
    </Container>
  );
};
