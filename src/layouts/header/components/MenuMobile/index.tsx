import React, { useContext, useEffect } from "react";
import { AiFillPieChart, AiFillStar } from "react-icons/ai";
import { BsPower } from "react-icons/bs";
import { useAccount } from "wagmi";
import { disconnect } from "wagmi/actions";
import { ClientOnly } from "../../../../components/client-only";
import { NextChakraLink } from "../../../../components/link";
import { CommonPageContext } from "../../../../contexts/commun-page";
import { PopupUpdateContext } from "../../../../contexts/popup";
import { UserContext } from "../../../../contexts/user";
import { useUrl } from "../../../../hooks/url";
import { pushData } from "../../../../lib/mixpanel";
import { addressSlicer } from "../../../../utils/formaters";
import { ToggleColorMode } from "../../../toggle-mode";
import { navigation } from "../../constants";
import { ChainsChanger } from "../chains-changer";
import { Mobile } from "../mobile";

interface MenuMobileProps {
  showChainPopover?: boolean;
  setShowChainPopover?: React.Dispatch<React.SetStateAction<boolean>>;
  setShowInfoPopover?: React.Dispatch<React.SetStateAction<boolean>>;
  showInfoPopover?: boolean;
}

export const MenuMobile = ({
  showChainPopover,
  setShowChainPopover,
  setShowInfoPopover,
  showInfoPopover,
}: MenuMobileProps) => {
  const { address, isConnected } = useAccount();
  const { user } = useContext(UserContext);
  const { isMenuMobile, setIsMenuMobile } = useContext(CommonPageContext);
  const { watchlistUrl } = useUrl();
  const { setConnect } = useContext(PopupUpdateContext);

  useEffect(() => {
    window.onscroll = () => {
      if (isMenuMobile) window.scrollTo(0, 0);
    };

    return () => {
      window.onscroll = () => {};
    };
  }, [isMenuMobile]);

  const { portfolioUrl } = useUrl();

  return (
    <div
      className={`bg-light-bg-primary dark:bg-dark-bg-primary z-[110] pt-[15px] top-[45px] 
    w-screen left-0 h-screen text-light-font-100 dark:text-dark-font-100 flex flex-col 
    overflow-x-hidden fixed ${isMenuMobile ? "flex" : "hidden"}`}
      id="mobileNav"
    >
      <Mobile navigation={navigation} />
      <NextChakraLink
        href={isConnected ? watchlistUrl : ""}
        extraCss="mt-2.5"
        onClick={() => {
          if (!isConnected) setConnect(true);
          setIsMenuMobile(false);
          pushData("Header Clicked", {
            name: "Watchlist",
          });
        }}
      >
        <div className="flex pl-[30px] items-center mt-2.5 text-light-font-100 dark:text-dark-font-100 cursor-pointer">
          <AiFillStar className="text-yellow dark:text-yellow text-lg mr-[5px]" />
          <p className="text-lg">Watchlist</p>
        </div>
      </NextChakraLink>
      <NextChakraLink
        href={portfolioUrl}
        onClick={() => {
          setIsMenuMobile(false);
          pushData("Header Clicked", {
            name: "Portfolio",
          });
        }}
      >
        <div className="flex pl-[30px] items-center mt-2.5 text-light-font-100 dark:text-dark-font-100">
          <div className="opacity-80 w-4 h-4 mr-[5px]">
            <AiFillPieChart className="text-blue dark:text-blue" />
          </div>
          <p className="text-lg">Portfolio</p>
        </div>
      </NextChakraLink>
      <ClientOnly>
        {isConnected ? (
          <>
            <div className="flex mt-5 bg-light-bg-terciary dark:bg-dark-bg-terciary items-center h-[40px] px-[30px]">
              <p className="text-base text-light-font-100 dark:text-dark-font-100">
                {!user?.username && user?.address && address
                  ? addressSlicer(address)
                  : user?.username || "Nickname"}
              </p>
              {address && user?.username ? (
                <p className="text-base text-light-font-40 dark:text-dark-font-40 ml-[5px]">
                  ({addressSlicer(address)})
                </p>
              ) : null}
            </div>
            <div className="flex px-[30px] mt-[15px] items-center w-full justify-between">
              <button
                onClick={() => {
                  disconnect();
                }}
              >
                <div className="flex items-center text-light-font-100 dark:text-dark-font-100">
                  <BsPower className="text-lg mr-2.5" />
                  <p className="text-base font-medium">Log Out</p>
                </div>
              </button>
            </div>{" "}
          </>
        ) : (
          <button
            className="border border-light-border-primary dark:border-dark-border-primary rounded
           h-[30px] w-[120px] text-light-font-100 dark:text-dark-font-100 text-base ml-[30px] mt-5"
            onClick={() => {
              setConnect(true);
            }}
          >
            Connect
          </button>
        )}
      </ClientOnly>
      <div className="flex justify-between items-center mt-5">
        <ToggleColorMode isMobile />
        <div className="flex mr-[15px]">
          <ChainsChanger
            isMobileVersion
            showChainPopover={showChainPopover}
            setShowChainPopover={setShowChainPopover}
            setShowInfoPopover={setShowInfoPopover}
            showInfoPopover={showInfoPopover}
          />
        </div>
      </div>
    </div>
  );
};
