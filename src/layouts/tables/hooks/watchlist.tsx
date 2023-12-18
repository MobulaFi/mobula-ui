"use client";
import { usePathname } from "next/navigation";
import { useCallback, useContext, useMemo } from "react";
import { useAccount } from "wagmi";
import { PopupUpdateContext } from "../../../contexts/popup";
import { UserContext } from "../../../contexts/user";
import { pushData } from "../../../lib/mixpanel";
import { GET } from "../../../utils/fetch";

export const useWatchlist = (id?: number) => {
  const { user, setUser } = useContext(UserContext);
  const { setConnect } = useContext(PopupUpdateContext);
  const { address } = useAccount();
  const pathname = usePathname();

  const inWatchlist = useMemo(() => {
    if (user?.main_watchlist) {
      return user?.main_watchlist?.assets?.includes(id);
    }

    return false;
  }, [user?.main_watchlist, id]);

  const handleAddMultipleWatchlist = (
    tokensId: number[] | undefined[],
    watchlistId: number | undefined
  ) => {
    const idOfTokens = tokensId.join(",");

    if (address) {
      GET("/watchlist/multi-add", {
        account: address,
        assets: idOfTokens,
        watchlist_id: watchlistId,
      })
        .then((resp) => resp.json())
        .then((resp) => {
          // if (resp.error) alert.error(resp.error);
          // else {
          // alert.success('Successfully added assets to your watchlist');
          setUser((userBuffer) => ({
            ...userBuffer,
            main_watchlist: {
              ...userBuffer.main_watchlist,
              assets: [...userBuffer.main_watchlist.assets, ...tokensId],
            },
          }));
          // }
        });
    }
  };

  const handleAddWatchlist = useCallback(
    (
      idBuffer?: number,
      watchlistId?: number,
      isToAdd?: boolean,
      setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>,
      shouldAlert = false
    ) => {
      if (setIsLoading) setIsLoading(true);

      if (isToAdd) {
        if (address) {
          GET("/watchlist/add", {
            account: address,
            asset: idBuffer || id,
            watchlist_id: watchlistId,
            // Used for Learn&Earn
            page: pathname.includes("trade") ? "trade" : "other",
          })
            .then((resp) => resp.json())
            .then((resp) => {
              // if (resp.error) alert.error(resp.error);
              // else {
              pushData("Crypto Added to Watchlist", {
                crypto_id: idBuffer,
              });

              if (setIsLoading) setIsLoading(false);
              setUser((userBuffer) => ({
                ...userBuffer,
                main_watchlist: {
                  ...userBuffer.main_watchlist,
                  assets: [...userBuffer.main_watchlist.assets, idBuffer || id],
                },
              }));
              // }
            });

          GET("/earn/adventure", {
            name: "Introduction",
            action: 5,
            account: address,
          }).catch((e) => e);
        } else {
          setConnect(true);
        }
      } else {
        GET("/watchlist/remove", {
          account: address,
          asset: id || idBuffer,
          watchlist_id: watchlistId,
        })
          .then((resp) => resp.json())
          .then((resp) => {
            // if (resp.error) alert.error(resp.error);
            // else {
            pushData("Crypto Removed from Watchlist", {
              crypto_id: idBuffer,
            });
            if (setIsLoading) setIsLoading(false);
            // alert.success('Successfully removed asset from watchlist');
            setUser((userBuffer) => ({
              ...userBuffer,
              main_watchlist: {
                ...userBuffer.main_watchlist,
                assets: userBuffer.main_watchlist.assets.filter(
                  (e) => e !== idBuffer
                ),
              },
            }));
            // }
          });
      }
    },
    []
  );

  return {
    handleAddWatchlist,
    inWatchlist,
    handleAddMultipleWatchlist,
  };
};
