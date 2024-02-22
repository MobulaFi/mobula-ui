"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useAccount } from "wagmi";
import { Container } from "../../components/container";
import { LargeFont, SmallFont } from "../../components/fonts";
import { NextChakraLink } from "../../components/link";
import { CommonPageProvider } from "../../contexts/commun-page";
import { useShouldConnect } from "../../hooks/connect";
import { useUrl } from "../../hooks/url";
import { pushData } from "../../lib/mixpanel";
import { getPath } from "./constant";

export const Footer = () => {
  const pages = getPath();
  const [isHover, setIsHover] = useState(null);
  const router = useRouter();
  const { portfolioUrl } = useUrl();
  const { isDisconnected } = useAccount();
  const handleConnect = useShouldConnect(() => router.push(portfolioUrl));
  return (
    <CommonPageProvider>
      <div
        className={`w-full border-t-2 border pb-[100px] md:pb-[50px] border-light-border-primary dark:border-dark-border-primary
         bg-light-bg-primary dark:bg-dark-bg-primary md:bg-light-bg-secondary dark:md:bg-dark-bg-secondary`}
        id="footer"
      >
        <Container extraCss="pt-[28px] md:pt-[5px] mt-0 w-full">
          <div className="flex mt-[15px] md:mt-0 flex-row sm:flex-col-reverse mx-auto w-[90%] md:w-[100%]">
            <div className="flex w-1/5">
              <div className="theme-image dark">
                <img
                  src="/mobula/mobula-logo.svg"
                  className="h-[62px] w-[62px] md:w-[42px] md:h-[42px] md:max-w-[42px] md:max-h-[42px] mt-0 md:mt-[15px] ml-0 sm:ml-[20px] mb-auto"
                  alt="mobula logo"
                />
              </div>
              <div className="theme-image light">
                <img
                  src="/mobula/mobula-logo-light.svg"
                  className="h-[62px] w-[62px] md:w-[42px] md:h-[42px] md:max-w-[42px] md:max-h-[42px] mt-0 md:mt-[15px] ml-0 sm:ml-[20px] mb-auto"
                  alt="mobula logo light"
                />
              </div>
            </div>
            <div className="flex sm:hidden justify-between w-full">
              {pages.map((entry) => (
                <div className="flex flex-col items-between" key={entry.name}>
                  <LargeFont extraCss="mb-2.5">{entry.name}</LargeFont>
                  {entry.extends.map((page) => (
                    <NextChakraLink
                      extraCss="w-fit"
                      href={
                        isDisconnected && page.name === "Portfolio"
                          ? null
                          : page.url
                      }
                      key={page.url}
                      target="_blank"
                      rel="noreferrer"
                      onMouseEnter={() => setIsHover(page.name)}
                      onMouseLeave={() => setIsHover(null)}
                      onClick={() => {
                        if (page.name === "Portfolio") {
                          handleConnect();
                        }
                        pushData("Footer Clicked", {
                          "Destination URL": page.url,
                          name: page.name,
                        });
                      }}
                    >
                      <SmallFont
                        extraCss={`${
                          isHover === page.name
                            ? "text-light-font-100 dark:text-dark-font-100"
                            : "text-light-font-60 dark:text-dark-font-60"
                        } transition-all duration-200 w-fit`}
                      >
                        {page.name}
                        <div
                          className={`h-[1px] mt-1 transition-all duration-150 bg-light-font-60 dark:bg-dark-font-60 mb-1.5 ${
                            isHover === page.name ? "w-full" : "w-0"
                          }`}
                        />
                      </SmallFont>
                    </NextChakraLink>
                  ))}
                </div>
              ))}
            </div>
            <div className="w-full sm:flex flex-col hidden bg-light-bg-secondary dark:bg-dark-bg-secondary">
              {pages.map((entry) => (
                <div
                  className="flex flex-col item-between px-[25px] py-[20px] border-b border-light-border-primary dark:border-dark-border-primary"
                  key={entry.name}
                >
                  <LargeFont extraCss="mb-[15px] text-start">
                    {entry.name}
                  </LargeFont>
                  {entry.extends.map((page) => (
                    <NextChakraLink
                      extraCss="text-start w-fit mr-auto"
                      href={page.url}
                      key={page.url}
                      target="_blank"
                      rel="noreferrer"
                      onMouseEnter={() => setIsHover(page.name)}
                      onMouseLeave={() => setIsHover(null)}
                      onClick={() => {
                        if (page.name === "Portfolio") {
                          handleConnect();
                        }
                        pushData("Footer Clicked", {
                          "Destination URL": page.url,
                          name: page.name,
                        });
                      }}
                    >
                      <p
                        className={`text-sm ${
                          isHover === page.name
                            ? "text-light-font-100 dark:text-dark-font-100"
                            : "text-light-font-60 dark:text-dark-font-60"
                        } transition-all duration-200 font-normal text-start w-fit`}
                      >
                        {page.name}
                        <div
                          className={`h-[1px] mt-1 transition-all duration-150 bg-light-font-60 dark:bg-dark-font-60 mb-1.5 ${
                            isHover === page.name ? "w-full" : "w-0"
                          }`}
                        />
                      </p>
                    </NextChakraLink>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </Container>
      </div>
    </CommonPageProvider>
  );
};
