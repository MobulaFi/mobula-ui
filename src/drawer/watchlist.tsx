import { useRouter } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { BsChevronDown } from "react-icons/bs";
import { Button } from "../components/button";
import { LargeFont, SmallFont } from "../components/fonts";
import { Menu } from "../components/menu";
import { WatchlistContext } from "../contexts/pages/watchlist";
import { PopupStateContext, PopupUpdateContext } from "../contexts/popup";
import { UserContext } from "../contexts/user";
import { IWatchlist } from "../interfaces/pages/watchlist";
import { useWatchlist } from "../layouts/new-tables/hooks/watchlist";
import { createSupabaseDOClient } from "../lib/supabase";
import { getUrlFromName } from "../utils/formaters";

export const WatchlistDrawer = () => {
  const { setShowAddedToWatchlist } = useContext(PopupUpdateContext);
  const { showAddedToWatchlist } = useContext(PopupStateContext);
  const { tokenToAddInWatchlist } = useContext(WatchlistContext);
  const { user } = useContext(UserContext);
  const supabase = createSupabaseDOClient();
  const router = useRouter();
  const timerRef = useRef(null);
  const [watchlistsOfUser, setWatchlistsOfUser] = useState<IWatchlist[]>([]);
  const [activeWatchlist, setActiveWatchlist] = useState<IWatchlist>();
  const { handleAddWatchlist } = useWatchlist(Number(activeWatchlist?.id));

  const getWatchlistsOfUser = () => {
    if (user) {
      supabase
        .from("watchlist")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true })
        .then((r) => {
          if (r.data) {
            setWatchlistsOfUser(r.data);
            setActiveWatchlist(
              r.data.filter((entry) => entry.main_watchlist)[0] || r.data[0]
            );
          }
        });
    }
  };

  const startTimer = () => {
    if (activeWatchlist)
      timerRef.current = setTimeout(() => {
        handleAddWatchlist(
          Number(tokenToAddInWatchlist?.id),
          Number(activeWatchlist?.id),
          true,
          () => {},
          false
        );
        setShowAddedToWatchlist(false);
      }, 7000);
  };

  const addToWatchlistAndClose = () => {
    clearTimeout(timerRef.current);
    handleAddWatchlist(
      Number(tokenToAddInWatchlist?.id),
      Number(activeWatchlist?.id),
      true,
      () => {},
      false
    );
    setShowAddedToWatchlist(false);
  };

  useEffect(() => {
    if (user && showAddedToWatchlist) {
      if (!activeWatchlist) getWatchlistsOfUser();
      if (activeWatchlist) {
        startTimer();
        return () => {
          clearTimeout(timerRef.current);
        };
      }
    }
    return () => {};
  }, [user, activeWatchlist, showAddedToWatchlist]);

  return (
    <div
      className={`fixed inset-0 z-[100] ${
        showAddedToWatchlist && tokenToAddInWatchlist
          ? "opacity-100"
          : "opacity-0 pointer-events-none"
      } transition-all duration-200 ease-in-out`}
    >
      <div
        className={`sm:w-0 w-full h-fit`}
        onClick={() => {
          addToWatchlistAndClose();
          setShowAddedToWatchlist(false);
        }}
      />
      <div
        className={`flex flex-col fixed border border-light-border-primary
         dark:border-dark-border-primary bg-light-bg-secondary dark:bg-dark-bg-secondary 
         transition-all duration-500 ease-in-out w-screen h-fit bottom-0 max-w-[800px] mx-auto
          left-1/2 -translate-x-1/2 shadow-lg rounded-lg ${
            showAddedToWatchlist ? "bottom-[2%] md:bottom-0" : "bottom-[-100%]"
          }`}
      >
        <div
          className="flex items-center justify-between border-b border-light-border-primary
         dark:border-dark-border-primary py-2.5 px-5 md:p-[15px] max-w-[800px] mx-auto w-full"
        >
          <div className="flex items-center">
            <LargeFont>
              Watchlist {activeWatchlist?.name || user?.main_watchlist?.name}
            </LargeFont>
          </div>
          <button onClick={addToWatchlistAndClose}>
            <AiOutlineClose className="text-light-font-100 dark:text-dark-font-100 text-xl" />
          </button>
        </div>
        <div
          className="p-5 md:p-2.5 flex w-full max-w-[800px] mx-auto bg-light-bg-secondary
        dark:bg-dark-bg-secondary rounded-md h-fit relative items-center justify-between border-t 
        border-light-border-primary dark:border-dark-border-primary shadow-md flex-wrap flex-row sm:flex-col"
        >
          <div className="flex items-center w-auto sm:w-full ">
            <img
              height={50}
              width={50}
              alt="token logo"
              className="rounded-full mr-5 md:mr-[15px]"
              src={tokenToAddInWatchlist?.logo || "/empty/unknown.png"}
            />
            <div className="flex flex-col flex-wrap w-full">
              <div className="flex items-center flex-wrap mb-0 md:mb-[2.5px]">
                <SmallFont extraCss="mr-[7.5px]">Selected watchlist:</SmallFont>
                <Menu
                  extraCss="top-auto bottom-[25px] h-fit w-fit right-0"
                  titleCss="text-light-font-100 dark:text-dark-font-100 text-sm font-medium md:text-xs mr-5 "
                  title={
                    <div className="flex items-center">
                      <SmallFont>{activeWatchlist?.name}</SmallFont>
                      <BsChevronDown className="ml-[5px]" />
                    </div>
                  }
                >
                  {watchlistsOfUser.map((watchlist, i) => (
                    <button
                      className={`${
                        activeWatchlist.name === watchlist.name
                          ? "text-light-font-100 dark:text-dark-font-100"
                          : "text-light-font-40 dark:text-dark-font-40"
                      } text-start w-full text-sm hover:text-light-font-100 hover:dark:text-dark-font-100 
                      whitespace-nowrap ${
                        i !== watchlistsOfUser?.length - 1 ? "mb-1.5" : ""
                      }`}
                      key={watchlist.id}
                      onClick={() => setActiveWatchlist(watchlist)}
                    >
                      {watchlist.name}
                    </button>
                  ))}
                </Menu>
              </div>
              <SmallFont extraCss="text-light-font-40 dark:text-dark-font-40">
                You can also select another watchlist
              </SmallFont>
            </div>
          </div>
          <div className="flex mr-5 mt-0 md:mr-[15px] w-auto sm:w-full pl-0 md:pl-2.5 md:mt-3">
            <Button
              extraCss="mr-2.5 min-w-[120px] border-darkblue dark:border-darkblue hover:border-blue hover:dark:border-blue md:w-2/4"
              onClick={() => {
                addToWatchlistAndClose();
                router.push(`/asset/${tokenToAddInWatchlist.name}`);
              }}
            >
              Visit Asset
            </Button>
            <Button
              extraCss="min-w-[120px] md:w-2/4"
              onClick={() => {
                addToWatchlistAndClose();
                router.push(
                  `/watchlist/${user?.address}/${getUrlFromName(
                    activeWatchlist.name
                  )}`
                );
              }}
            >
              Visit Watchlist
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
