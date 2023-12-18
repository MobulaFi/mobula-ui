"use client";
import { User } from "mobula-utils/lib/user/model";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import { BiArrowBack } from "react-icons/bi";
import { useAccount } from "wagmi";
import { AddressAvatar } from "../../../../../components/avatar";
import { Container } from "../../../../../components/container";
import { LargeFont, MediumFont } from "../../../../../components/fonts";
import { NextImageFallback } from "../../../../../components/image";
import {
  PopupStateContext,
  PopupUpdateContext,
} from "../../../../../contexts/popup";
import { WatchlistDrawer } from "../../../../../drawer/watchlist";
import { AssetsTable } from "../../../../../layouts/tables/components";
import { addressSlicer } from "../../../../../utils/formaters";
import { Asset } from "../../../../asset/models";
import { WatchlistContext } from "../../context-manager";
import { IWatchlist } from "../../models";
import { Header } from "../header";

interface SeeWatchlistProps {
  watchlist: IWatchlist;
  isMobile: boolean;
  tokens: Asset[];
  userOfWatchlist: User;
}

export const SeeWatchlist = ({
  watchlist,
  isMobile,
  tokens,
  userOfWatchlist,
}: SeeWatchlistProps) => {
  const router = useRouter();
  const { isConnected } = useAccount();
  const { setConnect } = useContext(PopupUpdateContext);
  const [orderBy, setOrderBy] = useState({
    ascending: false,
    type: "market_cap",
    first: true,
  });
  const getUsername = () => {
    if (userOfWatchlist) {
      if (userOfWatchlist?.username) return userOfWatchlist.username;
      return addressSlicer(userOfWatchlist?.address);
    }
    return null;
  };
  const { setIsPageUserWatchlist } = useContext(WatchlistContext);
  useEffect(() => {
    setIsPageUserWatchlist(true);
  }, []);

  const [resultsData, setResultsData] = useState({ data: tokens, count: 0 });

  const username = getUsername();
  const { showAddedToWatchlist } = useContext(PopupStateContext);
  return (
    <Container>
      <div className="flex items-center  my-[15px]">
        <button
          className="mr-2.5"
          onClick={() => {
            if (isConnected) router.push("/watchlist");
            else setConnect(true);
          }}
        >
          <BiArrowBack className="text-light-font-100 dark:text-dark-font-100" />
        </button>
        <LargeFont>{watchlist?.name}</LargeFont>

        <div className="flex items-center ml-auto">
          {userOfWatchlist?.profile_pic !== "/mobula/fullicon.png" ? (
            <NextImageFallback
              width={22}
              height={22}
              style={{
                borderRadius: "full",
              }}
              src={userOfWatchlist?.profile_pic}
              alt="user profile pic"
              fallbackSrc="/empty/unknown.png"
            />
          ) : (
            <AddressAvatar
              extraCss="w-[22px] h-[22px] rounded-full"
              address={userOfWatchlist?.address}
            />
          )}
          <MediumFont
            extraCss="ml-[7.5px] cursor-pointer"
            onClick={() => router.push(`/profile/${userOfWatchlist?.address}`)}
          >
            By {username}
          </MediumFont>
        </div>
      </div>
      {tokens ? (
        <>
          <Header assets={tokens} activeWatchlist={watchlist} />
          <AssetsTable
            resultsData={resultsData}
            setResultsData={setResultsData}
            orderBy={orderBy}
            setOrderBy={setOrderBy}
            isMobile={isMobile}
          />
        </>
      ) : null}
      {showAddedToWatchlist ? <WatchlistDrawer /> : null}
    </Container>
  );
};
