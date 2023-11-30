import React from "react";
import { SmallFont } from "../../../../../components/fonts";

interface CardsAndCTAProps {
  extraCss?: string;
}

export const CardsAndCTA = ({ extraCss, ...props }: CardsAndCTAProps) => {
  const tokens = ["bitcoin", "ethereum", "usdt", "bnb", "avalanche", "polygon"];
  return (
    <div className={`flex flex-col ${extraCss}`} {...props}>
      <div className="flex items-center mt-5 lg:mt-[15px] md:mt-0 m-2.5">
        <img
          src="/logo/mastercard.png"
          className="w-[35px] lg:w-[32px] md:w-[25px] mr-2.5 md:mr-[5px]"
          alt="logo mastercard"
        />
        <img
          src="/logo/visa.png"
          className="h-[18px] lg:h-[16px] md:h-[14px]"
          alt="logo visa"
        />
        <div
          className="flex items-center bg-light-bg-terciary dark:bg-dark-bg-terciary px-1.5 
        rounded-lg ml-5 lg:ml-[15px] md:ml-2.5 pr-[25px] lg:pr-5 md:pr-[15px] h-[34px] lg:h-[30px] md:h-[28px]"
        >
          {tokens.map((token) => (
            <img
              className={`mr-[7.5px] h-[22px] lg:h-[20px] md:h-[18px] ${
                token === "usdt" ? "lg:hidden" : "lg:flex"
              } flex md:flex`}
              src={`/logo/${token}.png`}
              key={token}
              alt={`${token} logo`}
            />
          ))}
          <SmallFont extraCss="ml-[5px]">+30,000</SmallFont>
        </div>
      </div>
    </div>
  );
};
