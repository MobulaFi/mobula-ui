import React, { useContext, useEffect, useState } from "react";
import { AiFillPieChart, AiFillStar } from "react-icons/ai";
import { BsPower } from "react-icons/bs";
import { useAccount } from "wagmi";
import { disconnect, readContract } from "wagmi/actions";
import { ClientOnly } from "../../../../components/client-only";
import { NextChakraLink } from "../../../../components/link";
import { MOBL_ADDRESS } from "../../../../constants";
import { CommonPageContext } from "../../../../contexts/commun-page";
import { PopupUpdateContext } from "../../../../contexts/popup";
import { UserContext } from "../../../../contexts/user";
import { useUrl } from "../../../../hooks/url";
import { pushData } from "../../../../lib/mixpanel";
import { balanceOfAbi } from "../../../../utils/abi";
import { addressSlicer, getFormattedAmount } from "../../../../utils/formaters";
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
  const [balanceMOBL, setBalanceMOBL] = useState<number | null>(null);

  const getBalanceOfMOBL = async () => {
    const balance = await readContract({
      address: MOBL_ADDRESS as `0x${string}`,
      abi: balanceOfAbi,
      functionName: "balanceOf",
      args: [address],
    });
    setBalanceMOBL(Number(balance) / 10 ** 18 || null);
  };

  useEffect(() => {
    if (isConnected) getBalanceOfMOBL();
  }, [isConnected]);

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
      className={`bg-light-bg-primary hidden lg:flex dark:bg-dark-bg-primary z-[102] pt-[15px] top-[98px] 
    w-screen left-0 h-screen text-light-font-100 dark:text-dark-font-100 flex-col 
    overflow-x-hidden fixed ${
      isMenuMobile ? "opacity-100 translate-x-0" : "translate-x-full"
    } transition-all duration-300 ease-in-out`}
      id="mobileNav"
    >
      <Mobile navigation={navigation} />
      <NextChakraLink
        href={isConnected ? watchlistUrl : ""}
        extraCss="mt-2.5"
        onClick={() => {
          if (!isConnected) setConnect(true);
          setIsMenuMobile(false);
          setShowChainPopover(false);
          pushData("Header Clicked", {
            name: "Watchlist",
          });
        }}
      >
        <div className="flex pl-[30px] items-center my-2.5 text-light-font-100 dark:text-dark-font-100 cursor-pointer">
          <AiFillStar className="text-yellow dark:text-yellow text-base mr-[5px]" />
          <p className="text-base font-normal">Watchlist</p>
        </div>
      </NextChakraLink>
      <NextChakraLink
        href={isConnected ? portfolioUrl : ""}
        onClick={() => {
          if (!isConnected) setConnect(true);
          setIsMenuMobile(false);
          pushData("Header Clicked", {
            name: "Portfolio",
          });
        }}
      >
        <div className="flex pl-[30px] items-center mt-2.5 text-light-font-100 dark:text-dark-font-100">
          <div className="opacity-80 w-4 h-4 mr-[5px]">
            <AiFillPieChart className="text-blue dark:text-blue text-base" />
          </div>
          <p className="text-base  font-normal">Portfolio</p>
        </div>
      </NextChakraLink>
      <ClientOnly>
        {isConnected ? (
          <>
            <div className="flex mt-5 bg-light-bg-terciary dark:bg-dark-bg-terciary items-center h-[40px] px-[30px]">
              <div className="flex items-center justify-between w-full">
                <div className="w-fit flex items-center mr-2.5">
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
                {balanceMOBL ? (
                  <div className="flex items-center">
                    <p className="text-sm text-light-font-100 dark:text-dark-font-100">
                      {getFormattedAmount(balanceMOBL + (user?.balance || 0))}
                    </p>
                    <img
                      src="/mobula/fullicon.png"
                      className="w-[18px] h-[18px] rounded-full ml-[5px]"
                    />
                  </div>
                ) : null}
              </div>
            </div>
          </>
        ) : (
          <button
            className="border border-light-border-primary dark:border-dark-border-primary rounded
           h-[30px] w-fit  px-2 text-light-font-100 dark:text-dark-font-100 text-base ml-[30px] mt-5"
            onClick={() => {
              setConnect(true);
              setIsMenuMobile(false);
            }}
          >
            Connect
          </button>
        )}
      </ClientOnly>
      {isMenuMobile ? (
        <div className="hidden lg:flex justify-between items-center mt-5">
          <ToggleColorMode isMobile />
          <div className="hidden mr-[15px] lg:flex">
            <ChainsChanger
              isMobileVersion
              showChainPopover={showChainPopover}
              setShowChainPopover={setShowChainPopover}
              setShowInfoPopover={setShowInfoPopover}
              showInfoPopover={showInfoPopover}
            />
          </div>
        </div>
      ) : null}
      {isConnected ? (
        <button
          className="ml-[28px] mt-3.5"
          onClick={() => {
            disconnect();
          }}
        >
          <div className="flex items-center text-light-font-100 dark:text-dark-font-100 text-base">
            <BsPower className="text-xl mr-2.5" />
            Log Out
          </div>
        </button>
      ) : null}
    </div>
  );
};
