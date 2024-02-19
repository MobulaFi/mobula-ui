import React from "react";
import { SmallFont } from "../../../../../components/fonts";
import { NextChakraLink } from "../../../../../components/link";
import { pricings } from "../../constants";

export const PricingBox = ({ id }: { id: number }) => {
  return (
    <div className="w-full flex flex-col p-8">
      <SmallFont extraCss="font-poppins font-medium text-center text-lg">
        {pricings[id].type}
      </SmallFont>
      <SmallFont extraCss="font-poppins mb-5 text-light-font-60 dark:text-dark-font-60 text-center text-base">
        {pricings[id].usecase}
      </SmallFont>
      <h2
        className="text-light-font-100 dark:text-dark-font-100 tracking-tight 
                  font-poppins text-6xl md:text-2xl font-bold text-center mt-5"
      >
        {pricings[id].price}
        <span className="text-base font-normal">
          {pricings[id].pricePerMonth}
        </span>
      </h2>
      <SmallFont extraCss="font-poppins mb-5 mt-2.5 text-light-font-60 dark:text-dark-font-60 text-center text-base font-normal">
        Billed annually or {pricings[id].pricePerMonthAlt}
      </SmallFont>
      <button
        className="my-5 w-[200px] mx-auto h-[45px] text-base font-medium bg-[#253558] hover:bg-[#415288] border hover:border-blue
               dark:border-darkblue water-button  md:h-[40px] md:w-[190px] md:text-sm md:font-normal"
      >
        <NextChakraLink href={pricings[id].url}>Get started now</NextChakraLink>
      </button>
      <ul className="mt-2.5">
        {pricings[id].features.map((feature) => (
          <li className="text-light-font-60 dark:text-dark-font-60 font-poppins text-base mt-2.5">
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
};
