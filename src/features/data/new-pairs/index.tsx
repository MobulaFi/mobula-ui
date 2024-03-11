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
      <div className="overflow-x-scroll">
        <table>
          <thead>
            <tr className="text-left">
              <BasicThead
                title="Token"
                extraCss="text-start sticky left-[0px] z-[1] bg-light-bg-primary dark:bg-dark-bg-primary md:pl-2.5"
                titleCssPosition="justify-start"
              />
              <BasicThead extraCss="static" title="Price" />
              <BasicThead extraCss="static" title="Volume" />
              <BasicThead extraCss="static" title="Liquidity" />
              <BasicThead extraCss="static" title="Market Cap" />
              <BasicThead extraCss="static" title="5m" />
              <BasicThead extraCss="static" title="1h" />
              <BasicThead extraCss="static" title="4h" />{" "}
              <BasicThead extraCss="static" title="12h" />
              <BasicThead extraCss="static" title="24h" />
              <BasicThead extraCss="static" title="Created at" />
            </tr>
          </thead>
          {pairs
            ?.filter(
              (entry) =>
                entry?.pairs?.[0]?.[entry?.pairs?.[0]?.baseToken]?.price > 0
            )
            ?.map((pair, i) => (
              <TableRow
                key={i}
                isHover={isHover}
                setIsHover={setIsHover}
                router={router}
                pair={pair}
              />
            ))}{" "}
        </table>
      </div>
    </Container>
  );
};
