import { useContext, useEffect } from "react";
import { AiFillStar, AiOutlineEdit } from "react-icons/ai";
import { BiCopy } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { HiOutlineTrash } from "react-icons/hi";
import { useAccount } from "wagmi";
import { Menu } from "../../../../../components/menu";
import { API_ENDPOINT } from "../../../../../constants";
import { UserContext } from "../../../../../contexts/user";
import { useSignerGuard } from "../../../../../hooks/signer";
import { pushData } from "../../../../../lib/mixpanel";
import { triggerAlert } from "../../../../../lib/toastify";
import { GET } from "../../../../../utils/fetch";
import { WatchlistContext } from "../../context-manager";
import { incrementWatchlistName } from "../../utils";

export const HeaderMenu = () => {
  const {
    activeWatchlist,
    setShowEdit,
    isMainWatchlist,
    setIsMainWatchlist,
    setActiveWatchlist,
  } = useContext(WatchlistContext);
  const { address } = useAccount();
  const signerGuard = useSignerGuard();
  const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    if (activeWatchlist)
      setIsMainWatchlist(activeWatchlist.main_watchlist as boolean);
  }, [activeWatchlist]);

  const deleteWatchlist = () => {
    if (address && activeWatchlist) {
      fetch(
        `${API_ENDPOINT}/watchlist/delete?account=${address}&name=${activeWatchlist.name}`
      )
        .then((response) => response.json())
        .then((add) => {
          if (add.error) {
            triggerAlert("Error", "Something went wrong. Please try again.");
          } else {
            pushData("Watchlist Removed", {
              watchlist_id: activeWatchlist.id,
            });
            setUser({
              ...user,
              watchlist: user?.watchlist.filter(
                (w) => w.name !== activeWatchlist.name
              ),
            });
            setActiveWatchlist(
              user?.watchlist.filter((w) => w.name !== activeWatchlist.name)[0]
            );
            triggerAlert("Success", "Your watchlist has been deleted.");
          }
        });
    }
    // else {
    //   alert.show("Please connect your wallet to delete a watchlist");
    // }
  };
  // DONE
  const addAsMainWatchlist = () => {
    if (activeWatchlist)
      GET("/watchlist/main", {
        id: activeWatchlist.id as number,
        account: address as string,
      })
        .then((r) => r.json())
        .then((r) => {
          if (r.error) {
            triggerAlert("Error", "Something went wrong. Please try again.");
          } else {
            setIsMainWatchlist(true);
            triggerAlert("Success", "This watchlist is now the main one.");
          }
        });
  };

  // DONE
  const duplicateWatchlist = () => {
    if (address && activeWatchlist) {
      GET("/watchlist/duplicate", {
        account: address,
        id: activeWatchlist.id as number,
      })
        .then((response) => response.json())
        .then((add) => {
          if (add.error) {
            triggerAlert("Error", "Something went wrong. Please try again.");
          } else {
            const newName = incrementWatchlistName(
              activeWatchlist.name,
              user?.watchlist
            );
            setUser({
              ...user,
              watchlist: [
                ...(user?.watchlist || []),
                { ...activeWatchlist, name: newName },
              ],
            });
            triggerAlert("Success", "Your watchlist has been duplicated.");
          }
        });
    } else {
      triggerAlert(
        "Error",
        "Please connect your wallet to duplicate a watchlist"
      );
    }
  };

  const squareBox =
    "flex item-center justify-center p-1 rounded-md bg-light-bg-hover dark:bg-dark-bg-hover mr-2.5";
  const iconStyle = "text-light-font-40 dark:text-dark-font-40 text-sm";

  return (
    <Menu
      titleCss="bg-light-bg-terciary dark:bg-dark-bg-terciary text-light-font-100 dark:text-dark-font-100 
    hover:bg-light-bg-hover hover:dark:bg-dark-bg-hover ml-[10px] border border-light-border-primary 
    dark:border-dark-border-primary text-sm md:text-xs rounded-md px-1 h-[30px]"
      title={<BsThreeDotsVertical className="mt-0.5 text-lg md:text-base" />}
    >
      <div
        className="flex items-center whitespace-nowrap text-light-font-100 dark:text-dark-font-100 mb-2 text-sm md:text-xs"
        onClick={() => setShowEdit(true)}
      >
        <div className={squareBox}>
          <AiOutlineEdit className={iconStyle} />
        </div>
        Edit Name
      </div>
      <div
        className="flex items-center whitespace-nowrap text-light-font-100 dark:text-dark-font-100 mb-2 text-sm md:text-xs"
        onClick={() => {
          if (user)
            signerGuard(() => {
              duplicateWatchlist();
            });
        }}
      >
        <div className={squareBox}>
          <BiCopy className={iconStyle} />
        </div>
        Duplicate Watchlist
      </div>
      <div
        className="flex items-center whitespace-nowrap text-light-font-100 dark:text-dark-font-100 mb-2 text-sm md:text-xs"
        onClick={() => {
          if (user) {
            signerGuard(() => {
              if (user) deleteWatchlist();
            });
          }
        }}
      >
        <div className={squareBox}>
          <HiOutlineTrash className={iconStyle} />
        </div>
        Remove Watchlist
      </div>
      <div
        onClick={() => {
          signerGuard(() => {
            if (user) addAsMainWatchlist();
          });
        }}
      >
        {isMainWatchlist ? (
          <div className="flex items-center whitespace-nowrap text-light-font-100 dark:text-dark-font-100 text-sm md:text-xs">
            <div className={squareBox}>
              <AiFillStar className="text-yellow dark:text-yellow text-[15px]" />
            </div>
            This is your Main Watchlist
          </div>
        ) : (
          <div className="flex items-center whitespace-nowrap text-light-font-100 dark:text-dark-font-100 justify-between text-sm md:text-xs">
            <div className="flex items-center">
              <div className={`${squareBox} mr-2.5`}>
                <AiFillStar className="text-light-font-40 dark:text-dark-font-40 text-sm " />
              </div>
              Add as Main Watchlist
            </div>
          </div>
        )}
      </div>
    </Menu>
  );
};
