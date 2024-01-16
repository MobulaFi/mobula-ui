import { useTheme } from "next-themes";
import React, { useContext, useRef, useState } from "react";
import { BiCopy } from "react-icons/bi";
import { BsCheckLg, BsGlobe2 } from "react-icons/bs";
import { IoShareSocialOutline } from "react-icons/io5";
import { useAccount } from "wagmi";
import { Button } from "../../../../../../components/button";
import { Collapse } from "../../../../../../components/collapse";
import { ExtraSmallFont, SmallFont } from "../../../../../../components/fonts";
import { Input } from "../../../../../../components/input";
import { Modal } from "../../../../../../components/modal-container";
import { UserContext } from "../../../../../../contexts/user";
import { useSignerGuard } from "../../../../../../hooks/signer";
import { Switch } from "../../../../../../lib/shadcn/components/ui/switch";
import { triggerAlert } from "../../../../../../lib/toastify";
import { GET } from "../../../../../../utils/fetch";
import { WatchlistContext } from "../../../context-manager";
import { IWatchlist } from "../../../models";
import { editWatchlist } from "../../../utils";

interface EditPopupProps {
  watchlist: IWatchlist;
}

export const EditPopup = ({ watchlist }: EditPopupProps) => {
  const { setShowEdit, showEdit, setEditName, editName, activeWatchlist } =
    useContext(WatchlistContext);
  const { address } = useAccount();
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";
  const { user, setUser } = useContext(UserContext);
  const errorRef = useRef<HTMLDivElement>();
  const [isPublic, setIsPublic] = useState(watchlist?.public);
  const signerGuard = useSignerGuard();
  const [hasCopied, setHasCopied] = useState(false);

  const onCopy = () => {
    navigator.clipboard.writeText(
      `https://mobula.app/watchlist/${watchlist?.id}`
    );
    setHasCopied(true);
    setTimeout(() => {
      setHasCopied(false);
    }, 2000);
  };

  const getWatchlistPublic = () => {
    GET("/watchlist/public", {
      id: watchlist.id,
      account: address as string,
      public: !isPublic,
    })
      .then((r) => r.json())
      .then((r) => {
        if (r.error) {
          triggerAlert(
            "Error",
            "Something went wrong, please try again later."
          );
        } else {
          setIsPublic(!isPublic);

          if (isPublic)
            triggerAlert("Success", "Your watchlist is now public.");
          else triggerAlert("Success", "Your watchlist is now private.");
        }
      });
  };

  return (
    <Modal
      extraCss="max-w-[400px]"
      title="Edit Watchlist"
      isOpen={showEdit}
      onClose={() => setShowEdit(false)}
    >
      <div className="flex flex-col">
        <SmallFont>Watchlist Name</SmallFont>

        <Input
          extraCss="mt-2.5"
          onChange={(e) => {
            if (e.target.value.length < 33 && activeWatchlist) {
              setEditName({
                oldname: activeWatchlist.name,
                newname: e.target.value,
                watchlist: activeWatchlist.name,
              });
              e.target.style.border = isDarkMode
                ? "1px solid rgba(255,255,255,0.03)"
                : "1px solid rgba(0,0,0,0.03)";
              errorRef.current.style.opacity = "0";
            } else {
              e.target.style.border = "1px solid #ea3943";
              errorRef.current.style.opacity = "1";
            }
          }}
        />
        <div className="flex justify-between mt-[7.5px]">
          <ExtraSmallFont extraCss="text-light-font-40 dark:text-dark-font-40">
            {editName.newname.length}/32 characters
          </ExtraSmallFont>
          <div
            className="opacity-0 transition-all duration-200 ease-in-out"
            ref={errorRef}
          >
            <ExtraSmallFont extraCss="text-red dark:text-red font-medium">
              Should have max 32 characters
            </ExtraSmallFont>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between mt-[15px]">
        <div className="flex items-center">
          <BsGlobe2 className="mr-2.5 text-lg text-light-font-40 dark:text-dark-font-40" />
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
      <Collapse startingHeight="max-h-[0px]" isOpen={isPublic}>
        <div className="flex flex-col mt-[7.5px]">
          <div className="flex items-center">
            <IoShareSocialOutline className="mr-2.5 text-lg text-light-font-40 dark:text-dark-font-40" />
            <SmallFont>Share to Community</SmallFont>
          </div>
        </div>
        <div
          className="h-[35px] rounded-md bg-light-bg-terciary dark:bg-dark-bg-terciary px-2.5 mt-2.5 border 
          border-light-border-primary dark:border-dark-border-primary"
        >
          <input
            className="h-full text-light-font-100 dark:text-dark-font-100 pr-2.5 truncate"
            value={`https://mobula.app/watchlist/${watchlist?.id}`}
          />

          <div className="h-full" onClick={onCopy}>
            <div className="flex h-full pr-2.5 items-center text-light-font-100 dark:text-dark-font-100 bg-light-bg-terciary dark:bg-dark-bg-terciary">
              {hasCopied ? "copied" : "copy"}
              {hasCopied ? (
                <BsCheckLg className="ml-[5px] text-green dark:text-green" />
              ) : (
                <BiCopy className="ml-[5px] text-light-font-60 dark:text-dark-font-60" />
              )}
            </div>
          </div>
        </div>
      </Collapse>
      <Button
        extraCss="mt-[15px] border-darkblue dark:border-darkblue hover:border-blue hover:dark:border-blue"
        onClick={() => {
          if (address)
            signerGuard(() => {
              editWatchlist(editName, address, alert);
              const newWatchlist: IWatchlist[] = [];
              for (let i = 0; i < user.watchlist.length; i += 1) {
                newWatchlist.push(user.watchlist[i]);
                if (user.watchlist[i].name === editName.oldname)
                  user.watchlist[i].name = editName.newname;
              }
              setUser({ ...user, watchlist: newWatchlist });
              setShowEdit(false);
            });
        }}
      >
        Edit Watchlist
      </Button>
    </Modal>
  );
};
