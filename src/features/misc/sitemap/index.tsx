"use client";
import { NextChakraLink } from "components/link";
import { useSearchParams } from "next/navigation";
import React from "react";
import { Container } from "../../../components/container";
import { LargeFont, SmallFont } from "../../../components/fonts";
import { Asset } from "../../../interfaces/assets";
import { getUrlFromName } from "../../../utils/formaters";

interface SiteMapProps {
  assets: Asset[];
  count: number;
}

export const SiteMap = ({ assets, count }: SiteMapProps) => {
  const params = useSearchParams();
  const page = params.get("page");
  return (
    <Container>
      <LargeFont>Cryptocurrencies Sitemap</LargeFont>
      <div className="flex flex-wrap w-full mt-5 mx-auto">
        <ul className="ul-sitemap">
          {assets?.map((asset) => (
            <li className="truncate">
              <a
                href={`/asset/${getUrlFromName(asset?.name)}`}
                className="text-light-font-100 dark:text-dark-font-100 
                 hover:text-blue hover:dark:text-blue text-start overflow-hidden 
                 text-sm md:text-xs"
              >
                {asset?.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-wrap w-full mt-[30px] mx-auto ">
        {Array.from({ length: count / 200 })?.map((_, i) => (
          <NextChakraLink href={`/sitemap?page=${i + 1}`}>
            <SmallFont
              extraCss={`font-medium text-sm md:text-xs my-[5px] mx-2.5 w-[25px] ${
                Number(page || 1) === i + 1
                  ? "text-blue dark:text-blue"
                  : "text-light-font-60 dark:text-dark-font-60"
              }`}
            >
              {i + 1}
            </SmallFont>
          </NextChakraLink>
        ))}
      </div>
    </Container>
  );
};
