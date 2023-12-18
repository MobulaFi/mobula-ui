"use client";
import { useParams, usePathname } from "next/navigation";
import { createContext, useEffect, useMemo, useState } from "react";
import { useAccount } from "wagmi";
import { IWatchlist } from "../interfaces/pages/watchlist";
import { IUserContext, UserExtended } from "../interfaces/user";
import { createSupabaseDOClient } from "../lib/supabase";
import { triggerAlert } from "../lib/toastify";

export const UserContext = createContext({} as IUserContext);

export const UserProvider = ({ children }) => {
  const { address } = useAccount();
  const [user, setUser] = useState<UserExtended | null>(null);
  const [watchlist, setWatchlist] = useState<IWatchlist>();
  const [watchlists, setWatchlists] = useState<IWatchlist[]>([]);
  const params = useParams();
  const query = params.r;
  const pathname = usePathname();

  useEffect(() => {
    const loadUserData = async (tries = 0) => {
      const supabase = createSupabaseDOClient();
      const { data } = await supabase
        .from("users")
        .select(
          "id,address,watchlists_followed,external_wallets,tags,username,telegram,telegram_id,discord,claimed,visits,streaks,balance,profile_pic,nft,profile_pic,nft,nft_id,timezone_offset,twitter,notifications_history,quests_done,quests_pending,vouched_by,hidden_profile,level,xp,banner,achievements,total_tx,stacked_mobl,watchlist(*),portfolios(id,wallets,removed_transactions,removed_assets),views(*)"
        )
        .match({
          address,
        })
        .order("created_at", { ascending: true, foreignTable: "watchlist" })
        .order("last_cached", { ascending: false, foreignTable: "portfolios" });

      if (data && data.length > 0) {
        const ref = pathname && query ? query : undefined;
        setUser({
          ...(data[0] as unknown as UserExtended),
          main_watchlist:
            data[0].watchlist.find((e) => e.main_watchlist) ||
            data[0].watchlist[0],
          views: data[0].views,
        });
        setTimeout(() => {
          if ((window as any).mixpanel) {
            try {
              (window as any).mixpanel.identify(data[0].id);
              (window as any).mixpanel.people.set({
                wallet: address,
                id: data[0].id,
                ref: ref as string,
                has_claimed_mobl: data[0].claimed !== 0,
                has_signed_up: true,
                is_governance_member: data[0]?.stacked_mobl > 0,
              });
            } catch (err) {
              // console.log(err);
            }
          }
        }, 1000);
      } else if (tries < 5) {
        setTimeout(() => {
          loadUserData(tries + 1);
        }, 1000);
      } else {
        triggerAlert("Error", "Please refresh the page, something went wrong.");
      }
    };

    if (address) loadUserData();
  }, [address]);

  const value = useMemo<IUserContext>(
    () => ({
      user,
      setUser,
      watchlist,
      setWatchlist,
      watchlists,
      setWatchlists,
    }),
    [user, setUser, watchlist, setWatchlist, watchlists, setWatchlists]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
