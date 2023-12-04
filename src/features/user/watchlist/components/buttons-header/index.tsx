import { usePathname } from "next/navigation";
import React from "react";
import { LargeFont } from "../../../../../components/fonts";
import { NextChakraLink } from "../../../../../components/link";

export const ButtonsHeader = () => {
  const pathname = usePathname();
  return (
    <div className="flex items-center">
      <NextChakraLink href="/watchlist/followed" extraCss="mb-0">
        <LargeFont
          extraCss={`cursor-pointer  mb-0 ${
            pathname === "/watchlist"
              ? "text-light-font-100 dark:text-dark-font-100"
              : "text-light-font-40 dark:text-dark-font-40"
          }`}
        >
          Watchlists
        </LargeFont>
      </NextChakraLink>
      <NextChakraLink href="/watchlist/followed" extraCss="mx-5 mb-0">
        <LargeFont
          extraCss={`mx-5 cursor-pointer  mb-0 ${
            pathname === "/watchlist/followed"
              ? "text-light-font-100 dark:text-dark-font-100"
              : "text-light-font-40 dark:text-dark-font-40"
          }`}
        >
          Followed
        </LargeFont>
      </NextChakraLink>
      <NextChakraLink href="/watchlist/explore" extraCss="mx-5 mb-0">
        <LargeFont
          extraCss={`cursor-pointer  mb-0 ${
            pathname === "/watchlist/explore"
              ? "text-light-font-100 dark:text-dark-font-100"
              : "text-light-font-40 dark:text-dark-font-40"
          }`}
        >
          Explore
        </LargeFont>
      </NextChakraLink>
    </div>
  );
};
