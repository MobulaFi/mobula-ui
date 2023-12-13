"use client";
import Cookies from "js-cookie";
import mixpanel from "mixpanel-browser";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import TagManager from "react-gtm-module";

export const useAnalytics = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  useEffect(() => {
    const handleRouteChange = () => {
      if (!(window as any).mixpanel) return;
      (window as any).mixpanel.track("Page Loaded");
    };
    const url = pathname + searchParams.toString();
    handleRouteChange();
  }, [pathname, searchParams]);

  useEffect(() => {
    if ((window as any).mixpanel) return;

    // Mixpanel project token
    const mixpanelToken = "792afbf66aa630430016bdbd59c52ba7";

    // Mixpanel script loading function
    function loadMixpanelScript() {
      const script = document.createElement("script");
      script.src = "https://data.mobula.fi/lib.min.js";
      script.async = true;

      script.onload = () => {
        (window as any).mixpanel = mixpanel;
      };

      document.head.appendChild(script);
    }

    loadMixpanelScript();

    const theme = Cookies.get("chakra-ui-color-mode") || "light";

    mixpanel.init(mixpanelToken, {
      api_host: "https://data.mobula.fi",
      ignore_dnt: true,
      loaded: () => {
        mixpanel.track("Page Loaded", {
          theme,
        });
      },
    });
    TagManager.initialize({ gtmId: "GTM-KH942LP" });
  }, []);
};
