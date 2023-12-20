"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import { Button } from "../../../../../components/button";
import { MediumFont } from "../../../../../components/fonts";
import { pushData } from "../../../../../lib/mixpanel";
import { BuilderType } from "../../models";

export const TemplateOdd = ({ isOdd, content }: BuilderType) => {
  const router = useRouter();
  return (
    <div
      className={`mb-[110px] lg:mb-[100px] flex items-center justify-between w-full md:flex-col ${
        isOdd ? "flex-row" : "flex-row-reverse"
      }`}
    >
      <div className="w-2/4 lg:w-full max-w-[510px] lg:max-w-auto">
        <p
          className={`text-xl md:text-sm text-blue dark:text-blue font-bold ${
            isOdd ? "text-start" : "text-end"
          } md:text-center`}
        >
          {content.title}
        </p>
        <p
          className={`text-xl md:text-sm text-light-font-100 dark:text-dark-font-100 font-bold ${
            isOdd ? "text-start" : "text-end"
          } md:text-center mb-5 md:mb-2.5 text-4xl md:text-xl`}
        >
          {content.subtitle}
        </p>
        <MediumFont
          extraCss={`${
            isOdd ? "text-start" : "text-end"
          }  md:text-center max-w-[500px] lg:max-w-[90%] mx-0 md:mx-auto`}
        >
          {content.description}
        </MediumFont>
        <div
          className={`flex md:hidden w-full ${
            isOdd ? "justify-start" : "justify-end"
          } md:justify-center`}
        >
          <Button
            onClick={() => {
              router.push(content.url);
              pushData("Button Clicked", {
                "Button Name": content.button_name,
                "Destination URL": content.url,
              });
              // Google Ads conversion tracking
              if (typeof window !== "undefined" && (window as any).gtag) {
                (window as any).gtag("event", "conversion", {
                  send_to: "AW-11451783005/d2flCIaL34AZEN2u0dQq",
                });
              }
            }}
            extraCss="w-fit mt-[30px] lg:mt-[15px] text-sm mx-0 md:h-[40px] md:mx-auto px-[15px] mb-0 lg:mb-5"
          >
            {content.button_name}
            <FaArrowRightLong className="ml-2.5 text-lg" />
          </Button>
        </div>
      </div>
      <div className="flex flex-col w-2/4 lg:w-full">
        <img
          className="h-[350px] max-h-[350px] block md:hidden mx-auto my-0 lg:my-[15px]"
          src={content.image}
        />
        <img
          className="w-auto max-w-[300px] hidden md:flex mx-auto my-0 lg:my-[15px]"
          src={
            content.title === "Grow your community"
              ? "/landings/builder/bot_mobile.png"
              : content.image
          }
        />
        <div className="hidden md:flex w-full justify-center">
          <Button
            extraCss="max-w-[300px] w-full sm:max-w-[85%] h-[30px] text-sm mt-0 mx-auto mb-5 "
            onClick={() => {
              router.push(content.url);
              // Mixpanel tracking
              pushData("Button Clicked", {
                "Button Name": content.button_name,
                "Destination URL": content.url,
              });
              if (typeof window !== "undefined" && (window as any).gtag) {
                (window as any).gtag("event", "conversion", {
                  send_to: "AW-11451783005/d2flCIaL34AZEN2u0dQq",
                });
              }
            }}
          >
            {content.button_name}
            <FaArrowRightLong className="ml-2.5 text-lg" />
          </Button>
        </div>
      </div>
    </div>
  );
};
