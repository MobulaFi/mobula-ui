"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Container } from "../../../components/container";
import { Title } from "../../../components/fonts";
import { BasicThead } from "../../../layouts/new-tables/ui/basic-thead";
import { TableRow } from "./components/table-row";

export const NewPairs = ({ pairs }) => {
  const [isHover, setIsHover] = useState("");
  const router = useRouter();
  return (
    <Container>
      <Title
        title="Crypto Pairs Recently created"
        subtitle="Discover the latest cryptocurrencies listed on Mobula, their price, volume, chart, liquidity, and more."
        extraCss="mb-5"
      />
      <table>
        <thead>
          <tr className="text-left">
            <BasicThead
              title="Token"
              extraCss="text-start sticky left-0 z-[1] bg-light-bg-primary dark:bg-dark-bg-primary"
              titleCssPosition="justify-start"
            />
            <BasicThead extraCss="static" title="Price" canOrder />
            <BasicThead extraCss="static" title="Volume" canOrder />
            <BasicThead extraCss="static" title="Liquidity" canOrder />
            <BasicThead extraCss="static" title="Market Cap" canOrder />
            {/* <BasicThead extraCss="static" title="5m" canOrder />
            <BasicThead extraCss="static" title="1h" canOrder />
            <BasicThead extraCss="static" title="4h" canOrder />
            <BasicThead extraCss="static" title="24h" canOrder /> */}
            <BasicThead extraCss="static" title="Created at" canOrder />
          </tr>
        </thead>
        {pairs?.map((pair, i) => (
          <TableRow
            key={i}
            isHover={isHover}
            setIsHover={setIsHover}
            router={router}
            pair={pair}
          />
        ))}{" "}
      </table>
    </Container>
  );
};
