import { useRouter } from "next/navigation";
import React from "react";
import { SmallFont } from "../../../../../components/fonts";
import { pricings } from "../../constants";

export const PricingBox = ({ id }: { id: number }) => {
  const router = useRouter();
  return (
    <div className="w-full flex flex-col p-8">
      <SmallFont extraCss="font-poppins font-medium text-center text-lg  md:text-base">
        {pricings[id].type}
      </SmallFont>
      <SmallFont extraCss="font-poppins mb-5 text-light-font-60 dark:text-dark-font-60 text-center text-base  md:text-sm">
        {pricings[id].usecase}
      </SmallFont>
      <h2
        className="text-light-font-100 dark:text-dark-font-100 tracking-tight 
                  font-poppins text-6xl md:text-5xl font-bold text-center mt-5 md:mt-4 mb-[25px]"
      >
        {pricings[id].price}
        <span className="text-base font-normal">
          {pricings[id].pricePerMonth}
        </span>
      </h2>
      {/* <SmallFont extraCss="font-poppins mb-5 mt-2.5 text-light-font-60 dark:text-dark-font-60 text-center text-base font-normal md:text-sm">
        Billed annually or {pricings[id].pricePerMonthAlt}
      </SmallFont> */}
      <button
        className="w-full h-[50px] rounded-lg bg-light-font-5 dark:bg-dark-font-5 shadow-xl 
      backdrop-blur-md border border-light-border-primary dark:border-dark-border-primary
       hover:bg-light-font-80 hover:dark:bg-dark-font-80 transition-all duration-300 ease-in-out
        hover:text-dark-font-100 hover:dark:text-light-font-100 font-poppins text-base 
        text-light-font-100 dark:text-dark-font-100 my-5 md:my-4"
        onClick={() => router.push(pricings[id].url)}
      >
        Get started now
      </button>
      <ul className="mt-2.5">
        {pricings[id].features.map((feature) => (
          <li className="text-light-font-60 dark:text-dark-font-60 font-poppins text-base mt-2.5">
            {feature}
          </li>
        ))}
      </ul>
      {/* <img
        src={pricings[id].logo}
        alt="pricing logo"
        className="w-full mt-10"
      /> */}
    </div>
  );
};
