"use client";
import { MediumFont, SmallFont } from "components/fonts";
import { useGeneralContext } from "contexts/general";
import { PopupUpdateContext } from "contexts/popup";
import { pushData } from "lib/mixpanel";
import { blockchainsContent } from "mobula-lite/lib/chains/constants";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useContext, useState } from "react";
import { BiChevronDown } from "react-icons/bi";
import { FaGithub, FaKey } from "react-icons/fa";
import { MdLibraryAdd, MdOutlineKeyboardCapslock } from "react-icons/md";
import { RiGlobalLine } from "react-icons/ri";
import { useAccount, useNetwork } from "wagmi";
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
  const { setShowSwitchNetwork, setConnect } = useContext(PopupUpdateContext);
  const { address } = useAccount();
  const { chain } = useNetwork();

  console.log("hidenav", hideNav);

  return (
    <div
      className={`flex lg:hidden flex-col h-screen max-h-screen w-full tranition-all duration-100 ease-linear overflow-hidden ${
        hideNav === "hidden" ? "max-w-[68px]" : "max-w-[300px]"
      } border-r border-light-border-secondary dark:border-dark-border-secondary cursor-pointer shadow-xl min-w-[68px]`}
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
      <div className="flex items-center justify-between w-full mt-[4px] ">
        <div className="pl-[18px] pt-2.5 items-center flex">
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
      <div className="p-5 pb-0 w-fit overflow-hidden whitespace-nowrap">
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
            <MediumFont extraCss="font-poppins font-medium">Global</MediumFont>
            <BiChevronDown className="text-light-font-100 dark:text-dark-font-100 text-2xl mr-5 ml-1.5" />
          </div>
        </div>
        {navigationGlobal.extend.map((page, i) => (
          <Link
            href={page.url}
            onClick={() => handleActiveSection(page.name)}
            onMouseEnter={() => setIsHover(page.name)}
            onMouseLeave={() => setIsHover("")}
          >
            <div className="flex items-center mb-5 pl-7">
              {page.icon}
              <div className="w-fit ml-2.5">
                <SmallFont extraCss="font-poppins font-medium">
                  {page.name}
                </SmallFont>
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
        className={`flex flex-col h-full mt-5 ${
          showChains ? "max-h-[340px]" : "max-h-[40px]"
        } overflow-hidden transition-all duration-100 ease-linear`}
      >
        <div className="flex items-center mb-4 pl-5" onClick={handleShowChains}>
          <img
            src={
              blockchainsContent[chain?.name]?.logo ||
              blockchainsContent["Ethereum"]?.logo
            }
            className="h-[24px] w-[24px] min-w-[24px] rounded-full"
          />
          <div className="ml-6 flex items-center justify-between whitespace-nowrap">
            <MediumFont extraCss="font-poppins font-medium">
              Chains ({Object.keys(blockchainsContent)?.length})
            </MediumFont>
            <BiChevronDown className="text-light-font-100 dark:text-dark-font-100 text-2xl mr-5 ml-1.5" />
          </div>
        </div>
        <div className="flex flex-col max-h-[270px] overflow-y-auto whitespace-nowrap">
          {Object.entries(blockchainsContent)?.map((blockchain, i) => (
            <div
              className="flex items-center mb-5 pl-7"
              key={blockchain[0]}
              onClick={() => {
                console.log(blockchain);
                if (!address) {
                  setConnect(true);
                  return;
                } else setShowSwitchNetwork(Number(blockchain[1].chainId));
              }}
            >
              <img
                src={blockchain[1]?.logo || "/empty/unknown.png"}
                className="h-[20px] w-[20px] min-w-[20px] rounded-full"
              />
              <div className="w-fit ml-2.5">
                <SmallFont
                  extraCss={`${
                    chain?.id === blockchain[1]?.chainId
                      ? "text-blue dark:text-blue"
                      : ""
                  }font-poppins font-medium`}
                >
                  {blockchain[0]}
                </SmallFont>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div
        className="flex flex-col z-[2] w-[300px] mt-auto p-5 mb-2.5 border-t overflow-hidden whitespace-nowrap
       border-light-border-secondary dark:border-dark-border-secondary"
      >
        <Link
          href="https://github.com/MobulaFi/mobula-ui"
          target="_blank"
          rel="noopener noreferrer"
        >
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
          target="_blank"
          rel="noopener noreferrer"
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
