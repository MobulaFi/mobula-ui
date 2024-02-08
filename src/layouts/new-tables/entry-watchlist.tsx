"use client";
import { User } from "mobula-utils/lib/user/model";
import { usePathname, useRouter } from "next/navigation";
import React, { useContext, useEffect } from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { useAccount } from "wagmi";
import { AddressAvatar } from "../../components/avatar";
import { SmallFont } from "../../components/fonts";
import { NextImageFallback } from "../../components/image";
import { Skeleton } from "../../components/skeleton";
import { WatchlistContext } from "../../contexts/pages/watchlist";
import { UserContext } from "../../contexts/user";
import { Asset } from "../../features/asset/models";
import { IWatchlist } from "../../interfaces/pages/watchlist";
import { pushData } from "../../lib/mixpanel";
import { GET } from "../../utils/fetch";
import {
  addressSlicer,
  formatAmount,
  getTokenPercentage,
  getUrlFromName,
} from "../../utils/formaters";

interface EntryWatchlistProps {
  watchlist: { id: string; name: string } & IWatchlist;
  tokens: Asset[];
  usersOwner: User[];
  isLoading: boolean;
  i: number;
}

export const EntryWatchlist = ({
  watchlist,
  tokens,
  usersOwner,
  isLoading,
  i,
}: EntryWatchlistProps) => {
  const [isHover, setIsHover] = React.useState(false);
  const { user, setUser } = useContext(UserContext);
  const { setIsPageUserWatchlist, watchlists, setWatchlists } =
    useContext(WatchlistContext);
  const { address } = useAccount();
  const router = useRouter();
  const pathname = usePathname();

  const userOfWatchlist = usersOwner.find(
    (newUser) => newUser.id === watchlist.user_id
  );
  const assetsOfWatchlist = tokens.filter((token) =>
    watchlist?.assets?.map((asset: any) => asset?.id).includes(token.id)
  );

  const handleFollowWatchlist = (isAddTo) => {
    if (address && isAddTo && user && watchlist?.user_id !== user?.id) {
      GET("/watchlist/follow", {
        id: watchlist.id,
        account: user.address,
      })
        .then((r) => r.json())
        .then((r) => {
          // if (r.error) alert.error(r.error);
          // else {
          pushData("Watchlist Followed", {
            watchlist_owner_id: watchlist.user_id,
            watchlist_id: watchlist.id,
          });
          // alert.success("Successfully followed this watchlist.");
          setUser((userBuffer: any) => {
            if (!userBuffer) return null;
            return {
              ...userBuffer,
              watchlists_followed: [
                ...userBuffer.watchlists_followed,
                watchlist.id,
              ],
            };
          });
          // }
        });
    } else if (address && !isAddTo && watchlist?.user_id !== user?.id)
      GET("/watchlist/unfollow", {
        id: watchlist.id as number,
        account: user ? user.address : "",
      })
        .then((r) => r.json())
        .then((r) => {
          // if (r.error) alert.error(r.error);
          // else {
          pushData("Watchlist Unfollowed", {
            watchlist_id: watchlist.id,
          });
          // alert.success("Successfully unfollowed this watchlist.");
          setWatchlists(
            watchlists?.filter((entry) => entry.watchlist_id !== watchlist.id)
          );
          setUser((userBuffer) => {
            if (!userBuffer) return null;
            return {
              ...userBuffer,
              watchlists_followed: userBuffer.watchlists_followed.filter(
                (entry) => entry !== watchlist.id
              ),
            };
          });
          // }
        });
    // else if (watchlist?.user_id === user?.id)
    //   alert.error("You can't follow your own watchlist");
  };

  useEffect(() => {
    setIsPageUserWatchlist(false);
  }, []);

  const marketCap = assetsOfWatchlist[i]?.reduce(
    (acc, token) => acc + (token ? Number(token.market_cap) : 0),
    0
  );
  const percentage = assetsOfWatchlist[i]?.reduce(
    (acc, token) => acc + (token ? token.price_change_24h : 0),
    0
  );
  const percentageAvr =
    percentage / (assetsOfWatchlist[i] ? assetsOfWatchlist[i].length : 0);
  const sumScores = (assets, scoreType) =>
    assets
      ?.filter((entry) => entry[scoreType] > 0)
      .reduce((acc, token) => acc + token[scoreType], 0);

  const countNonZeroScores = (assets, scoreType) =>
    assetsOfWatchlist[i]?.filter((entry) => entry[scoreType] > 0).length;

  const calculateAverageScore = (assets, scoreType) =>
    sumScores(assetsOfWatchlist[i], scoreType) /
    countNonZeroScores(tokens, scoreType);

  const getAverageScore = () => {
    const averageScoreTrust = calculateAverageScore(tokens, "trust_score");
    const averageScoreSocial = calculateAverageScore(tokens, "social_score");
    const averageScoreUtility = calculateAverageScore(tokens, "utility_score");
    const average =
      (averageScoreTrust + averageScoreSocial + averageScoreUtility) / 3;
    if (Number.isNaN(Math.round(average))) return "--";
    return Math.round(average);
  };

  const getColorFromAverageScore = () => {
    if (Number(getAverageScore()) > 2 && Number(getAverageScore()) < 4)
      return "text-yellow dark:text-yellow";
    if (Number(getAverageScore()) <= 2) return "text-red dark:text-red";
    if (Number(getAverageScore()) >= 4) return "text-green dark:text-green";
    return "text-light-font-100 dark:text-dark-font-100";
  };
  const averageScoreColor = getColorFromAverageScore();

  return (
    <tbody
      className={`text-sm ${
        isHover ? "bg-light-bg-hover dark:bg-dark-bg-hover" : ""
      } h-[57px]`}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <tr>
        <td className="border-b border-light-border-primary dark:border-dark-border-primary py-[25px] lg:py-[12px]">
          <div className="flex items-center justify-center">
            {watchlist && !isLoading ? (
              <button
                onClick={() =>
                  handleFollowWatchlist(
                    !user?.watchlists_followed.includes(watchlist.id)
                  )
                }
              >
                {user?.watchlists_followed?.includes(watchlist.id) ||
                pathname.includes("followed") ? (
                  <AiFillStar className="text-yellow dark:text-yellow text-xl mx-auto" />
                ) : (
                  <AiOutlineStar
                    className="text-light-font-100 dark:text-dark-font-100 text-xl
                   mx-auto transition-all duration-200 ease-in-out hover:text-yellow hover:dark:text-yellow text-sm"
                  />
                )}
              </button>
            ) : (
              <Skeleton extraCss="w-5 h-5 min-w-5 rounded-full" />
            )}
          </div>
        </td>
        <td
          className="border-b cursor-pointer left-0 border-light-border-primary dark:border-dark-border-primary py-[25px] lg:py-[12px]"
          onClick={() => {
            router.push(
              `/watchlist/${userOfWatchlist?.address}/${getUrlFromName(
                watchlist?.name
              )}`
            );
            setIsPageUserWatchlist(true);
          }}
        >
          {watchlist && !isLoading ? (
            <SmallFont>{watchlist.name}</SmallFont>
          ) : (
            <Skeleton extraCss="h-4 lg:h-[15px] md:h-3.5 w-[100px]" />
          )}
        </td>
        <td
          className="border-b cursor-pointer left-0 border-light-border-primary dark:border-dark-border-primary py-[25px] lg:py-[12px]"
          onClick={() => {
            router.push(
              `/watchlist/${userOfWatchlist?.address}/${getUrlFromName(
                watchlist?.name
              )}`
            );
            setIsPageUserWatchlist(true);
          }}
        >
          {watchlist && !isLoading ? (
            <SmallFont>
              {watchlist.followers ? watchlist.followers : 0}
            </SmallFont>
          ) : (
            <Skeleton extraCss="h-4 lg:h-[15px] md:h-3.5 w-[30px]" />
          )}
        </td>
        <td
          className="border-b cursor-pointer left-0 border-light-border-primary dark:border-dark-border-primary py-[25px] lg:py-[12px]"
          onClick={() => {
            router.push(
              `/watchlist/${userOfWatchlist?.address}/${getUrlFromName(
                watchlist?.name
              )}`
            );
            setIsPageUserWatchlist(true);
          }}
        >
          {watchlist && !isLoading ? (
            <SmallFont extraCss={averageScoreColor}>
              {getAverageScore()}
              <span className="text-light-font-100 dark:text-dark-font-100">
                /5
              </span>
            </SmallFont>
          ) : (
            <Skeleton extraCss="h-4 lg:h-[15px] md:h-3.5 w-[40px]" />
          )}
        </td>
        <td
          className="border-b cursor-pointer left-0 border-light-border-primary dark:border-dark-border-primary py-[25px] lg:py-[12px]"
          onClick={() => {
            router.push(
              `/watchlist/${userOfWatchlist?.address}/${getUrlFromName(
                watchlist?.name
              )}`
            );
            setIsPageUserWatchlist(true);
          }}
        >
          {watchlist && !isLoading ? (
            <SmallFont>${formatAmount(marketCap)}</SmallFont>
          ) : (
            <Skeleton extraCss="h-4 lg:h-[15px] md:h-3.5 w-[140px]" />
          )}
        </td>
        <td
          className="border-b cursor-pointer left-0 border-light-border-primary dark:border-dark-border-primary py-[25px] lg:py-[12px]"
          onClick={() => {
            router.push(
              `/watchlist/${userOfWatchlist?.address}/${getUrlFromName(
                watchlist?.name
              )}`
            );
            setIsPageUserWatchlist(true);
          }}
        >
          {watchlist && !isLoading ? (
            <SmallFont
              extraCss={
                percentageAvr > 0
                  ? "text-green dark:text-green"
                  : "text-red dark:text-red"
              }
            >
              {getTokenPercentage(percentageAvr)}%
            </SmallFont>
          ) : (
            <Skeleton extraCss="h-4 lg:h-[15px] md:h-3.5 w-[50px]" />
          )}
        </td>
        <td className="border-b cursor-pointer left-0 border-light-border-primary dark:border-dark-border-primary py-[25px] lg:py-[12px]">
          {watchlist && !isLoading ? (
            <div
              className="flex items-center cursor-pointer hover:text-blue
             hover:dark:text-blue transition-all duration-200 ease-in-out 
             text-light-font-100 dark:text-dark-font-100 justify-end"
              onClick={() =>
                router.push(`/profile/${userOfWatchlist?.address}`)
              }
            >
              {userOfWatchlist?.username
                ? userOfWatchlist.username
                : addressSlicer(userOfWatchlist?.address)}
              {userOfWatchlist?.profile_pic !== "/mobula/fullicon.png" ? (
                <NextImageFallback
                  style={{
                    borderRadius: "50%",
                    marginLeft: "7.5px",
                  }}
                  width={22}
                  height={22}
                  src={userOfWatchlist?.profile_pic as string}
                  fallbackSrc="/mobula/mobula-logo.svg"
                  alt="Watchlist user profile pic"
                />
              ) : (
                <AddressAvatar
                  extraCss="w-[22px] h-[22px] rounded-full ml-[7.5px]"
                  address={userOfWatchlist.address}
                />
              )}
            </div>
          ) : (
            <div className="flex items-center">
              <Skeleton extraCss="h-4 lg:h-[15px] md:h-3.5 w-[90px]" />
              <Skeleton extraCss="w-[22px] h-[22px] rounded-full ml-[7.5px]" />
            </div>
          )}
        </td>
        <td
          className="border-b cursor-pointer left-0 border-light-border-primary dark:border-dark-border-primary py-[25px] lg:py-[12px]"
          onClick={() => {
            router.push(
              `/watchlist/${userOfWatchlist?.address}/${getUrlFromName(
                watchlist?.name
              )}`
            );
            setIsPageUserWatchlist(true);
          }}
        >
          {watchlist && !isLoading ? (
            <div className="flex items-center justify-end">
              <div className="flex items-center">
                {assetsOfWatchlist[i]?.map((token, idx) => {
                  if (idx < 5)
                    return (
                      <NextImageFallback
                        width={22}
                        height={22}
                        className="bg-light-bg-terciary dark:bg-dark-bg-terciary border border-light-border-primary
                       dark:border-dark-border-primary rounded-full ml-[-5px] "
                        alt={token.name}
                        src={token.logo}
                        key={idx}
                        fallbackSrc="/empty/unknown.png"
                      />
                    );
                  return null;
                })}
              </div>
              {assetsOfWatchlist[i] ? (
                <SmallFont extraCss="ml-[7.5px]">
                  {assetsOfWatchlist[i].length - 5 > 0
                    ? `+${assetsOfWatchlist[i].length - 5}`
                    : null}
                </SmallFont>
              ) : null}
            </div>
          ) : (
            <div className="flex items-center justify-end">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton
                    extraCss="w-[22px] h-[22px] rounded-full mr-[-5px]"
                    key={i}
                  />
                ))}
              </div>
              <Skeleton extraCss="h-4 lg:h-[15px] md:h-3.5 w-[36px] ml-[7.5px]" />
            </div>
          )}
        </td>
      </tr>
    </tbody>
  );
};
