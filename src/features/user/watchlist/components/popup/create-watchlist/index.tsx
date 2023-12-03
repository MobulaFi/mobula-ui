import React, { useContext, useRef, useState } from "react";
// import { useAlert } from "react-alert";
import { BiCopy } from "react-icons/bi";
import { BsCheckLg, BsGlobe2 } from "react-icons/bs";
import { IoShareSocialOutline } from "react-icons/io5";
import { useAccount } from "wagmi";
import { Button } from "../../../../../../components/button";
import { Collapse } from "../../../../../../components/collapse";
import { ExtraSmallFont, SmallFont } from "../../../../../../components/fonts";
import { Input } from "../../../../../../components/input";
import { ModalContainer } from "../../../../../../components/modal-container";
import { UserContext } from "../../../../../../contexts/user";
import { useSignerGuard } from "../../../../../../hooks/signer";
import { pushData } from "../../../../../../lib/mixpanel";
import { Switch } from "../../../../../../lib/shadcn/components/ui/switch";
import { GET } from "../../../../../../utils/fetch";
import { WatchlistContext } from "../../../context-manager";

export const CreatePopup = ({ watchlist }) => {
  const { showCreateWL, setShowCreateWL, watchlists } =
    useContext(WatchlistContext);
  const { address } = useAccount();
  // const alert = useAlert();
  const { user, setUser } = useContext(UserContext);
  const errorRef = useRef<HTMLDivElement>();
  const errorNameRef = useRef<HTMLDivElement>();
  const [isPublic, setIsPublic] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);
  const signerGuard = useSignerGuard();
  const [name, setName] = useState("");

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
          // if (add.error) alert.error(add.error);
          // else {
          pushData("Watchlist Added", {
            watchlist_name: name,
          });
          // alert.success("Successfully created new watchlist");
          setUser(
            (userBuffer) =>
              ({
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
              } as never)
          );
          // }
        });
    }
    //  else {
    //   alert.show("Please connect your wallet to add a watchlist");
    // }
  };

  return (
    <ModalContainer
      title="Create Watchlist"
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
              e.target.style.border = borders;
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
            className="opacity-0 transition-all duration-250 ease-in-out"
            ref={errorRef}
          >
            <ExtraSmallFont extraCss="text-red dark:text-red font-medium">
              Should have max 32 characters
            </ExtraSmallFont>
          </div>
          <div
            ref={errorNameRef}
            className="opacity-0 transition-all duration-250 ease-in-out"
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
      <Collapse startingHeight="0px" isOpen={isPublic}>
        <div className="flex flex-col mt-[7.5px]">
          <div className="flex items-center">
            <IoShareSocialOutline className="mr-2.5 text-lg text-light-font-40 dark:text-dark-font-40" />
            <SmallFont>Share to Community</SmallFont>
          </div>
          <div
            className="h-[35px] rounded bg-light-bg-terciary dark:bg-dark-bg-terciary px-2.5 mt-2.5 border 
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
    </ModalContainer>
  );
};
