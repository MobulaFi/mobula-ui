import React, { useContext, useState } from "react";
import { useAlert } from "react-alert";
import { BiCopy } from "react-icons/bi";
import { BsCheckLg, BsGlobe2 } from "react-icons/bs";
import { IoShareSocialOutline } from "react-icons/io5";
import { ExtraSmallFont, SmallFont } from "../../../../../../components/fonts";
import { ModalContainer } from "../../../../../../components/modal-container";
import { UserContext } from "../../../../../../contexts/user";
import { Switch } from "../../../../../../lib/shadcn/components/ui/switch";
import { GET } from "../../../../../../utils/fetch";
import { getUrlFromName } from "../../../../../../utils/formaters";
import { WatchlistContext } from "../../../context-manager";
import { IWatchlist } from "../../../models";

interface SharePopupProps {
  watchlist: IWatchlist;
}

export const SharePopup = ({ watchlist }: SharePopupProps) => {
  const [isPublic, setIsPublic] = useState(watchlist?.public);
  const { user } = useContext(UserContext);
  const [hasCopied, setHasCopied] = useState(false);
  const alert = useAlert();
  const { showShare, setShowShare } = useContext(WatchlistContext);
  const isOwner = watchlist?.user_id === user?.id;

  const onCopy = () => {
    navigator.clipboard.writeText(
      `http://mobula.fi/watchlist/${user?.address}/${getUrlFromName(
        watchlist?.name as string
      )}`
    );
    setHasCopied(true);
    setTimeout(() => {
      setHasCopied(false);
    }, 2000);
  };

  const getWatchlistPublic = () => {
    GET("/watchlist/public", {
      id: watchlist.id as number,
      account: user?.address as string,
      public: !isPublic,
    })
      .then((r) => r.json())
      .then((r) => {
        if (r.error) alert.error(r.error);
        else {
          setIsPublic(!isPublic);
          if (isPublic) alert.success("Your watchlist is now public.");
          else alert.success("Your watchlist is now private.");
        }
      });
  };

  return (
    <ModalContainer
      extraCss="max-w-[300px]"
      isOpen={showShare}
      title="Share"
      onClose={() => setShowShare(false)}
    >
      {isOwner ? (
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <BsGlobe2 className="mr-2.5 text-light-font-40 dark:text-dark-font-40 text-lg" />
            <div>
              <SmallFont>Public</SmallFont>
              <ExtraSmallFont extraCss="text-light-font-40 dark:text-dark-font-40">
                You can share the watchlist
              </ExtraSmallFont>
            </div>
          </div>
          <Switch
            className="mt-2.5"
            checked={isPublic}
            onClick={getWatchlistPublic}
          />
        </div>
      ) : null}
      <div className="flex flex-col mt-[7.5px]">
        <div className="flex items-center">
          <IoShareSocialOutline className="text-lg mr-2.5 text-light-font-40 dark:text-dark-font-40" />
          <SmallFont>Share to Community</SmallFont>
        </div>
        <div
          className="flex items-center justify-between h-[35px] border border-light-border-primary dark:border-dark-border-primary rounded 
        bg-light-bg-terciary dark:bg-dark-bg-terciary pr-2.5 mt-2.5"
        >
          <input
            className="pl-2.5 h-full text-light-font-100 dark:text-dark-font-100 truncate text-sm w-full"
            value={
              user && watchlist
                ? `http://mobula.fi/watchlist/${user?.address}/${getUrlFromName(
                    watchlist?.name as string
                  )}`
                : ""
            }
          />
          <div className="flex h-full" onClick={onCopy}>
            <div
              className="h-full flex text-light-font-100 dark:text-dark-font-100
             bg-light-bg-terciary dark:bg-dark-bg-terciary items-center text-sm"
            >
              {hasCopied ? "copied" : "copy"}
              {hasCopied ? (
                <BsCheckLg className="ml-[5px] text-green dark:text-green" />
              ) : (
                <BiCopy className="ml-[5px]" />
              )}
            </div>
          </div>
        </div>
      </div>
    </ModalContainer>
  );
};
