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
import { pushData } from "../../../../../../lib/mixpanel";
import { Switch } from "../../../../../../lib/shadcn/components/ui/switch";
import { triggerAlert } from "../../../../../../lib/toastify";
import { GET } from "../../../../../../utils/fetch";
import { WatchlistContext } from "../../../context-manager";
import { IWatchlist } from "../../../models";

interface CreatePopupProps {
  watchlist: IWatchlist;
}

export const CreatePopup = ({ watchlist }: CreatePopupProps) => {
  const { showCreateWL, setShowCreateWL, watchlists } =
    useContext(WatchlistContext);
  const { address } = useAccount();
  const { user, setUser } = useContext(UserContext);
  const errorRef = useRef<HTMLDivElement>();
  const errorNameRef = useRef<HTMLDivElement>();
  const [isPublic, setIsPublic] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);
  const signerGuard = useSignerGuard();
  const [name, setName] = useState("");
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";

  const onCopy = () => {
    navigator.clipboard.writeText(
      `https://mobula.app/watchlist/${watchlist?.id}`
    );
    setHasCopied(true);
    setTimeout(() => {
      setHasCopied(false);
    }, 2000);
  };

  const addNewWatchlist = () => {
    if (
      user &&
      user.watchlist?.find((entry) => entry.name === name) === undefined
    ) {
      GET("/watchlist/create", {
        account: user?.address,
        name,
        public: isPublic,
      })
        .then((response) => response.json())
        .then((add) => {
          if (add.error) {
            triggerAlert(
              "Error",
              "Something went wrong, please try again to create a new watchlist"
            );
          } else {
            pushData("Watchlist Added", {
              watchlist_name: name,
            });
            triggerAlert(
              "Success",
              "Your watchlist has been created successfully"
            );
            setUser((userBuffer) => ({
              ...userBuffer,
              watchlist: [
                ...(userBuffer?.watchlist || []),
                {
                  name,
                  assets: [],
                  id: add.id,
                  user_id: user.id,
                  created_at: new Date(),
                },
              ],
            }));
          }
        });
    } else {
      triggerAlert("Warning", "Please connect your wallet to add a watchlist");
    }
  };

  return (
    <Modal
      extraCss="max-w-[400px]"
      title="Create Watchlist"
      titleCss="mb-2.5"
      isOpen={showCreateWL}
      onClose={() => setShowCreateWL(false)}
    >
      <div className="flex flex-col">
        <SmallFont>Watchlist Name</SmallFont>
        <Input
          extraCss="mt-2.5"
          onChange={(e) => {
            if (
              watchlists?.find((entry) => entry.name === e.target.value) !==
              undefined
            ) {
              e.target.style.border = "1px solid var(--chakra-colors-red)";
              errorNameRef.current.style.opacity = "1";
            } else if (e.target.value.length < 33) {
              setName(e.target.value);
              e.target.style.border = isDarkMode
                ? "1px solid rgba(255,255,255,0.03)"
                : "1px solid rgba(0,0,0,0.03)";
              errorRef.current.style.opacity = "0";
              errorNameRef.current.style.opacity = "0";
            } else {
              e.target.style.border = "1px solid var(--chakra-colors-red)";
              errorRef.current.style.opacity = "1";
            }
          }}
        />
        <div className="flex justify-between mt-[7.5px]">
          <ExtraSmallFont extraCss="text-light-font-40 dark:text-dark-font-40">
            {name.length}/32 characters
          </ExtraSmallFont>
          <div
            className="opacity-0 transition-all duration-200 ease-in-out"
            ref={errorRef}
          >
            <ExtraSmallFont extraCss="text-red dark:text-red font-medium">
              Should have max 32 characters
            </ExtraSmallFont>
          </div>
          <div
            ref={errorNameRef}
            className="opacity-0 transition-all duration-200 ease-in-out"
          >
            <ExtraSmallFont extraCss="text-red dark:text-red font-medium">
              Name already exists
            </ExtraSmallFont>
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
            onClick={() => setIsPublic(!isPublic)}
          />
        </div>
      </div>
      <Collapse startingHeight="max-h-[0px]" isOpen={isPublic}>
        <div className="flex flex-col mt-[7.5px] w-full">
          <div className="flex items-center w-full">
            <IoShareSocialOutline className="mr-2.5 text-lg text-light-font-40 dark:text-dark-font-40" />
            <SmallFont>Share to Community</SmallFont>
          </div>
          <div
            className="h-[35px] rounded-md bg-light-bg-terciary dark:bg-dark-bg-terciary px-0 mt-2.5 border 
          border-light-border-primary dark:border-dark-border-primary w-full"
          >
            <input
              className="h-full text-light-font-100 dark:text-dark-font-100 pr-2.5 truncate w-full text-sm"
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
        </div>
      </Collapse>
      <Button
        extraCss="mt-[15px] border-darkblue dark:border-darkblue hover:border-blue hover:dark:border-blue"
        onClick={() => {
          if (address)
            signerGuard(() => {
              addNewWatchlist();
              setShowCreateWL(false);
            });
        }}
      >
        Create Watchlist
      </Button>
    </Modal>
  );
};
