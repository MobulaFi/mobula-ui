"use client";
import React, { useEffect, useState } from "react";
import { Container } from "../../../components/container";
import { SmallFont, Title } from "../../../components/fonts";
import { tabs } from "../../../layouts/menu-mobile/constant";
import { TopNav } from "../../../layouts/menu-mobile/top-nav";
import { ButtonSelectorMobile } from "./components/button-selector-mobile";
import { MoversTable } from "./components/table-mover";
import { MoversType } from "./models";

interface MoversProps {
  gainersBuffer: MoversType[];
  losersBuffer: MoversType[];
}

export const Movers = ({ gainersBuffer, losersBuffer }: MoversProps) => {
  const [isGainer, setIsGainer] = useState(true);

  const moverPath = {
    url: "/movers",
    name: "Gainers & Losers",
    theme: "Crypto",
  };

  useEffect(() => {
    localStorage.setItem("path", JSON.stringify(moverPath));
  }, []);

  useEffect(() => {
    localStorage.setItem("path", JSON.stringify(moverPath));
  }, []);

  function toFullString(num) {
    let str = num.toString();
    if (str.includes("e")) {
      const parts = str.split("e");
      const base = parts[0].replace(".", "");
      const exponent = parseInt(parts[1], 10);

      if (exponent < 0) {
        const decimalPlaces = Math.abs(exponent) - 1;
        str = "0." + "0".repeat(decimalPlaces) + base;
      } else {
        str = base + "0".repeat(exponent - base.length + 1);
      }
    }

    return str;
  }

  const formatSmallNumber = (number: number, id?: string) => {
    const nbrToString = toFullString(number);
    const cutFirstHalf = nbrToString.split("");
    const firstHalf = [cutFirstHalf[0], cutFirstHalf[1], cutFirstHalf[2]];
    const numberArray = cutFirstHalf.slice(3, cutFirstHalf.length);

    const numberArr: string[] = [];
    let countZero = 0;

    numberArray.forEach((element, index) => {
      if (element === "0") countZero++;
      else numberArr.push(element);
    });

    return (
      <>
        {firstHalf}
        <sub className="text-[10px] mb-[-10px] mx-[1px]">{countZero}</sub>
        {numberArr.join("")}
      </>
    );
  };

  return (
    <>
      <TopNav list={tabs} active="G&L" isGeneral />
      <SmallFont>{formatSmallNumber(0.000000000000000345)}</SmallFont>
      <Container>
        <div className="flex flex-col">
          <Title
            title="Biggest Crypto Gainers and Losers"
            subtitle="Discover the biggest crypto movers of the day, their real time price, chart, liquidity, and more."
            extraCss="mb-5 md:mx-0"
          />
          <div className="item-center justify-between hidden md:flex w-full mb-2.5">
            <div className="w-full flex items-center">
              <ButtonSelectorMobile
                onClick={() => setIsGainer(true)}
                isGainer
                activeTab={isGainer === true}
              />
              <ButtonSelectorMobile
                onClick={() => setIsGainer(false)}
                activeTab={isGainer === false}
              />
            </div>
          </div>
        </div>
        <div className="flex mt-2.5 md:mt-0 lg:overflow-x-scroll scroll">
          <div
            className={`flex mr-3 lg:mr-0 w-2/4 lg:w-full max-w-[588px] lg:max-w-full ${
              isGainer ? "" : "lg:hidden"
            }`}
            id="left"
          >
            <MoversTable
              assets={isGainer ? gainersBuffer : losersBuffer}
              isGainer={isGainer}
            />
          </div>
          <div
            className={`flex ml-3 lg:ml-0 w-2/4 max-w-[588px] lg:max-w-full lg:w-full ${
              !isGainer ? "" : "lg:hidden"
            }`}
          >
            <MoversTable assets={losersBuffer} isGainer={false} />
          </div>
        </div>
      </Container>
    </>
  );
};
