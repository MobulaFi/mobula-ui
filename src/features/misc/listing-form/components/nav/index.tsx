import { useTheme } from "next-themes";
import React, { useContext } from "react";
import { FiExternalLink } from "react-icons/fi";
import { LargeFont, MediumFont } from "../../../../../components/fonts";
import { NextChakraLink } from "../../../../../components/link";
import { ListingContext } from "../../context-manager";

export const Nav = ({ state }) => {
  const { actualPage, setActualPage } = useContext(ListingContext);
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";
  const infos = [
    {
      name: "Asset Info",
    },
    {
      name: "Socials",
    },
    {
      name: "Contracts",
    },
    ...(state.type === "nft"
      ? []
      : [
          // REMOVED TEMPORARILY
          // {
          //   name: "Vesting",
          // },
          // {
          //   name: "Fees",
          // },
        ]),

    {
      name: "Submit",
    },
  ];

  return (
    <div>
      <div
        className="flex rounded-xl bg-light-bg-terciary dark:bg-dark-bg-terciary 
      mr-[25px] flex-col w-[235px] pb-[25px] items-center border border-light-border-primary 
      dark:border-dark-border-primary md:hidden"
      >
        <img
          className="mt-[30px] mb-2.5 rounded-full h-[87px] w-[87px]"
          alt="mobula logo"
          src={
            state.image.logo || state.image.uploaded_logo || isDarkMode
              ? "/mobula/mobula-logo.svg"
              : "/mobula/mobula-logo-light.svg"
          }
        />

        <LargeFont extraCss="mb-[30px]">Listing Form</LargeFont>
        <div className="flex flex-col w-full mb-5 relative">
          <div className="flex flex-col w-full items-start relative">
            {infos.map((info, i) => (
              <div className="w-full flex-col flex pl-[30px]" key={info.name}>
                <div className="flex items-center">
                  <button
                    className={`w-6 h-6 rounded-full text-light-font-100 dark:text-dark-font-100 
                  transition-all duration-200 text-sm border ${
                    i <= actualPage
                      ? "border-blue dark:border-blue bg-light-bg-hover dark:bg-dark-bg-hover"
                      : "border-light-border-secondary dark:border-dark-border-secondary bg-light-bg-hover dark:bg-dark-bg-hover hover:border-blue hover:dark:border-blue"
                  }`}
                    onClick={() => {
                      if (i <= actualPage) setActualPage(i);
                    }}
                  >
                    {i + 1}
                  </button>
                  <MediumFont extraCss="ml-2.5">{info.name}</MediumFont>
                </div>
                {infos.length - 1 === i ? null : (
                  <div
                    className={`flex ${
                      i < actualPage
                        ? " bg-blue dark:bg-blue"
                        : "bg-light-border-secondary dark:bg-dark-border-secondary"
                    } h-[30px] w-[1px] ml-3`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center ml-[25px] mr-auto">
          <NextChakraLink
            extraCss="text-blue dark:text-blue text-xs md:text-[10px] font-medium"
            href="https://docs.mobula.fi/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read here{" "}
            <span className="text-light-font-100 dark:text-dark-font-100">
              the documentation
            </span>
          </NextChakraLink>{" "}
        </div>
        <div className="flex items-center ml-[25px] mr-auto">
          <NextChakraLink
            href="https://t.me/MobulaPartnerBot?start=Form_Help"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="text-light-font-40 dark:text-dark-font-40 underline flex items-center text-xs md:text-[10px]">
              Get in touch with core-team
              <FiExternalLink className="ml-[5px] text-[11px] text-light-font-60 dark:text-dark-font-60" />
            </span>
          </NextChakraLink>
        </div>
      </div>
    </div>
  );
};
