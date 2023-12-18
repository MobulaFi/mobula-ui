import { useParams, usePathname, useRouter } from "next/navigation";
import {
  default as React,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { BiAddToQueue } from "react-icons/bi";
import { IoAdd, IoShareSocialOutline } from "react-icons/io5";
import { useAccount } from "wagmi";
import { Button } from "../../../../../components/button";
import { SmallFont } from "../../../../../components/fonts";
import { UserContext } from "../../../../../contexts/user";
import { pushData } from "../../../../../lib/mixpanel";
import { createSupabaseDOClient } from "../../../../../lib/supabase";
import { triggerAlert } from "../../../../../lib/toastify";
import { GET } from "../../../../../utils/fetch";
import { Asset } from "../../../../asset/models";
import { WatchlistContext } from "../../context-manager";
import { IWatchlist } from "../../models";
import { HeaderMenu } from "../header-menu";
import { SharePopup } from "../popup/share";
interface HeaderProps {
  assets: Asset[];
  activeWatchlist: IWatchlist | IWatchlist[];
  setActiveWatchlist?: React.Dispatch<
    SetStateAction<IWatchlist | IWatchlist[]>
  >;
  setShowCreateWL?: React.Dispatch<SetStateAction<boolean>>;
}

export const Header = ({
  assets,
  activeWatchlist,
  setActiveWatchlist,
  setShowCreateWL,
}: HeaderProps) => {
  const { user, setUser } = useContext(UserContext);
  const [watchlistID, setWatchlistID] = useState(0);
  const {
    isPageUserWatchlist,
    setShowShare,
    setShowAddCoins,
    setSearchWatchlist,
  } = useContext(WatchlistContext);
  const [userOfWatchlist, setUserOfWatchlist] =
    useState<{ address: string; id: number; username: string }[]>();
  const { address } = useAccount();
  const headerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const params = useParams();
  const { isConnected } = useAccount();
  const router = useRouter();
  const isUserWatchlist =
    (isPageUserWatchlist && !pathname.includes("explore")) ||
    (!pathname.includes("followed") && pathname !== "/watchlist");

  const globalPercentage: number[] = [];
  assets?.map((entry) => globalPercentage.push(entry?.price_change_24h));
  const averageROI = () => {
    const sum = globalPercentage.reduce((a, b) => a + b, 0);
    const avg = sum / globalPercentage.length || 0;
    return avg;
  };

  const getBgColor = (name: string) => {
    if (!activeWatchlist)
      return "bg-light-bg-terciary dark:bg-dark-bg-terciary";
    if ("name" in activeWatchlist && activeWatchlist.name === name)
      return "bg-light-bg-hover dark:bg-dark-bg-hover";
    return "bg-light-bg-terciary dark:bg-dark-bg-terciary";
  };

  useEffect(() => {
    const supabase = createSupabaseDOClient();
    if (params) {
      if (!userOfWatchlist) {
        supabase
          .from("users")
          .select("id,username,address")
          .eq("address", params.username)
          .then((r) => {
            if (r.data) setUserOfWatchlist(r.data);
          });
      }
      if (userOfWatchlist) {
        supabase
          .from("watchlist")
          .select("*")
          .ilike(
            "name",
            `%${(typeof params.title === "string" ? params.title : "")
              .split("-")
              .join(" ")}%`
          )
          .eq("user_id", userOfWatchlist[0]?.id)
          .then((r) => {
            if (r.data) setWatchlistID(r.data[0].id);
          });
      }
    }
  }, [userOfWatchlist, pathname]);

  const handleFollowWatchlist = () => {
    if (address && !user?.watchlists_followed.includes(watchlistID))
      GET("/watchlist/follow", {
        id: watchlistID,
        account: user?.address as string,
      })
        .then((r) => r.json())
        .then((r) => {
          if (r.error) {
            triggerAlert(
              "Error",
              "Something went wrong while following this watchlist"
            );
          } else {
            pushData("Watchlist Followed", {
              watchlist_owner_id: userOfWatchlist?.[0]?.id,
              watchlist_id: watchlistID,
            });
            triggerAlert("Success", "Successfully followed this watchlist.");
            setUser((userBuffer) => ({
              ...userBuffer,
              watchlists_followed: [
                ...(userBuffer?.watchlists_followed || []),
                watchlistID,
              ],
            }));
          }
        });
    if (address && user?.watchlists_followed.includes(watchlistID))
      GET("/watchlist/unfollow", {
        id: watchlistID,
        account: user?.address as string,
      })
        .then((r) => r.json())
        .then((r) => {
          if (r.error) {
            console.log(r.error);
            triggerAlert(
              "Error",
              "Something went wrong while unfollowing this watchlist"
            );
          } else {
            pushData("Watchlist Unfollowed", {
              watchlist_id: watchlistID,
            });
            triggerAlert("Success", "Successfully unfollowed this watchlist.");
            setUser((userBuffer) => ({
              ...userBuffer,
              watchlists_followed: userBuffer?.watchlists_followed.filter(
                (entry) => entry !== watchlistID
              ),
            }));
          }
        });
  };
  console.log(activeWatchlist);
  if (pathname !== "/watchlist/followed")
    return (
      <div className="flex items-center justify-between rounded-t border-t border-light-border-primary dark:border-dark-border-primary py-2.5">
        {pathname === "/watchlist/explore" ? null : (
          <div className="flex items-center jutify-between w-full">
            <div
              className="overflow-x-scroll flex scroll bg-light-bg-primary dark:bg-dark-bg-primary"
              style={{
                width: `calc(100% - ${headerRef?.current?.clientWidth}px)`,
              }}
            >
              {user?.watchlist.map((item) => (
                <Button
                  key={item?.id}
                  extraCss={`mr-2.5 ${
                    getBgColor(item?.name) ||
                    "bg-light-bg-terciary dark:bg-dark-bg-terciary"
                  }`}
                  onClick={() => {
                    setActiveWatchlist(item);
                  }}
                >
                  {item?.name}
                </Button>
              ))}
              <div className="bg-light-bg-primary dark:bg-dark-bg-primary sticky flex right-0">
                <Button onClick={() => setShowCreateWL(true)}>
                  <IoAdd className="text-[10px] text-light-font-100 dark:text-dark-font-100" />
                </Button>
              </div>
            </div>
            <div
              className="flex items-center bg-light-bg-primary dark:bg-dark-bg-primary min-w-fit pl-2.5"
              ref={headerRef}
            >
              <Button extraCss="ml-2.5" onClick={() => setShowShare(true)}>
                <SmallFont extraCss="flex md:hidden">Share </SmallFont>
                <IoShareSocialOutline
                  className="text-light-font-40 dark:text-dark-font-40
                 md:text-light-font-100 md:dark:text-dark-font-100 ml-[5px] md:ml-0 mb-[1px] text-sm"
                />
              </Button>
              {isUserWatchlist ? (
                <Button extraCss="ml-2.5" onClick={handleFollowWatchlist}>
                  {user?.watchlists_followed.includes(watchlistID) ? (
                    <AiFillStar className="text-yellow dark:text-yellow mr-[5px] text-base" />
                  ) : (
                    <AiOutlineStar className="text-light-font-40 dark:text-dark-font-40 mr-[5px] text-base" />
                  )}
                  Follow
                </Button>
              ) : null}
              {pathname === "/watchlist" ? (
                <Button
                  extraCss="ml-2.5"
                  onClick={() => {
                    pushData("Add Assets From Watchlist", {});
                    setShowAddCoins(true);
                  }}
                >
                  <BiAddToQueue className="mr-[5px] md:mr-0 text-base text-light-font-40 dark:text-dark-font-40 md:text-light-font-100 md:dark:text-dark-font-100" />
                  <SmallFont extraCss="flex md:hidden">Add Assets</SmallFont>
                </Button>
              ) : null}
              {pathname === "/watchlist" ? <HeaderMenu /> : null}
            </div>
            <SharePopup watchlist={activeWatchlist as IWatchlist} />
          </div>
        )}
      </div>
    );
  return null;
};

// (
//   <Input
//     h={["35px"]}
//     borderRadius="4px"
//     border={borders}
//     maxW={["100%", "100%", "250px"]}
//     bg={boxBg6}
//     ml="auto"
//     px="10px"
//     fontWeight="500"
//     color={text80}
//     _placeholder={{color: text80, opacity: 1}}
//     placeholder="Search"
//     onChange={e => setSearchWatchlist(e.target.value)}
//   />
// )
