import React, { useContext, useEffect, useState } from "react";
import { useAlert } from "react-alert";
import { AiOutlineClose } from "react-icons/ai";
import { BsCheckLg } from "react-icons/bs";
import { Button } from "../../../../../../components/button";
import { ExtraSmallFont, SmallFont } from "../../../../../../components/fonts";
import { NextImageFallback } from "../../../../../../components/image";
import { Input } from "../../../../../../components/input";
import { ModalContainer } from "../../../../../../components/modal-container";
import { UserContext } from "../../../../../../contexts/user";
import { useUpdateSearch } from "../../../../../../layouts/swap/hooks/useUpdateSearch";
import { useWatchlist } from "../../../../../../layouts/tables/hooks/watchlist";
import { WatchlistContext } from "../../../context-manager";
import { IWatchlist } from "../../../models";

interface AddCoinPopupProps {
  watchlist: IWatchlist;
}

export const AddCoinPopup = ({ watchlist }: AddCoinPopupProps) => {
  const { setActiveWatchlist, showAddCoins, activeWatchlist, setShowAddCoins } =
    useContext(WatchlistContext);
  const { user, setUser } = useContext(UserContext);
  const [searchToken, setSearchToken] = useState("");
  const { updateSearch, results } = useUpdateSearch("in");
  const [tokenToAdd, setTokenToAdd] = useState<any[]>([]);
  const { handleAddMultipleWatchlist } = useWatchlist();
  const alert = useAlert();

  useEffect(() => {
    if (!activeWatchlist) {
      setActiveWatchlist(watchlist);
    }
  }, [showAddCoins]);

  useEffect(() => {
    updateSearch(searchToken);
  }, [searchToken]);

  return (
    <ModalContainer
      extraCss="max-w-[400px]"
      isOpen={showAddCoins}
      onClose={() => setShowAddCoins(false)}
    >
      <div className="p-2.5 flex-col flex">
        <Input
          extraCss="text-light-font-60 dark:text-dark-font-60 h-[40px] px-[15px] mx-auto w-full mb-[3px] "
          placeholder="Search a token name or address"
          onChange={(e) => setSearchToken(e.target.value)}
        />
        <div className="flex flex-wrap">
          {tokenToAdd.map((entry) => (
            <Button
              key={entry.id}
              extraCss="mr-[7.5px] mt-[7.5px] px-[7.5px] h-[26px] rounded-full "
              onClick={() => {
                setTokenToAdd(
                  tokenToAdd.filter((token) => token.id !== entry.id)
                );
              }}
            >
              <NextImageFallback
                style={{
                  borderRadius: "50%",
                  marginRight: "5px",
                }}
                height={15}
                width={15}
                src={entry?.logo}
                fallbackSrc="/empty/unknown.png"
                alt={`${entry.name} logo`}
              />
              <ExtraSmallFont extraCss="font-medium mt-[1px]">
                {entry.name}
              </ExtraSmallFont>
              <AiOutlineClose className="ml-[7.5px] text-[10px] text-light-font-40 dark:text-dark-font-40" />
            </Button>
          ))}
        </div>
      </div>
      {results
        .filter((entry: any) => !watchlist?.assets?.includes(entry.id))
        ?.map((token: any, idx: number) => {
          const isAlreadyAdded = tokenToAdd.find(
            (entry) => entry.id === token.id
          );
          if (idx < 5)
            return (
              <div
                className={`border-b border-light-border-primary dark:border-dark-border-primary 
              ${
                idx === 0 ? "border-t" : ""
              } py-2.5 px-[15px] w-full cursor-pointer flex justify-between items-center 
              bg-light-bg-terciary dark:bg-dark-bg-terciary hover:bg-light-bg-hover dark:hover:bg-dark-bg-hover 
              transition-all duration-250 ease-in-out`}
                key={token.id}
                onClick={() => {
                  if (isAlreadyAdded) {
                    setTokenToAdd(
                      tokenToAdd.filter((entry) => entry.id !== token.id)
                    );
                  } else {
                    setTokenToAdd([...tokenToAdd, token]);
                  }
                }}
              >
                <div className="flex items-center">
                  <NextImageFallback
                    style={{
                      borderRadius: "50%",
                      marginRight: "10px",
                    }}
                    height={26}
                    width={26}
                    src={token?.logo}
                    fallbackSrc="/empty/unknown.png"
                    alt={`${token.name} logo`}
                  />
                  <div>
                    <SmallFont>{token.name}</SmallFont>
                    <SmallFont extraCss="text-light-font-40 dark:text-dark-font-40">
                      {token.symbol}{" "}
                    </SmallFont>
                  </div>
                </div>
                {isAlreadyAdded ? (
                  <BsCheckLg className="text-blue dark:text-blue" />
                ) : null}
              </div>
            );
          return null;
        })}
      <div className="flex p-2.5">
        <Button
          extraCss="h-[40px] border-darkblue dark:border-darkblue hover:border-blue hover:dark:border-blue"
          onClick={() => {
            if ((user?.watchlist.length || 0) > 0) {
              const tokensId = tokenToAdd.map((token) => token.id);
              handleAddMultipleWatchlist(
                tokensId,
                activeWatchlist?.id as number
              );
              setShowAddCoins(false);
              setActiveWatchlist((prev) => ({
                ...prev,
                assets: [
                  ...(prev?.assets || []),
                  ...tokenToAdd.map((token) => token.id.toString()),
                ],
              }));
              const active = user?.watchlist.find(
                (entry) => entry.name === activeWatchlist?.name
              );
              const toAdd = [
                ...(active?.assets || []),
                ...tokenToAdd.map((token) => token.id),
              ];
              const updatedActiveWatchlist = {
                ...active,
                assets: toAdd,
              };
              const filteredWL = user?.watchlist.filter(
                (entry) => entry.name !== activeWatchlist?.name
              );
              const updatedWatchlists = [
                ...(filteredWL || []),
                updatedActiveWatchlist,
              ];
              setUser({ ...(user as any), watchlist: updatedWatchlists });
              setTokenToAdd([]);
            } else alert.error("Please create a watchlist first");
          }}
        >
          Select Coins ({tokenToAdd.length})
        </Button>
      </div>
    </ModalContainer>
  );
};
