"use client";
import Cookies from "js-cookie";
import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";
import React, {
  Dispatch,
  RefObject,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AiOutlineClose, AiOutlineStar } from "react-icons/ai";
import { BsPower } from "react-icons/bs";
import { FaTelegramPlane } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { RiMenu3Line } from "react-icons/ri";
import { TbBellRinging } from "react-icons/tb";
import { useAccount } from "wagmi";
import { disconnect, readContract } from "wagmi/actions";
import { AddressAvatar } from "../../../../components/avatar";
import { SmallFont } from "../../../../components/fonts";
import { NextImageFallback } from "../../../../components/image";
import { Skeleton } from "../../../../components/skeleton";
import { MOBL_ADDRESS } from "../../../../constants";
import { CommonPageContext } from "../../../../contexts/commun-page";
import {
  PopupStateContext,
  PopupUpdateContext,
} from "../../../../contexts/popup";
import { UserContext } from "../../../../contexts/user";
import { pushData } from "../../../../lib/mixpanel";
import { Connect } from "../../../../popup/connect";
import { FeedBackPopup } from "../../../../popup/feedback";
import { SwitchNetworkPopup } from "../../../../popup/switch-network";
import { PopupTelegram } from "../../../../popup/telegram-connect";
import { balanceOfAbi } from "../../../../utils/abi";
import { addressSlicer, getFormattedAmount } from "../../../../utils/formaters";
import { deleteCookie } from "../../../../utils/general";
import { ToggleColorMode } from "../../../toggle-mode";
import { AccountHeaderContext } from "../../context-manager";
import { useUserBalance } from "../../context-manager/balance";
import { useBalance } from "../../hooks/useBalance";
import { MenuMobile } from "../MenuMobile";
import { ChainsChanger } from "../chains-changer";
import { PortfolioButton } from "../portfolio";

interface UserSectionProps {
  addressFromCookie: string;
}

const SearchBarPopup: any = dynamic(
  () => import("../../../../popup/searchbar").then((mod) => mod.SearchBarPopup),
  {
    ssr: false,
  }
);
// const ConnectWallet = dynamic(
//   () => import("../../../../common/components/popup/wallet-reconnect"),
//   {
//     ssr: false,
//   }
// );

function useOutsideAlerter(
  ref: RefObject<HTMLDivElement>,
  setTriggerHook: Dispatch<SetStateAction<boolean>>
) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setTriggerHook(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, setTriggerHook]);
}

export const UserSection = ({ addressFromCookie }: UserSectionProps) => {
  const [triggerSearch, setTriggerSearch] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [isConnectorOpen, setIsConnectorOpen] = useState(false);
  const { setConnect } = useContext(PopupUpdateContext);
  const { connect, showCard, showConnectSocialPopup } =
    useContext(PopupStateContext);
  const [showFeedbackPopup, setShowFeedbackPopup] = useState(false);
  const { address, isConnected } = useAccount();
  const { user } = useContext(UserContext);
  const { setShowNotif } = useContext(AccountHeaderContext);
  const { isMenuMobile, setIsMenuMobile } = useContext(CommonPageContext);
  useOutsideAlerter(wrapperRef, setTriggerSearch);
  const [shouldMagicLinkProfile, setShouldMagicLinkProfile] = useState(false);
  const [showTelegramConnector, setShowTelegramConnector] = useState(false);
  const [showInfoPopover, setShowInfoPopover] = useState(false);
  const [showChainPopover, setShowChainPopover] = useState(false);
  const { isConnecting, isDisconnected } = useAccount();
  const { userBalance, setUserBalance } = useUserBalance();
  const [balanceMOBL, setBalanceMOBL] = useState<number | null>(null);
  const params = useParams();
  const isMagicLoading = params.state;
  useBalance();

  useEffect(() => {
    const needShowNPS = localStorage.getItem("needShowNPS");
    if (needShowNPS && new Date().getTime() > Number(needShowNPS)) {
      setTimeout(() => {
        setShowFeedbackPopup(true);
        localStorage.setItem(
          "needShowNPS",
          // 1000 days
          String(new Date().getTime() + 86400000000000)
        );
      }, 10000);
    } else if (!needShowNPS) {
      localStorage.setItem(
        "needShowNPS",
        // 1 hour
        String(new Date().getTime() + 3600000)
      );
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", (e) => {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT") {
        setTriggerSearch(true);
      } else if (e.key === "Escape") {
        setTriggerSearch(false);
      }
    });
  }, []);

  useEffect(() => {
    if (isMagicLoading && address) {
      const isFirstVisitMagic = localStorage.getItem(`magic${address}`);

      if (!isFirstVisitMagic) {
        localStorage.setItem(`magic${address}`, "true");
        localStorage.setItem("need_magic", "true");
        setShouldMagicLinkProfile(true);
      }
    }
  }, [isMagicLoading, address]);

  useEffect(() => {
    const isFirstVisitMagic = localStorage.getItem("need_magic");
    if (isFirstVisitMagic) {
      setShouldMagicLinkProfile(true);
      localStorage.removeItem("need_magic");
    }
  }, []);

  useEffect(() => {
    if (!Cookies.get("address")) {
      Cookies.set("address", address, {
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
      });
    }
  }, [isConnected, address]);

  const getEffectOnClick = (type: string) => {
    const map = {
      watchlist: () => {
        if (isConnected) {
          router.push("/watchlist");
        } else {
          setConnect(true);
        }
        pushData("Header Clicked", {
          name: "watchlist",
        });
        setShowInfoPopover(false);
      },
      notif: () => {
        setShowNotif(true);
        pushData("Header Clicked", {
          name: "notif drawer",
        });
        setShowInfoPopover(false);
      },
      disconnect: () => {
        disconnect();
        pushData("Header Clicked", {
          name: "disconnect",
        });
        setShowInfoPopover(false);
      },
    };

    const result = map[type];
    if (result) return result();
  };

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
    if (showInfoPopover && !balanceMOBL) getBalanceOfMOBL();
  }, [showInfoPopover]);

  useEffect(() => {
    if (isDisconnected) deleteCookie("user-balance");
  }, [isDisconnected]);

  useEffect(() => {
    if (!userBalance) return;
    Cookies.set("user-balance", JSON.stringify(userBalance.actual_balance));
    if (userBalance.change_color) {
      const timeoutId = setTimeout(() => {
        setUserBalance((prevState) => ({ ...prevState, change_color: false }));
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
    return () => {};
  }, [userBalance]);

  useEffect(() => {
    if (!address || !isConnected) {
      deleteCookie("address");
      deleteCookie("actual-view");
    }
  }, [address, isConnected]);

  const connectMemo = useMemo(() => {
    if (isConnected || (isConnecting && addressFromCookie)) return null;
    return (
      <div className="ml-[7.5px] mr-[7.5px] transition-all duration-400 whitespace-nowrap text-sm font-medium text-light-font-100 dark:text-dark-font-100 h-[28px] flex items-center justify-center z-[4]">
        {isConnected ? "" : "Connect"}
      </div>
    );
  }, [isConnected, isConnecting]);

  const telegramStyleButton =
    "text-sm h-[22px] rounded-full w-fit px-1.5 mt-2.5 text-light-font-100 dark:text-dark-font-100 font-medium transition-all duration-250 hover:bg-light-bg-hover hover:dark:bg-dark-bg-hover bg-light-bg-terciary dark:bg-dark-bg-terciary border border-light-border-primary dark:border-dark-border-primary";
  const squareBox =
    "flex items-center bg-light-bg-hover dark:bg-dark-bg-hover rounded w-[22px] h-[22px] min-w-[22px] justify-center mr-2.5";
  const listContainer =
    "flex items-center text-sm font-medium px-[15px] py-[12.5px] text-light-font-100 dark:text-dark-font-100 cursor-pointer transition-all duration-200 hover:bg-light-bg-hover hover:dark:bg-dark-bg-hover";

  return (
    <>
      <div className="relative flex items-center w-full justify-end  lg:justify-end sm:w-[90%]">
        {!isMenuMobile ? (
          <>
            <ChainsChanger
              showChainPopover={showChainPopover}
              setShowChainPopover={setShowChainPopover}
              showInfoPopover={showInfoPopover}
              setShowInfoPopover={setShowInfoPopover}
            />
            <PortfolioButton extraCss="flex lg:hidden" />
            <div
              className="flex text-light-font-60 dark:text-dark-font-60 items-center rounded border
            border-light-border-primary dark:border-dark-border-primary bg-light-bg-secondary 
            dark:bg-dark-bg-secondary h-[35px] mr-2.5 md:mr-[7.5px] transition-all duration-250 
            max-w-[16vw] lg:max-w-full w-full ml-0 lg:ml-2.5 cursor-pointer 
            hover:bg-light-bg-hover hover:dark:bg-dark-bg-hover ease-in-out overflow-hidden"
              onClick={() => {
                setTriggerSearch(true);
                setIsMenuMobile(false);
              }}
            >
              <div
                className="flex border-r border-light-border-primary dark:border-dark-border-primary 
              lg:border-transparent lg:dark:border-transparent items-center px-[7.5px] h-full rounded-l"
              >
                <FiSearch className="text-md md:text-lg text-light-font-100 dark:text-dark-font-100" />
              </div>
              <p className="text-sm text-light-font-100 dark:text-dark-font-100 truncate pl-2 lg:pl-2.5">
                Crypto name, wallet, ens, token address...
              </p>
            </div>
            <PortfolioButton extraCss="lg:flex hidden md:h-[35px]" />
          </>
        ) : null}
        <div className="flex relative">
          <button
            className={`flex items-center w-fit min-w-[35px] p-0.5 md:hidden bg-light-bg-terciary
           dark:bg-dark-bg-terciary relative hover:bg-light-bg-hover hover:dark:bg-dark-bg-hover transition-all duration-250 border 
           border-light-border-primary dark:border-dark-border-primary ${
             isDisconnected || (isConnecting && !addressFromCookie)
               ? "rounded"
               : "rounded-full"
           } 
            mr-0 lg:ml-0.5`}
            onClick={() => {
              if (isConnected === false) setConnect(true);
              else if (isConnected) {
                if (showChainPopover) {
                  setShowChainPopover(false);
                  setShowInfoPopover(true);
                } else setShowInfoPopover((prev) => !prev);
              }
            }}
          >
            {isConnected || (isConnecting && addressFromCookie) ? (
              user ? (
                <>
                  {user?.profile_pic !== "/mobula/fullicon.png" ? (
                    <NextImageFallback
                      width={31}
                      height={31}
                      style={{
                        borderRadius: "50%",
                        minWidth: "31px",
                      }}
                      src={user?.profile_pic}
                      alt="user profile picture"
                      fallbackSrc={""}
                    />
                  ) : null}
                  {user?.profile_pic === "/mobula/fullicon.png" ? (
                    <AddressAvatar
                      address={user?.address}
                      extraCss="rounded-full w-[31px] h-[31px] min-w-[31px]"
                    />
                  ) : null}
                </>
              ) : (
                <Skeleton extraCss="w-[31px] h-[31px] rounded-full" />
              )
            ) : null}
            {connectMemo}
          </button>
          {showInfoPopover ? (
            <div
              className="flex items-center absolute flex-col w-[230px] top-[56px] 
            right-[-40px] lg:right-[-30px] z-[100] max-w-[230px] rounded border border-light-border-primary 
            dark:border-dark-border-primary bg-light-bg-secondary dark:bg-dark-bg-secondary shadow-md"
              onMouseLeave={() => {
                if (isConnected) setShowInfoPopover(false);
              }}
            >
              <div className="flex flex-col w-full p-2.5">
                <p
                  className="text-lg md:text-md font-medium text-light-font-100 dark:text-dark-font-100
                pr-2.5 truncate max-w-full overflow-hidden"
                >
                  {user?.username || addressSlicer(user?.address)}{" "}
                </p>
                {user?.telegram_id ? (
                  <button
                    className={`flex justify-center items-center ${telegramStyleButton} cursor-default`}
                  >
                    <FaTelegramPlane className="text-telegram mr-[5px]" />@
                    {user?.telegram}
                  </button>
                ) : (
                  <button
                    className={telegramStyleButton}
                    onClick={() => setShowTelegramConnector(true)}
                  >
                    <FaTelegramPlane className="text-telegram mr-[5px]" />
                    Connect Telegram
                  </button>
                )}
              </div>
              <div className="flex items-center justify-between mt-[5px] w-full p-2.5 border-t border-b border-light-border-primary dark:border-dark-border-primary">
                <SmallFont extraCss="font-medium text-light-font-60 dark:text-dark-font-60">
                  Balance:
                </SmallFont>
                <SmallFont extraCss="font-medium text-light-font-100 dark:text-dark-font-100">
                  {getFormattedAmount(
                    (user?.balance || 0) + (balanceMOBL || 0)
                  )}{" "}
                  MOBL
                </SmallFont>
              </div>
              <div className="flex flex-col w-full">
                <div
                  className={`${listContainer} mt-0`}
                  onClick={() => getEffectOnClick("watchlist")()}
                >
                  <div className={squareBox}>
                    <AiOutlineStar className="text-base text-light-font-60 dark:text-dark-font-60" />
                  </div>
                  Watchlist
                </div>

                <div
                  className={listContainer}
                  onClick={() => getEffectOnClick("notif")()}
                >
                  <div className={squareBox}>
                    <TbBellRinging className="text-base text-light-font-60 dark:text-dark-font-60" />
                  </div>
                  Notifications
                </div>
                <div
                  className={`${listContainer} mb-0`}
                  onClick={() => getEffectOnClick("disconnect")()}
                >
                  <div className={squareBox}>
                    <BsPower className="text-base text-red dark:text-red" />
                  </div>
                  <p className="text-sm mb-[1px]">Log out</p>
                </div>
              </div>
            </div>
          ) : null}
        </div>
        {triggerSearch && (
          <SearchBarPopup
            trigger={triggerSearch}
            setTrigger={setTriggerSearch}
          />
        )}
        <Connect />
        <SwitchNetworkPopup />
        <div className="w-0.5 h-[15px] bg-light-border-primary dark:bg-dark-border-primary mx-2.5 flex lg:hidden" />
        <ToggleColorMode extraCss="flex lg:hidden" />
        <button
          className="hidden lg:flex ml-2.5 lg:ml-1 min-w-[22px]"
          onClick={() => {
            setIsMenuMobile(!isMenuMobile);
          }}
        >
          {isMenuMobile ? (
            <AiOutlineClose className="text-[22px] text-light-font-100 dark:text-dark-font-100" />
          ) : (
            <RiMenu3Line className="text-[22px] text-light-font-100 dark:text-dark-font-100" />
          )}
        </button>
        {showFeedbackPopup ? (
          <FeedBackPopup
            visible={showFeedbackPopup}
            setVisible={setShowFeedbackPopup}
          />
        ) : null}
        {/* {showConnectSocialPopup && <ConnectSocialPopup />} */}
      </div>
      {isMenuMobile && (
        <MenuMobile
          showChainPopover={showChainPopover}
          setShowChainPopover={setShowChainPopover}
          setShowInfoPopover={setShowInfoPopover}
          showInfoPopover={showInfoPopover}
        />
      )}
      {showTelegramConnector ? (
        <PopupTelegram
          showPopup={showTelegramConnector}
          setShowPopup={setShowTelegramConnector}
        />
      ) : null}
      {/*     {showCard && <PayWithCard />} */}
    </>
  );
};
