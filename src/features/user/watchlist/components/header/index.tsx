import { default as React, SetStateAction, useContext, useRef } from "react";
import { BiAddToQueue } from "react-icons/bi";
import { IoAdd, IoShareSocialOutline } from "react-icons/io5";
import { Button } from "../../../../../components/button";
import { SmallFont } from "../../../../../components/fonts";
import { UserContext } from "../../../../../contexts/user";
import { pushData } from "../../../../../lib/mixpanel";
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
  const { user } = useContext(UserContext);
  const { setShowShare, setShowAddCoins } = useContext(WatchlistContext);
  const headerRef = useRef<HTMLDivElement>(null);

  const globalPercentage: number[] = [];
  assets?.map((entry) => globalPercentage.push(entry?.price_change_24h));

  const getBgColor = (name: string) => {
    if (!activeWatchlist)
      return "bg-light-bg-terciary dark:bg-dark-bg-terciary";
    if ("name" in activeWatchlist && activeWatchlist.name === name)
      return "bg-light-bg-hover dark:bg-dark-bg-hover";
    return "bg-light-bg-terciary dark:bg-dark-bg-terciary";
  };

  return (
    <div className="flex items-center justify-between rounded-t border-t border-light-border-primary dark:border-dark-border-primary py-2.5">
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
          <HeaderMenu />
        </div>
        <SharePopup watchlist={activeWatchlist as IWatchlist} />
      </div>
    </div>
  );
};
