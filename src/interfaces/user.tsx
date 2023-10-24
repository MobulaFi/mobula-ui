import { User } from "mobula-utils/lib/user/model";
import { View } from "../features/data/top100/models";
import { IPortfolio } from "./pages/portfolio";
import { IWatchlist } from "./pages/watchlist";

export type UserExtended = User & {
  watchlist: IWatchlist[];
  portfolios: IPortfolio[];
  main_watchlist: IWatchlist;
  views: View[];
};

export interface IUserContext {
  user: UserExtended | null;
  setUser: React.Dispatch<React.SetStateAction<UserExtended | null>>;
  watchlist: IWatchlist;
  setWatchlist: React.Dispatch<React.SetStateAction<IWatchlist>>;
  watchlists: IWatchlist[];
  setWatchlists: React.Dispatch<React.SetStateAction<IWatchlist[]>>;
}
