import React, { useState } from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { Spinner } from "../../../components/spinner";
import { useTop100 } from "../../../features/data/top100/context-manager";
import { useWatchlist } from "../hooks/watchlist";
interface WatchlistAdd {
  addOrRemoveFromWatchlist: Function;
  setAddedToWatchlist;
}

export const WatchlistAdd = ({
  addOrRemoveFromWatchlist,
  setAddedToWatchlist,
  addedToWatchlist,
  token,
  noRank = false,
  showMobile = false,
}) => {
  const { isLoading } = useTop100();
  const { inWatchlist } = useWatchlist(token.id);
  const [isHover, setIsHover] = useState(false);
  return (
    <div
      className={`flex items-center justify-start ${
        showMobile ? "" : "md:hidden"
      } `}
    >
      {isLoading ? (
        <Spinner extraCss="w-[15px] h-[15px]" />
      ) : (
        <>
          {inWatchlist || addedToWatchlist || isHover ? (
            <AiFillStar
              className="text-yellow dark:text-yellow text-lg transition-all duration-200 ease-in-out"
              onMouseLeave={() => setIsHover(false)}
              onClick={() => {
                addOrRemoveFromWatchlist();
                setAddedToWatchlist(!addedToWatchlist);
              }}
            />
          ) : (
            <AiOutlineStar
              className="text-light-font-80 dark:text-dark-font-80 text-lg transition-all duration-200 ease-in-out"
              onMouseEnter={() => setIsHover(true)}
              onClick={() => {
                addOrRemoveFromWatchlist();
                setAddedToWatchlist(!addedToWatchlist);
              }}
            />
          )}
        </>
      )}
      {noRank ? null : (
        <div className="ml-[5px] text-light-font-80 dark:text-dark-font-80 font-medium">
          {token.rank}
        </div>
      )}
    </div>
  );
};
