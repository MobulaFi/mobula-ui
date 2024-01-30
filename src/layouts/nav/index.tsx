"use client";
import { MediumFont } from "components/fonts";
import { useGeneralContext } from "contexts/general";
import { pushData } from "lib/mixpanel";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useState } from "react";
import { FaGithub } from "react-icons/fa";
import { FaKey } from "react-icons/fa6";
import { MdLibraryAdd, MdOutlineKeyboardCapslock } from "react-icons/md";
import { navigation } from "./constants";

export const Nav = () => {
  const { setHideNav, hideNav } = useGeneralContext();
  const handleHideNav = () => setHideNav("visible");
  const { resolvedTheme } = useTheme();
  const [active, setActive] = useState("");
  const [isHover, setIsHover] = useState("");
  const handleActiveSection = (value: string) => setActive(value);

  console.log("hideNav", hideNav);

  return (
    <div
      className={`flex flex-col h-screen max-h-screen w-full tranition-all duration-100 ease-linear overflow-hidden ${
        hideNav === "hidden" ? "max-w-[68px]" : "max-w-[300px]"
      } border-r border-light-border-secondary dark:border-dark-border-secondary cursor-pointer shadow-xl`}
      onMouseEnter={() => {
        if (hideNav === "locked") return;
        setHideNav("visible");
      }}
      onMouseLeave={() => {
        if (hideNav === "locked") return;
        setHideNav("hidden");
      }}
    >
      <div className="flex items-center justify-between w-full mt-[4px] ">
        <div className="pl-[18px] pt-5 pb-2.5 items-center flex">
          <img
            className="w-[32px] h-[32px] max-w-[32px] max-h-[32px]"
            src={
              resolvedTheme === "dark"
                ? "/mobula/mobula-logo.svg"
                : "/mobula/mobula-logo-light.svg"
            }
            alt="Mobula logo"
          />
          <h2
            className={`text-light-font-100 dark:text-dark-font-100 text-[32px] ml-3 font-poppins ${
              hideNav === "hidden" ? "opacity-0" : ""
            } transition-opacity duration-100 ease-linear`}
          >
            Mobula
          </h2>
        </div>
        <button
          className="pr-[18px] pt-5 pb-2.5 pl-2 items-center flex mt-1"
          onClick={() => {
            if (hideNav === "locked") setHideNav("hidden");
            else setHideNav("locked");
          }}
        >
          <MdOutlineKeyboardCapslock
            className={`${
              hideNav === "locked" ? "-rotate-90" : "rotate-90"
            } text-light-font-100 dark:text-dark-font-100 text-2xl`}
          />
        </button>
      </div>
      <div className="p-5 w-fit overflow-hidden whitespace-nowrap">
        {navigation.map((page, i) => (
          <Link
            href={page.url}
            onClick={() => handleActiveSection(page.name)}
            onMouseEnter={() => setIsHover(page.name)}
            onMouseLeave={() => setIsHover("")}
          >
            <div className="flex items-center mb-8">
              {page.icon}
              <div className="w-fit ml-6">
                <MediumFont extraCss="font-poppins font-medium">
                  {page.name}
                </MediumFont>
                <div
                  className={`${
                    active === page.name || isHover === page.name
                      ? "w-full"
                      : "w-0"
                  } h-[1px] rounded bg-light-font-80 dark:bg-dark-font-80 transition-all duration-100 ease-linear`}
                />
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div
        className="flex flex-col z-[2] mt-auto p-5 mb-2.5 border-t w-fit overflow-hidden whitespace-nowrap
       border-light-border-secondary dark:border-dark-border-secondary"
      >
        <Link href="https://github.com/MobulaFi/mobula-ui">
          <div className="flex items-center mb-8">
            <FaGithub className="text-2xl text-light-font-100 dark:text-dark-font-100" />
            <div className="w-fit ml-6">
              <MediumFont extraCss="font-poppins font-medium">
                Github
              </MediumFont>
            </div>
          </div>
        </Link>
        <Link
          href="/list?utm_source=header"
          onClick={() => {
            pushData("Header Get listed Clicked");
          }}
        >
          <div className="flex items-center mb-8">
            <MdLibraryAdd className="text-2xl text-light-font-100 dark:text-dark-font-100" />
            <div className="w-fit ml-6">
              <MediumFont extraCss="font-poppins font-medium">
                Get listed
              </MediumFont>
            </div>
          </div>
        </Link>
        <Link
          href="https://docs.mobula.fi/?utm_source=header"
          onClick={() => {
            pushData("Header Free API Key Clicked");
          }}
        >
          <div className="flex items-center mb-8">
            <FaKey className="text-2xl text-light-font-100 dark:text-dark-font-100" />
            <div className="w-fit ml-6">
              <MediumFont extraCss="font-poppins font-medium">
                Free API Key
              </MediumFont>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};
