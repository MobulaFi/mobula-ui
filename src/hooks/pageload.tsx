import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { isAddress } from "viem";
import { useAccount } from "wagmi";
import { pushData } from "../lib/mixpanel";
import { GET } from "../utils/fetch";
import { askPermission, subscribeUserToPush } from "../utils/notif";

export const pathToUrl = (path: string) => {
  if (path === "/") {
    return {
      theme: "Crypto",
      url: "/",
      name: "",
    };
  }

  return null;
};

export const usePageLoad = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { address } = useAccount();
  const query = useSearchParams();
  const ref = query.get("ref");

  useEffect(() => {
    if (pathToUrl(pathname))
      localStorage.setItem("path", JSON.stringify(pathToUrl(pathname)));
  }, [pathname]);

  useEffect(() => {
    if (ref) {
      localStorage.setItem("ref", String(ref));
    }
  }, [query]);

  useEffect(() => {
    if (
      address &&
      localStorage.getItem(`signature${address}`) &&
      localStorage.getItem("signatureAddress") !== address
    ) {
      localStorage.setItem(
        "signature",
        localStorage.getItem(`signature${address}`)!
      );
      localStorage.setItem("signatureAddress", address);
    }
  }, [address]);

  useEffect(() => {
    if (address && isAddress(address) && pathname) {
      const ref = localStorage.getItem("ref");
      const notificationAsked = localStorage.getItem("notification");
      const offset = new Date().getTimezoneOffset() / 60;

      GET("/connection", {
        account: address,
        ref,
        page: pathname.split("?")[0],
        offset,
      });

      if (!localStorage.getItem(`session-${address}`)) {
        pushData("CONNECT-VALIDATED");
        localStorage.setItem(`session-${address}`, "true");
        localStorage.setItem("signatureAddress", address);
      }

      if (!navigator.userAgent.includes("Firefox")) {
        const handleNotification = async () => {
          if (!notificationAsked) {
            localStorage.setItem("notification", "true");
            try {
              if (!("serviceWorker" in navigator)) {
                return;
              }

              if (!("PushManager" in window)) {
                return;
              }
              await askPermission();
              if (address) subscribeUserToPush(address);
            } catch (err) {
              // alert.error(
              //   "Notifications are not enabled. You will miss notifications about price changes, market opportunities and Mobula advances. Use your navigator settings to rollback.",
              // );
            }
          }
        };

        handleNotification();
      }
    }
  }, [address, router]);
};
