"use client";
import { blockchainsContent } from "mobula-lite/lib/chains/constants";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import React, { useContext, useState } from "react";
import { BiChevronDown } from "react-icons/bi";
import { FaGithub, FaKey } from "react-icons/fa";
import { MdLibraryAdd, MdOutlineKeyboardCapslock } from "react-icons/md";
import { RiGlobalLine } from "react-icons/ri";
import { SiHiveBlockchain } from "react-icons/si";
import { useAccount } from "wagmi";
import { SmallFont } from "../../components/fonts";
import { NextChakraLink } from "../../components/link";
import { useGeneralContext } from "../../contexts/general";
import { PopupUpdateContext } from "../../contexts/popup";
import { pushData } from "../../lib/mixpanel";
import { getUrlFromName } from "../../utils/formaters";
import { navigation, navigationGlobal } from "./constants";

export const Nav = () => {
  const { setHideNav, hideNav } = useGeneralContext();
  const [showChains, setShowChains] = useState(false);
  const router = useRouter();
  const { theme } = useTheme();
  const [isHover, setIsHover] = useState("");
  const [showGlobal, setShowGlobal] = useState(false);
  const handleShowGlobal = () => setShowGlobal(!showGlobal);
  const handleShowChains = () => setShowChains(!showChains);
  const { setConnect } = useContext(PopupUpdateContext);
  const { isDisconnected } = useAccount();

  const blockchains = Object.entries(blockchainsContent)?.filter((x) => {
    return x[1]?.FETCH_BLOCKS;
  });

  const image =
    theme === "dark"
      ? "/mobula/mobula-logo.svg"
      : "/mobula/mobula-logo-light.svg";
  return (
    <div
      id="container"
      className={`flex lg:hidden flex-col h-screen max-h-screen transition-all duration-100 ease-linear overflow-hidden ${
        hideNav === "hidden"
          ? "w-[60px] min-w-[60px] max-w-[60px]"
          : "w-[230px] min-w-[230px] max-w-[230px]"
      } border-r border-light-border-secondary dark:border-dark-border-secondary cursor-pointer bg-light-bg-primary
       dark:bg-dark-bg-primary shadow-xl min-w-[60px] fixed top-0 left-0 z-[101]`}
      onMouseEnter={() => {
        if (hideNav === "locked") return;
        setHideNav("visible");
        setShowChains(true);
      }}
      onMouseLeave={() => {
        if (hideNav === "locked") return;
        setHideNav("hidden");
        setShowChains(false);
        setShowGlobal(false);
      }}
    >
      <div className="flex items-center justify-between w-full mt-[42px] mb-4">
        <div className="pl-[13px] items-center flex ">
          <div className="theme-image dark">
            <img
              src="/mobula/mobula-logo.svg"
              className="w-[32px] h-[32px] max-w-[32px] max-h-[32px]"
              width={32}
              height={32}
            />
          </div>
          <div className="theme-image light">
            <img
              src="/mobula/mobula-logo-light.svg"
              className="w-[32px] h-[32px] max-w-[32px] max-h-[32px]"
              width={32}
              height={32}
            />
          </div>
          <h2
            className={`text-light-font-100 dark:text-dark-font-100 text-2xl ml-3 font-poppins ${
              hideNav === "hidden" ? "opacity-0" : ""
            } transition-opacity duration-100 ease-linear`}
          >
            Mobula
          </h2>
        </div>
        <button
          className="pr-[18px] pl-2 items-center flex "
          onClick={() => {
            if (hideNav === "locked") setHideNav("hidden");
            else setHideNav("locked");
          }}
        >
          <MdOutlineKeyboardCapslock
            className={`${
              hideNav === "locked" ? "-rotate-90" : "rotate-90"
            } text-light-font-100 dark:text-dark-font-100 text-lg`}
          />
        </button>
      </div>
      <div className="p-5 pb-0 w-fit overflow-hidden whitespace-nowrap mb-5 min-h-[164px]">
        {navigation.map((page, i) => (
          <NextChakraLink
            href={page.name === "Portfolio" && isDisconnected ? `/` : page.url}
            onClick={(e) => {
              if (page.name === "Portfolio" && isDisconnected) {
                e.preventDefault();
                setConnect(true);
                return;
              }
            }}
            onMouseEnter={() => setIsHover(page.name)}
            onMouseLeave={() => setIsHover("")}
          >
            <div
              className={`flex items-center ${
                i === navigation?.length - 1 ? "" : "mb-5"
              }`}
            >
              {page.icon}
              <div className="w-fit ml-6">
                <SmallFont extraCss="font-poppins font-normal">
                  {page.name}
                </SmallFont>
                <div
                  className={`${
                    isHover === page.name ? "w-full" : "w-0"
                  } h-[1px] rounded bg-light-font-80 dark:bg-dark-font-80 transition-all duration-100 ease-linear`}
                />
              </div>
            </div>
          </NextChakraLink>
        ))}
      </div>
      <div
        className={`flex flex-col h-full ${
          showGlobal ? "max-h-[160px]" : "max-h-[40px]"
        } overflow-hidden transition-all duration-100 ease-linear`}
      >
        <div
          className="flex items-center mb-4 pl-5 "
          onClick={handleShowGlobal}
        >
          <RiGlobalLine className="text-light-font-100 dark:text-dark-font-100 text-lg min-w-[18px]" />
          <div className="ml-6 flex items-center justify-between whitespace-nowrap overflow-hidden ">
            <SmallFont extraCss="font-poppins">
              {navigationGlobal.name}
            </SmallFont>
            <BiChevronDown className="text-light-font-100 dark:text-dark-font-100 text-2xl mr-5 ml-1.5" />
          </div>
        </div>
        {navigationGlobal.extend.map((page, i) => (
          <NextChakraLink
            onMouseEnter={() => setIsHover(page.name)}
            onMouseLeave={() => setIsHover("")}
            href={page.url}
          >
            <div
              className={`flex items-center ${
                i !== navigationGlobal.extend.length - 1 ? "mb-5" : ""
              } pl-7`}
            >
              {page.icon}
              <div className="w-fit ml-1.5">
                <SmallFont extraCss="font-poppins">{page.name}</SmallFont>
                <div
                  className={`${
                    isHover === page.name ? "w-full" : "w-0"
                  } h-[1px] rounded bg-light-font-80 dark:bg-dark-font-80 transition-all duration-100 ease-linear`}
                />
              </div>
            </div>
          </NextChakraLink>
        ))}
      </div>
      <div
        className={`flex flex-col h-full mt-0 ${
          showChains ? "max-h-full" : "max-h-[40px]"
        } overflow-hidden transition-all duration-100 ease-linear`}
      >
        <div className="flex items-center mb-4 pl-5" onClick={handleShowChains}>
          <SiHiveBlockchain className="text-light-font-100 dark:text-dark-font-100 text-[18px] min-w-[18px]" />
          <div className="ml-6 flex items-center justify-between whitespace-nowrap">
            <SmallFont extraCss="font-poppins">
              Chains ({blockchains?.length})
            </SmallFont>
            <BiChevronDown className="text-light-font-100 dark:text-dark-font-100 text-2xl mr-5 ml-1.5" />
          </div>
        </div>
        <div className="relative overflow-y-scroll">
          <div className="flex flex-col whitespace-nowrap relative">
            {blockchains?.map((blockchain, i) => (
              <div
                className={`flex items-center ${
                  i !== blockchains?.length - 1 ? "mb-5" : ""
                } pl-7`}
                key={blockchain[0]}
                onMouseEnter={() => setIsHover(blockchain[0])}
                onMouseLeave={() => setIsHover("")}
              >
                <NextChakraLink
                  href={`/chain/${
                    blockchain[1]?.shortName
                      ? getUrlFromName(blockchain[1]?.shortName)
                      : getUrlFromName(blockchain[0])
                  }`}
                >
                  <div className="flex items-center w-full">
                    <img
                      src={blockchain[1]?.logo || "/empty/unknown.png"}
                      className="h-[18px] w-[18px] min-w-[18px] rounded-full"
                    />
                    <div className="w-fit ml-2.5">
                      <SmallFont extraCss={`font-poppins`}>
                        {blockchain[1]?.shortName || blockchain[0]}
                      </SmallFont>
                      <div
                        className={`${
                          isHover === blockchain[0] ? "w-full" : "w-0"
                        } h-[1px] rounded bg-light-font-80 dark:bg-dark-font-80 transition-all duration-100 ease-linear`}
                      />
                    </div>
                  </div>
                </NextChakraLink>
              </div>
            ))}
          </div>{" "}
          <div className="from-light-bg-primary to-[rgba(0,0,0,0)] h-[30px] w-full sticky bottom-[-10px] bg-gradient-to-t dark:from-dark-bg-primary dark:to-[rgba(0,0,0,0)]" />{" "}
        </div>
      </div>
      <div className="h-[30px] w-full" />
      <div
        className="flex flex-col z-[2] w-[300px] mt-auto p-5 pb-0  border-t overflow-hidden whitespace-nowrap
       border-light-border-secondary dark:border-dark-border-secondary min-h-[141px]"
      >
        <a
          href="https://github.com/MobulaFi/mobula-ui"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="flex items-center mb-5">
            <FaGithub className="text-lg text-light-font-100 dark:text-dark-font-100" />
            <div className="w-fit ml-6">
              <SmallFont extraCss="font-poppins">Github</SmallFont>
            </div>
          </div>
        </a>
        <a
          href="/list?utm_source=header"
          onClick={() => {
            pushData("Header Get listed Clicked");
          }}
        >
          <div className="flex items-center mb-5">
            <MdLibraryAdd className="text-lg text-light-font-100 dark:text-dark-font-100" />
            <div className="w-fit ml-6">
              <SmallFont extraCss="font-poppins">Get listed</SmallFont>
            </div>
          </div>
        </a>
        <a
          href="https://docs.mobula.fi/?utm_source=header"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            pushData("Header Free API Key Clicked");
          }}
        >
          <div className="flex items-center mb-5">
            <FaKey className="text-lg text-light-font-100 dark:text-dark-font-100" />
            <div className="w-fit ml-6">
              <SmallFont extraCss="font-poppins">Free API Key</SmallFont>
            </div>
          </div>
        </a>
      </div>
    </div>
  );
};
