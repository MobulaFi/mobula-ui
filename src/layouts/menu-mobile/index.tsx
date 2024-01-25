"use client";
import { usePathname } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { FiHome } from "react-icons/fi";
import { SlWallet } from "react-icons/sl";
import { VscArrowSwap } from "react-icons/vsc";
import { useAccount } from "wagmi";
import { SmallFont } from "../../components/fonts";
import { NextChakraLink } from "../../components/link";
import { PopupUpdateContext } from "../../contexts/popup";
import { useUrl } from "../../hooks/url";

export const MenuFixedMobile = () => {
  const [lastScroll, setLastScroll] = useState(0);
  const [visible, setVisible] = useState(true);
  const { portfolioUrl } = useUrl();
  const { setConnect } = useContext(PopupUpdateContext);
  const { isConnected, isDisconnected } = useAccount();
  const pathname = usePathname();
  const [isHover, setIsHover] = useState({
    home: pathname === "/home",
    swap: pathname === "/swap",
    portfolio: pathname === "/portfolio",
  });

  const handleHoverIn = (key: string) => {
    setIsHover((prev) => ({ ...prev, [key]: true }));
  };

  const handleHoverOut = (key: string) => {
    if (pathname === `/${key}` || (key === "home" && pathname === "/home"))
      return;
    setIsHover((prev) => ({ ...prev, [key]: false }));
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollCourant =
        window.pageYOffset || document.documentElement.scrollTop;

      if (scrollCourant >= lastScroll && scrollCourant > 0) setVisible(false);
      else setVisible(true);

      setLastScroll(scrollCourant);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScroll]);

  return (
    <div
      className={`w-full h-[75px] items-center flex-col pb-2.5 border-t border-light-border-primary
     dark:border-dark-border-primary bg-light-bg-secondary dark:bg-dark-bg-secondary z-[11] hidden md:flex 
     transition-all duration-200 ease-in-out fixed shadow-md ${
       visible ? "bottom-0" : "bottom-[-80px]"
     }`}
    >
      <div className="flex w-full h-full max-w-[340px] mx-auto">
        <div className="flex w-[33.33%] h-full items-center justify-center">
          <NextChakraLink
            href="/home"
            onMouseEnter={() => handleHoverIn("home")}
            onMouseLeave={() => handleHoverOut("home")}
            onClick={() =>
              setIsHover({ swap: false, portfolio: false, home: true })
            }
          >
            <div className="flex flex-col items-center justify-center">
              <FiHome
                className={`text-lg mb-[5px] ${
                  isHover.home
                    ? "text-light-font-100 dark:text-dark-font-100"
                    : "text-light-font-60 dark:text-dark-font-60"
                } transition-all duration-200 ease-in-out`}
              />
              <SmallFont
                extraCss={` ${
                  isHover.home
                    ? "text-light-font-100 dark:text-dark-font-100"
                    : "text-light-font-60 dark:text-dark-font-60"
                } transition-all duration-200 ease-in-out`}
              >
                Home
              </SmallFont>
            </div>
          </NextChakraLink>
        </div>
        <div className="flex w-[33.33%] h-full items-center justify-center">
          <NextChakraLink
            href="/swap"
            onMouseEnter={() => handleHoverIn("swap")}
            onMouseLeave={() => handleHoverOut("swap")}
            onClick={() =>
              setIsHover({ swap: true, portfolio: false, home: false })
            }
          >
            <div className="flex flex-col items-center justify-center">
              <VscArrowSwap
                className={`text-lg mb-[5px] ${
                  isHover.swap
                    ? "text-light-font-100 dark:text-dark-font-100"
                    : "text-light-font-60 dark:text-dark-font-60"
                } transition-all duration-200 ease-in-out`}
              />
              <SmallFont
                extraCss={` ${
                  isHover.swap
                    ? "text-light-font-100 dark:text-dark-font-100"
                    : "text-light-font-60 dark:text-dark-font-60"
                } transition-all duration-200 ease-in-out`}
              >
                Swap
              </SmallFont>
            </div>
          </NextChakraLink>
        </div>
        <div className="flex w-[33.33%] h-full items-center justify-center">
          <NextChakraLink
            href={isConnected ? portfolioUrl : ""}
            onMouseEnter={() => handleHoverIn("portfolio")}
            onMouseLeave={() => handleHoverOut("portfolio")}
            onClick={() => {
              if (isDisconnected) setConnect(true);
              setIsHover({ swap: false, portfolio: true, home: false });
            }}
          >
            <div className="flex flex-col items-center justify-center">
              <SlWallet
                className={`text-lg mb-[5px] ${
                  isHover.portfolio
                    ? "text-light-font-100 dark:text-dark-font-100"
                    : "text-light-font-60 dark:text-dark-font-60"
                } transition-all duration-200 ease-in-out`}
              />
              <SmallFont
                extraCss={` ${
                  isHover.portfolio
                    ? "text-light-font-100 dark:text-dark-font-100"
                    : "text-light-font-60 dark:text-dark-font-60"
                } transition-all duration-200 ease-in-out`}
              >
                Portfolio
              </SmallFont>
            </div>
          </NextChakraLink>
        </div>
      </div>
    </div>
  );
};
