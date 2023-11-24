import { useTheme } from "next-themes";
import React, { useContext } from "react";
import { useAccount } from "wagmi";
import { Drawer } from "../components/drawer";
import { LargeFont, SmallFont } from "../components/fonts";
import { UserContext } from "../contexts/user";
import { AccountHeaderContext } from "../layouts/header/context-manager";
import { GET } from "../utils/fetch";

export const NotificationDrawer = () => {
  const { user, setUser } = useContext(UserContext);
  const { address } = useAccount();
  const { setShowNotif, showNotif } = useContext(AccountHeaderContext);
  const { theme } = useTheme();
  const isWhiteMode = theme === "light";

  const getNotifTime = (date: number) => {
    if (user) {
      const now = new Date().getTime();
      const newDate = now - date || 0; //
      const daysAgo = Math.floor(newDate / (60 * 60 * 24 * 1000));
      const hours = Math.floor(newDate / (60 * 60 * 1000));
      const minutes = Math.floor(newDate / (60 * 1000));

      if (daysAgo === 0) {
        if (hours === 0) {
          if (minutes === 0) return "Just now";
          return `${minutes} minutes ago`;
        }
        return `${hours} hours ago`;
      }
      if (daysAgo === 1)
        return `Yesterday at ${new Date(date).getHours()}:${new Date(
          date
        ).getMinutes()}`;
      if (daysAgo >= 2) return `${daysAgo} days ago`;
    }
    return null;
  };

  const readNotif = () => {
    if (address && user) {
      GET("/readnotif", {
        account: address,
      });
      setUser({
        ...user,
        notifications_history: user?.notifications_history.map((notif) => ({
          ...notif,
          red: true,
        })),
      });
    }
  };
  return (
    <Drawer
      isOpen={showNotif}
      onClose={() => setShowNotif(false)}
      titleChildren={
        <>
          <LargeFont>Notifications</LargeFont>
          {(user?.notifications_history?.filter((notif) => notif.red === false)
            ?.length || 0) > 0 ? (
            <div className="flex items-center">
              <div className="h-[15px] w-[1px] bg-light-border-primary dark:bg-dark-border-primary mx-2.5" />
              <button
                className="font-medium text-light-font-100 dark:text-dark-font-100 ml-2.5 text-sm"
                onClick={readNotif}
              >
                Read all
              </button>
            </div>
          ) : null}
        </>
      }
    >
      <div className="mt-[102px]">
        {!user?.notifications_history.filter((notif) => !notif.red).length ? (
          <div className="flex items-center flex-col w-full">
            <img
              className="mt-5 h-[160px] w-fit"
              src={isWhiteMode ? "/asset/notif-light.png" : "/asset/notif.png"}
              alt="empty notification image"
            />
            <LargeFont extraCss="mt-5">No notifications</LargeFont>
            <SmallFont extraCss="text-light-font-60 dark:text-dark-font-60 text-center w-[80%] mt-[7.5px]">
              New notifications will be added here once pushed.
            </SmallFont>
          </div>
        ) : (
          user?.notifications_history
            ?.filter((notif) => !notif.red)
            .map((notif) => (
              <div
                key={notif.title}
                className="flex py-[15px] px-5 border-b border-light-border-primary 
                dark:border-dark-border-primary relative flex-col cursor-pointer"
              >
                <div className="flex items-center">
                  <img
                    className="rounded-full w-[32px] h-[32px] mr-2.5"
                    src={`/mobula${notif.image}`}
                    alt="notification image"
                  />
                  <SmallFont>{notif.title}</SmallFont>
                </div>
                <p className="text-xs mt-2.5 text-light-font-100 dark:text-dark-font-100">
                  {notif.content}
                </p>
                <p className="text-[10px] mt-2.5 text-light-font-100 dark:text-dark-font-100">
                  {getNotifTime(notif.date)}
                </p>
              </div>
            ))
        )}
      </div>
    </Drawer>
  );
};
