"use client";
import { blockchainsContent } from "mobula-lite/lib/chains/constants";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import React, { useContext, useState } from "react";
import { BiChevronDown } from "react-icons/bi";
import { FaGithub, FaKey } from "react-icons/fa";
import { MdLibraryAdd, MdOutlineKeyboardCapslock } from "react-icons/md";
import { RiGlobalLine } from "react-icons/ri";
import { useAccount, useNetwork } from "wagmi";
import { MediumFont, SmallFont } from "../../components/fonts";
import { useGeneralContext } from "../../contexts/general";
import { PopupUpdateContext } from "../../contexts/popup";
import { pushData } from "../../lib/mixpanel";
import { getUrlFromName } from "../../utils/formaters";
import { navigation, navigationGlobal } from "./constants";

export const Nav = () => {
  const { setHideNav, hideNav } = useGeneralContext();
  const [showChains, setShowChains] = useState(false);
  const { resolvedTheme } = useTheme();
  const [active, setActive] = useState("");
  const [isHover, setIsHover] = useState("");
  const handleActiveSection = (value: string) => setActive(value);
  const [showGlobal, setShowGlobal] = useState(false);
  const handleShowGlobal = () => setShowGlobal(!showGlobal);
  const handleShowChains = () => setShowChains(!showChains);
  const { setConnect } = useContext(PopupUpdateContext);
  const { isDisconnected } = useAccount();
  const router = useRouter();
  const { chain } = useNetwork();

  console.log("blockchainsContent", blockchainsContent);
  const blockchains = Object.entries(blockchainsContent)?.filter(
    (x) => x[1]?.FETCH_BLOCKS
  );
  return (
    <div
      id="container"
      className={`flex lg:hidden flex-col h-screen max-h-screen transition-all duration-100 ease-linear overflow-hidden ${
        hideNav === "hidden"
          ? "w-[68px] min-w-[68px] max-w-[68px]"
          : "w-[300px] min-w-[300px] max-w-[300px]"
      } border-r border-light-border-secondary dark:border-dark-border-secondary cursor-pointer bg-light-bg-primary
       dark:bg-dark-bg-primary shadow-xl min-w-[68px] fixed top-0 left-0 z-[101]`}
      onMouseEnter={() => {
        if (hideNav === "locked") return;
        setHideNav("visible");
      }}
      onMouseLeave={() => {
        if (hideNav === "locked") return;
        setHideNav("hidden");
        setShowChains(false);
        setShowGlobal(false);
      }}
    >
      <div className="flex items-center justify-between w-full mt-[42px]">
        <div className="pl-[18px] items-center flex ">
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
            className={`text-light-font-100 dark:text-dark-font-100 text-[32px] ml-[18px] font-poppins ${
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
            } text-light-font-100 dark:text-dark-font-100 text-2xl`}
          />
        </button>
      </div>
      <div className="p-5 pb-0 w-fit overflow-hidden whitespace-nowrap mt-4">
        {navigation.map((page, i) => (
          <a
            href={page.name === "Portfolio" && isDisconnected ? `/` : page.url}
            onClick={(e) => {
              if (page.name === "Portfolio" && isDisconnected) {
                e.preventDefault();
                setConnect(true);
                return;
              }
              handleActiveSection(page.name);
            }}
            onMouseEnter={() => setIsHover(page.name)}
            onMouseLeave={() => setIsHover("")}
          >
            <div className="flex items-center mb-8">
              {page.icon}
              <div className="w-fit ml-6">
                <MediumFont extraCss="font-poppins font-normal">
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
          </a>
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
          <RiGlobalLine className="text-light-font-100 dark:text-dark-font-100 text-[26px] min-w-[26px]" />
          <div className="ml-6 flex items-center justify-between whitespace-nowrap overflow-hidden ">
            <MediumFont extraCss="font-poppins">
              {navigationGlobal.name}
            </MediumFont>
            <BiChevronDown className="text-light-font-100 dark:text-dark-font-100 text-2xl mr-5 ml-1.5" />
          </div>
        </div>
        {navigationGlobal.extend.map((page, i) => (
          <a
            href={page.url}
            onClick={() => handleActiveSection(page.name)}
            onMouseEnter={() => setIsHover(page.name)}
            onMouseLeave={() => setIsHover("")}
          >
            <div className="flex items-center mb-5 pl-7">
              {page.icon}
              <div className="w-fit ml-2.5">
                <SmallFont extraCss="font-poppins">{page.name}</SmallFont>
                <div
                  className={`${
                    active === page.name || isHover === page.name
                      ? "w-full"
                      : "w-0"
                  } h-[1px] rounded bg-light-font-80 dark:bg-dark-font-80 transition-all duration-100 ease-linear`}
                />
              </div>
            </div>
          </a>
        ))}
      </div>
      <div
        className={`flex flex-col h-full mt-5 ${
          showChains ? "max-h-[340px]" : "max-h-[40px]"
        } overflow-hidden transition-all duration-100 ease-linear`}
      >
        <div className="flex items-center mb-4 pl-5" onClick={handleShowChains}>
          <img
            src={
              blockchainsContent[chain?.name as string]?.logo ||
              blockchainsContent["Ethereum"]?.logo
            }
            className="h-[24px] w-[24px] min-w-[24px] rounded-full"
          />
          <div className="ml-6 flex items-center justify-between whitespace-nowrap">
            <MediumFont extraCss="font-poppins">
              Chains ({blockchains?.length})
            </MediumFont>
            <BiChevronDown className="text-light-font-100 dark:text-dark-font-100 text-2xl mr-5 ml-1.5" />
          </div>
        </div>
        <div className="flex flex-col max-h-[270px] overflow-y-auto whitespace-nowrap">
          {blockchains?.map((blockchain, i) => (
            <div
              className="flex items-center mb-5 pl-7"
              key={blockchain[0]}
              onClick={() => {
                router.push(
                  `/chain/${
                    blockchain[1]?.shortName
                      ? getUrlFromName(blockchain[1]?.shortName)
                      : getUrlFromName(blockchain[0])
                  }`
                );
              }}
            >
              <img
                src={blockchain[1]?.logo || "/empty/unknown.png"}
                className="h-[20px] w-[20px] min-w-[20px] rounded-full"
              />
              <div className="w-fit ml-2.5">
                <SmallFont
                  extraCss={`${
                    (chain?.id as never) === blockchain[1]?.evmChainId
                      ? "text-blue dark:text-blue"
                      : ""
                  }font-poppins`}
                >
                  {blockchain[0]}
                </SmallFont>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div
        className="flex flex-col z-[2] w-[300px] mt-auto p-5 pt-8 pb-0  border-t overflow-hidden whitespace-nowrap
       border-light-border-secondary dark:border-dark-border-secondary"
      >
        <a
          href="https://github.com/MobulaFi/mobula-ui"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="flex items-center mb-8">
            <FaGithub className="text-2xl text-light-font-100 dark:text-dark-font-100" />
            <div className="w-fit ml-6">
              <MediumFont extraCss="font-poppins">Github</MediumFont>
            </div>
          </div>
        </a>
        <a
          href="/list?utm_source=header"
          onClick={() => {
            pushData("Header Get listed Clicked");
          }}
        >
          <div className="flex items-center mb-8">
            <MdLibraryAdd className="text-2xl text-light-font-100 dark:text-dark-font-100" />
            <div className="w-fit ml-6">
              <MediumFont extraCss="font-poppins">Get listed</MediumFont>
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
          <div className="flex items-center mb-8">
            <FaKey className="text-2xl text-light-font-100 dark:text-dark-font-100" />
            <div className="w-fit ml-6">
              <MediumFont extraCss="font-poppins">Free API Key</MediumFont>
            </div>
          </div>
        </a>
      </div>
    </div>
  );
};
